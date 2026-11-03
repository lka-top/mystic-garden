package top.mysgarden.garden.dto;

import java.time.Instant;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonSetter;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 笔记本、笔记及本地知识库同步相关请求与响应 DTO。
 */
public final class NoteDtos {

    private NoteDtos() {
    }

    public record NotebookDto(
            Integer id,
            String name,
            String slug,
            String path,
            Integer parentId,
            String description,
            String icon,
            @JsonProperty("isPrivate") boolean isPrivate,
            int sortOrder,
            Instant createdAt,
            Instant updatedAt,
            @JsonInclude(JsonInclude.Include.NON_NULL) Long noteCount
    ) {
    }

    public record NotebookBriefDto(
            Integer id,
            String name,
            String slug,
            String path,
            Integer parentId,
            String icon
    ) {
    }

    public record CreateNotebookRequest(
            @NotBlank(message = "名称不能为空")
            @Size(max = 50, message = "名称最多 50 个字符")
            String name,

            @NotBlank(message = "Slug不能为空")
            @Size(max = 50, message = "Slug 最多 50 个字符")
            String slug,

            @Size(min = 1, max = 500, message = "路径长度须在 1 到 500 之间")
            String path,

            @Positive(message = "父级目录 ID 必须为正整数")
            Integer parentId,

            @Size(max = 200, message = "描述最多 200 个字符")
            String description,

            @Size(max = 50, message = "图标标识最多 50 个字符")
            String icon,

            @JsonProperty("isPrivate") Boolean isPrivate,
            Integer sortOrder
    ) {
        public boolean privateOrDefault() {
            return Boolean.TRUE.equals(isPrivate);
        }

        public int sortOrderOrDefault() {
            return sortOrder != null ? sortOrder : 0;
        }
    }

    /** GET /notes 分页列表项（已剔除 password）。 */
    public record NoteListItemDto(
            Integer id,
            String title,
            String slug,
            String sourcePath,
            String content,
            String summary,
            @JsonProperty("isPinned") boolean isPinned,
            @JsonProperty("isPublished") boolean isPublished,
            @JsonProperty("isEncrypted") boolean isEncrypted,
            int views,
            Integer notebookId,
            Integer authorId,
            Instant createdAt,
            Instant updatedAt,
            NotebookBriefDto notebook,
            List<TaxonomyDtos.TagBriefDto> tags,
            UserDtos.SimpleAuthorDto author
    ) {
    }

    /** GET /notes/{slug}、POST /notes、PUT /notes/{id} 详情响应（已剔除 password）。 */
    public record NoteDetailDto(
            Integer id,
            String title,
            String slug,
            String sourcePath,
            String content,
            String summary,
            @JsonProperty("isPinned") boolean isPinned,
            @JsonProperty("isPublished") boolean isPublished,
            @JsonProperty("isEncrypted") boolean isEncrypted,
            int views,
            Integer notebookId,
            Integer authorId,
            Instant createdAt,
            Instant updatedAt,
            NotebookDto notebook,
            UserDtos.SimpleAuthorDto author,
            List<TaxonomyDtos.TagBriefDto> tags
    ) {
    }

    public record CreateNoteRequest(
            @NotBlank(message = "标题不能为空")
            @Size(max = 200, message = "标题最多 200 个字符")
            String title,

            @NotBlank(message = "Slug 不能为空")
            @Size(max = 100, message = "Slug 最多 100 个字符")
            String slug,

            @Size(max = 500, message = "摘要最多 500 个字符")
            String summary,

            @NotBlank(message = "内容不能为空")
            String content,

            @JsonProperty("isPinned") Boolean isPinned,
            @JsonProperty("isPublished") Boolean isPublished,
            @JsonProperty("isEncrypted") Boolean isEncrypted,
            String password,
            @Positive(message = "笔记本 ID 必须为正整数") Integer notebookId,
            List<@NotNull(message = "标签 ID 不能为空") @Positive(message = "标签 ID 必须为正整数") Integer> tagIds
    ) {
        public boolean pinnedOrDefault() {
            return Boolean.TRUE.equals(isPinned);
        }

        public boolean publishedOrDefault() {
            return isPublished == null || isPublished;
        }

        public boolean encryptedOrDefault() {
            return Boolean.TRUE.equals(isEncrypted);
        }

        public List<Integer> tagIdsOrEmpty() {
            return tagIds != null ? tagIds : List.of();
        }
    }

