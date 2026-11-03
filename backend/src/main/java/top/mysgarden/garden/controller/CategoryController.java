package top.mysgarden.garden.controller;

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
import top.mysgarden.garden.service.CategoryService;
import top.mysgarden.garden.util.AuthContext;

@RestController
@RequestMapping("/api/v1/categories")
@RequiredArgsConstructor
@Tag(name = "Categories", description = "文章分类接口")
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    @Operation(summary = "获取全部分类与标签（附已发布文章计数）")
    public ApiResult<TaxonomyDtos.CategoriesOverviewDto> list() {
        return ApiResult.ok(categoryService.getCategoriesAndTags());
    }

    @PostMapping
    @Operation(summary = "创建文章分类")
    public ApiResult<TaxonomyDtos.CategoryDto> create(
            @Valid @RequestBody TaxonomyDtos.CreateCategoryRequest request) {
        AuthContext.requireAdmin();
        return ApiResult.ok(categoryService.createCategory(request), "分类创建成功");
    }
}
