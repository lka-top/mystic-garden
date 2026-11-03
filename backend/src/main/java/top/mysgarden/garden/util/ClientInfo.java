package top.mysgarden.garden.util;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import top.mysgarden.garden.dto.ErrorBody;

/**
 * 客户端 IP、User-Agent 提取与 Filter 层错误响应输出工具。
 */
public final class ClientInfo {

    private static final int MAX_IP = 50;
    private static final int MAX_UA = 255;

    private ClientInfo() {
    }

    /**
     * 优先读取 Nginx 写入的 {@code X-Real-IP}（后端仅在内部网络暴露，避免客户端伪造 X-Forwarded-For 绕过限流）。
     */
    public static String ip(HttpServletRequest request) {
        String realIp = request.getHeader("X-Real-IP");
        String ip = (realIp != null && !realIp.isBlank()) ? realIp.trim() : request.getRemoteAddr();
        if (ip == null || ip.isBlank()) {
            ip = "127.0.0.1";
        }
        return ip.length() > MAX_IP ? ip.substring(0, MAX_IP) : ip;
    }

    public static String userAgent(HttpServletRequest request) {
        String ua = request.getHeader("User-Agent");
        if (ua == null) {
            return null;
        }
        return ua.length() > MAX_UA ? ua.substring(0, MAX_UA) : ua;
    }

    public static void writeError(HttpServletResponse response, int status, String message) throws IOException {
        response.setStatus(status);
        response.setCharacterEncoding(StandardCharsets.UTF_8.name());
        response.setContentType("application/json;charset=UTF-8");
        response.getWriter().write(ErrorBody.of(status, message).toJson());
    }
}
