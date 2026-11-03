package top.mysgarden.garden.service;

import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

import top.mysgarden.garden.config.AppProperties;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/**
 * 本地图片存储测试，完整移植并扩展原 {@code tests/unit/storage.spec.ts}。
 */
class LocalStorageServiceTest {

    @TempDir
    Path tempDir;

    private LocalStorageService createService(String publicBaseUrl) {
        AppProperties props = new AppProperties(
                "https://mysgarden.top",
                "神秘花园",
                "desc",
                "lka",
                null,
                null,
                new AppProperties.Storage("local", tempDir.toString(), publicBaseUrl)
        );
        return new LocalStorageService(props);
    }

    @Test
    void mapsObjectKeyToRelativePathAndPublicUrl() {
        LocalStorageService service = createService("https://mysgarden.top/uploads/");

        assertThat(LocalStorageService.extractRelativePath("uploads/notes/2026/09/example.png"))
                .isEqualTo("notes/2026/09/example.png");
        assertThat(service.getLocalPublicUrl("uploads/notes/2026/09/example.png"))
                .isEqualTo("https://mysgarden.top/uploads/notes/2026/09/example.png");
        assertThat(service.supportsDirectUpload()).isFalse();
    }

    @Test
    void rejectsPathTraversalAndInvalidPrefix() {
        assertThatThrownBy(() -> LocalStorageService.extractRelativePath("notes/example.png"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("无效的上传对象路径");

        assertThatThrownBy(() -> LocalStorageService.extractRelativePath("uploads/../secret.png"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("不安全的上传对象路径");

        assertThatThrownBy(() -> LocalStorageService.extractRelativePath("uploads/admin/../../etc/passwd"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("不安全的上传对象路径");

        assertThatThrownBy(() -> LocalStorageService.extractRelativePath("uploads/admin\\secret.png"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("不安全的上传对象路径");

        assertThatThrownBy(() -> LocalStorageService.resolveLocalFilePath("uploads/../outside.png", tempDir))
                .isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    void writesBytesIntoLocalUploadDirectory() throws Exception {
        LocalStorageService service = createService("/uploads");
        String objectKey = "uploads/admin/2026/09/test.png";
        byte[] content = "image-data".getBytes(StandardCharsets.UTF_8);

        String url = service.upload(content, "test.png", "image/png", StorageService.Scope.ADMIN, objectKey);

        assertThat(url).isEqualTo("/uploads/admin/2026/09/test.png");
        Path savedFile = LocalStorageService.resolveLocalFilePath(objectKey, tempDir);
        assertThat(Files.readString(savedFile, StandardCharsets.UTF_8)).isEqualTo("image-data");
    }
}
