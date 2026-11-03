package top.mysgarden.garden;

import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.context.annotation.Bean;
import org.testcontainers.mysql.MySQLContainer;
import org.testcontainers.utility.DockerImageName;

/**
 * 全局共享的 MySQL 8.0.36 测试容器（与生产 docker-compose.yml 同版本、同字符集与 +08:00 时区），
 * 由 Flyway 自动执行 V1__baseline.sql 并接受 Hibernate ddl-auto=validate 强校验。
 */
@TestConfiguration(proxyBeanMethods = false)
public class TestcontainersConfiguration {

    private static final MySQLContainer MYSQL_CONTAINER;

    static {
        MYSQL_CONTAINER = new MySQLContainer(DockerImageName.parse("mysql:8.0.36"))
                .withDatabaseName("luokai_blog_test")
                .withUsername("luokai")
                .withPassword("LuokaiTestPass2026!")
                .withUrlParam("connectionTimeZone", "UTC")
                .withUrlParam("forceConnectionTimeZoneToSession", "true")
                .withUrlParam("characterEncoding", "UTF-8")
                .withCommand(
                        "--character-set-server=utf8mb4",
                        "--collation-server=utf8mb4_unicode_ci",
                        "--default-time-zone=+08:00"
                );
        MYSQL_CONTAINER.start();
        Runtime.getRuntime().addShutdownHook(new Thread(MYSQL_CONTAINER::stop));
    }

    @Bean
    @ServiceConnection
    MySQLContainer mysqlContainer() {
        return MYSQL_CONTAINER;
    }
}
