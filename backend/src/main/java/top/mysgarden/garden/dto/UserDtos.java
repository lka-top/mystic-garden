package top.mysgarden.garden.dto;

import java.time.Instant;

import com.fasterxml.jackson.annotation.JsonInclude;

/**
 * 用户与作者相关对外 DTO 集合。
 */
public final class UserDtos {

    private UserDtos() {
    }

    /** POST /auth/login 返回的 user 结构。 */
    public record LoginUserDto(
            Integer id,
            String username,
            String nickname,
            String avatar,
            String role
    ) {
    }

    /** POST /auth/register 返回的 user 结构。 */
    public record RegisteredUserDto(
            Integer id,
            String username,
            String nickname,
            String avatar,
            String email,
            String role,
            Instant createdAt
    ) {
    }

    /** GET /auth/me 返回的完整管理员档案。 */
    public record UserProfileDto(
            Integer id,
            String username,
            String nickname,
            String avatar,
            String email,
            String bio,
            String role,
            Instant createdAt
    ) {
    }

    public record AuthTokenResponse<U>(String token, U user) {
    }

    /** 文章详情作者信息（含 bio）。 */
    public record AuthorDto(
            Integer id,
            String nickname,
            String avatar,
            @JsonInclude(JsonInclude.Include.ALWAYS) String bio
    ) {
    }

    /** 笔记与随笔作者精简信息。 */
    public record SimpleAuthorDto(
            Integer id,
            String nickname,
            String avatar
    ) {
    }

    /** 评论关联用户信息。 */
    public record CommentUserDto(
            Integer id,
            String username,
            String nickname,
            String avatar,
            String role
    ) {
    }
}
