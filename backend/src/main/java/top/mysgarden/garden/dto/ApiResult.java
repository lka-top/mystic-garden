package top.mysgarden.garden.dto;

/**
 * 统一成功响应契约：{@code { code: 200, message, data }}，与原 Nuxt successResponse 完全一致。
 */
public record ApiResult<T>(int code, String message, T data) {

    public static <T> ApiResult<T> ok(T data) {
        return new ApiResult<>(200, "success", data);
    }

    public static <T> ApiResult<T> ok(T data, String message) {
        return new ApiResult<>(200, message, data);
    }
}
