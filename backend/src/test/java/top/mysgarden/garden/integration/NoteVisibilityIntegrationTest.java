package top.mysgarden.garden.integration;

import java.util.Map;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import tools.jackson.databind.JsonNode;

import top.mysgarden.garden.AbstractIntegrationTest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class NoteVisibilityIntegrationTest extends AbstractIntegrationTest {

    @Test
    void encryptedAndPrivateDescendantNotesAreAdminOnlyAcrossPublicReaders() throws Exception {
        int privateParentId = createNotebook("private-root", "private-root", null, true);
        createNotebook("private-child", "private-root/child", privateParentId, false);
        createNotebook("public-root", "public-root", null, false);

        createNote("public-note", "public-root", "public marker", false, true);
        createNote("encrypted-note", "public-root", "secret encrypted marker", true, true);
        createNote("private-child-note", "private-child", "secret private marker", false, true);
        createNote("draft-note", "public-root", "secret draft marker", false, false);

        String tagBody = mockMvc.perform(post("/api/v1/tags")
                        .header(HttpHeaders.AUTHORIZATION, bearerAdmin())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonMapper.writeValueAsString(Map.of(
                                "name", "visibility-tag", "slug", "visibility-tag"))))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        int tagId = jsonMapper.readTree(tagBody).at("/data/id").asInt();
        for (String slug : new String[] { "public-note", "encrypted-note", "private-child-note" }) {
            jdbcTemplate.update("INSERT INTO note_tags (note_id, tag_id) SELECT id, ? FROM notes WHERE slug = ?",
                    tagId, slug);
        }

        String publicList = mockMvc.perform(get("/api/v1/notes"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.pagination.total").value(1))
                .andReturn().getResponse().getContentAsString();
        assertThat(publicList).contains("public marker")
                .doesNotContain("secret encrypted", "secret private", "secret draft");

        mockMvc.perform(get("/api/v1/notes/encrypted-note"))
                .andExpect(status().isNotFound());
        mockMvc.perform(get("/api/v1/notes/private-child-note"))
                .andExpect(status().isNotFound());
        mockMvc.perform(get("/api/v1/notes/encrypted-note")
                        .header(HttpHeaders.AUTHORIZATION, bearerAdmin()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.content").value("secret encrypted marker"));
        mockMvc.perform(get("/api/v1/notes/private-child-note")
                        .header(HttpHeaders.AUTHORIZATION, bearerAdmin()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.content").value("secret private marker"));
        mockMvc.perform(get("/api/v1/notes")
                        .header(HttpHeaders.AUTHORIZATION, bearerAdmin())
                        .param("all", "true"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.pagination.total").value(4));

        mockMvc.perform(get("/api/v1/search").param("q", "secret"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.notes", hasSize(0)));
        mockMvc.perform(get("/api/v1/stats/overview"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.stats.notes").value(1))
                .andExpect(jsonPath("$.data.recentNotes", hasSize(1)))
                .andExpect(jsonPath("$.data.recentNotes[0].slug").value("public-note"));

        String sitemap = mockMvc.perform(get("/sitemap.xml"))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        assertThat(sitemap).contains("/notes/public-note")
                .doesNotContain("/notes/encrypted-note", "/notes/private-child-note", "/notes/draft-note");

        String publicNotebooks = mockMvc.perform(get("/api/v1/notebooks"))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        assertThat(publicNotebooks).contains("public-root")
                .doesNotContain("private-root", "private-child");
        mockMvc.perform(get("/api/v1/tags"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data[0].noteCount").value(1));
        mockMvc.perform(get("/api/v1/notebooks")
                        .header(HttpHeaders.AUTHORIZATION, bearerAdmin()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data", hasSize(3)));
    }

    @Test
    void notebookPathAndKeywordTreatSqlWildcardsAsLiteralText() throws Exception {
        createNotebook("dev-ops", "dev_ops", null, false);
        createNotebook("dev-other", "devXops", null, false);
        createNote("literal-note", "dev-ops", "alpha_beta", false, true);
        createNote("wildcard-note", "dev-other", "alphaXbeta", false, true);

        mockMvc.perform(get("/api/v1/notes").param("notebook", "dev-ops"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.pagination.total").value(1))
                .andExpect(jsonPath("$.data.list[0].slug").value("literal-note"));
        mockMvc.perform(get("/api/v1/notes").param("keyword", "alpha_beta"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.pagination.total").value(1))
                .andExpect(jsonPath("$.data.list[0].slug").value("literal-note"));
    }

    private int createNotebook(String slug, String path, Integer parentId, boolean isPrivate) throws Exception {
        Map<String, Object> payload = new java.util.HashMap<>();
        payload.put("name", slug);
        payload.put("slug", slug);
        payload.put("path", path);
        payload.put("isPrivate", isPrivate);
        if (parentId != null) {
            payload.put("parentId", parentId);
        }
        String body = mockMvc.perform(post("/api/v1/notebooks")
                        .header(HttpHeaders.AUTHORIZATION, bearerAdmin())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonMapper.writeValueAsString(payload)))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        return jsonMapper.readTree(body).at("/data/id").asInt();
    }

    private void createNote(String slug, String notebookSlug, String content,
            boolean isEncrypted, boolean isPublished) throws Exception {
        JsonNode notebookResponse = jsonMapper.readTree(mockMvc.perform(get("/api/v1/notebooks")
                        .header(HttpHeaders.AUTHORIZATION, bearerAdmin()))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString());
        int notebookId = -1;
        for (JsonNode notebook : notebookResponse.at("/data")) {
            if (notebook.at("/slug").asText().equals(notebookSlug)) {
                notebookId = notebook.at("/id").asInt();
                break;
            }
        }
        assertThat(notebookId).isPositive();
        mockMvc.perform(post("/api/v1/notes")
                        .header(HttpHeaders.AUTHORIZATION, bearerAdmin())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonMapper.writeValueAsString(Map.of(
                                "title", slug,
                                "slug", slug,
                                "content", content,
                                "notebookId", notebookId,
                                "isEncrypted", isEncrypted,
                                "isPublished", isPublished))))
                .andExpect(status().isOk());
    }
}
