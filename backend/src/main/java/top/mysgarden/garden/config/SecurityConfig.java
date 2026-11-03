package top.mysgarden.garden.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import top.mysgarden.garden.service.JwtService;
import top.mysgarden.garden.util.ClientInfo;

/**
 * Spring Security 无状态鉴权配置（参照 OpenIsle {@code SecurityConfig}），
 * 完整对齐原 Nuxt {@code server/utils/auth.ts} 的 401/403 文案与路由权限边界。
 */
@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtService jwtService;
    private final AppProperties appProperties;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(10);
    }

    @Bean
    public RateLimitFilter rateLimitFilter() {
        return new RateLimitFilter();
    }

    @Bean
    public NoteSyncTokenFilter noteSyncTokenFilter() {
        return new NoteSyncTokenFilter(appProperties);
    }

    @Bean
    public LenientJwtAuthFilter lenientJwtAuthFilter() {
        return new LenientJwtAuthFilter(jwtService);
    }

    @Bean
    public AuthenticationEntryPoint customAuthenticationEntryPoint() {
        return (request, response, authException) -> {
            boolean invalid = Boolean.TRUE.equals(request.getAttribute(LenientJwtAuthFilter.ATTR_JWT_INVALID));
            String message = invalid
                    ? "令牌无效或已过期，请重新登录"
                    : "未提供访问令牌，请先登录";
            ClientInfo.writeError(response, 401, message);
        };
    }

    @Bean
    public AccessDeniedHandler customAccessDeniedHandler() {
        return (request, response, accessDeniedException) ->
                ClientInfo.writeError(response, 403, "权限不足：需要管理员权限");
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            RateLimitFilter rateLimitFilter,
            NoteSyncTokenFilter noteSyncTokenFilter,
            LenientJwtAuthFilter lenientJwtAuthFilter,
            AuthenticationEntryPoint authenticationEntryPoint,
            AccessDeniedHandler accessDeniedHandler) throws Exception {

        http
                .csrf(AbstractHttpConfigurer::disable)
                .httpBasic(AbstractHttpConfigurer::disable)
                .formLogin(AbstractHttpConfigurer::disable)
                .logout(AbstractHttpConfigurer::disable)
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .exceptionHandling(eh -> eh
                        .authenticationEntryPoint(authenticationEntryPoint)
                        .accessDeniedHandler(accessDeniedHandler))
                .authorizeHttpRequests(auth -> auth
                        // 健康检查与 OpenAPI 文档
                        .requestMatchers("/actuator/health", "/actuator/health/**", "/v3/api-docs/**").permitAll()
                        // 登录、注册、游客评论、随笔点赞公开
                        .requestMatchers(HttpMethod.POST, "/api/v1/auth/login", "/api/v1/auth/register").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/v1/comments").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/v1/essays/*/like").permitAll()
                        // 笔记同步由 NoteSyncTokenFilter 独立鉴权
                        .requestMatchers("/api/v1/notes/sync", "/api/v1/notes/sync/**").permitAll()
                        // /auth/me 要求管理员角色（与原 requireAdminUser 行为一致）
                        .requestMatchers(HttpMethod.GET, "/api/v1/auth/me").hasRole("ADMIN")
                        // 其余 GET 公开接口与 SEO XML 公开
                        .requestMatchers(HttpMethod.GET, "/api/v1/**", "/feed.xml", "/sitemap.xml").permitAll()
                        // 其余所有 /api/v1/** 写操作要求管理员角色
                        .requestMatchers("/api/v1/**").hasRole("ADMIN")
                        .anyRequest().denyAll())
                .addFilterBefore(rateLimitFilter, UsernamePasswordAuthenticationFilter.class)
                .addFilterAfter(noteSyncTokenFilter, RateLimitFilter.class)
                .addFilterAfter(lenientJwtAuthFilter, NoteSyncTokenFilter.class);

        return http.build();
    }
}
