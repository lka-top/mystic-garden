package top.mysgarden.garden.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import top.mysgarden.garden.dto.ApiResult;
import top.mysgarden.garden.dto.InteractionDtos;
import top.mysgarden.garden.service.SearchService;

@RestController
@RequestMapping("/api/v1/search")
@RequiredArgsConstructor
@Tag(name = "Search", description = "全站公开内容检索接口")
public class SearchController {

    private final SearchService searchService;

    @GetMapping
    @Operation(summary = "跨文章、笔记、随笔检索")
    public ApiResult<InteractionDtos.SearchResponseDto> search(@RequestParam(required = false) String q) {
        return ApiResult.ok(searchService.search(q));
    }
}
