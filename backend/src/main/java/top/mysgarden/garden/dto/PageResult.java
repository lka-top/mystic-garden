package top.mysgarden.garden.dto;

import java.util.List;

/**
 * 统一分页响应数据：{@code { list, pagination: { total, page, pageSize, totalPages } }}。
 */
public record PageResult<T>(List<T> list, Pagination pagination) {

    public record Pagination(long total, int page, int pageSize, int totalPages) {
    }

    public static <T> PageResult<T> of(List<T> list, long total, int page, int pageSize) {
        int totalPages = pageSize <= 0 ? 0 : (int) Math.ceil((double) total / pageSize);
        return new PageResult<>(list, new Pagination(total, page, pageSize, totalPages));
    }
}
