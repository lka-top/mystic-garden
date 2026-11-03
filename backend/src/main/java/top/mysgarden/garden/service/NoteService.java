package top.mysgarden.garden.service;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Caching;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import top.mysgarden.garden.config.CachingConfig;
import top.mysgarden.garden.dto.NoteDtos;
import top.mysgarden.garden.dto.PageResult;
import top.mysgarden.garden.exception.BusinessException;
import top.mysgarden.garden.exception.NotFoundException;
import top.mysgarden.garden.mapper.NoteMapper;
import top.mysgarden.garden.model.Note;
import top.mysgarden.garden.model.Notebook;
import top.mysgarden.garden.model.Tag;
import top.mysgarden.garden.model.User;
import top.mysgarden.garden.repository.NoteRepository;
import top.mysgarden.garden.repository.NotebookRepository;
import top.mysgarden.garden.repository.TagRepository;
import top.mysgarden.garden.repository.UserRepository;
import top.mysgarden.garden.util.JpaLike;

@Service
@RequiredArgsConstructor
public class NoteService {

    private final NoteRepository noteRepository;
    private final NotebookRepository notebookRepository;
    private final TagRepository tagRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final NoteMapper noteMapper;
    private final ViewCountService viewCountService;
    private final NoteVisibilityService noteVisibilityService;

    @Transactional(readOnly = true)
    public PageResult<NoteDtos.NoteListItemDto> listNotes(
            int page,
            int pageSize,
            String notebookSlug,
            String tagSlug,
            String keyword,
            boolean includeUnpublished,
            boolean isAdmin) {

        String targetPath;
        if (notebookSlug != null && !notebookSlug.isBlank()) {
            Optional<Notebook> nbOpt = notebookRepository.findBySlug(notebookSlug);
            if (nbOpt.isEmpty()) {
                return PageResult.of(List.of(), 0L, page, pageSize);
            }
            targetPath = nbOpt.get().getPath();
        } else {
            targetPath = null;
        }

        Specification<Note> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (!includeUnpublished) {
                predicates.add(cb.isTrue(root.get("published")));
            }
            if (targetPath != null) {
                Join<Note, Notebook> nbJoin = root.join("notebook", JoinType.INNER);
                predicates.add(cb.or(
                        cb.equal(nbJoin.get("path"), targetPath),
                        cb.like(nbJoin.get("path"), JpaLike.escape(targetPath) + "/%", JpaLike.ESCAPE)
                ));
            }
            if (tagSlug != null && !tagSlug.isBlank()) {
                Join<Note, Tag> tagJoin = root.join("tags", JoinType.INNER);
                predicates.add(cb.equal(tagJoin.get("slug"), tagSlug));
                if (query != null) {
                    query.distinct(true);
                }
            }
            if (keyword != null && !keyword.isBlank()) {
                String pattern = JpaLike.contains(keyword.trim());
                predicates.add(cb.or(
                        cb.like(root.get("title"), pattern, JpaLike.ESCAPE),
                        cb.like(root.get("summary"), pattern, JpaLike.ESCAPE),
                        cb.like(root.get("content"), pattern, JpaLike.ESCAPE)
                ));
            }
            return cb.and(predicates.toArray(Predicate[]::new));
        };

        if (!isAdmin) {
            spec = noteVisibilityService.publicNotes().and(spec);
        }

        Pageable pageable = PageRequest.of(
                page - 1,
                pageSize,
                Sort.by(Sort.Order.desc("pinned"), Sort.Order.desc("createdAt"), Sort.Order.asc("id")));

