package top.mysgarden.garden.service;

import java.util.List;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import top.mysgarden.garden.dto.InteractionDtos;
import top.mysgarden.garden.mapper.CategoryMapper;
import top.mysgarden.garden.mapper.NotebookMapper;
import top.mysgarden.garden.model.Article;
import top.mysgarden.garden.model.Essay;
import top.mysgarden.garden.model.Note;
import top.mysgarden.garden.repository.ArticleRepository;
import top.mysgarden.garden.repository.EssayRepository;
import top.mysgarden.garden.repository.NoteRepository;
import top.mysgarden.garden.util.JpaLike;

@Service
@RequiredArgsConstructor
public class SearchService {

    private final ArticleRepository articleRepository;
    private final NoteRepository noteRepository;
    private final EssayRepository essayRepository;
    private final CategoryMapper categoryMapper;
    private final NotebookMapper notebookMapper;
    private final NoteVisibilityService noteVisibilityService;

    @Transactional(readOnly = true)
    public InteractionDtos.SearchResponseDto search(String rawQuery) {
        String q = rawQuery != null ? rawQuery.trim() : "";
        if (q.isEmpty()) {
            return new InteractionDtos.SearchResponseDto(List.of(), List.of(), List.of());
        }

        String pattern = JpaLike.contains(q);
        Sort newestFirst = Sort.by(Sort.Order.desc("createdAt"), Sort.Order.asc("id"));

        Specification<Article> articleSpec = (root, query, cb) -> cb.and(
                cb.isTrue(root.get("published")),
                cb.or(
                        cb.like(root.get("title"), pattern, JpaLike.ESCAPE),
                        cb.like(root.get("summary"), pattern, JpaLike.ESCAPE),
                        cb.like(root.get("content"), pattern, JpaLike.ESCAPE)
                )
        );
        List<InteractionDtos.SearchArticleItemDto> articles = articleRepository
                .findAll(articleSpec, PageRequest.of(0, 8, newestFirst))
                .getContent()
                .stream()
                .map(a -> new InteractionDtos.SearchArticleItemDto(
                        a.getId(),
                        a.getSlug(),
                        a.getTitle(),
                        a.getSummary(),
                        a.getCreatedAt(),
                        categoryMapper.toNameSlugDto(a.getCategory())))
                .toList();

        Specification<Note> noteSpec = noteVisibilityService.publicNotes().and((root, query, cb) -> cb.or(
                        cb.like(root.get("title"), pattern, JpaLike.ESCAPE),
                        cb.like(root.get("summary"), pattern, JpaLike.ESCAPE),
                        cb.like(root.get("content"), pattern, JpaLike.ESCAPE)
        ));
        List<InteractionDtos.SearchNoteItemDto> notes = noteRepository
                .findAll(noteSpec, PageRequest.of(0, 8, newestFirst))
                .getContent()
                .stream()
                .map(n -> new InteractionDtos.SearchNoteItemDto(
                        n.getId(),
                        n.getSlug(),
                        n.getTitle(),
                        n.getSummary(),
                        n.getCreatedAt(),
                        notebookMapper.toNameSlugDto(n.getNotebook())))
                .toList();

        Specification<Essay> essaySpec = (root, query, cb) -> cb.and(
                cb.isTrue(root.get("published")),
                cb.like(root.get("content"), pattern, JpaLike.ESCAPE)
        );
        List<InteractionDtos.SearchEssayItemDto> essays = essayRepository
                .findAll(essaySpec, PageRequest.of(0, 6, newestFirst))
                .getContent()
                .stream()
                .map(e -> new InteractionDtos.SearchEssayItemDto(
                        e.getId(),
                        e.getContent(),
                        e.getMood(),
                        e.getCreatedAt()))
                .toList();

        return new InteractionDtos.SearchResponseDto(articles, notes, essays);
    }
}