    @Getter
    @Setter
    @NoArgsConstructor
    public static class UpdateNoteRequest {

        @Size(min = 1, max = 200, message = "标题不能为空")
        private String title;

        @Size(min = 1, max = 100, message = "Slug 不能为空")
        private String slug;

        @Size(max = 500, message = "摘要最多 500 个字符")
        private String summary;
        @JsonIgnore
        private boolean summarySet;

        @Size(min = 1, message = "内容不能为空")
        private String content;

        @JsonProperty("isPinned")
        private Boolean isPinned;

        @JsonProperty("isPublished")
        private Boolean isPublished;

        @JsonProperty("isEncrypted")
        private Boolean isEncrypted;

        private String password;
        @JsonIgnore
        private boolean passwordSet;

        @Positive(message = "笔记本 ID 必须为正整数")
        private Integer notebookId;
        @JsonIgnore
        private boolean notebookIdSet;

        private List<@NotNull(message = "标签 ID 不能为空") @Positive(message = "标签 ID 必须为正整数") Integer> tagIds;
        @JsonIgnore
        private boolean tagIdsSet;

        @JsonSetter("summary")
        public void assignSummary(String summary) {
            this.summary = summary;
            this.summarySet = true;
        }

        @JsonSetter("password")
        public void assignPassword(String password) {
            this.password = password;
            this.passwordSet = true;
        }

        @JsonSetter("notebookId")
        public void assignNotebookId(Integer notebookId) {
            this.notebookId = notebookId;
            this.notebookIdSet = true;
        }

        @JsonSetter("tagIds")
        public void assignTagIds(List<Integer> tagIds) {
            this.tagIds = tagIds;
            this.tagIdsSet = true;
        }
    }

    public record SyncDirectoryItem(
            @NotBlank(message = "目录名称不能为空")
            @Size(max = 50, message = "目录名称最多 50 个字符")
            String name,

            @NotBlank(message = "目录 Slug 不能为空")
            @Size(max = 50, message = "目录 Slug 最多 50 个字符")
            String slug,

            @NotBlank(message = "目录路径不能为空")
            @Size(max = 500, message = "目录路径最多 500 个字符")
            String path,

            @Size(min = 1, max = 500, message = "父级目录路径长度须在 1 到 500 之间")
            String parentPath,

            @Size(max = 200, message = "目录描述最多 200 个字符")
            String description,

            @NotBlank(message = "目录图标不能为空")
            @Size(max = 50, message = "目录图标最多 50 个字符")
            String icon
    ) {
    }

    public record SyncNoteItem(
            @NotBlank(message = "笔记标题不能为空")
            @Size(max = 200, message = "笔记标题最多 200 个字符")
            String title,

            @NotBlank(message = "笔记 Slug 不能为空")
            @Size(max = 100, message = "笔记 Slug 最多 100 个字符")
            String slug,

            @NotBlank(message = "笔记摘要不能为空")
            @Size(max = 500, message = "笔记摘要最多 500 个字符")
            String summary,

            @NotBlank(message = "笔记正文不能为空")
            @Size(max = 2_000_000, message = "笔记正文超过上限")
            String content,

            @NotBlank(message = "笔记源路径不能为空")
            @Size(max = 500, message = "笔记源路径最多 500 个字符")
            String sourcePath,

            @Size(min = 1, max = 500, message = "目录路径长度须在 1 到 500 之间")
            String directoryPath,

            @Size(max = 30, message = "单篇笔记最多 30 个标签")
            List<@NotBlank @Size(max = 50) String> tags
    ) {
        public List<String> distinctTrimmedTags() {
            if (tags == null) {
                return List.of();
            }
            return tags.stream().map(String::trim).filter(s -> !s.isEmpty()).distinct().toList();
        }
    }

    public record NoteSyncRequest(
            @Valid
            @Size(max = 500, message = "单次最多同步 500 个目录")
            List<SyncDirectoryItem> directories,

            @Valid
            @jakarta.validation.constraints.NotEmpty(message = "至少需要同步一篇笔记")
            @Size(min = 1, max = 50, message = "单次最多同步 50 篇笔记")
            List<SyncNoteItem> notes
    ) {
        public List<SyncDirectoryItem> directoriesOrEmpty() {
            return directories != null ? directories : List.of();
        }
    }

    public record NoteSyncResultDto(int created, int updated) {
    }
}
