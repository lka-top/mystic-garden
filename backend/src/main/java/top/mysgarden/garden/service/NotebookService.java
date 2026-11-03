package top.mysgarden.garden.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import top.mysgarden.garden.config.CachingConfig;
import top.mysgarden.garden.dto.NoteDtos;
import top.mysgarden.garden.exception.BusinessException;
import top.mysgarden.garden.mapper.NotebookMapper;
import top.mysgarden.garden.model.Notebook;
import top.mysgarden.garden.repository.NoteRepository;
import top.mysgarden.garden.repository.NotebookRepository;

@Service
@RequiredArgsConstructor
public class NotebookService {

    private final NotebookRepository notebookRepository;
    private final NoteRepository noteRepository;
    private final NotebookMapper notebookMapper;
    private final NoteVisibilityService noteVisibilityService;

    @Transactional(readOnly = true)
    public List<NoteDtos.NotebookDto> listNotebooks(boolean isAdmin) {
        Set<Integer> privateIds = isAdmin ? Set.of() : noteVisibilityService.privateNotebookIds();
        List<Notebook> notebooks = isAdmin
                ? notebookRepository.findAllByOrderBySortOrderAscCreatedAtAsc()
                : notebookRepository.findAllByOrderBySortOrderAscCreatedAtAsc().stream()
                        .filter(nb -> !privateIds.contains(nb.getId()))
                        .toList();

        Map<Integer, Long> directCounts = CategoryService.toCountMap(isAdmin
                ? noteRepository.countPublishedByNotebook()
                : noteRepository.countPublicByNotebook());
        Map<Integer, List<Integer>> childrenByParent = new HashMap<>();
        Map<Integer, Notebook> byId = new HashMap<>();

        for (Notebook nb : notebooks) {
            byId.put(nb.getId(), nb);
            childrenByParent.computeIfAbsent(nb.getParentId(), k -> new ArrayList<>()).add(nb.getId());
        }

        Map<Integer, Long> memo = new HashMap<>();
        return notebooks.stream()
                .map(nb -> notebookMapper.toDto(
                        nb,
                        countRecursive(nb.getId(), byId, childrenByParent, directCounts, memo)))
                .toList();
    }

    private static long countRecursive(
            Integer id,
            Map<Integer, Notebook> byId,
            Map<Integer, List<Integer>> childrenByParent,
            Map<Integer, Long> directCounts,
            Map<Integer, Long> memo) {

        Long cached = memo.get(id);
        if (cached != null) {
            return cached;
        }
        if (!byId.containsKey(id)) {
            return 0L;
        }
        long total = directCounts.getOrDefault(id, 0L);
        for (Integer childId : childrenByParent.getOrDefault(id, List.of())) {
            total += countRecursive(childId, byId, childrenByParent, directCounts, memo);
        }
        memo.put(id, total);
        return total;
    }

    @Transactional
    @CacheEvict(value = CachingConfig.STATS_CACHE_NAME, allEntries = true)
    public NoteDtos.NotebookDto createNotebook(NoteDtos.CreateNotebookRequest request) {
        if (notebookRepository.existsBySlug(request.slug())) {
            throw BusinessException.conflict("该笔记本 Slug 已存在");
        }
        if (request.parentId() != null && !notebookRepository.existsById(request.parentId())) {
            throw BusinessException.badRequest("指定的父级笔记本不存在");
        }
        Notebook nb = new Notebook();
        nb.setName(request.name());
        nb.setSlug(request.slug());
        nb.setPath((request.path() != null && !request.path().isBlank()) ? request.path() : request.slug());
        nb.setParentId(request.parentId());
        nb.setDescription(request.description());
        nb.setIcon(request.icon());
        nb.setPrivateNotebook(request.privateOrDefault());
        nb.setSortOrder(request.sortOrderOrDefault());
        Notebook saved = notebookRepository.save(nb);
        return notebookMapper.toDto(saved);
    }
}
