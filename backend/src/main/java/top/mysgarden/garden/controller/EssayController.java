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
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import top.mysgarden.garden.dto.ApiResult;
import top.mysgarden.garden.dto.InteractionDtos;
import top.mysgarden.garden.dto.PageResult;
import top.mysgarden.garden.service.EssayService;
import top.mysgarden.garden.util.AuthContext;
import top.mysgarden.garden.util.AuthenticatedUser;

@Validated
@RestController
@RequestMapping("/api/v1/essays")
@RequiredArgsConstructor
@Tag(name = "Essays", description = "随笔微言接口")
public class EssayController {

    private final EssayService essayService;

    @GetMapping
    @Operation(summary = "分页查询随笔时间轴")
    public ApiResult<PageResult<InteractionDtos.EssayDto>> list(
            @RequestParam(defaultValue = "1") @Min(value = 1, message = "页码最小为 1") int page,
            @RequestParam(defaultValue = "15") @Min(value = 1, message = "每页数量最小为 1") @Max(value = 50, message = "每页数量最大为 50") int pageSize,
            @RequestParam(required = false) String mood,
            @RequestParam(required = false) String all) {
        boolean includeUnpublished = AuthContext.isAdminAll(all);
        return ApiResult.ok(essayService.listEssays(page, pageSize, mood, includeUnpublished));
    }

    @PostMapping
    @Operation(summary = "发布随笔")
    public ApiResult<InteractionDtos.EssayDto> create(
            @Valid @RequestBody InteractionDtos.CreateEssayRequest request) {
        AuthenticatedUser admin = AuthContext.requireAdmin();
        return ApiResult.ok(essayService.createEssay(request, admin.userId()), "随笔发布成功");
    }

    @PostMapping("/{id}/like")
    @Operation(summary = "随笔点赞")
    public ApiResult<InteractionDtos.EssayLikeDto> like(
            @PathVariable @Positive(message = "无效的资源 ID") Integer id) {
        return ApiResult.ok(essayService.likeEssay(id), "点赞成功");
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "删除随笔")
    public ApiResult<Void> delete(@PathVariable @Positive(message = "无效的资源 ID") Integer id) {
        AuthContext.requireAdmin();
        essayService.deleteEssay(id);
        return ApiResult.ok(null, "随笔已删除");
    }
}
