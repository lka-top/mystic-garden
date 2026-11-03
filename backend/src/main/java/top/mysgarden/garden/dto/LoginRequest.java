package top.mysgarden.garden.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record LoginRequest(
        @NotBlank(message = "请输入用户名")
        @Size(max = 50, message = "用户名最多 50 个字符")
        String username,

        @NotBlank(message = "请输入密码")
        @Size(max = 50, message = "密码最多 50 位")
        String password
) {
}
