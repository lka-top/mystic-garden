package top.mysgarden.garden.dto;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * 分类与标签相关请求和响应 DTO。
 */
public final class TaxonomyDtos {

    private TaxonomyDtos() {
    }

    public record CategoryDto(
            Integer id,
            String name,
            String slug,
            String description,
            @JsonInclude(JsonInclude.Include.NON_NULL) Long articleCount
    ) {
    }

    public record CategoryBriefDto(
            Integer id,
            String name,
            String slug
    ) {
    }

    public record NameSlugDto(
            String name,
            String slug
    ) {
    }

    public record TagDto(
            Integer id,
            String name,
            String slug,
            @JsonInclude(JsonInclude.Include.NON_NULL) Long articleCount,
            @JsonInclude(JsonInclude.Include.NON_NULL) Long noteCount
    ) {
    }

    public record TagBriefDto(
            Integer id,
            String name,
            String slug
    ) {
    }

    public record CategoriesOverviewDto(
            List<CategoryDto> categories,
            List<TagDto> tags
    ) {
    }

    public record CreateCategoryRequest(
            @NotBlank(message = "分类名称不能为空")
            @Size(max = 50, message = "分类名称最多50个字符")
            String name,

            @NotBlank(message = "Slug 标识不能为空")
            @Size(max = 50, message = "Slug 最多50个字符")
            String slug,

            @Size(max = 200, message = "分类描述最多200个字符")
            String description
    ) {
    }

    public record CreateTagRequest(
            @NotBlank(message = "标签名称不能为空")
            @Size(max = 50, message = "标签名称最多 50 个字符")
            String name,

            @Size(max = 50, message = "标签 Slug 最多 50 个字符")
            String slug
    ) {
    }
}
