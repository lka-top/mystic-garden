package top.mysgarden.garden.service;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import top.mysgarden.garden.config.CachingConfig;
import top.mysgarden.garden.dto.ArticleDtos;
import top.mysgarden.garden.dto.PageResult;
import top.mysgarden.garden.exception.BusinessException;
import top.mysgarden.garden.exception.NotFoundException;
import top.mysgarden.garden.mapper.ArticleMapper;
import top.mysgarden.garden.model.Article;
import top.mysgarden.garden.model.Category;
import top.mysgarden.garden.model.Tag;
import top.mysgarden.garden.model.User;
import top.mysgarden.garden.repository.ArticleRepository;
import top.mysgarden.garden.repository.CategoryRepository;
import top.mysgarden.garden.repository.CommentRepository;
import top.mysgarden.garden.repository.TagRepository;
import top.mysgarden.garden.repository.UserRepository;
import top.mysgarden.garden.util.JpaLike;

@Service
@RequiredArgsConstructor
public class ArticleService {

    private final ArticleRepository articleRepository;
    private final CategoryRepository categoryRepository;
    private final TagRepository tagRepository;
    private final UserRepository userRepository;
    private final CommentRepository commentRepository;
    private final ArticleMapper articleMapper;
    private final ViewCountService viewCountService;

    @Transactional(readOnly = true)
    @Cacheable(
            value = CachingConfig.ARTICLE_LIST_CACHE_NAME,
            condition = "!#includeUnpublished",
            key = "#page + ':' + #pageSize + ':' + (#categorySlug ?: '') + ':' + (#tagSlug ?: '') + ':' + (#keyword ?: '')"
    )
    public PageResult<ArticleDtos.ArticleListItemDto> listArticles(
            int page,
            int pageSize,
            String categorySlug,
            String tagSlug,
            String keyword,
            boolean includeUnpublished) {

        Specification<Article> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (!includeUnpublished) {
                predicates.add(cb.isTrue(root.get("published")));
            }
            if (categorySlug != null && !categorySlug.isBlank()) {
                Join<Article, Category> catJoin = root.join("category", JoinType.INNER);
                predicates.add(cb.equal(catJoin.get("slug"), categorySlug));
            }
            if (tagSlug != null && !tagSlug.isBlank()) {
                Join<Article, Tag> tagJoin = root.join("tags", JoinType.INNER);
                predicates.add(cb.equal(tagJoin.get("slug"), tagSlug));
                if (query != null) {
                    query.distinct(true);
                }
            }
            if (keyword != null && !keyword.isBlank()) {
                String pattern = JpaLike.contains(keyword.trim());
                predicates.add(cb.or(
                        cb.like(root.get("title"), pattern, JpaLike.ESCAPE),
                        cb.like(root.get("summary"), pattern, JpaLike.ESCAPE)
                ));
            }
            return cb.and(predicates.toArray(Predicate[]::new));
        };

        Pageable pageable = PageRequest.of(
                page - 1,
                pageSize,
                Sort.by(Sort.Order.desc("pinned"), Sort.Order.desc("createdAt")));

        Page<Article> result = articleRepository.findAll(spec, pageable);
        List<Article> articles = result.getContent();

        Map<Integer, Long> commentCounts = articles.isEmpty()
                ? Map.of()
                : CategoryService.toCountMap(commentRepository.countApprovedByArticleIds(
                        articles.stream().map(Article::getId).toList()));

        List<ArticleDtos.ArticleListItemDto> items = articles.stream()
                .map(a -> articleMapper.toListItemDto(a, commentCounts.getOrDefault(a.getId(), 0L)))
                .toList();

