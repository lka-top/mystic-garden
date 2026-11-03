package top.mysgarden.garden.util;

/**
 * 已通过 JWT 认证的当前请求用户载荷（对应原 AuthPayload：{ userId, username, role }）。
 */
public record AuthenticatedUser(Integer userId, String username, String role) {

    public boolean isAdmin() {
        return "admin".equalsIgnoreCase(role);
    }
}
