package top.mysgarden.garden.config;

import java.io.IOException;
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.web.filter.OncePerRequestFilter;

import top.mysgarden.garden.util.ClientInfo;

/**
 * 内存滑动窗口限流过滤器，规则与原 {@code server/middleware/rate-limit.ts} 完全一致。
 */
public class RateLimitFilter extends OncePerRequestFilter {

    public record Rule(String path, String method, int limit, long windowMs) {
    }

    private static final List<Rule> RULES = List.of(
            new Rule("/api/v1/auth/login", "POST", 5, 60_000L),
            new Rule("/api/v1/auth/register", "POST", 3, 60_000L),
            new Rule("/api/v1/comments", "POST", 10, 60_000L),
            new Rule("/api/v1/upload", "POST", 15, 60_000L),
            new Rule("/api/v1/uploads/sign", "POST", 30, 60_000L)
    );

    private static final long CLEANUP_INTERVAL_MS = 5 * 60_000L;

    private final Map<String, Deque<Long>> ipRecords = new ConcurrentHashMap<>();
    private final AtomicLong lastCleanup = new AtomicLong(System.currentTimeMillis());

    public void clear() {
        ipRecords.clear();
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        String path = request.getRequestURI();
        String method = request.getMethod();

        Rule matched = null;
        for (Rule rule : RULES) {
            if (rule.method().equalsIgnoreCase(method)
                    && (path.equals(rule.path()) || path.startsWith(rule.path() + "/"))) {
                matched = rule;
                break;
            }
        }

        if (matched == null) {
            filterChain.doFilter(request, response);
            return;
        }

        long now = System.currentTimeMillis();
        long prevCleanup = lastCleanup.get();
        if (now - prevCleanup > CLEANUP_INTERVAL_MS && lastCleanup.compareAndSet(prevCleanup, now)) {
            cleanupExpired(now);
        }

        String clientIp = ClientInfo.ip(request);
        String key = matched.method() + ":" + matched.path() + ":" + clientIp;
        Deque<Long> deque = ipRecords.computeIfAbsent(key, k -> new ArrayDeque<>());

        long retryAfterSeconds = 0;
        synchronized (deque) {
            while (!deque.isEmpty() && now - deque.peekFirst() >= matched.windowMs()) {
                deque.pollFirst();
            }
            if (deque.size() >= matched.limit()) {
                long earliest = deque.peekFirst() != null ? deque.peekFirst() : now;
                retryAfterSeconds = Math.max(1L, (long) Math.ceil((matched.windowMs() - (now - earliest)) / 1000.0));
            } else {
                deque.addLast(now);
            }
        }

        if (retryAfterSeconds > 0) {
            response.setHeader(HttpHeaders.RETRY_AFTER, String.valueOf(retryAfterSeconds));
            ClientInfo.writeError(response, 429, "请求过于频繁，请在 " + retryAfterSeconds + " 秒后再试");
            return;
        }

        filterChain.doFilter(request, response);
    }

    private void cleanupExpired(long now) {
        long maxWindow = 60_000L;
        ipRecords.entrySet().removeIf(entry -> {
            Deque<Long> deque = entry.getValue();
            synchronized (deque) {
                while (!deque.isEmpty() && now - deque.peekFirst() >= maxWindow) {
                    deque.pollFirst();
                }
                return deque.isEmpty();
            }
        });
    }
}