        return PageResult.of(items, result.getTotalElements(), page, pageSize);
    }

    @Transactional(readOnly = true)
    public ArticleDtos.ArticleDetailDto getArticleBySlug(String slug, boolean isAdmin) {
        Article article = articleRepository.findBySlug(slug)
                .orElseThrow(() -> new NotFoundException("文章不存在或已被删除"));

        if (!article.isPublished() && !isAdmin) {
            throw new NotFoundException("文章不存在或已被删除");
        }

        long commentCount = commentRepository.countByArticleIdAndApprovedTrue(article.getId());
        ArticleDtos.ArticleDetailDto dto = articleMapper.toDetailDto(article, commentCount);
        viewCountService.incrementArticleViewsAsync(article.getId());
        return dto;
    }

    @Transactional
    @Caching(evict = {
            @CacheEvict(value = CachingConfig.ARTICLE_LIST_CACHE_NAME, allEntries = true),
            @CacheEvict(value = CachingConfig.CATEGORY_CACHE_NAME, allEntries = true),
            @CacheEvict(value = CachingConfig.TAG_CACHE_NAME, allEntries = true),
            @CacheEvict(value = CachingConfig.STATS_CACHE_NAME, allEntries = true)
    })
    public ArticleDtos.ArticleDetailDto createArticle(ArticleDtos.CreateArticleRequest request, Integer authorId) {
        if (articleRepository.existsBySlug(request.slug())) {
            throw BusinessException.conflict("该 Slug 标识已存在，请更换");
        }

        User author = userRepository.findById(authorId)
                .orElseThrow(() -> new NotFoundException("作者用户不存在"));

        int readingTime = request.readingTimeOrDefault() > 0
                ? request.readingTimeOrDefault()
                : estimateReadingTime(request.content());

        Article article = new Article();
        article.setSlug(request.slug());
        article.setTitle(request.title());
        article.setSummary(request.summary());
        article.setContent(request.content());
        article.setCoverImage(request.coverImage());
        article.setPublished(request.publishedOrDefault());
        article.setPinned(request.pinnedOrDefault());
        article.setReadingTime(readingTime);
        article.setAuthor(author);

        if (request.categoryId() != null) {
            Category category = categoryRepository.findById(request.categoryId())
                    .orElseThrow(() -> BusinessException.badRequest("指定的文章分类不存在"));
            article.setCategory(category);
        }

        if (!request.tagIdsOrEmpty().isEmpty()) {
            article.setTags(resolveTags(request.tagIdsOrEmpty()));
        }

        Article saved = articleRepository.save(article);
        return articleMapper.toDetailDto(saved, 0L);
    }

    @Transactional
    @Caching(evict = {
            @CacheEvict(value = CachingConfig.ARTICLE_LIST_CACHE_NAME, allEntries = true),
            @CacheEvict(value = CachingConfig.CATEGORY_CACHE_NAME, allEntries = true),
            @CacheEvict(value = CachingConfig.TAG_CACHE_NAME, allEntries = true),
            @CacheEvict(value = CachingConfig.STATS_CACHE_NAME, allEntries = true)
    })
    public ArticleDtos.ArticleDetailDto updateArticle(Integer id, ArticleDtos.UpdateArticleRequest request) {
        Article article = articleRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("资源不存在或已被删除"));

        if (request.getSlug() != null && articleRepository.existsBySlugAndIdNot(request.getSlug(), id)) {
            throw BusinessException.conflict("该 Slug 标识已被占用");
        }

        if (request.getSlug() != null) {
            article.setSlug(request.getSlug());
        }
        if (request.getTitle() != null) {
            article.setTitle(request.getTitle());
        }
        if (request.getSummary() != null) {
            article.setSummary(request.getSummary());
        }
        if (request.getContent() != null) {
            article.setContent(request.getContent());
        }
        if (request.isCoverImageSet()) {
            article.setCoverImage(request.getCoverImage());
        }
        if (request.getIsPublished() != null) {
            article.setPublished(request.getIsPublished());
        }
        if (request.getIsPinned() != null) {
            article.setPinned(request.getIsPinned());
        }

        Integer estimatedReadingTime = request.getReadingTime();
        if (request.getContent() != null && (estimatedReadingTime == null || estimatedReadingTime == 0)) {
            estimatedReadingTime = estimateReadingTime(request.getContent());
        }
        if (estimatedReadingTime != null) {
            article.setReadingTime(estimatedReadingTime);
        }

        if (request.isCategoryIdSet()) {
            if (request.getCategoryId() == null) {
                article.setCategory(null);
            } else {
                Category category = categoryRepository.findById(request.getCategoryId())
                        .orElseThrow(() -> BusinessException.badRequest("指定的文章分类不存在"));
                article.setCategory(category);
            }
        }

        if (request.isTagIdsSet()) {
            List<Integer> tagIds = request.getTagIds() != null ? request.getTagIds() : List.of();
            article.setTags(resolveTags(tagIds));
        }

        Article saved = articleRepository.save(article);
        long commentCount = commentRepository.countByArticleIdAndApprovedTrue(saved.getId());
        return articleMapper.toDetailDto(saved, commentCount);
    }

    @Transactional
    @Caching(evict = {
            @CacheEvict(value = CachingConfig.ARTICLE_LIST_CACHE_NAME, allEntries = true),
            @CacheEvict(value = CachingConfig.CATEGORY_CACHE_NAME, allEntries = true),
            @CacheEvict(value = CachingConfig.TAG_CACHE_NAME, allEntries = true),
            @CacheEvict(value = CachingConfig.STATS_CACHE_NAME, allEntries = true)
    })
    public void deleteArticle(Integer id) {
        if (!articleRepository.existsById(id)) {
            throw new NotFoundException("资源不存在或已被删除");
        }
        articleRepository.deleteById(id);
    }

    static int estimateReadingTime(String content) {
        return Math.max(1, (int) Math.ceil(content.length() / 350.0));
    }

    private Set<Tag> resolveTags(List<Integer> requestedIds) {
        Set<Integer> uniqueIds = new LinkedHashSet<>(requestedIds);
        if (uniqueIds.isEmpty()) {
            return new LinkedHashSet<>();
        }
        if (uniqueIds.stream().anyMatch(id -> id == null || id <= 0)) {
            throw BusinessException.badRequest("标签 ID 必须为正整数");
        }
        Set<Tag> tags = new LinkedHashSet<>(tagRepository.findAllById(uniqueIds));
        if (tags.size() != uniqueIds.size()) {
            throw BusinessException.badRequest("指定的部分文章标签不存在");
        }
        return tags;
    }
}
