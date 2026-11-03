package top.mysgarden.garden;

import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import tools.jackson.databind.json.JsonMapper;

import top.mysgarden.garden.config.RateLimitFilter;
import top.mysgarden.garden.model.User;
import top.mysgarden.garden.repository.UserRepository;
import top.mysgarden.garden.service.JwtService;

/**
 * 集成测试基类：共享 MySQL 8.0.36 Testcontainer，并在每个用例前清理表数据、Caffeine 缓存与限流状态。
 */
@Import(TestcontainersConfiguration.class)
@SpringBootTest
@AutoConfigureMockMvc
public abstract class AbstractIntegrationTest {

    protected static final String ADMIN_USERNAME = "admin";
    protected static final String ADMIN_PASSWORD = "AdminSecurePassword2026!";
    protected static final String TEST_SYNC_TOKEN = "test-only-note-sync-token-at-least-32-chars-2026";

    @Autowired
    protected MockMvc mockMvc;

    @Autowired
    protected JsonMapper jsonMapper;

    @Autowired
    protected JdbcTemplate jdbcTemplate;

    @Autowired
    protected CacheManager cacheManager;

    @Autowired
    protected RateLimitFilter rateLimitFilter;

    @Autowired
    protected UserRepository userRepository;

    @Autowired
    protected PasswordEncoder passwordEncoder;

    @Autowired
    protected JwtService jwtService;

    protected User adminUser;
    protected String adminJwt;

    @BeforeEach
    void resetDatabaseAndCaches() {
        jdbcTemplate.update("DELETE FROM comments");
        jdbcTemplate.update("DELETE FROM article_tags");
        jdbcTemplate.update("DELETE FROM note_tags");
        jdbcTemplate.update("DELETE FROM articles");
        jdbcTemplate.update("DELETE FROM notes");
        jdbcTemplate.update("DELETE FROM notebooks");
        jdbcTemplate.update("DELETE FROM essays");
        jdbcTemplate.update("DELETE FROM categories");
        jdbcTemplate.update("DELETE FROM tags");
        jdbcTemplate.update("DELETE FROM settings");
        jdbcTemplate.update("DELETE FROM users");

        for (String name : cacheManager.getCacheNames()) {
            Cache cache = cacheManager.getCache(name);
            if (cache != null) {
                cache.clear();
            }
        }
        rateLimitFilter.clear();

        User admin = new User();
        admin.setUsername(ADMIN_USERNAME);
        admin.setPasswordHash(passwordEncoder.encode(ADMIN_PASSWORD));
        admin.setNickname("花园守护者");
        admin.setEmail("admin@mysgarden.top");
        admin.setRole("admin");
        this.adminUser = userRepository.save(admin);
        this.adminJwt = jwtService.signToken(adminUser.getId(), adminUser.getUsername(), adminUser.getRole());
    }

    protected String bearerAdmin() {
        return "Bearer " + adminJwt;
    }

    protected String bearer(String token) {
        return "Bearer " + token;
    }
}
