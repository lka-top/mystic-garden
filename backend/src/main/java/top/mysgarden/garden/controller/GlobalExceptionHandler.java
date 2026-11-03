package top.mysgarden.garden.controller;

import java.sql.SQLException;
import java.util.NoSuchElementException;

import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.BindException;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.validation.ObjectError;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.HandlerMethodValidationException;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.multipart.support.MissingServletRequestPartException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import top.mysgarden.garden.dto.ErrorBody;
import top.mysgarden.garden.exception.BusinessException;
import top.mysgarden.garden.exception.NotFoundException;
import top.mysgarden.garden.exception.RateLimitException;

/**
 * 全局异常处理器，参照 OpenIsle 的 {@code controller/GlobalExceptionHandler}，
 * 并将所有错误统一输出为兼容 Nuxt 前端的 {@link ErrorBody}。
 */
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final String MSG_VALIDATION = "参数校验失败";
    private static final String MSG_NOT_FOUND = "资源不存在或已被删除";
    private static final String MSG_CONFLICT = "资源已存在：唯一字段冲突，请更换后重试";
    private static final String MSG_DB = "数据库操作失败，请稍后重试";

    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ErrorBody> handleBusiness(BusinessException ex) {
        return respond(ex.getStatus(), ex.getMessage());
    }

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<ErrorBody> handleNotFound(NotFoundException ex) {
        return respond(HttpStatus.NOT_FOUND, ex.getMessage() != null ? ex.getMessage() : MSG_NOT_FOUND);
    }

    @ExceptionHandler(RateLimitException.class)
    public ResponseEntity<ErrorBody> handleRateLimit(RateLimitException ex) {
        return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                .header(HttpHeaders.RETRY_AFTER, String.valueOf(ex.getRetryAfterSeconds()))
                .body(ErrorBody.of(HttpStatus.TOO_MANY_REQUESTS.value(), ex.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorBody> handleBodyValidation(MethodArgumentNotValidException ex) {
        return respond(HttpStatus.BAD_REQUEST, firstMessage(ex.getBindingResult()));
    }

    @ExceptionHandler(BindException.class)
    public ResponseEntity<ErrorBody> handleBind(BindException ex) {
        return respond(HttpStatus.BAD_REQUEST, firstMessage(ex.getBindingResult()));
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ErrorBody> handleConstraintViolation(ConstraintViolationException ex) {
        String message = ex.getConstraintViolations().stream()
                .map(ConstraintViolation::getMessage)
                .filter(m -> m != null && !m.isBlank())
                .findFirst()
                .orElse(MSG_VALIDATION);
        return respond(HttpStatus.BAD_REQUEST, message);
    }

    @ExceptionHandler(HandlerMethodValidationException.class)
    public ResponseEntity<ErrorBody> handleMethodValidation(HandlerMethodValidationException ex) {
        String message = ex.getParameterValidationResults().stream()
                .flatMap(r -> r.getResolvableErrors().stream())
                .map(e -> e.getDefaultMessage())
                .filter(m -> m != null && !m.isBlank())
                .findFirst()
                .orElse(MSG_VALIDATION);
        return respond(HttpStatus.BAD_REQUEST, message);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErrorBody> handleUnreadable(HttpMessageNotReadableException ex) {
        return respond(HttpStatus.BAD_REQUEST, "请求体格式不正确");
    }

    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<ErrorBody> handleMissingParam(MissingServletRequestParameterException ex) {
        return respond(HttpStatus.BAD_REQUEST, "缺少参数：" + ex.getParameterName());
    }

    @ExceptionHandler(MissingServletRequestPartException.class)
    public ResponseEntity<ErrorBody> handleMissingPart(MissingServletRequestPartException ex) {
        return respond(HttpStatus.BAD_REQUEST, "未接收到上传文件");
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ErrorBody> handleTypeMismatch(MethodArgumentTypeMismatchException ex) {
        if ("id".equals(ex.getName())) {
            return respond(HttpStatus.BAD_REQUEST, "无效的资源 ID");
        }
        return respond(HttpStatus.BAD_REQUEST, "参数 " + ex.getName() + " 格式不正确");
    }

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<ErrorBody> handleTooLarge(MaxUploadSizeExceededException ex) {
        return respond(HttpStatus.valueOf(413), "上传文件超过大小上限");
    }

    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<ErrorBody> handleMethodNotAllowed(HttpRequestMethodNotSupportedException ex) {
        return respond(HttpStatus.METHOD_NOT_ALLOWED, "请求方法不被支持");
    }

    @ExceptionHandler(HttpMediaTypeNotSupportedException.class)
    public ResponseEntity<ErrorBody> handleMediaType(HttpMediaTypeNotSupportedException ex) {
        return respond(HttpStatus.UNSUPPORTED_MEDIA_TYPE, "不支持的请求内容类型");
    }

    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<ErrorBody> handleNoResource(NoResourceFoundException ex) {
        return respond(HttpStatus.NOT_FOUND, "资源不存在");
    }

    @ExceptionHandler({ EmptyResultDataAccessException.class, EntityNotFoundException.class, NoSuchElementException.class })
    public ResponseEntity<ErrorBody> handleMissing(Exception ex) {
        return respond(HttpStatus.NOT_FOUND, MSG_NOT_FOUND);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErrorBody> handleIntegrity(DataIntegrityViolationException ex) {
        if (isDuplicateKey(ex)) {
            return respond(HttpStatus.CONFLICT, MSG_CONFLICT);
        }
        log.warn("数据完整性约束冲突: {}", rootMessage(ex));
        return respond(HttpStatus.INTERNAL_SERVER_ERROR, MSG_DB);
    }

    @ExceptionHandler(DataAccessException.class)
    public ResponseEntity<ErrorBody> handleDataAccess(DataAccessException ex) {
        log.error("数据库操作失败", ex);
        return respond(HttpStatus.INTERNAL_SERVER_ERROR, MSG_DB);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorBody> handleUnexpected(Exception ex) {
        log.error("未处理的服务端异常", ex);
        return respond(HttpStatus.INTERNAL_SERVER_ERROR, "服务器内部错误，请稍后重试");
    }

    private static ResponseEntity<ErrorBody> respond(HttpStatus status, String message) {
        return ResponseEntity.status(status).body(ErrorBody.of(status.value(), message));
    }

    private static String firstMessage(BindingResult result) {
        ObjectError first = result.getAllErrors().stream().findFirst().orElse(null);
        if (first == null) {
            return MSG_VALIDATION;
        }
        if (first instanceof FieldError fe && fe.isBindingFailure()) {
            return "参数 " + fe.getField() + " 格式不正确";
        }
        String message = first.getDefaultMessage();
        return (message == null || message.isBlank()) ? MSG_VALIDATION : message;
    }

    static boolean isDuplicateKey(Throwable ex) {
        for (Throwable cur = ex; cur != null; cur = cur.getCause()) {
            if (cur instanceof SQLException sql && (sql.getErrorCode() == 1062 || "23000".equals(sql.getSQLState()) && cur.getMessage() != null && cur.getMessage().contains("Duplicate"))) {
                return true;
            }
        }
        return false;
    }

    private static String rootMessage(Throwable ex) {
        Throwable cur = ex;
        while (cur.getCause() != null) {
            cur = cur.getCause();
        }
        return cur.getMessage();
    }
}
