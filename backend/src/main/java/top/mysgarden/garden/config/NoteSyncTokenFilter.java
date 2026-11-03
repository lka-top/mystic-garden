package top.mysgarden.garden.config;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.web.filter.OncePerRequestFilter;

import top.mysgarden.garden.util.ClientInfo;

/**
 * 笔记同步独立凭证过滤器，仅作用于 {@code /api/v1/notes/sync} 及其子路径，
 * 使用常量时间比较，严格对齐原 {@code server/utils/note-sync.ts}。
 */
public class NoteSyncTokenFilter extends OncePerRequestFilter {

    private final AppProperties properties;

    public NoteSyncTokenFilter(AppProperties properties) {
        this.properties = properties;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        return !"/api/v1/notes/sync".equals(path) && !path.startsWith("/api/v1/notes/sync/");
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        String expected = properties.noteSyncToken();
        if (expected == null || expected.length() < 32) {
            ClientInfo.writeError(response, 503, "笔记同步服务未配置");
            return;
        }

        String auth = request.getHeader(HttpHeaders.AUTHORIZATION);
        String actual = (auth != null && auth.startsWith("Bearer ")) ? auth.substring(7) : "";
        byte[] expectedBytes = expected.getBytes(StandardCharsets.UTF_8);
        byte[] actualBytes = actual.getBytes(StandardCharsets.UTF_8);

        if (actual.isEmpty() || !MessageDigest.isEqual(expectedBytes, actualBytes)) {
            ClientInfo.writeError(response, 401, "笔记同步凭证无效");
            return;
        }

        filterChain.doFilter(request, response);
    }
}
