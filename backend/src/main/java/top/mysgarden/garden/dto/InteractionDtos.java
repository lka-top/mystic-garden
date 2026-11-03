package top.mysgarden.garden.dto;

import java.time.Instant;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import org.hibernate.validator.constraints.URL;

/**
 * 随笔、评论、上传、搜索与统计模块请求与响应 DTO。
 */
public final class InteractionDtos {

    private InteractionDtos() {
    }

    public record CommentCountMetaDto(long comments) {
    }

    public record EssayDto(
            Integer id,
            String content,
            String mood,
            String weather,
            String location,
            List<String> images,
            @JsonProperty("isPinned") boolean isPinned,
            @JsonProperty("isPublished") boolean isPublished,
            int likes,
            Integer authorId,
            Instant createdAt,
            Instant updatedAt,
            UserDtos.SimpleAuthorDto author,
            @JsonInclude(JsonInclude.Include.NON_NULL) @JsonProperty("_count") CommentCountMetaDto countMeta,
            @JsonInclude(JsonInclude.Include.NON_NULL) Long commentCount
    ) {
    }

    public record CreateEssayRequest(
            @NotBlank(message = "随笔内容不能为空")
            String content,

            @Size(max = 30, message = "心情标签最多 30 个字符")
            String mood,

            @Size(max = 30, message = "天气标签最多 30 个字符")
            String weather,

            @Size(max = 100, message = "地点最多 100 个字符")
            String location,

            List<@NotNull(message = "配图链接不能为空") @URL(message = "配图链接格式不正确") String> images,

            @JsonProperty("isPinned") Boolean isPinned,
            @JsonProperty("isPublished") Boolean isPublished
    ) {
        public boolean pinnedOrDefault() {
            return Boolean.TRUE.equals(isPinned);
        }

        public boolean publishedOrDefault() {
            return isPublished == null || isPublished;
        }
    }

    public record EssayLikeDto(Integer id, int likes) {
    }

    public record CommentDto(
            Integer id,
            String targetType,
            @Positive(message = "无效的文章 ID") Integer articleId,
            @Positive(message = "无效的随笔 ID") Integer essayId,
            @Positive(message = "无效的父评论 ID") Integer parentId,
            Integer userId,
            String content,
            @JsonInclude(JsonInclude.Include.NON_NULL) String ipAddress,
            @JsonInclude(JsonInclude.Include.NON_NULL) String userAgent,
            @JsonProperty("isApproved") boolean isApproved,
            @JsonProperty("isPinned") boolean isPinned,
            Instant createdAt,
            Instant updatedAt,
            @JsonInclude(JsonInclude.Include.NON_NULL) UserDtos.CommentUserDto user,
            @JsonInclude(JsonInclude.Include.NON_NULL) List<CommentDto> replies
    ) {
    }

    public record CreateCommentRequest(
            @Pattern(regexp = "^(article|essay|guestbook)$", message = "无效的评论目标类型")
            String targetType,

            Integer articleId,
            Integer essayId,
            Integer parentId,

            @Size(min = 8, max = 64, message = "访客标识长度须在 8 到 64 之间")
            String guestUuid,

            @NotBlank(message = "评论内容不能为空")
            @Size(min = 1, max = 1000, message = "评论字数最多 1000 字")
            String content
    ) {
        public String targetTypeOrDefault() {
            return (targetType == null || targetType.isBlank()) ? "article" : targetType;
        }
    }

    public record ApproveCommentRequest(
            @JsonProperty("isApproved") Boolean isApproved
    ) {
        public boolean approvedOrDefault() {
            return isApproved == null || isApproved;
        }
    }

    public record UploadResultDto(String url, String filename, long size) {
    }

    public record DirectUploadSignRequest(
            @NotBlank(message = "文件名不能为空")
            @Size(max = 255, message = "文件名过长")
            String filename,

            @NotBlank(message = "图片类型不能为空")
            @Size(max = 100, message = "图片类型过长")
            String contentType,

            @jakarta.validation.constraints.NotNull(message = "图片不能为空")
            @jakarta.validation.constraints.Positive(message = "图片不能为空")
            @jakarta.validation.constraints.Max(value = 26_214_400L, message = "单张图片不能超过 25 MB")
            Long size
    ) {
    }

    public record SearchArticleItemDto(
            Integer id,
            String slug,
            String title,
            String summary,
            Instant createdAt,
            TaxonomyDtos.NameSlugDto category
    ) {
    }

    public record SearchNoteItemDto(
            Integer id,
            String slug,
            String title,
            String summary,
            Instant createdAt,
            TaxonomyDtos.NameSlugDto notebook
    ) {
    }

    public record SearchEssayItemDto(
            Integer id,
            String content,
            String mood,
            Instant createdAt
    ) {
    }

    public record SearchResponseDto(
            List<SearchArticleItemDto> articles,
            List<SearchNoteItemDto> notes,
            List<SearchEssayItemDto> essays
    ) {
    }

    public record StatsCountsDto(
            long articles,
            long essays,
            long notes,
            long notebooks,
            long categories,
            long tags,
            long comments,
            long totalUsers,
            long guestUsers,
            long registeredUsers,
            long totalViews
    ) {
    }

    public record RecentArticleItemDto(
            Integer id,
            String slug,
            String title,
            Instant createdAt,
            int views,
            TaxonomyDtos.NameSlugDto category
    ) {
    }

    public record RecentEssayItemDto(
            Integer id,
            String content,
            String mood,
            int likes,
            Instant createdAt
    ) {
    }

    public record RecentNotebookInfoDto(
            String name,
            String slug,
            String icon
    ) {
    }

    public record RecentNoteItemDto(
            Integer id,
            String slug,
            String title,
            Instant createdAt,
            int views,
            RecentNotebookInfoDto notebook
    ) {
    }

    public record StatsOverviewResponseDto(
            StatsCountsDto stats,
            List<RecentArticleItemDto> recentArticles,
            List<RecentEssayItemDto> recentEssays,
            List<RecentNoteItemDto> recentNotes
    ) {
    }
}
