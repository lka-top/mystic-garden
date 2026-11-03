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
import top.mysgarden.garden.dto.NoteDtos;
import top.mysgarden.garden.service.NotebookService;
import top.mysgarden.garden.util.AuthContext;

@RestController
@RequestMapping("/api/v1/notebooks")
@RequiredArgsConstructor
@Tag(name = "Notebooks", description = "知识库笔记本分类树接口")
public class NotebookController {

    private final NotebookService notebookService;

    @GetMapping
    @Operation(summary = "获取笔记本分类树（递归汇总子目录公开笔记数）")
    public ApiResult<List<NoteDtos.NotebookDto>> list() {
        return ApiResult.ok(notebookService.listNotebooks(AuthContext.isAdmin()));
    }

    @PostMapping
    @Operation(summary = "创建笔记本目录")
    public ApiResult<NoteDtos.NotebookDto> create(
            @Valid @RequestBody NoteDtos.CreateNotebookRequest request) {
        AuthContext.requireAdmin();
        return ApiResult.ok(notebookService.createNotebook(request), "笔记本创建成功");
    }
}
