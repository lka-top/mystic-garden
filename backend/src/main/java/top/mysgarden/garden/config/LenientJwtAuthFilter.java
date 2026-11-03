package top.mysgarden.garden.config;

import java.io.IOException;
import java.util.List;
import java.util.Locale;
import java.util.Optional;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import top.mysgarden.garden.service.JwtService;
import top.mysgarden.garden.util.AuthenticatedUser;

/**
 * 宽松型 JWT 身份过滤器：
 * - 若携带有效 JWT，则注入 {@link AuthenticatedUser} 及 {@code ROLE_ADMIN / ROLE_USER / ROLE_GUEST}；
 * - 若未携带或令牌过期/无效，绝不在过滤器层直接返回 401（保证公开 GET 接口对携带过期 Cookie 的浏览器友好降级），
 *   仅在 request attribute 上记录 {@link #ATTR_JWT_INVALID}，供受保护端点的 AuthenticationEntryPoint 返回精确错误消息。
 */
public class LenientJwtAuthFilter extends OncePerRequestFilter {

    public static final String ATTR_JWT_INVALID = "garden.jwt.invalid";

    private final JwtService jwtService;

    public LenientJwtAuthFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        // 笔记同步接口使用独立的 NOTE_SYNC_TOKEN，不当作 JWT 解析
        return "/api/v1/notes/sync".equals(path) || path.startsWith("/api/v1/notes/sync/");
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        String header = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (header != null && header.startsWith("Bearer ")) {
            String rawToken = header.substring(7).trim();
            Optional<AuthenticatedUser> verified = jwtService.verifyToken(rawToken);
            if (verified.isPresent()) {
                AuthenticatedUser user = verified.get();
                String roleAuthority = "ROLE_" + user.role().toUpperCase(Locale.ROOT);
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                user,
                                null,
                                List.of(new SimpleGrantedAuthority(roleAuthority)));
                SecurityContextHolder.getContext().setAuthentication(authentication);
            } else {
                request.setAttribute(ATTR_JWT_INVALID, Boolean.TRUE);
            }
        }

        filterChain.doFilter(request, response);
    }
}
