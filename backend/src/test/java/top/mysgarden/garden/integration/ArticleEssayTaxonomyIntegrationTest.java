package top.mysgarden.garden.integration;

import java.time.Duration;
import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;
import tools.jackson.databind.JsonNode;

import top.mysgarden.garden.AbstractIntegrationTest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.nullValue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * 分类、标签、文章（含 UTC 时间戳与可置空局部更新）、随笔（JSON 数组与原子点赞）、设置、搜索、统计与 SEO XML 集成测试。
 */
class ArticleEssayTaxonomyIntegrationTest extends AbstractIntegrationTest {

    @Test
    void taxonomyArticlePartialUpdateUtcTimestampAndPaginationValidation() throws Exception {
        // 1. 创建分类（重复 slug 返回 409）
        MvcResult catRes = mockMvc.perform(post("/api/v1/categories")
                        .header(HttpHeaders.AUTHORIZATION, bearerAdmin())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonMapper.writeValueAsString(Map.of(
                                "name", "Java 架构",
                                "slug", "java-arch",
                                "description", "Spring Boot 与现代 JVM 实践"
                        ))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andReturn();
        int categoryId = jsonMapper.readTree(catRes.getResponse().getContentAsString()).at("/data/id").asInt();

        mockMvc.perform(post("/api/v1/categories")
                        .header(HttpHeaders.AUTHORIZATION, bearerAdmin())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonMapper.writeValueAsString(Map.of(
                                "name", "另一个分类",
                                "slug", "java-arch"
                        ))))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.statusCode").value(409));

        // 2. 创建标签（同名幂等返回 200 "标签已存在"）
        MvcResult tagRes = mockMvc.perform(post("/api/v1/tags")
                        .header(HttpHeaders.AUTHORIZATION, bearerAdmin())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonMapper.writeValueAsString(Map.of("name", "Spring Boot 4", "slug", "spring-boot-4"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("标签创建成功"))
                .andReturn();
        int tagId = jsonMapper.readTree(tagRes.getResponse().getContentAsString()).at("/data/id").asInt();

        mockMvc.perform(post("/api/v1/tags")
                        .header(HttpHeaders.AUTHORIZATION, bearerAdmin())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonMapper.writeValueAsString(Map.of("name", "Spring Boot 4"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("标签已存在"))
                .andExpect(jsonPath("$.data.id").value(tagId));

        // 不存在的关联 ID 必须明确失败，不能静默丢弃后仍返回成功。
        mockMvc.perform(post("/api/v1/articles")
                        .header(HttpHeaders.AUTHORIZATION, bearerAdmin())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonMapper.writeValueAsString(Map.of(
                                "slug", "invalid-tag-reference",
                                "title", "无效标签关联",
                                "summary", "应返回 400",
                                "content", "正文",
                                "tagIds", List.of(999_999)
                        ))))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.statusMessage").value("指定的部分文章标签不存在"));

        // 3. 创建已发布文章，验证 UTC ISO-8601 (.SSS'Z') 时间格式与 +08:00 MySQL 容器无 8 小时偏移
        Instant beforeCreate = Instant.now();
        MvcResult articleRes = mockMvc.perform(post("/api/v1/articles")
                        .header(HttpHeaders.AUTHORIZATION, bearerAdmin())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonMapper.writeValueAsString(Map.of(
                                "slug", "nuxt-to-spring-boot",
                                "title", "从 Nuxt Nitro 迁移到 Spring Boot 4",
                                "summary", "记录神秘花园后端平滑演进的架构实践",
                                "content", "# 架构演进\n\n采用 Spring Data JPA + Flyway + Caffeine 构建轻量高可靠服务。",
                                "coverImage", "https://mysgarden.top/uploads/cover.webp",
                                "isPublished", true,
                                "isPinned", true,
                                "categoryId", categoryId,
                                "tagIds", List.of(tagId)
                        ))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.data.readingTime").value(1))
                .andExpect(jsonPath("$.data.coverImage").value("https://mysgarden.top/uploads/cover.webp"))
                .andExpect(jsonPath("$.data.category.slug").value("java-arch"))
                .andExpect(jsonPath("$.data.tags", hasSize(1)))
                .andReturn();

        JsonNode createdArticle = jsonMapper.readTree(articleRes.getResponse().getContentAsString()).at("/data");
        int articleId = createdArticle.get("id").asInt();
        String createdAtText = createdArticle.get("createdAt").asString();
        assertThat(createdAtText).matches("^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{3}Z$");
        Instant parsedCreatedAt = Instant.parse(createdAtText);
        assertThat(Duration.between(beforeCreate, parsedCreatedAt).abs()).isLessThan(Duration.ofSeconds(30));

        // 4. 局部更新：显式传 coverImage: null 置空封面，未传 summary/categoryId/tagIds 保持原值不变
        Map<String, Object> patchPayload = new HashMap<>();
        patchPayload.put("title", "从 Nuxt Nitro 平滑迁移至 Spring Boot 4");
        patchPayload.put("coverImage", null);

        mockMvc.perform(put("/api/v1/articles/" + articleId)
                        .header(HttpHeaders.AUTHORIZATION, bearerAdmin())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonMapper.writeValueAsString(patchPayload)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.title").value("从 Nuxt Nitro 平滑迁移至 Spring Boot 4"))
                .andExpect(jsonPath("$.data.coverImage").value(nullValue()))
                .andExpect(jsonPath("$.data.summary").value("记录神秘花园后端平滑演进的架构实践"))
                .andExpect(jsonPath("$.data.categoryId").value(categoryId))
                .andExpect(jsonPath("$.data.tags", hasSize(1)));

        // 5. 列表筛选、详情获取与分页越界校验（pageSize=201 -> 400）
        mockMvc.perform(get("/api/v1/articles")
                        .param("category", "java-arch")
                        .param("tag", "spring-boot-4"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.list", hasSize(1)))
                .andExpect(jsonPath("$.data.pagination.total").value(1));

        mockMvc.perform(get("/api/v1/articles").param("pageSize", "201"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.statusCode").value(400));

        mockMvc.perform(get("/api/v1/articles/nuxt-to-spring-boot"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.slug").value("nuxt-to-spring-boot"))
                .andExpect(jsonPath("$.data.author.nickname").value("花园守护者"));

        // 分类概览统计已发布文章数
        mockMvc.perform(get("/api/v1/categories"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.categories[0].articleCount").value(1))
                .andExpect(jsonPath("$.data.tags[0].articleCount").value(1));

        // 6. 删除文章后详情返回 404
        mockMvc.perform(delete("/api/v1/articles/" + articleId)
                        .header(HttpHeaders.AUTHORIZATION, bearerAdmin()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("文章已删除"));

        mockMvc.perform(get("/api/v1/articles/nuxt-to-spring-boot"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.statusCode").value(404));
    }

    @Test
    void essayJsonImagesLikeSettingsSearchStatsAndSeoXmlEndpoints() throws Exception {
        // 1. 发布一篇长文 + 一条带配图数组的随笔
        mockMvc.perform(post("/api/v1/articles")
                        .header(HttpHeaders.AUTHORIZATION, bearerAdmin())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonMapper.writeValueAsString(Map.of(
                                "slug", "caffeine-cache-guide",
                                "title", "小站缓存选型：Caffeine 实战",
                                "summary", "无需引入外部 Redis 的轻量级进程内缓存方案",
                                "content", "Caffeine 基于 W-TinyLFU 算法，命中率极高。",
                                "isPublished", true
                        ))))
                .andExpect(status().isOk());

        MvcResult essayRes = mockMvc.perform(post("/api/v1/essays")
                        .header(HttpHeaders.AUTHORIZATION, bearerAdmin())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonMapper.writeValueAsString(Map.of(
                                "content", "秋日午后在花园调试 Caffeine 缓存，阳光正好。",
                                "mood", "惬意",
                                "weather", "晴朗",
                                "location", "杭州",
                                "images", List.of("https://mysgarden.top/uploads/autumn-1.webp", "https://mysgarden.top/uploads/autumn-2.webp"),
                                "isPublished", true
                        ))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.images", hasSize(2)))
                .andExpect(jsonPath("$.data.likes").value(0))
                .andReturn();
        int essayId = jsonMapper.readTree(essayRes.getResponse().getContentAsString()).at("/data/id").asInt();

        // 2. 随笔按心情过滤与原子点赞
        mockMvc.perform(get("/api/v1/essays").param("mood", "惬意"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.list", hasSize(1)));

        mockMvc.perform(post("/api/v1/essays/" + essayId + "/like"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.likes").value(1));

        mockMvc.perform(post("/api/v1/essays/" + essayId + "/like"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.likes").value(2));

        // 3. 动态键值配置写入与读取
        mockMvc.perform(patch("/api/v1/settings")
                        .header(HttpHeaders.AUTHORIZATION, bearerAdmin())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonMapper.writeValueAsString(Map.of(
                                "site_icp", "浙ICP备20260001号",
                                "hero_motto", "静水流深，沧笙踏歌"
                        ))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("设置保存成功"));

        mockMvc.perform(get("/api/v1/settings"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.site_icp").value("浙ICP备20260001号"))
                .andExpect(jsonPath("$.data.hero_motto").value("静水流深，沧笙踏歌"));

        // 4. 全站搜索命中文章与随笔
        mockMvc.perform(get("/api/v1/search").param("q", "Caffeine"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.articles", hasSize(1)))
                .andExpect(jsonPath("$.data.essays", hasSize(1)));

        // 5. 统计概览（Bento 仪表盘）
        mockMvc.perform(get("/api/v1/stats/overview"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.stats.articles").value(1))
                .andExpect(jsonPath("$.data.stats.essays").value(1))
                .andExpect(jsonPath("$.data.recentArticles", hasSize(1)))
                .andExpect(jsonPath("$.data.recentEssays", hasSize(1)));

        // 6. RSS Feed、Sitemap XML 与 OpenAPI v3 文档契约检查
        mockMvc.perform(get("/feed.xml"))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_XML))
                .andExpect(content().string(containsString("<rss version=\"2.0\"")))
                .andExpect(content().string(containsString("caffeine-cache-guide")));

        mockMvc.perform(get("/sitemap.xml"))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_XML))
                .andExpect(content().string(containsString("<urlset")))
                .andExpect(content().string(containsString("/articles/caffeine-cache-guide")));

        mockMvc.perform(get("/v3/api-docs"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.info.title", containsString("神秘花园")));

        // 7. 删除随笔
        mockMvc.perform(delete("/api/v1/essays/" + essayId)
                        .header(HttpHeaders.AUTHORIZATION, bearerAdmin()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("随笔已删除"));
    }
}
