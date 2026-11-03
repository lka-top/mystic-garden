package top.mysgarden.garden.util;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;
import java.util.Locale;
import java.util.regex.Pattern;

/**
 * Slug 生成工具，逐字节对齐原 {@code tags/index.post.ts} 与 {@code notes/sync.post.ts}。
 */
public final class SlugUtils {

    private static final Pattern NON_SLUG_CHARS = Pattern.compile("[^\\w\\u4e00-\\u9fa5]+");
    private static final Pattern TRIM_DASHES = Pattern.compile("^-+|-+$");

    private SlugUtils() {
    }

    /** 将名称标准化为 URL Slug（保留字母、数字、下划线与中文字符）。 */
    public static String toSlug(String name) {
        if (name == null) {
            return "";
        }
        String replaced = NON_SLUG_CHARS.matcher(name.toLowerCase(Locale.ROOT).trim()).replaceAll("-");
        return TRIM_DASHES.matcher(replaced).replaceAll("");
    }

    /**
     * 笔记同步专用标签 Slug 生成（附带 SHA-256 前 8 位十六进制后缀，避免多语言标签碰撞）。
     */
    public static String createSyncTagSlug(String name) {
        String normalized = toSlug(name);
        if (normalized.isEmpty()) {
            normalized = "tag";
        }
        String prefix = normalized.length() > 40 ? normalized.substring(0, 40) : normalized;
        String suffix = sha256Hex(name).substring(0, 8);
        return prefix + "-" + suffix;
    }

    public static String sha256Hex(String input) {
        return sha256Hex(input.getBytes(StandardCharsets.UTF_8));
    }

    public static String sha256Hex(byte[] bytes) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            return HexFormat.of().formatHex(md.digest(bytes));
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 algorithm missing", e);
        }
    }
}
