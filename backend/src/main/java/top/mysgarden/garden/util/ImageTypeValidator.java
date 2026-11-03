package top.mysgarden.garden.util;

import java.util.Locale;
import java.util.Map;

/**
 * 图片上传扩展名、MIME 类型与文件头一致性校验。
 * SVG 是可执行的 XML 文档，不作为普通图片写入同源上传目录。
 */
public final class ImageTypeValidator {

    public static final long MAX_ADMIN_IMAGE_SIZE = 25L * 1024 * 1024;
    public static final long MAX_NOTE_IMAGE_SIZE = 10L * 1024 * 1024;

    private static final Map<String, String> IMAGE_MIME_TYPES = Map.of(
            ".jpg", "image/jpeg",
            ".jpeg", "image/jpeg",
            ".png", "image/png",
            ".webp", "image/webp",
            ".gif", "image/gif",
            ".avif", "image/avif"
    );

    private ImageTypeValidator() {
    }

    public record ValidatedImageType(String ext, String mimeType) {
    }

    public static ValidatedImageType validate(String filename, String contentType) {
        if (filename == null || contentType == null) {
            return null;
        }
        int dotIdx = filename.lastIndexOf('.');
        if (dotIdx < 0) {
            return null;
        }
        String ext = filename.substring(dotIdx).toLowerCase(Locale.ROOT);
        String expectedMime = IMAGE_MIME_TYPES.get(ext);
        String normalizedContentType = contentType.trim().toLowerCase(Locale.ROOT);
        int semi = normalizedContentType.indexOf(';');
        if (semi > 0) {
            normalizedContentType = normalizedContentType.substring(0, semi).trim();
        }
        if (expectedMime == null || !expectedMime.equals(normalizedContentType)) {
            return null;
        }
        return new ValidatedImageType(ext, expectedMime);
    }

    /**
     * 根据已校验的类型检查文件签名，阻止仅修改扩展名和 Content-Type 的伪装文件。
     */
    public static boolean matchesContent(ValidatedImageType imageType, byte[] content) {
        if (imageType == null || content == null) {
            return false;
        }
        return switch (imageType.ext()) {
            case ".jpg", ".jpeg" -> startsWith(content, 0xFF, 0xD8, 0xFF);
            case ".png" -> startsWith(content, 0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A);
            case ".gif" -> startsWithAscii(content, "GIF87a") || startsWithAscii(content, "GIF89a");
            case ".webp" -> startsWithAscii(content, "RIFF") && asciiEquals(content, 8, "WEBP");
            case ".avif" -> isAvif(content);
            default -> false;
        };
    }

    private static boolean isAvif(byte[] content) {
        if (content.length < 12 || !asciiEquals(content, 4, "ftyp")) {
            return false;
        }
        int scanLimit = Math.min(content.length - 3, 64);
        for (int offset = 8; offset < scanLimit; offset += 4) {
            if (asciiEquals(content, offset, "avif") || asciiEquals(content, offset, "avis")) {
                return true;
            }
        }
        return false;
    }

    private static boolean startsWith(byte[] content, int... signature) {
        if (content.length < signature.length) {
            return false;
        }
        for (int i = 0; i < signature.length; i++) {
            if ((content[i] & 0xFF) != signature[i]) {
                return false;
            }
        }
        return true;
    }

    private static boolean startsWithAscii(byte[] content, String signature) {
        return asciiEquals(content, 0, signature);
    }

    private static boolean asciiEquals(byte[] content, int offset, String expected) {
        if (offset < 0 || content.length < offset + expected.length()) {
            return false;
        }
        for (int i = 0; i < expected.length(); i++) {
            if ((content[offset + i] & 0xFF) != expected.charAt(i)) {
                return false;
            }
        }
        return true;
    }
}
