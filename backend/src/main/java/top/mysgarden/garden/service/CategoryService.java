package top.mysgarden.garden.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import top.mysgarden.garden.config.CachingConfig;
import top.mysgarden.garden.dto.TaxonomyDtos;
import top.mysgarden.garden.exception.BusinessException;
import top.mysgarden.garden.mapper.CategoryMapper;
import top.mysgarden.garden.mapper.TagMapper;
import top.mysgarden.garden.model.Category;
import top.mysgarden.garden.repository.ArticleRepository;
import top.mysgarden.garden.repository.CategoryRepository;
import top.mysgarden.garden.repository.TagRepository;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final TagRepository tagRepository;
    private final ArticleRepository articleRepository;
    private final CategoryMapper categoryMapper;
    private final TagMapper tagMapper;

    @Transactional(readOnly = true)
    @Cacheable(value = CachingConfig.CATEGORY_CACHE_NAME, key = "'overview'")
    public TaxonomyDtos.CategoriesOverviewDto getCategoriesAndTags() {
        Map<Integer, Long> catCounts = toCountMap(articleRepository.countPublishedByCategory());
        Map<Integer, Long> tagCounts = toCountMap(articleRepository.countPublishedByTag());

        List<TaxonomyDtos.CategoryDto> categories = categoryRepository.findAll().stream()
                .map(c -> categoryMapper.toDto(c, catCounts.getOrDefault(c.getId(), 0L)))
                .toList();

        List<TaxonomyDtos.TagDto> tags = tagRepository.findAll().stream()
                .map(t -> tagMapper.toDto(t, tagCounts.getOrDefault(t.getId(), 0L), null))
                .toList();

        return new TaxonomyDtos.CategoriesOverviewDto(categories, tags);
    }

    @Transactional
    @Caching(evict = {
            @CacheEvict(value = CachingConfig.CATEGORY_CACHE_NAME, allEntries = true),
            @CacheEvict(value = CachingConfig.STATS_CACHE_NAME, allEntries = true)
    })
    public TaxonomyDtos.CategoryDto createCategory(TaxonomyDtos.CreateCategoryRequest request) {
        if (categoryRepository.existsBySlug(request.slug())) {
            throw BusinessException.conflict("该分类 Slug 标识已存在");
        }
        if (categoryRepository.existsByName(request.name())) {
            throw BusinessException.conflict("该分类名称已存在");
        }
        Category category = new Category();
        category.setName(request.name());
        category.setSlug(request.slug());
        category.setDescription((request.description() != null && !request.description().isBlank())
                ? request.description()
                : null);
        Category saved = categoryRepository.save(category);
        return categoryMapper.toDto(saved);
    }

    static Map<Integer, Long> toCountMap(List<Object[]> rows) {
        Map<Integer, Long> map = new HashMap<>();
        for (Object[] row : rows) {
            if (row[0] instanceof Number id && row[1] instanceof Number cnt) {
                map.put(id.intValue(), cnt.longValue());
            }
        }
        return map;
    }
}
