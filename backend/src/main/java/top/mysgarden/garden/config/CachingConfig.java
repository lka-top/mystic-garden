package top.mysgarden.garden.config;

import java.time.Duration;
import java.util.List;

import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.caffeine.CaffeineCache;
import org.springframework.cache.support.SimpleCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * 进程内 Caffeine 缓存配置，
 * 替代原 Nuxt Nitro routeRules 中的 SWR 内存缓存：
 * - stats: 60s
 * - categories / tags: 120s
 * - articles / essays 匿名列表: 30s
 * - notes / notebooks: 不缓存，确保同步后刷新立即可见
 */
@Configuration
@EnableCaching
public class CachingConfig {

    public static final String STATS_CACHE_NAME = "garden_stats";
    public static final String CATEGORY_CACHE_NAME = "garden_categories";
    public static final String TAG_CACHE_NAME = "garden_tags";
    public static final String ARTICLE_LIST_CACHE_NAME = "garden_articles";
    public static final String ESSAY_LIST_CACHE_NAME = "garden_essays";

    @Bean
    public CacheManager cacheManager() {
        SimpleCacheManager manager = new SimpleCacheManager();
        manager.setCaches(List.of(
                buildCache(STATS_CACHE_NAME, Duration.ofSeconds(60), 16),
                buildCache(CATEGORY_CACHE_NAME, Duration.ofSeconds(120), 16),
                buildCache(TAG_CACHE_NAME, Duration.ofSeconds(120), 16),
                buildCache(ARTICLE_LIST_CACHE_NAME, Duration.ofSeconds(30), 256),
                buildCache(ESSAY_LIST_CACHE_NAME, Duration.ofSeconds(30), 128)
        ));
        return manager;
    }

    private static CaffeineCache buildCache(String name, Duration ttl, long maxSize) {
        return new CaffeineCache(name, Caffeine.newBuilder()
                .expireAfterWrite(ttl)
                .expireAfterAccess(ttl)
                .maximumSize(maxSize)
                .recordStats()
                .build());
    }
}
