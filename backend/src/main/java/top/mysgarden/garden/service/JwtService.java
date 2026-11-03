package top.mysgarden.garden.service;

import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.Instant;
import java.util.Optional;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import com.nimbusds.jose.jwk.source.ImmutableSecret;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.stereotype.Service;

import top.mysgarden.garden.config.AppProperties;
import top.mysgarden.garden.util.AuthenticatedUser;

/**
 * JWT 签发与校验服务（HS256），载荷结构 {@code { userId, username, role }} 与原 Node jsonwebtoken 完全互通。
 */
@Service
public class JwtService {

    private final JwtEncoder jwtEncoder;
    private final JwtDecoder jwtDecoder;
    private final Duration expiration;

    public JwtService(AppProperties properties) {
        AppProperties.Jwt jwtProps = properties.jwt();
        String secret = jwtProps != null ? jwtProps.secret() : null;
        if (secret == null || secret.getBytes(StandardCharsets.UTF_8).length < 32) {
            throw new IllegalStateException("缺少或过弱的 JWT_SECRET 环境变量（HS256 至少需要 32 字节），拒绝启动");
        }
        byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        SecretKey secretKey = new SecretKeySpec(keyBytes, "HmacSHA256");
        this.jwtEncoder = new NimbusJwtEncoder(new ImmutableSecret<>(secretKey));
        this.jwtDecoder = NimbusJwtDecoder.withSecretKey(secretKey)
                .macAlgorithm(MacAlgorithm.HS256)
                .build();
        this.expiration = (jwtProps.expiration() != null) ? jwtProps.expiration() : Duration.ofDays(7);
    }

    public String signToken(Integer userId, String username, String role) {
        Instant now = Instant.now();
        JwsHeader header = JwsHeader.with(MacAlgorithm.HS256).build();
        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuedAt(now)
                .expiresAt(now.plus(expiration))
                .subject(username)
                .claim("userId", userId)
                .claim("username", username)
                .claim("role", role)
                .build();
        return jwtEncoder.encode(JwtEncoderParameters.from(header, claims)).getTokenValue();
    }

    public Optional<AuthenticatedUser> verifyToken(String token) {
        if (token == null || token.isBlank()) {
            return Optional.empty();
        }
        try {
            Jwt jwt = jwtDecoder.decode(token);
            Object rawUserId = jwt.getClaim("userId");
            String username = jwt.getClaimAsString("username");
            String role = jwt.getClaimAsString("role");
            if (!(rawUserId instanceof Number num) || username == null || role == null) {
                return Optional.empty();
            }
            return Optional.of(new AuthenticatedUser(num.intValue(), username, role));
        } catch (JwtException | IllegalArgumentException ex) {
            return Optional.empty();
        }
    }
}
