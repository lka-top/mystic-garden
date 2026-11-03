package top.mysgarden.garden.config;

import java.time.Duration;

import org.springframework.boot.context.properties.ConfigurationProperties;

/** 应用级配置，对应 application.yml 的 {@code app.*}。 */
@ConfigurationProperties(prefix = "app")
public record AppProperties(
        String siteUrl,
        String siteName,
        String siteDescription,
        String authorName,
        Jwt jwt,
        String noteSyncToken,
        Storage storage) {

    public record Jwt(String secret, Duration expiration) {
    }

    public record Storage(String driver, String uploadDir, String publicBaseUrl) {
    }
}
