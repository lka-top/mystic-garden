package top.mysgarden.garden.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank(message = "用户名至少 3 个字符")
        @Size(min = 3, max = 30, message = "用户名长度须在 3 到 30 个字符之间")
        @Pattern(regexp = "^[a-zA-Z0-9_-]+$", message = "用户名仅支持字母、数字、下划线及连字符")
        String username,

        @NotBlank(message = "密码长度至少 6 位")
        @Size(min = 6, max = 50, message = "密码长度须在 6 到 50 位之间")
        String password,

        @NotBlank(message = "请输入昵称")
        @Size(min = 1, max = 30, message = "昵称最多 30 个字符")
        String nickname,

        @Email(message = "邮箱格式不正确")
        @Size(max = 100, message = "邮箱最多 100 个字符")
        String email,

        @Size(min = 8, max = 64, message = "访客标识长度须在 8 到 64 之间")
        String guestUuid
) {
}
