package top.mysgarden.garden.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import top.mysgarden.garden.dto.ApiResult;
import top.mysgarden.garden.dto.InteractionDtos;
import top.mysgarden.garden.dto.PageResult;
import top.mysgarden.garden.service.CommentService;
import top.mysgarden.garden.util.AuthContext;
import top.mysgarden.garden.util.ClientInfo;

@Validated
@RestController
@RequestMapping("/api/v1/comments")
@RequiredArgsConstructor
@Tag(name = "Comments", description = "多态树形评论接口")
public class CommentController {

    private final CommentService commentService;

    @GetMapping
    @Operation(summary = "分页查询顶级评论及其楼中楼回复")
    public ApiResult<PageResult<InteractionDtos.CommentDto>> list(
            @RequestParam(defaultValue = "article")
            @Pattern(regexp = "^(article|essay|guestbook)$", message = "无效的评论目标类型") String targetType,
            @RequestParam(required = false) @Positive(message = "无效的文章 ID") Integer articleId,
            @RequestParam(required = false) @Positive(message = "无效的随笔 ID") Integer essayId,
            @RequestParam(defaultValue = "1") @Min(value = 1, message = "页码最小为 1") int page,
            @RequestParam(defaultValue = "50") @Min(value = 1, message = "每页数量最小为 1") @Max(value = 100, message = "每页数量最大为 100") int pageSize,
            @RequestParam(required = false) String all) {
        boolean includeUnapproved = AuthContext.isAdminAll(all);
        return ApiResult.ok(commentService.listComments(targetType, articleId, essayId, page, pageSize, includeUnapproved));
    }

    @PostMapping
    @Operation(summary = "发表评论（登录用户直接过审，游客自动建档待审）")
    public ApiResult<InteractionDtos.CommentDto> create(
            @Valid @RequestBody InteractionDtos.CreateCommentRequest request,
            HttpServletRequest servletRequest) {
        var created = commentService.createComment(
                request,
                AuthContext.currentUser().orElse(null),
                ClientInfo.ip(servletRequest),
                ClientInfo.userAgent(servletRequest));
        return ApiResult.ok(created, "评论提交成功");
    }

    @PatchMapping("/{id}/approve")
    @Operation(summary = "审核或下线评论")
    public ApiResult<InteractionDtos.CommentDto> approve(
            @PathVariable @Positive(message = "无效的资源 ID") Integer id,
            @RequestBody(required = false) InteractionDtos.ApproveCommentRequest request) {
        AuthContext.requireAdmin();
        boolean approved = request == null || request.approvedOrDefault();
        var updated = commentService.approveComment(id, approved);
        return ApiResult.ok(updated, approved ? "评论已通过审核" : "评论已下线");
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "删除评论")
    public ApiResult<Void> delete(@PathVariable @Positive(message = "无效的资源 ID") Integer id) {
        AuthContext.requireAdmin();
        commentService.deleteComment(id);
        return ApiResult.ok(null, "评论已删除");
    }
}
