package top.mysgarden.garden.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

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
import top.mysgarden.garden.dto.InteractionDtos;
import top.mysgarden.garden.dto.PageResult;
import top.mysgarden.garden.exception.NotFoundException;
import top.mysgarden.garden.mapper.EssayMapper;
import top.mysgarden.garden.model.Essay;
import top.mysgarden.garden.model.User;
import top.mysgarden.garden.repository.CommentRepository;
import top.mysgarden.garden.repository.EssayRepository;
import top.mysgarden.garden.repository.UserRepository;
import top.mysgarden.garden.util.JpaLike;

@Service
@RequiredArgsConstructor
public class EssayService {

    private final EssayRepository essayRepository;
    private final UserRepository userRepository;
    private final CommentRepository commentRepository;
    private final EssayMapper essayMapper;

    @Transactional(readOnly = true)
    @Cacheable(
            value = CachingConfig.ESSAY_LIST_CACHE_NAME,
            condition = "!#includeUnpublished",
            key = "#page + ':' + #pageSize + ':' + (#mood ?: '')"
    )
    public PageResult<InteractionDtos.EssayDto> listEssays(
            int page,
            int pageSize,
            String mood,
            boolean includeUnpublished) {

        Specification<Essay> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (!includeUnpublished) {
                predicates.add(cb.isTrue(root.get("published")));
            }
            if (mood != null && !mood.isBlank()) {
                predicates.add(cb.like(root.get("mood"), JpaLike.contains(mood.trim()), JpaLike.ESCAPE));
            }
            return cb.and(predicates.toArray(Predicate[]::new));
        };

        Pageable pageable = PageRequest.of(
                page - 1,
                pageSize,
                Sort.by(Sort.Order.desc("pinned"), Sort.Order.desc("createdAt")));

        Page<Essay> result = essayRepository.findAll(spec, pageable);
        List<Essay> essays = result.getContent();

        Map<Integer, Long> commentCounts = essays.isEmpty()
                ? Map.of()
                : CategoryService.toCountMap(commentRepository.countApprovedByEssayIds(
                        essays.stream().map(Essay::getId).toList()));

        List<InteractionDtos.EssayDto> items = essays.stream()
                .map(e -> essayMapper.toDto(e, commentCounts.getOrDefault(e.getId(), 0L)))
                .toList();

        return PageResult.of(items, result.getTotalElements(), page, pageSize);
    }

    @Transactional
    @Caching(evict = {
            @CacheEvict(value = CachingConfig.ESSAY_LIST_CACHE_NAME, allEntries = true),
            @CacheEvict(value = CachingConfig.STATS_CACHE_NAME, allEntries = true)
    })
    public InteractionDtos.EssayDto createEssay(InteractionDtos.CreateEssayRequest request, Integer authorId) {
        User author = userRepository.findById(authorId)
                .orElseThrow(() -> new NotFoundException("作者用户不存在"));

        Essay essay = new Essay();
        essay.setContent(request.content());
        essay.setMood(request.mood());
        essay.setWeather(request.weather());
        essay.setLocation(request.location());
        essay.setImages(request.images());
        essay.setPinned(request.pinnedOrDefault());
        essay.setPublished(request.publishedOrDefault());
        essay.setAuthor(author);

        Essay saved = essayRepository.save(essay);
        return essayMapper.toDto(saved, null);
    }

    @Transactional
    @CacheEvict(value = CachingConfig.ESSAY_LIST_CACHE_NAME, allEntries = true)
    public InteractionDtos.EssayLikeDto likeEssay(Integer id) {
        int updatedRows = essayRepository.incrementLikes(id);
        if (updatedRows == 0) {
            throw new NotFoundException("资源不存在或已被删除");
        }
        Essay essay = essayRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("资源不存在或已被删除"));
        return new InteractionDtos.EssayLikeDto(essay.getId(), essay.getLikes());
    }

    @Transactional
    @Caching(evict = {
            @CacheEvict(value = CachingConfig.ESSAY_LIST_CACHE_NAME, allEntries = true),
            @CacheEvict(value = CachingConfig.STATS_CACHE_NAME, allEntries = true)
    })
    public void deleteEssay(Integer id) {
        if (!essayRepository.existsById(id)) {
            throw new NotFoundException("资源不存在或已被删除");
        }
        essayRepository.deleteById(id);
    }
}
