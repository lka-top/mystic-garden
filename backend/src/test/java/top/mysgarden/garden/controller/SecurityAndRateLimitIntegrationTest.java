package top.mysgarden.garden.controller;

import java.util.Map;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

import top.mysgarden.garden.AbstractIntegrationTest;
import top.mysgarden.garden.model.User;

import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * 鉴权边界（401 未携带 vs 401 令牌失效 vs 403 权限不足 vs 公开接口过期令牌宽容降级）与滑动窗口限流（429）集成测试。
 */
class SecurityAndRateLimitIntegrationTest extends AbstractIntegrationTest {

    @Test
    void missingTokenReturns401WithMissingPromptOnAdminEndpoints() throws Exception {
        mockMvc.perform(get("/api/v1/auth/me"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.statusCode").value(401))
                .andExpect(jsonPath("$.statusMessage").value("未提供访问令牌，请先登录"))
                .andExpect(jsonPath("$.message").value("未提供访问令牌，请先登录"));

        mockMvc.perform(post("/api/v1/categories")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonMapper.writeValueAsString(Map.of("name", "后端架构", "slug", "backend"))))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.statusCode").value(401))
                .andExpect(jsonPath("$.statusMessage").value("未提供访问令牌，请先登录"));
    }

    @Test
    void invalidOrTamperedTokenReturns401InvalidOnProtectedEndpointButDegradesGracefullyOnPublicGet() throws Exception {
        String tamperedToken = adminJwt.substring(0, adminJwt.length() - 4) + "xxxx";

        // 受保护接口：明确提示“令牌无效或已过期，请重新登录”
        mockMvc.perform(get("/api/v1/auth/me")
                        .header(HttpHeaders.AUTHORIZATION, bearer(tamperedToken)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.statusCode").value(401))
                .andExpect(jsonPath("$.statusMessage").value("令牌无效或已过期，请重新登录"));

        // 先由管理员创建一篇未发布草稿
        mockMvc.perform(post("/api/v1/articles")
                        .header(HttpHeaders.AUTHORIZATION, bearerAdmin())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonMapper.writeValueAsString(Map.of(
                                "slug", "draft-hidden-post",
                                "title", "未发布草稿",
                                "summary", "仅管理员可见",
                                "content", "草稿正文内容",
                                "isPublished", false
                        ))))
                .andExpect(status().isOk());

        // 公开 GET 接口携带失效令牌且尝试 ?all=true：不报错 401，且必须按匿名身份过滤草稿！
        mockMvc.perform(get("/api/v1/articles")
                        .param("all", "true")
                        .header(HttpHeaders.AUTHORIZATION, bearer(tamperedToken)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.data.list", hasSize(0)));

        // 合法管理员携带 ?all=true 则能看到该草稿
        mockMvc.perform(get("/api/v1/articles")
                        .param("all", "true")
                        .header(HttpHeaders.AUTHORIZATION, bearerAdmin()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.list", hasSize(1)))
                .andExpect(jsonPath("$.data.list[0].slug").value("draft-hidden-post"));
    }

    @Test
    void regularUserTokenReturns403ForbiddenOnAdminEndpoints() throws Exception {
        User normalUser = new User();
        normalUser.setUsername("reader01");
        normalUser.setPasswordHash(passwordEncoder.encode("ReaderPass123!"));
        normalUser.setNickname("普通读者");
        normalUser.setRole("user");
        normalUser = userRepository.save(normalUser);

        String userJwt = jwtService.signToken(normalUser.getId(), normalUser.getUsername(), normalUser.getRole());

        mockMvc.perform(get("/api/v1/auth/me")
                        .header(HttpHeaders.AUTHORIZATION, bearer(userJwt)))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.statusCode").value(403))
                .andExpect(jsonPath("$.statusMessage").value("权限不足：需要管理员权限"));

        mockMvc.perform(post("/api/v1/tags")
                        .header(HttpHeaders.AUTHORIZATION, bearer(userJwt))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonMapper.writeValueAsString(Map.of("name", "Vue3", "slug", "vue3"))))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.statusCode").value(403))
                .andExpect(jsonPath("$.statusMessage").value("权限不足：需要管理员权限"));
    }

    @Test
    void slidingWindowRateLimiterBlocksSixthLoginAttemptWithinOneMinute() throws Exception {
        String body = jsonMapper.writeValueAsString(Map.of("username", ADMIN_USERNAME, "password", "wrong-pass"));
        String clientIp = "203.0.113.77";

        for (int i = 1; i <= 5; i++) {
            mockMvc.perform(post("/api/v1/auth/login")
                            .header("X-Real-IP", clientIp)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(body))
                    .andExpect(status().isUnauthorized())
                    .andExpect(jsonPath("$.statusMessage").value("用户名或密码错误"));
        }

        // 第 6 次同 IP 请求触发 429 限流，并附带 Retry-After 响应头
        mockMvc.perform(post("/api/v1/auth/login")
                        .header("X-Real-IP", clientIp)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isTooManyRequests())
                .andExpect(header().exists(HttpHeaders.RETRY_AFTER))
                .andExpect(jsonPath("$.statusCode").value(429))
                .andExpect(jsonPath("$.statusMessage", containsString("请求过于频繁")));

        // 不同 IP 不受影响
        mockMvc.perform(post("/api/v1/auth/login")
                        .header("X-Real-IP", "203.0.113.88")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonMapper.writeValueAsString(Map.of(
                                "username", ADMIN_USERNAME,
                                "password", ADMIN_PASSWORD))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.data.token").isNotEmpty());
    }
}
