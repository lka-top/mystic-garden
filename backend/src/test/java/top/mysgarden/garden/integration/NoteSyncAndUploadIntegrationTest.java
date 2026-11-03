package top.mysgarden.garden.integration;

import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MvcResult;

import top.mysgarden.garden.AbstractIntegrationTest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.matchesPattern;
import static org.hamcrest.Matchers.nullValue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * 知识库笔记树递归、加密笔记 password 脱敏、NOTE_SYNC_TOKEN 幂等同步与图片上传集成测试。
 */
class NoteSyncAndUploadIntegrationTest extends AbstractIntegrationTest {

    private static final byte[] TINY_PNG = new byte[] {
            (byte) 0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D
    };

    @Test
    void noteSyncTokenAuthDirectoryTreeIdempotentUpsertAndPasswordExclusion() throws Exception {
        Map<String, Object> syncPayload = Map.of(
                "directories", List.of(
                        Map.of(
                                "name", "技术开发",
                                "slug", "dev",
                                "path", "dev",
                                "icon", "lucide:code-2"
                        ),
                        Map.of(
                                "name", "Java 生态",
                                "slug", "dev-java",
                                "path", "dev/java",
                                "parentPath", "dev",
                                "icon", "lucide:coffee"
                        )
                ),
                "notes", List.of(
                        Map.of(
                                "title", "Spring Data JPA 性能调优",
                                "slug", "jpa-tuning",
                                "summary", "Batch Fetch 与 Specification 实战笔记",
                                "content", "## 核心要点\n\n开启 `default_batch_fetch_size: 50` 消除 N+1。",
                                "sourcePath", "dev/java/jpa-tuning.md",
                                "directoryPath", "dev/java",
                                "tags", List.of("Spring Data JPA", "MySQL 8")
                        )
                )
        );

        // 1. 未携带或携带错误的 NOTE_SYNC_TOKEN（包括携带管理员 JWT！）均必须返回 401
        mockMvc.perform(post("/api/v1/notes/sync")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonMapper.writeValueAsString(syncPayload)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.statusMessage").value("笔记同步凭证无效"));

        mockMvc.perform(post("/api/v1/notes/sync")
                        .header(HttpHeaders.AUTHORIZATION, bearerAdmin())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonMapper.writeValueAsString(syncPayload)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.statusMessage").value("笔记同步凭证无效"));

        // 2. 携带正确 NOTE_SYNC_TOKEN 首次同步：新增 1 篇，更新 0 篇
        mockMvc.perform(post("/api/v1/notes/sync")
                        .header(HttpHeaders.AUTHORIZATION, bearer(TEST_SYNC_TOKEN))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonMapper.writeValueAsString(syncPayload)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.created").value(1))
                .andExpect(jsonPath("$.data.updated").value(0));

        // 3. 相同 sourcePath 二次同步：幂等更新（新增 0 篇，更新 1 篇）
        Map<String, Object> updateSyncPayload = Map.of(
                "directories", syncPayload.get("directories"),
                "notes", List.of(
                        Map.of(
                                "title", "Spring Data JPA 性能调优（修订版）",
                                "slug", "jpa-tuning",
                                "summary", "新增 EntityGraph 与分页计数说明",
                                "content", "## 核心要点（V2）\n\n已补充二级实战案例。",
                                "sourcePath", "dev/java/jpa-tuning.md",
                                "directoryPath", "dev/java",
                                "tags", List.of("Spring Data JPA")
                        )
                )
        );

        mockMvc.perform(post("/api/v1/notes/sync")
                        .header(HttpHeaders.AUTHORIZATION, bearer(TEST_SYNC_TOKEN))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonMapper.writeValueAsString(updateSyncPayload)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.created").value(0))
                .andExpect(jsonPath("$.data.updated").value(1));

        // 引用不存在的目录路径返回 422
        Map<String, Object> invalidDirPayload = Map.of(
                "notes", List.of(
                        Map.of(
                                "title", "孤立笔记",
                                "slug", "orphan-note",
                                "summary", "缺失父目录",
                                "content", "内容",
                                "sourcePath", "unknown/orphan.md",
                                "directoryPath", "unknown/dir"
                        )
                )
        );
        mockMvc.perform(post("/api/v1/notes/sync")
                        .header(HttpHeaders.AUTHORIZATION, bearer(TEST_SYNC_TOKEN))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonMapper.writeValueAsString(invalidDirPayload)))
                .andExpect(status().is(422));

        mockMvc.perform(post("/api/v1/notebooks")
                        .header(HttpHeaders.AUTHORIZATION, bearerAdmin())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonMapper.writeValueAsString(Map.of(
                                "name", "孤立目录",
                                "slug", "orphan-notebook",
                                "parentId", 999_999
                        ))))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.statusMessage").value("指定的父级笔记本不存在"));

        // 4. 创建私密笔记本，验证匿名列表隐藏私密目录，且父目录 dev 递归汇总子目录 dev/java 的公开笔记数
        mockMvc.perform(post("/api/v1/notebooks")
                        .header(HttpHeaders.AUTHORIZATION, bearerAdmin())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonMapper.writeValueAsString(Map.of(
                                "name", "私密手记",
                                "slug", "private-diary",
                                "isPrivate", true
                        ))))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/v1/notebooks"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data", hasSize(2)))
                .andExpect(jsonPath("$.data[?(@.slug == 'dev')].noteCount").value(1));

