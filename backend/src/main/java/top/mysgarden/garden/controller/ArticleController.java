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
import top.mysgarden.garden.dto.ArticleDtos;
import top.mysgarden.garden.dto.PageResult;
import top.mysgarden.garden.service.ArticleService;
import top.mysgarden.garden.util.AuthContext;
import top.mysgarden.garden.util.AuthenticatedUser;

@Validated
@RestController
@RequestMapping("/api/v1/articles")
@RequiredArgsConstructor
@Tag(name = "Articles", description = "长篇博文接口")
public class ArticleController {

    private final ArticleService articleService;

    @GetMapping
    @Operation(summary = "分页查询文章列表")
    public ApiResult<PageResult<ArticleDtos.ArticleListItemDto>> list(
            @RequestParam(defaultValue = "1") @Min(value = 1, message = "页码最小为 1") int page,
            @RequestParam(defaultValue = "10") @Min(value = 1, message = "每页数量最小为 1") @Max(value = 200, message = "每页数量最大为 200") int pageSize,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String tag,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String all) {
        boolean includeUnpublished = AuthContext.isAdminAll(all);
        return ApiResult.ok(articleService.listArticles(page, pageSize, category, tag, keyword, includeUnpublished));
    }

    @GetMapping("/{slug}")
    @Operation(summary = "根据 Slug 获取文章详情")
    public ApiResult<ArticleDtos.ArticleDetailDto> detail(@PathVariable String slug) {
        return ApiResult.ok(articleService.getArticleBySlug(slug, AuthContext.isAdmin()));
    }

    @PostMapping
    @Operation(summary = "创建文章")
    public ApiResult<ArticleDtos.ArticleDetailDto> create(
            @Valid @RequestBody ArticleDtos.CreateArticleRequest request) {
        AuthenticatedUser admin = AuthContext.requireAdmin();
        return ApiResult.ok(articleService.createArticle(request, admin.userId()), "文章创建成功");
    }

    @PutMapping("/{id}")
    @Operation(summary = "更新文章")
    public ApiResult<ArticleDtos.ArticleDetailDto> update(
            @PathVariable @Positive(message = "无效的资源 ID") Integer id,
            @Valid @RequestBody ArticleDtos.UpdateArticleRequest request) {
        AuthContext.requireAdmin();
        return ApiResult.ok(articleService.updateArticle(id, request), "文章更新成功");
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "删除文章")
    public ApiResult<Void> delete(@PathVariable @Positive(message = "无效的资源 ID") Integer id) {
        AuthContext.requireAdmin();
        articleService.deleteArticle(id);
        return ApiResult.ok(null, "文章已删除");
    }
}
