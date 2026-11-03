package top.mysgarden.garden.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import top.mysgarden.garden.dto.ApiResult;
import top.mysgarden.garden.dto.NoteDtos;
import top.mysgarden.garden.dto.PageResult;
import top.mysgarden.garden.service.NoteService;
import top.mysgarden.garden.util.AuthContext;
import top.mysgarden.garden.util.AuthenticatedUser;

@Validated
@RestController
@RequestMapping("/api/v1/notes")
@RequiredArgsConstructor
@Tag(name = "Notes", description = "知识库笔记接口")
public class NoteController {

    private final NoteService noteService;

    @GetMapping
    @Operation(summary = "分页查询笔记列表（支持目录子树递归筛选）")
    public ApiResult<PageResult<NoteDtos.NoteListItemDto>> list(
            @RequestParam(defaultValue = "1") @Min(value = 1, message = "页码最小为 1") int page,
            @RequestParam(defaultValue = "20") @Min(value = 1, message = "每页数量最小为 1") @Max(value = 50, message = "每页数量最大为 50") int pageSize,
            @RequestParam(required = false) String notebook,
            @RequestParam(required = false) String tag,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String all) {
        boolean includeUnpublished = AuthContext.isAdminAll(all);
        return ApiResult.ok(noteService.listNotes(page, pageSize, notebook, tag, keyword,
                includeUnpublished, AuthContext.isAdmin()));
    }

    @GetMapping("/{slug}")
    @Operation(summary = "根据 Slug 获取笔记详情")
    public ApiResult<NoteDtos.NoteDetailDto> detail(@PathVariable String slug) {
        return ApiResult.ok(noteService.getNoteBySlug(slug, AuthContext.isAdmin()));
    }

    @PostMapping
    @Operation(summary = "创建笔记")
    public ApiResult<NoteDtos.NoteDetailDto> create(
            @Valid @RequestBody NoteDtos.CreateNoteRequest request) {
        AuthenticatedUser admin = AuthContext.requireAdmin();
        return ApiResult.ok(noteService.createNote(request, admin.userId()), "笔记创建成功");
    }

    @PutMapping("/{id}")
    @Operation(summary = "更新笔记")
    public ApiResult<NoteDtos.NoteDetailDto> update(
            @PathVariable @Positive(message = "无效的资源 ID") Integer id,
            @Valid @RequestBody NoteDtos.UpdateNoteRequest request) {
        AuthContext.requireAdmin();
        return ApiResult.ok(noteService.updateNote(id, request), "笔记更新成功");
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "删除笔记")
    public ApiResult<Void> delete(@PathVariable @Positive(message = "无效的资源 ID") Integer id) {
        AuthContext.requireAdmin();
        noteService.deleteNote(id);
        return ApiResult.ok(null, "笔记已删除");
    }
}
