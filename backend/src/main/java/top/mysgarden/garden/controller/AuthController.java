package top.mysgarden.garden.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import top.mysgarden.garden.dto.ApiResult;
import top.mysgarden.garden.dto.LoginRequest;
import top.mysgarden.garden.dto.RegisterRequest;
import top.mysgarden.garden.dto.UserDtos;
import top.mysgarden.garden.service.AuthService;
import top.mysgarden.garden.util.AuthContext;
import top.mysgarden.garden.util.AuthenticatedUser;
import top.mysgarden.garden.util.ClientInfo;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Auth", description = "认证与当前用户接口")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    @Operation(summary = "用户登录并签发 JWT")
    public ApiResult<UserDtos.AuthTokenResponse<UserDtos.LoginUserDto>> login(
            @Valid @RequestBody LoginRequest request) {
        return ApiResult.ok(authService.login(request), "登录成功");
    }

    @PostMapping("/register")
    @Operation(summary = "注册普通用户（支持游客指纹无缝升级）")
    public ApiResult<UserDtos.AuthTokenResponse<UserDtos.RegisteredUserDto>> register(
            @Valid @RequestBody RegisterRequest request,
            HttpServletRequest servletRequest) {
        var result = authService.register(
                request,
                ClientInfo.ip(servletRequest),
                ClientInfo.userAgent(servletRequest));
        return ApiResult.ok(result, "注册成功，欢迎加入神秘花园！");
    }

    @GetMapping("/me")
    @Operation(summary = "获取当前已登录管理员档案")
    public ApiResult<UserDtos.UserProfileDto> me() {
        AuthenticatedUser admin = AuthContext.requireAdmin();
        return ApiResult.ok(authService.getCurrentProfile(admin.userId()));
    }
}
