package top.mysgarden.garden.controller;

import java.util.List;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import top.mysgarden.garden.dto.ApiResult;
import top.mysgarden.garden.dto.TaxonomyDtos;
import top.mysgarden.garden.service.TagService;
import top.mysgarden.garden.util.AuthContext;

@RestController
@RequestMapping("/api/v1/tags")
@RequiredArgsConstructor
@Tag(name = "Tags", description = "全局标签接口")
public class TagController {

    private final TagService tagService;

    @GetMapping
    @Operation(summary = "获取全部标签（含文章数与笔记数）")
    public ApiResult<List<TaxonomyDtos.TagDto>> list() {
        return ApiResult.ok(tagService.listTags());
    }

    @PostMapping
    @Operation(summary = "创建标签（若同名已存在则幂等返回）")
    public ApiResult<TaxonomyDtos.TagBriefDto> create(
            @Valid @RequestBody TaxonomyDtos.CreateTagRequest request) {
        AuthContext.requireAdmin();
        TagService.CreateTagOutcome outcome = tagService.createTag(request);
        return ApiResult.ok(outcome.tag(), outcome.alreadyExisted() ? "标签已存在" : "标签创建成功");
    }
}
