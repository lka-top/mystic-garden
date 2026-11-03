package top.mysgarden.garden.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import top.mysgarden.garden.dto.ApiResult;
import top.mysgarden.garden.dto.InteractionDtos;
import top.mysgarden.garden.service.StatsService;

@RestController
@RequestMapping("/api/v1/stats")
@RequiredArgsConstructor
@Tag(name = "Stats", description = "全站统计概览接口")
public class StatsController {

    private final StatsService statsService;

    @GetMapping("/overview")
    @Operation(summary = "获取全站统计指标与最近更新动态")
    public ApiResult<InteractionDtos.StatsOverviewResponseDto> overview() {
        return ApiResult.ok(statsService.getOverview());
    }
}
