package top.mysgarden.garden.service;

import java.time.Instant;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.List;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import top.mysgarden.garden.config.AppProperties;
import top.mysgarden.garden.model.Article;
import top.mysgarden.garden.model.Note;
import top.mysgarden.garden.repository.ArticleRepository;
import top.mysgarden.garden.repository.NoteRepository;

/**
 * RSS 2.0 ({@code /feed.xml}) 与 Sitemap ({@code /sitemap.xml}) 生成服务，
 * 输出结构与原 {@code server/routes/feed.xml.ts}、{@code sitemap.xml.ts} 对齐。
 */
@Service
@RequiredArgsConstructor
public class SeoService {

    private static final DateTimeFormatter RFC_1123_GMT = DateTimeFormatter.RFC_1123_DATE_TIME.withZone(ZoneOffset.UTC);
    private static final DateTimeFormatter ISO_MILLIS_UTC = DateTimeFormatter
            .ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
            .withZone(ZoneOffset.UTC);

    private record StaticRoute(String url, String changefreq, String priority) {
    }

    private static final List<StaticRoute> STATIC_ROUTES = List.of(
            new StaticRoute("/", "daily", "1.0"),
            new StaticRoute("/articles", "daily", "0.9"),
            new StaticRoute("/essays", "daily", "0.8"),
            new StaticRoute("/notes", "daily", "0.8"),
            new StaticRoute("/archive", "weekly", "0.7"),
            new StaticRoute("/about", "monthly", "0.7")
    );

    private final ArticleRepository articleRepository;
    private final NoteRepository noteRepository;
    private final AppProperties appProperties;
    private final NoteVisibilityService noteVisibilityService;

    @Transactional(readOnly = true)
    public String buildRssFeed() {
        String siteUrl = normalizedSiteUrl();
        String siteName = orDefault(appProperties.siteName(), "神秘花园");
        String siteDesc = orDefault(appProperties.siteDescription(), "记录思考、探索技术、沉淀生活的一方数字花园");
        String fallbackAuthor = orDefault(appProperties.authorName(), "lka");

        List<Article> articles = articleRepository.findTop20ByPublishedTrueOrderByCreatedAtDesc();

        StringBuilder items = new StringBuilder();
        for (Article item : articles) {
            String link = siteUrl + "/articles/" + escapeXml(item.getSlug());
            String pubDate = RFC_1123_GMT.format(item.getCreatedAt());
            String author = (item.getAuthor() != null && item.getAuthor().getNickname() != null)
                    ? item.getAuthor().getNickname()
                    : fallbackAuthor;
            String categoryTag = (item.getCategory() != null && item.getCategory().getName() != null)
                    ? "<category>" + cdata(item.getCategory().getName()) + "</category>"
                    : "";

            items.append("\n    <item>")
                    .append("\n      <title>").append(cdata(item.getTitle())).append("</title>")
                    .append("\n      <link>").append(link).append("</link>")
                    .append("\n      <guid isPermaLink=\"true\">").append(link).append("</guid>")
                    .append("\n      <description>").append(cdata(item.getSummary() != null ? item.getSummary() : "")).append("</description>")
                    .append("\n      <author>").append(cdata(author)).append("</author>")
                    .append("\n      ").append(categoryTag)
                    .append("\n      <pubDate>").append(pubDate).append("</pubDate>")
                    .append("\n    </item>");
        }

        return "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n"
                + "<rss version=\"2.0\" xmlns:atom=\"http://www.w3.org/2005/Atom\">\n"
                + "  <channel>\n"
                + "    <title>" + cdata(siteName) + "</title>\n"
                + "    <link>" + escapeXml(siteUrl) + "</link>\n"
                + "    <description>" + cdata(siteDesc) + "</description>\n"
                + "    <language>zh-CN</language>\n"
                + "    <lastBuildDate>" + RFC_1123_GMT.format(Instant.now()) + "</lastBuildDate>\n"
                + "    <atom:link href=\"" + escapeXml(siteUrl) + "/feed.xml\" rel=\"self\" type=\"application/rss+xml\"/>"
                + items + "\n"
                + "  </channel>\n"
                + "</rss>";
    }

    @Transactional(readOnly = true)
    public String buildSitemap() {
        String siteUrl = normalizedSiteUrl();
        List<Article> articles = articleRepository.findByPublishedTrueOrderByCreatedAtDesc();
        List<Note> notes = noteRepository.findAll(noteVisibilityService.publicNotes(),
                Sort.by(Sort.Order.desc("createdAt"), Sort.Order.asc("id")));

        StringBuilder xml = new StringBuilder();
        xml.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n");
        xml.append("<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">");

        for (StaticRoute route : STATIC_ROUTES) {
            xml.append("\n  <url>")
                    .append("\n    <loc>").append(escapeXml(siteUrl + route.url())).append("</loc>")
                    .append("\n    <changefreq>").append(route.changefreq()).append("</changefreq>")
                    .append("\n    <priority>").append(route.priority()).append("</priority>")
                    .append("\n  </url>");
        }

        for (Article art : articles) {
            Instant mod = art.getUpdatedAt() != null ? art.getUpdatedAt() : art.getCreatedAt();
            xml.append("\n  <url>")
                    .append("\n    <loc>").append(escapeXml(siteUrl + "/articles/" + art.getSlug())).append("</loc>")
                    .append("\n    <lastmod>").append(ISO_MILLIS_UTC.format(mod)).append("</lastmod>")
                    .append("\n    <changefreq>weekly</changefreq>")
                    .append("\n    <priority>0.8</priority>")
                    .append("\n  </url>");
        }

        for (Note note : notes) {
            Instant mod = note.getUpdatedAt() != null ? note.getUpdatedAt() : note.getCreatedAt();
            xml.append("\n  <url>")
                    .append("\n    <loc>").append(escapeXml(siteUrl + "/notes/" + note.getSlug())).append("</loc>")
                    .append("\n    <lastmod>").append(ISO_MILLIS_UTC.format(mod)).append("</lastmod>")
                    .append("\n    <changefreq>monthly</changefreq>")
                    .append("\n    <priority>0.7</priority>")
                    .append("\n  </url>");
        }

        xml.append("\n</urlset>");
        return xml.toString();
    }

    private String normalizedSiteUrl() {
        String raw = orDefault(appProperties.siteUrl(), "http://localhost:3000").trim();
        return raw.endsWith("/") ? raw.substring(0, raw.length() - 1) : raw;
    }

    private static String orDefault(String val, String fallback) {
        return (val != null && !val.isBlank()) ? val : fallback;
    }

    private static String cdata(String text) {
        String safe = text == null ? "" : text.replace("]]>", "]]]]><![CDATA[>");
        return "<![CDATA[" + safe + "]]>";
    }

    private static String escapeXml(String text) {
        if (text == null) {
            return "";
        }
        return text.replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&apos;");
    }
}