        Page<Note> result = noteRepository.findAll(spec, pageable);
        List<NoteDtos.NoteListItemDto> items = result.getContent().stream()
                .map(noteMapper::toListItemDto)
                .toList();
        return PageResult.of(items, result.getTotalElements(), page, pageSize);
    }

    @Transactional(readOnly = true)
    public NoteDtos.NoteDetailDto getNoteBySlug(String slug, boolean isAdmin) {
        Note note = noteRepository.findBySlug(slug)
                .orElseThrow(() -> new NotFoundException("笔记不存在或已被删除"));

        if (!isAdmin && !noteVisibilityService.isPublic(note)) {
            throw new NotFoundException("笔记不存在或已被删除");
        }

        NoteDtos.NoteDetailDto dto = noteMapper.toDetailDto(note);
        viewCountService.incrementNoteViewsAsync(note.getId());
        return dto;
    }

    @Transactional
    @Caching(evict = {
            @CacheEvict(value = CachingConfig.TAG_CACHE_NAME, allEntries = true),
            @CacheEvict(value = CachingConfig.STATS_CACHE_NAME, allEntries = true)
    })
    public NoteDtos.NoteDetailDto createNote(NoteDtos.CreateNoteRequest request, Integer authorId) {
        if (noteRepository.existsBySlug(request.slug())) {
            throw BusinessException.conflict("该 Slug 标识已存在，请更换");
        }
        User author = userRepository.findById(authorId)
                .orElseThrow(() -> new NotFoundException("作者用户不存在"));

        Note note = new Note();
        note.setTitle(request.title());
        note.setSlug(request.slug());
        note.setSummary(request.summary());
        note.setContent(request.content());
        note.setPinned(request.pinnedOrDefault());
        note.setPublished(request.publishedOrDefault());
        note.setEncrypted(request.encryptedOrDefault());
        note.setPassword((request.password() != null && !request.password().isBlank())
                ? passwordEncoder.encode(request.password())
                : null);
        note.setAuthor(author);

        if (request.notebookId() != null) {
            Notebook nb = notebookRepository.findById(request.notebookId())
                    .orElseThrow(() -> BusinessException.badRequest("指定的笔记本不存在"));
            note.setNotebook(nb);
        }
        if (!request.tagIdsOrEmpty().isEmpty()) {
            note.setTags(resolveTags(request.tagIdsOrEmpty()));
        }

        Note saved = noteRepository.save(note);
        return noteMapper.toDetailDto(saved);
    }

    @Transactional
    @Caching(evict = {
            @CacheEvict(value = CachingConfig.TAG_CACHE_NAME, allEntries = true),
            @CacheEvict(value = CachingConfig.STATS_CACHE_NAME, allEntries = true)
    })
    public NoteDtos.NoteDetailDto updateNote(Integer id, NoteDtos.UpdateNoteRequest request) {
        Note note = noteRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("资源不存在或已被删除"));

        if (request.getSlug() != null && noteRepository.existsBySlugAndIdNot(request.getSlug(), id)) {
            throw BusinessException.conflict("该 Slug 标识已被占用");
        }

        if (request.getTitle() != null) {
            note.setTitle(request.getTitle());
        }
        if (request.getSlug() != null) {
            note.setSlug(request.getSlug());
        }
        if (request.isSummarySet()) {
            note.setSummary(request.getSummary());
        }
        if (request.getContent() != null) {
            note.setContent(request.getContent());
        }
        if (request.getIsPinned() != null) {
            note.setPinned(request.getIsPinned());
        }
        if (request.getIsPublished() != null) {
            note.setPublished(request.getIsPublished());
        }
        if (request.getIsEncrypted() != null) {
            note.setEncrypted(request.getIsEncrypted());
        }
        if (request.isPasswordSet()) {
            note.setPassword((request.getPassword() != null && !request.getPassword().isBlank())
                    ? passwordEncoder.encode(request.getPassword())
                    : null);
        }
        if (request.isNotebookIdSet()) {
            if (request.getNotebookId() == null) {
                note.setNotebook(null);
            } else {
                Notebook nb = notebookRepository.findById(request.getNotebookId())
                        .orElseThrow(() -> BusinessException.badRequest("指定的笔记本不存在"));
                note.setNotebook(nb);
            }
        }
        if (request.isTagIdsSet()) {
            List<Integer> tagIds = request.getTagIds() != null ? request.getTagIds() : List.of();
            note.setTags(resolveTags(tagIds));
        }

        Note saved = noteRepository.save(note);
        return noteMapper.toDetailDto(saved);
    }

    @Transactional
    @Caching(evict = {
            @CacheEvict(value = CachingConfig.TAG_CACHE_NAME, allEntries = true),
            @CacheEvict(value = CachingConfig.STATS_CACHE_NAME, allEntries = true)
    })
    public void deleteNote(Integer id) {
        if (!noteRepository.existsById(id)) {
            throw new NotFoundException("资源不存在或已被删除");
        }
        noteRepository.deleteById(id);
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
            throw BusinessException.badRequest("指定的部分笔记标签不存在");
        }
        return tags;
    }
}
