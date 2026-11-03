package top.mysgarden.garden.integration;

import java.util.Map;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

import top.mysgarden.garden.AbstractIntegrationTest;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class LiteralSearchIntegrationTest extends AbstractIntegrationTest {

    @Test
    void percentUnderscoreAndEscapeCharacterAreSearchedLiterally() throws Exception {
        createArticle("literal-symbols", "符号 token%_!", "仅此标题含特殊符号");
        createArticle("plain-text", "普通 tokenABC", "普通文字");

        for (String symbol : new String[]{"%", "_", "!"}) {
            mockMvc.perform(get("/api/v1/articles").param("keyword", symbol))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.data.list", hasSize(1)))
                    .andExpect(jsonPath("$.data.list[0].slug").value("literal-symbols"));

            mockMvc.perform(get("/api/v1/search").param("q", symbol))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.data.articles", hasSize(1)))
                    .andExpect(jsonPath("$.data.articles[0].slug").value("literal-symbols"));
        }
    }

    private void createArticle(String slug, String title, String summary) throws Exception {
        mockMvc.perform(post("/api/v1/articles")
                        .header(HttpHeaders.AUTHORIZATION, bearerAdmin())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonMapper.writeValueAsString(Map.of(
                                "slug", slug,
                                "title", title,
                                "summary", summary,
                                "content", "一篇文章的正文",
                                "isPublished", true
                        ))))
                .andExpect(status().isOk());
    }
}
