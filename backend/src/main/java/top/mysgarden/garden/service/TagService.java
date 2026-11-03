package top.mysgarden.garden.service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ThreadLocalRandom;

import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import top.mysgarden.garden.config.CachingConfig;
import top.mysgarden.garden.dto.TaxonomyDtos;
import top.mysgarden.garden.mapper.TagMapper;
import top.mysgarden.garden.model.Tag;
import top.mysgarden.garden.repository.ArticleRepository;
import top.mysgarden.garden.repository.NoteRepository;
import top.mysgarden.garden.repository.TagRepository;
import top.mysgarden.garden.util.SlugUtils;

@Service
@RequiredArgsConstructor
public class TagService {

    private final TagRepository tagRepository;
    private final ArticleRepository articleRepository;
    private final NoteRepository noteRepository;
    private final TagMapper tagMapper;
    private final NoteVisibilityService noteVisibilityService;

    public record CreateTagOutcome(TaxonomyDtos.TagBriefDto tag, boolean alreadyExisted) {
    }

    @Transactional(readOnly = true)
    @Cacheable(value = CachingConfig.TAG_CACHE_NAME, key = "'all'")
    public List<TaxonomyDtos.TagDto> listTags() {
        Map<Integer, Long> articleCounts = CategoryService.toCountMap(articleRepository.countAllByTag());
        Map<Integer, Long> noteCounts = CategoryService.toCountMap(
                noteRepository.countPublicByTag(noteVisibilityService.privateNotebookIdsWithSentinel()));

        return tagRepository.findAllByOrderByIdAsc().stream()
                .map(t -> tagMapper.toDto(
                        t,
                        articleCounts.getOrDefault(t.getId(), 0L),
                        noteCounts.getOrDefault(t.getId(), 0L)))
                .toList();
    }

    @Transactional
    @Caching(evict = {
            @CacheEvict(value = CachingConfig.TAG_CACHE_NAME, allEntries = true),
            @CacheEvict(value = CachingConfig.CATEGORY_CACHE_NAME, allEntries = true),
            @CacheEvict(value = CachingConfig.STATS_CACHE_NAME, allEntries = true)
    })
    public CreateTagOutcome createTag(TaxonomyDtos.CreateTagRequest request) {
        String cleanName = request.name().trim();
        Optional<Tag> existing = tagRepository.findByName(cleanName);
        if (existing.isPresent()) {
            return new CreateTagOutcome(tagMapper.toBriefDto(existing.get()), true);
        }

        String slug = (request.slug() != null && !request.slug().isBlank())
                ? request.slug().trim()
                : SlugUtils.toSlug(cleanName);
        if (slug.isEmpty()) {
            slug = "tag-" + System.currentTimeMillis();
        }
        if (tagRepository.findBySlug(slug).isPresent()) {
            slug = slug + "-" + ThreadLocalRandom.current().nextInt(1000);
        }

        Tag tag = new Tag();
        tag.setName(cleanName);
        tag.setSlug(slug);
        Tag saved = tagRepository.save(tag);
        return new CreateTagOutcome(tagMapper.toBriefDto(saved), false);
    }
}
