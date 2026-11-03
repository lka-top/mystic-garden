package top.mysgarden.garden.service;

import org.junit.jupiter.api.Test;

import top.mysgarden.garden.util.ImageTypeValidator;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * 图片扩展名与 MIME 类型校验单测，移植并扩展原 {@code tests/unit/image-upload.spec.ts}。
 */
class ImageTypeValidatorTest {

    @Test
    void acceptsMatchingExtensionAndMimeType() {
        var webp = ImageTypeValidator.validate("cover.webp", "image/webp");
        assertThat(webp).isNotNull();
        assertThat(webp.ext()).isEqualTo(".webp");
        assertThat(webp.mimeType()).isEqualTo("image/webp");

        var jpegUpper = ImageTypeValidator.validate("PHOTO.JPEG", "image/jpeg; charset=UTF-8");
        assertThat(jpegUpper).isNotNull();
        assertThat(jpegUpper.ext()).isEqualTo(".jpeg");
        assertThat(jpegUpper.mimeType()).isEqualTo("image/jpeg");

        assertThat(ImageTypeValidator.validate("vector.svg", "image/svg+xml")).isNull();
    }

    @Test
    void rejectsMismatchedOrUnsupportedFormats() {
        assertThat(ImageTypeValidator.validate("cover.png", "image/jpeg")).isNull();
        assertThat(ImageTypeValidator.validate("archive.pdf", "application/pdf")).isNull();
        assertThat(ImageTypeValidator.validate("noext", "image/png")).isNull();
        assertThat(ImageTypeValidator.validate(null, "image/png")).isNull();
    }

    @Test
    void distinguishesAdminAndNoteSizeLimits() {
        assertThat(ImageTypeValidator.MAX_ADMIN_IMAGE_SIZE).isEqualTo(25L * 1024 * 1024);
        assertThat(ImageTypeValidator.MAX_NOTE_IMAGE_SIZE).isEqualTo(10L * 1024 * 1024);
    }

    @Test
    void verifiesImageSignaturesInsteadOfTrustingClientMetadata() {
        var png = ImageTypeValidator.validate("cover.png", "image/png");
        assertThat(ImageTypeValidator.matchesContent(png, new byte[] {
                (byte) 0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A
        })).isTrue();
        assertThat(ImageTypeValidator.matchesContent(png, "not-a-png".getBytes())).isFalse();

        var webp = ImageTypeValidator.validate("cover.webp", "image/webp");
        assertThat(ImageTypeValidator.matchesContent(webp, new byte[] {
                'R', 'I', 'F', 'F', 0, 0, 0, 0, 'W', 'E', 'B', 'P'
        })).isTrue();

        var avif = ImageTypeValidator.validate("cover.avif", "image/avif");
        assertThat(ImageTypeValidator.matchesContent(avif, new byte[] {
                0, 0, 0, 24, 'f', 't', 'y', 'p', 'a', 'v', 'i', 'f', 0, 0, 0, 0
        })).isTrue();
    }
}
