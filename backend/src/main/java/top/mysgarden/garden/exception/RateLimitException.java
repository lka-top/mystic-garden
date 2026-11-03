package top.mysgarden.garden.exception;

import lombok.Getter;

/**
 * 请求频率超限异常，携带剩余冷却秒数用于写入 Retry-After 响应头。
 */
@Getter
public class RateLimitException extends RuntimeException {

    private final long retryAfterSeconds;

    public RateLimitException(String message, long retryAfterSeconds) {
        super(message);
        this.retryAfterSeconds = retryAfterSeconds;
    }
}
