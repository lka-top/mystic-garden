package top.mysgarden.garden.controller;

import java.util.Map;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import top.mysgarden.garden.dto.ApiResult;
import top.mysgarden.garden.service.SettingService;
import top.mysgarden.garden.util.AuthContext;

@RestController
@RequestMapping("/api/v1/settings")
@RequiredArgsConstructor
@Tag(name = "Settings", description = "全站动态键值配置接口")
public class SettingController {

    private final SettingService settingService;

    @GetMapping
    @Operation(summary = "读取全站动态配置表")
    public ApiResult<Map<String, String>> list() {
        return ApiResult.ok(settingService.getAllSettings());
    }

    @PatchMapping
    @Operation(summary = "批量更新配置项")
    public ApiResult<Map<String, Object>> patch(@RequestBody(required = false) Map<String, Object> body) {
        AuthContext.requireAdmin();
        return ApiResult.ok(settingService.updateSettings(body), "设置保存成功");
    }
}
