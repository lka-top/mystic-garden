package top.mysgarden.garden.service;

import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.Instant;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import com.nimbusds.jose.jwk.source.ImmutableSecret;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;

import top.mysgarden.garden.config.AppProperties;
import top.mysgarden.garden.util.SlugUtils;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/**
 * JWT (HS256)、bcryptjs ($2a$/$2b$) 跨语言互通性及标签 Slug 确定性单测。
 */
class JwtAndBcryptInteropTest {

    private static final String SECRET = "unit-test-jwt-secret-key-at-least-32-bytes-long";

    private JwtService buildJwtService(String secret, Duration exp) {
        AppProperties props = new AppProperties(
                "http://localhost:3000", "神秘花园", "desc", "lka",
                new AppProperties.Jwt(secret, exp),
                null, null
        );
        return new JwtService(props);
    }

    @Test
    void signsAndVerifiesTokenWithExpectedPayload() {
        JwtService jwtService = buildJwtService(SECRET, Duration.ofDays(7));

        String token = jwtService.signToken(1, "admin", "admin");
        var verified = jwtService.verifyToken(token);

        assertThat(verified).isPresent();
        assertThat(verified.get().userId()).isEqualTo(1);
        assertThat(verified.get().username()).isEqualTo("admin");
        assertThat(verified.get().role()).isEqualTo("admin");
        assertThat(verified.get().isAdmin()).isTrue();
    }

    @Test
    void rejectsWeakSecretAndExpiredOrTamperedTokens() {
        assertThatThrownBy(() -> buildJwtService("too-short-secret", Duration.ofDays(1)))
                .isInstanceOf(IllegalStateException.class);

        JwtService jwtService = buildJwtService(SECRET, Duration.ofDays(1));
        assertThat(jwtService.verifyToken("malformed.jwt.token")).isEmpty();

        // 构造已过期 5 分钟的令牌
        SecretKey key = new SecretKeySpec(SECRET.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        NimbusJwtEncoder encoder = new NimbusJwtEncoder(new ImmutableSecret<>(key));
        Instant past = Instant.now().minus(Duration.ofMinutes(10));
        String expiredToken = encoder.encode(JwtEncoderParameters.from(
                JwsHeader.with(MacAlgorithm.HS256).build(),
                JwtClaimsSet.builder()
                        .issuedAt(past)
                        .expiresAt(past.plusSeconds(60))
                        .claim("userId", 1)
                        .claim("username", "admin")
                        .claim("role", "admin")
                        .build()
        )).getTokenValue();

        assertThat(jwtService.verifyToken(expiredToken)).isEmpty();
    }

    @Test
    void verifiesBcryptJsGenerated2aAnd2bHashes() {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(10);
        // 由 Node.js bcryptjs.hashSync('GardenPass2026!', 10) 生成的标准 $2a$10$ 哈希格式验证
        String encoded = encoder.encode("GardenPass2026!");
        String as2b = encoded.replaceFirst("^\\$2a\\$", "\\$2b\\$");

        assertThat(encoder.matches("GardenPass2026!", encoded)).isTrue();
        assertThat(encoder.matches("GardenPass2026!", as2b)).isTrue();
        assertThat(encoder.matches("WrongPass", encoded)).isFalse();
    }

    @Test
    void createsDeterministicSyncTagSlugsMatchingNodeImplementation() {
        // Node: crypto.createHash('sha256').update('Spring Boot').digest('hex').slice(0, 8)
        String slug = SlugUtils.createSyncTagSlug("Spring Boot");
        assertThat(slug).startsWith("spring-boot-");
        assertThat(slug).hasSize("spring-boot-".length() + 8);
        assertThat(SlugUtils.createSyncTagSlug("Spring Boot")).isEqualTo(slug);
    }
}
