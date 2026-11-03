package top.mysgarden.garden.dto;

import java.time.Instant;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonSetter;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 文章模块请求与响应 DTO。
 */
public final class ArticleDtos {

    private ArticleDtos() {
    }

    /** GET /articles 分页列表项。 */
    public record ArticleListItemDto(
            Integer id,
            String slug,
            String title,
            String summary,
            String coverImage,
            @JsonProperty("isPublished") boolean isPublished,
            @JsonProperty("isPinned") boolean isPinned,
            int views,
            int readingTime,
            Instant createdAt,
            Instant updatedAt,
            TaxonomyDtos.CategoryBriefDto category,
            List<TaxonomyDtos.TagBriefDto> tags,
            @JsonProperty("_count") InteractionDtos.CommentCountMetaDto countMeta,
            long commentCount
    ) {
    }

    /** GET /articles/{slug}、POST /articles、PUT /articles/{id} 详情响应。 */
    public record ArticleDetailDto(
            Integer id,
            String slug,
            String title,
            String summary,
            String content,
            String coverImage,
            @JsonProperty("isPublished") boolean isPublished,
            @JsonProperty("isPinned") boolean isPinned,
            int views,
            int readingTime,
            Integer categoryId,
            Integer authorId,
            Instant createdAt,
            Instant updatedAt,
            TaxonomyDtos.CategoryDto category,
            UserDtos.AuthorDto author,
            List<TaxonomyDtos.TagBriefDto> tags,
            @JsonProperty("_count") InteractionDtos.CommentCountMetaDto countMeta,
            long commentCount
    ) {
    }

    public record CreateArticleRequest(
            @NotBlank(message = "Slug 长度至少 2 个字符")
            @Size(min = 2, max = 100, message = "Slug 长度至少 2 个字符")
            String slug,

            @NotBlank(message = "标题不能为空")
            @Size(max = 200, message = "标题最多 200 个字符")
            String title,

            @NotBlank(message = "摘要不能为空")
            @Size(max = 500, message = "摘要最多 500 个字符")
            String summary,

            @NotBlank(message = "内容不能为空")
            String content,

            String coverImage,

            @JsonProperty("isPublished") Boolean isPublished,
            @JsonProperty("isPinned") Boolean isPinned,

            @Min(value = 0, message = "阅读时长不能为负数")
            Integer readingTime,

            @Positive(message = "分类 ID 必须为正整数") Integer categoryId,
            List<@NotNull(message = "标签 ID 不能为空") @Positive(message = "标签 ID 必须为正整数") Integer> tagIds
    ) {
        public boolean publishedOrDefault() {
            return Boolean.TRUE.equals(isPublished);
        }

        public boolean pinnedOrDefault() {
            return Boolean.TRUE.equals(isPinned);
        }

        public int readingTimeOrDefault() {
            return readingTime != null ? readingTime : 0;
        }

        public List<Integer> tagIdsOrEmpty() {
            return tagIds != null ? tagIds : List.of();
        }
    }

    /**
     * 更新文章请求：显式跟踪可置空字段（coverImage、categoryId、tagIds）是否出现在 JSON 中，
     * 以精确复现原 Zod {@code .optional().nullable()} 的“未传不改、传 null 置空”语义。
     */
    @Getter
    @Setter
    @NoArgsConstructor
    public static class UpdateArticleRequest {

        @Size(min = 2, max = 100, message = "Slug 长度至少 2 个字符")
        private String slug;

        @Size(min = 1, max = 200, message = "标题不能为空")
        private String title;

        @Size(min = 1, max = 500, message = "摘要不能为空")
        private String summary;

        @Size(min = 1, message = "内容不能为空")
        private String content;

        private String coverImage;
        @JsonIgnore
        private boolean coverImageSet;

        @JsonProperty("isPublished")
        private Boolean isPublished;

        @JsonProperty("isPinned")
        private Boolean isPinned;

        @Min(value = 0, message = "阅读时长不能为负数")
        private Integer readingTime;

        @Positive(message = "分类 ID 必须为正整数")
        private Integer categoryId;
        @JsonIgnore
        private boolean categoryIdSet;

        private List<@NotNull(message = "标签 ID 不能为空") @Positive(message = "标签 ID 必须为正整数") Integer> tagIds;
        @JsonIgnore
        private boolean tagIdsSet;

        @JsonSetter("coverImage")
        public void assignCoverImage(String coverImage) {
            this.coverImage = coverImage;
            this.coverImageSet = true;
        }

        @JsonSetter("categoryId")
        public void assignCategoryId(Integer categoryId) {
            this.categoryId = categoryId;
            this.categoryIdSet = true;
        }

        @JsonSetter("tagIds")
        public void assignTagIds(List<Integer> tagIds) {
            this.tagIds = tagIds;
            this.tagIdsSet = true;
        }
    }
}
