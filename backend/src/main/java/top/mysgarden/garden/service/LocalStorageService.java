package top.mysgarden.garden.service;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Arrays;
import java.util.Locale;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import top.mysgarden.garden.config.AppProperties;

/**
 * 本地持久化目录存储实现，路径穿越防护与 URL 映射逻辑严格对齐原 {@code server/utils/storage.ts}。
 */
@Service
public class LocalStorageService implements StorageService {

    public static final String STORAGE_PREFIX = "uploads";

    private final Path uploadRootDir;
    private final String publicBaseUrl;

    public LocalStorageService(AppProperties properties) {
        AppProperties.Storage storage = properties.storage();
        String configuredDir = (storage != null && storage.uploadDir() != null && !storage.uploadDir().isBlank())
                ? storage.uploadDir()
                : "./uploads";
        String configuredBase = (storage != null && storage.publicBaseUrl() != null && !storage.publicBaseUrl().isBlank())
                ? storage.publicBaseUrl()
                : "/" + STORAGE_PREFIX;

        this.uploadRootDir = Path.of(configuredDir).toAbsolutePath().normalize();
        this.publicBaseUrl = stripTrailingSlashes(configuredBase);
    }

    @Override
    public String upload(byte[] data, String filename, String mimeType, Scope scope, String explicitObjectKey) {
        String objectKey = (explicitObjectKey != null && !explicitObjectKey.isBlank())
                ? explicitObjectKey
                : buildMonthPrefix(scope) + "/" + normalizeFilename(filename);

        Path targetFile = resolveLocalFilePath(objectKey, uploadRootDir);
        try {
            Files.createDirectories(targetFile.getParent());
            Files.write(targetFile, data);
        } catch (IOException ex) {
            throw new UncheckedIOException("写入本地上传文件失败", ex);
        }
        return toPublicUrl(publicBaseUrl, extractRelativePath(objectKey));
    }

    @Override
    public boolean supportsDirectUpload() {
        return false;
    }

    public static String createStorageObjectKey(Scope scope, String filename) {
        int dot = filename.lastIndexOf('.');
        String ext = dot >= 0 ? filename.substring(dot).toLowerCase(Locale.ROOT) : "";
        return buildMonthPrefix(scope) + "/" + UUID.randomUUID() + ext;
    }

    /**
     * 将对象键（必须以 {@code uploads/} 开头）转换为安全的相对路径，拒绝任何 {@code ..} 路径穿越。
     */
    public static String extractRelativePath(String objectKey) {
        String prefix = STORAGE_PREFIX + "/";
        if (objectKey == null || !objectKey.startsWith(prefix)) {
            throw new IllegalArgumentException("无效的上传对象路径：" + objectKey);
        }
        String rawRelative = objectKey.substring(prefix.length());
        if (rawRelative.isBlank() || rawRelative.startsWith("/")) {
            throw new IllegalArgumentException("不安全的上传对象路径：" + objectKey);
        }
        String[] segments = rawRelative.split("/");
        for (String seg : segments) {
            if (seg.isEmpty() || ".".equals(seg) || "..".equals(seg) || seg.contains("\\")) {
                throw new IllegalArgumentException("不安全的上传对象路径：" + objectKey);
            }
        }
        return String.join("/", segments);
    }

    public static Path resolveLocalFilePath(String objectKey, Path uploadDir) {
        Path normalizedRoot = uploadDir.toAbsolutePath().normalize();
        String relative = extractRelativePath(objectKey);
        Path resolved = normalizedRoot.resolve(relative).normalize();
        if (!resolved.startsWith(normalizedRoot) || resolved.equals(normalizedRoot)) {
            throw new IllegalArgumentException("不安全的上传对象路径：" + objectKey);
        }
        return resolved;
    }

    public static String toPublicUrl(String publicDomain, String relativeOrKey) {
        String cleanDomain = stripTrailingSlashes(publicDomain);
        String encodedPath = Arrays.stream(relativeOrKey.split("/"))
                .map(seg -> URLEncoder.encode(seg, StandardCharsets.UTF_8).replace("+", "%20"))
                .collect(Collectors.joining("/"));
        return cleanDomain + "/" + encodedPath;
    }

    public String getLocalPublicUrl(String objectKey) {
        return toPublicUrl(publicBaseUrl, extractRelativePath(objectKey));
    }

    static String normalizeFilename(String filename) {
        String baseName = Path.of(filename).getFileName().toString();
        String cleaned = baseName
                .replaceAll("[^a-zA-Z0-9._-]", "-")
                .replaceAll("-+", "-")
                .replaceAll("^-+|-+$", "");
        return cleaned.isEmpty() ? "image" : cleaned;
    }

    private static String buildMonthPrefix(Scope scope) {
        LocalDate now = LocalDate.now(ZoneId.systemDefault());
        return String.format("%s/%s/%04d/%02d", STORAGE_PREFIX, scope.dirName(), now.getYear(), now.getMonthValue());
    }

    private static String stripTrailingSlashes(String url) {
        int end = url.length();
        while (end > 0 && url.charAt(end - 1) == '/') {
            end--;
        }
        return url.substring(0, end);
    }
}
