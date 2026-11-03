package top.mysgarden.garden.integration;

import java.util.Map;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;
import tools.jackson.databind.JsonNode;

import top.mysgarden.garden.AbstractIntegrationTest;
import top.mysgarden.garden.model.User;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.startsWith;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * 游客留言自动建档 -> 审核上线 -> 楼中楼回复 -> 游客原地转正注册 -> 登录直接过审评论 全链路集成测试。
 */
class AuthAndCommentFlowIntegrationTest extends AbstractIntegrationTest {

    @Test
    void commentTargetsAndRepliesMustRemainStructurallyConsistent() throws Exception {
        mockMvc.perform(post("/api/v1/comments")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonMapper.writeValueAsString(Map.of(
                                "targetType", "article",
                                "content", "缺少文章 ID"
                        ))))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.statusMessage").value("文章评论必须且只能指定 articleId"));

        mockMvc.perform(post("/api/v1/comments")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonMapper.writeValueAsString(Map.of(
                                "targetType", "guestbook",
                                "articleId", 1,
                                "content", "留言板不应携带文章 ID"
                        ))))
                .andExpect(status().isBadRequest());

        mockMvc.perform(post("/api/v1/comments")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonMapper.writeValueAsString(Map.of(
                                "targetType", "article",
                                "articleId", 999_999,
                                "content", "不存在的文章"
                        ))))
                .andExpect(status().isNotFound());

        MvcResult guestbookParent = mockMvc.perform(post("/api/v1/comments")
                        .header(HttpHeaders.AUTHORIZATION, bearerAdmin())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonMapper.writeValueAsString(Map.of(
                                "targetType", "guestbook",
                                "content", "留言板父评论"
                        ))))
                .andExpect(status().isOk())
                .andReturn();
        int parentId = jsonMapper.readTree(guestbookParent.getResponse().getContentAsString())
                .at("/data/id").asInt();

        MvcResult article = mockMvc.perform(post("/api/v1/articles")
                        .header(HttpHeaders.AUTHORIZATION, bearerAdmin())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonMapper.writeValueAsString(Map.of(
                                "slug", "comment-target-consistency",
                                "title", "评论目标一致性",
                                "summary", "用于验证回复不能跨目标挂载",
                                "content", "正文"
                        ))))
                .andExpect(status().isOk())
                .andReturn();
        int articleId = jsonMapper.readTree(article.getResponse().getContentAsString()).at("/data/id").asInt();

        mockMvc.perform(post("/api/v1/comments")
                        .header(HttpHeaders.AUTHORIZATION, bearerAdmin())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonMapper.writeValueAsString(Map.of(
                                "targetType", "article",
                                "articleId", articleId,
                                "parentId", parentId,
                                "content", "不允许跨目标回复"
                        ))))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.statusMessage").value("回复必须与父评论属于同一内容"));

        mockMvc.perform(get("/api/v1/comments").param("targetType", "article"))
                .andExpect(status().isBadRequest());

        // 管理端审核页保留按类型聚合查询的既有语义。
        mockMvc.perform(get("/api/v1/comments")
                        .param("targetType", "article")
                        .param("all", "true")
                        .header(HttpHeaders.AUTHORIZATION, bearerAdmin()))
                .andExpect(status().isOk());
    }

    @Test
    void validTokenForDeletedUserDoesNotBypassGuestModeration() throws Exception {
        User deletedUser = new User();
        deletedUser.setUsername("deleted-reader");
        deletedUser.setPasswordHash(passwordEncoder.encode("DeletedReader2026!"));
        deletedUser.setNickname("已删除读者");
        deletedUser.setRole("user");
        deletedUser = userRepository.save(deletedUser);
        String staleJwt = jwtService.signToken(
                deletedUser.getId(), deletedUser.getUsername(), deletedUser.getRole());
        userRepository.deleteById(deletedUser.getId());

        mockMvc.perform(post("/api/v1/comments")
                        .header(HttpHeaders.AUTHORIZATION, bearer(staleJwt))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonMapper.writeValueAsString(Map.of(
                                "targetType", "guestbook",
                                "guestUuid", "deleted-user-fallback-2026",
                                "content", "失效主体应按游客待审核"
                        ))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.isApproved").value(false))
                .andExpect(jsonPath("$.data.user.role").value("guest"));
    }

    @Test
    void guestCommentModerationReplyAndInPlaceRegistrationUpgradeLifecycle() throws Exception {
        String guestUuid = "guest-uuid-flow-2026-abcd";

        // 1. 游客首次发表留言板评论：自动建档（role=guest）且处于待审核（isApproved=false）
        MvcResult commentRes = mockMvc.perform(post("/api/v1/comments")
                        .header("X-Real-IP", "198.51.100.12")
                        .header(HttpHeaders.USER_AGENT, "GardenTestBrowser/1.0")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonMapper.writeValueAsString(Map.of(
                                "targetType", "guestbook",
                                "guestUuid", guestUuid,
                                "content", "第一次来到神秘花园，留个脚印！"
                        ))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.data.isApproved").value(false))
                .andExpect(jsonPath("$.data.user.role").value("guest"))
                .andExpect(jsonPath("$.data.user.nickname", startsWith("漫步花友_")))
                .andExpect(jsonPath("$.data.ipAddress").doesNotExist())
                .andExpect(jsonPath("$.data.userAgent").doesNotExist())
                .andReturn();

        JsonNode commentJson = jsonMapper.readTree(commentRes.getResponse().getContentAsString());
        int commentId = commentJson.at("/data/id").asInt();
        int guestUserId = commentJson.at("/data/userId").asInt();

        // 2. 公开查询留言板：未审核评论不可见；管理员 ?all=true 可见
        mockMvc.perform(get("/api/v1/comments").param("targetType", "guestbook"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.list", hasSize(0)));

        mockMvc.perform(get("/api/v1/comments")
                        .param("targetType", "guestbook")
                        .param("all", "true")
                        .header(HttpHeaders.AUTHORIZATION, bearerAdmin()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.list", hasSize(1)))
                .andExpect(jsonPath("$.data.list[0].id").value(commentId))
                .andExpect(jsonPath("$.data.list[0].ipAddress").value("198.51.100.12"))
                .andExpect(jsonPath("$.data.list[0].userAgent").value("GardenTestBrowser/1.0"));

        // 3. 管理员审核通过该留言，并发表一条楼中楼回复（登录态自动过审）
        mockMvc.perform(patch("/api/v1/comments/" + commentId + "/approve")
                        .header(HttpHeaders.AUTHORIZATION, bearerAdmin())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonMapper.writeValueAsString(Map.of("isApproved", true))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.isApproved").value(true));

        mockMvc.perform(post("/api/v1/comments")
                        .header(HttpHeaders.AUTHORIZATION, bearerAdmin())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonMapper.writeValueAsString(Map.of(
                                "targetType", "guestbook",
                                "parentId", commentId,
                                "content", "欢迎常来逛逛！"
                        ))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.isApproved").value(true))
                .andExpect(jsonPath("$.data.parentId").value(commentId));

        // 公开列表可见顶级留言及嵌套 replies
        mockMvc.perform(get("/api/v1/comments").param("targetType", "guestbook"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.list", hasSize(1)))
                .andExpect(jsonPath("$.data.list[0].replies", hasSize(1)))
                .andExpect(jsonPath("$.data.list[0].ipAddress").doesNotExist())
                .andExpect(jsonPath("$.data.list[0].userAgent").doesNotExist())
                .andExpect(jsonPath("$.data.list[0].replies[0].ipAddress").doesNotExist())
                .andExpect(jsonPath("$.data.list[0].replies[0].userAgent").doesNotExist())
                .andExpect(jsonPath("$.data.list[0].replies[0].content").value("欢迎常来逛逛！"));

        // 4. 游客携带相同 guestUuid 注册账号：原地升级同一条 users 记录，保留历史评论归属！
        MvcResult regRes = mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonMapper.writeValueAsString(Map.of(
                                "username", "flower_friend",
                                "password", "FriendPass2026!",
                                "nickname", "常驻花友",
                                "email", "friend@mysgarden.top",
                                "guestUuid", guestUuid
                        ))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.data.user.id").value(guestUserId))
                .andExpect(jsonPath("$.data.user.role").value("user"))
                .andExpect(jsonPath("$.data.user.nickname").value("常驻花友"))
                .andExpect(jsonPath("$.data.token").isNotEmpty())
                .andReturn();

        String registeredJwt = jsonMapper.readTree(regRes.getResponse().getContentAsString())
                .at("/data/token").asString();
        assertThat(registeredJwt).isNotBlank();

        // 重复用户名注册返回 409
        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonMapper.writeValueAsString(Map.of(
                                "username", "flower_friend",
                                "password", "FriendPass2026!",
                                "nickname", "另一个人"
                        ))))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.statusCode").value(409))
                .andExpect(jsonPath("$.statusMessage").value("该用户名已被占用，请换一个"));

        // 5. 使用转正后的新账号登录成功，且登录态下发表评论直接过审（isApproved=true）
        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonMapper.writeValueAsString(Map.of(
                                "username", "flower_friend",
                                "password", "FriendPass2026!"
                        ))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.user.id").value(guestUserId))
                .andExpect(jsonPath("$.data.user.role").value("user"));

        mockMvc.perform(post("/api/v1/comments")
                        .header(HttpHeaders.AUTHORIZATION, bearer(registeredJwt))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonMapper.writeValueAsString(Map.of(
                                "targetType", "guestbook",
                                "content", "转正后的第二条留言，无需等待审核！"
                        ))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.isApproved").value(true))
                .andExpect(jsonPath("$.data.user.nickname").value("常驻花友"));

        // 历史第一条评论的作者昵称也自动同步展示为转正后的“常驻花友”
        mockMvc.perform(get("/api/v1/comments").param("targetType", "guestbook"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.list", hasSize(2)));

        // 6. 管理员删除父评论（级联清理子回复）
        mockMvc.perform(delete("/api/v1/comments/" + commentId)
                        .header(HttpHeaders.AUTHORIZATION, bearerAdmin()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("评论已删除"));

        mockMvc.perform(get("/api/v1/comments").param("targetType", "guestbook"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.list", hasSize(1)));
    }
}
