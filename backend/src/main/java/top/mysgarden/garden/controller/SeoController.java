package top.mysgarden.garden.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import top.mysgarden.garden.service.SeoService;

import java.time.Duration;

@RestController
@RequiredArgsConstructor
@Tag(name = "SEO", description = "RSS Feed 与 Sitemap XML 路由")
public class SeoController {

    private static final MediaType APPLICATION_XML_UTF8 = MediaType.parseMediaType("application/xml; charset=utf-8");

    private final SeoService seoService;

    @GetMapping(value = "/feed.xml", produces = "application/xml;charset=UTF-8")
    @Operation(summary = "生成 RSS 2.0 订阅源")
    public ResponseEntity<String> feed() {
        return ResponseEntity.ok()
                .contentType(APPLICATION_XML_UTF8)
                .header(HttpHeaders.CACHE_CONTROL, "public, max-age=3600, s-maxage=3600")
                .body(seoService.buildRssFeed());
    }

    @GetMapping(value = "/sitemap.xml", produces = "application/xml;charset=UTF-8")
    @Operation(summary = "生成 Sitemap 站点地图")
    public ResponseEntity<String> sitemap() {
        return ResponseEntity.ok()
                .contentType(APPLICATION_XML_UTF8)
                .cacheControl(CacheControl.maxAge(Duration.ofHours(1)).cachePublic().sMaxAge(Duration.ofHours(1)))
                .body(seoService.buildSitemap());
    }
}
