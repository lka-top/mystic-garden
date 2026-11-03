package top.mysgarden.garden.exception;

/**
 * 资源不存在异常，由 GlobalExceptionHandler 映射为 HTTP 404。
 */
public class NotFoundException extends RuntimeException {

    public NotFoundException(String message) {
        super(message);
    }
}
