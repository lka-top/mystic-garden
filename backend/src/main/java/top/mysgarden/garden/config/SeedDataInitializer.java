package top.mysgarden.garden.config;

import java.util.List;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.core.env.Environment;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import top.mysgarden.garden.model.Category;
import top.mysgarden.garden.model.Tag;
import top.mysgarden.garden.model.User;
import top.mysgarden.garden.repository.CategoryRepository;
import top.mysgarden.garden.repository.TagRepository;
import top.mysgarden.garden.repository.UserRepository;

/**
 * 种子数据初始化器（参照 OpenIsle {@code config/*Initializer}，仅在激活 {@code seed} Profile 时执行）。
 * 管理员凭证从环境变量读取，绝不在源码中硬编码密码。
 */
@Slf4j
@Component
@Profile("seed")
@RequiredArgsConstructor
public class SeedDataInitializer implements ApplicationRunner {

    private final Environment env;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final TagRepository tagRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        String rawPassword = env.getProperty("ADMIN_PASSWORD");
        if (rawPassword == null || rawPassword.isBlank()) {
            throw new IllegalStateException("未检测到 ADMIN_PASSWORD 环境变量，拒绝执行 seed 初始化");
        }
        String username = env.getProperty("ADMIN_USERNAME", "admin");
        String nickname = env.getProperty("ADMIN_NICKNAME", "lka");
        String email = env.getProperty("ADMIN_EMAIL", "admin@mysgarden.top");

        User admin = userRepository.findByUsername(username).orElseGet(User::new);
        admin.setUsername(username);
        admin.setPasswordHash(passwordEncoder.encode(rawPassword));
        if (admin.getId() == null) {
            admin.setNickname(nickname);
            admin.setAvatar("/images/avatar.webp");
            admin.setEmail(email);
            admin.setBio("全栈开发者 / 探索 Web 现代美学与工程架构。");
            admin.setRole("admin");
        }
        userRepository.save(admin);

        seedCategory("技术探索", "technology", "全栈开发、现代 Web 生态与工程实践");
        seedCategory("设计美学", "design", "Material Design 3、Tailwind CSS 与交互体验");
        seedCategory("系统架构", "architecture", "服务端架构、数据库优化与 DevOps 容器化");
        seedCategory("生活杂谈", "life", "读书笔记、生产力工具与成长碎碎念");

        List<String[]> defaultTags = List.of(
                new String[]{"Vue 3", "vue3"},
                new String[]{"Nuxt 3", "nuxt3"},
                new String[]{"Spring Boot", "spring-boot"},
                new String[]{"Java", "java"},
                new String[]{"Tailwind CSS", "tailwindcss"},
                new String[]{"TypeScript", "typescript"},
                new String[]{"Docker", "docker"},
                new String[]{"架构设计", "architecture"}
        );
        for (String[] pair : defaultTags) {
            seedTag(pair[0], pair[1]);
        }

        log.info("神秘花园 seed 初始化完成（管理员账号: {}）", username);
    }

    private void seedCategory(String name, String slug, String description) {
        if (!categoryRepository.existsBySlug(slug) && !categoryRepository.existsByName(name)) {
            Category c = new Category();
            c.setName(name);
            c.setSlug(slug);
            c.setDescription(description);
            categoryRepository.save(c);
        }
    }

    private void seedTag(String name, String slug) {
        if (tagRepository.findBySlug(slug).isEmpty() && tagRepository.findByName(name).isEmpty()) {
            Tag t = new Tag();
            t.setName(name);
            t.setSlug(slug);
            tagRepository.save(t);
        }
    }
}