        mockMvc.perform(get("/api/v1/notebooks").header(HttpHeaders.AUTHORIZATION, bearerAdmin()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data", hasSize(3)));

        // 按父目录 ?notebook=dev 查询时，递归包含子目录 dev/java 下的笔记
        mockMvc.perform(get("/api/v1/notes").param("notebook", "dev"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.list", hasSize(1)))
                .andExpect(jsonPath("$.data.list[0].title").value("Spring Data JPA 性能调优（修订版）"));

        // 5. 创建加密笔记，严格断言响应 JSON 绝不泄露 password 字段与明文密码！
        String rawSecret = "NeverExposeThisPassword#2026";
        MvcResult encCreateRes = mockMvc.perform(post("/api/v1/notes")
                        .header(HttpHeaders.AUTHORIZATION, bearerAdmin())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonMapper.writeValueAsString(Map.of(
                                "title", "加密随想",
                                "slug", "encrypted-reflection",
                                "summary", "受密码保护的笔记",
                                "content", "加密笔记正文",
                                "isPublished", true,
                                "isEncrypted", true,
                                "password", rawSecret
                        ))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.isEncrypted").value(true))
                .andExpect(jsonPath("$.data.password").doesNotExist())
                .andReturn();

        String createBody = encCreateRes.getResponse().getContentAsString();
        assertThat(createBody).doesNotContain(rawSecret).doesNotContain("\"password\"");
        int encNoteId = jsonMapper.readTree(createBody).at("/data/id").asInt();

        String listBody = mockMvc.perform(get("/api/v1/notes"))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        assertThat(listBody).doesNotContain(rawSecret).doesNotContain("\"password\"");

        mockMvc.perform(get("/api/v1/notes/encrypted-reflection"))
                .andExpect(status().isNotFound());

        String detailBody = mockMvc.perform(get("/api/v1/notes/encrypted-reflection")
                        .header(HttpHeaders.AUTHORIZATION, bearerAdmin()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.password").doesNotExist())
                .andReturn().getResponse().getContentAsString();
        assertThat(detailBody).doesNotContain(rawSecret).doesNotContain("\"password\"");

        // 6. 笔记局部更新（summary 显式置 null）与删除
        Map<String, Object> notePatch = new HashMap<>();
        notePatch.put("summary", null);
        mockMvc.perform(put("/api/v1/notes/" + encNoteId)
                        .header(HttpHeaders.AUTHORIZATION, bearerAdmin())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonMapper.writeValueAsString(notePatch)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.summary").value(nullValue()))
                .andExpect(jsonPath("$.data.content").value("加密笔记正文"));

        mockMvc.perform(delete("/api/v1/notes/" + encNoteId)
                        .header(HttpHeaders.AUTHORIZATION, bearerAdmin()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("笔记已删除"));
    }

    @Test
    void uploadsVerifyFileSignaturesRejectSvgAndDirectSignReturns503() throws Exception {
        MockMultipartFile pngForNote = new MockMultipartFile(
                "image", "diagram.png", "image/png", TINY_PNG);

        // 1. 笔记内嵌图片同步上传：按 SHA-256 生成幂等文件名 notes-<sha256>.png
        mockMvc.perform(multipart("/api/v1/notes/sync/assets")
                        .file(pngForNote)
                        .header(HttpHeaders.AUTHORIZATION, bearer(TEST_SYNC_TOKEN)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.filename", matchesPattern("^notes-[0-9a-f]{64}\\.png$")))
                .andExpect(jsonPath("$.data.url",
                        matchesPattern("^https://mysgarden\\.top/uploads/notes/\\d{4}/\\d{2}/notes-[0-9a-f]{64}\\.png$")));

        // 笔记同步接口禁止 SVG（防 XSS）
        MockMultipartFile svgForNote = new MockMultipartFile(
                "image", "vector.svg", "image/svg+xml",
                "<svg xmlns=\"http://www.w3.org/2000/svg\"></svg>".getBytes(StandardCharsets.UTF_8));
        mockMvc.perform(multipart("/api/v1/notes/sync/assets")
                        .file(svgForNote)
                        .header(HttpHeaders.AUTHORIZATION, bearer(TEST_SYNC_TOKEN)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.statusMessage").value("仅支持 JPG、PNG、WebP、GIF、AVIF 图片"));

        // 2. 管理员通用上传拒绝 SVG、伪造后缀与伪造图片内容
        MockMultipartFile adminSvg = new MockMultipartFile(
                "file", "badge.svg", "image/svg+xml",
                "<svg xmlns=\"http://www.w3.org/2000/svg\"></svg>".getBytes(StandardCharsets.UTF_8));
        mockMvc.perform(multipart("/api/v1/upload")
                        .file(adminSvg)
                        .header(HttpHeaders.AUTHORIZATION, bearerAdmin()))
                .andExpect(status().isBadRequest());

        MockMultipartFile badExe = new MockMultipartFile(
                "file", "payload.exe", "image/png", TINY_PNG);
        mockMvc.perform(multipart("/api/v1/upload")
                        .file(badExe)
                        .header(HttpHeaders.AUTHORIZATION, bearerAdmin()))
                .andExpect(status().isBadRequest());

        MockMultipartFile fakePng = new MockMultipartFile(
                "file", "payload.png", "image/png",
                "<script>alert('not an image')</script>".getBytes(StandardCharsets.UTF_8));
        mockMvc.perform(multipart("/api/v1/upload")
                        .file(fakePng)
                        .header(HttpHeaders.AUTHORIZATION, bearerAdmin()))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.statusMessage").value("图片文件内容与声明的类型不一致"));

        // 3. 本地存储模式下请求直传签名返回 503，触发前端回退至 /api/v1/upload
        mockMvc.perform(post("/api/v1/uploads/sign")
                        .header(HttpHeaders.AUTHORIZATION, bearerAdmin())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonMapper.writeValueAsString(Map.of(
                                "filename", "photo.png",
                                "contentType", "image/png",
                                "size", 1024
                        ))))
                .andExpect(status().isServiceUnavailable())
                .andExpect(jsonPath("$.statusCode").value(503))
                .andExpect(jsonPath("$.statusMessage", containsString("当前存储模式不支持浏览器直传")));
    }
}
