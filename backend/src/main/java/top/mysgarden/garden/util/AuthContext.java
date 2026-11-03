package top.mysgarden.garden.util;

import java.util.Optional;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import top.mysgarden.garden.exception.BusinessException;

/**
 * 安全上下文读取辅助，语义对齐原 {@code server/utils/auth.ts} 与 {@code pagination.ts}。
 */
public final class AuthContext {

    private AuthContext() {
    }

    /** 对应 {@code tryGetAuthUser}：获取任意已登录用户（admin / user），匿名返回 empty。 */
    public static Optional<AuthenticatedUser> currentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && auth.getPrincipal() instanceof AuthenticatedUser user) {
            return Optional.of(user);
        }
        return Optional.empty();
    }

    /** 对应 {@code tryGetAdminUser}：若当前已登录且为管理员则返回 true。 */
    public static boolean isAdmin() {
        return currentUser().map(AuthenticatedUser::isAdmin).orElse(false);
    }

    /** 对应 {@code isAdminAllRequest}：仅当管理员携带 {@code all=true} 时返回未发布/未审核数据。 */
    public static boolean isAdminAll(String allParam) {
        return "true".equals(allParam) && isAdmin();
    }

    /** 对应 {@code requireAdminUser}：强制要求管理员身份。 */
    public static AuthenticatedUser requireAdmin() {
        AuthenticatedUser user = currentUser()
                .orElseThrow(() -> BusinessException.unauthorized("未提供访问令牌，请先登录"));
        if (!user.isAdmin()) {
            throw BusinessException.forbidden("权限不足：需要管理员权限");
        }
        return user;
    }
}
