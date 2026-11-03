package top.mysgarden.garden.service;

import java.util.List;
import java.util.Set;

import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import top.mysgarden.garden.config.CachingConfig;
import top.mysgarden.garden.dto.InteractionDtos;
import top.mysgarden.garden.mapper.CategoryMapper;
import top.mysgarden.garden.model.Notebook;
import top.mysgarden.garden.model.Note;
import top.mysgarden.garden.repository.ArticleRepository;
import top.mysgarden.garden.repository.CategoryRepository;
import top.mysgarden.garden.repository.CommentRepository;
import top.mysgarden.garden.repository.EssayRepository;
import top.mysgarden.garden.repository.NoteRepository;
import top.mysgarden.garden.repository.NotebookRepository;
import top.mysgarden.garden.repository.TagRepository;
import top.mysgarden.garden.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class StatsService {

    private final ArticleRepository articleRepository;
    private final EssayRepository essayRepository;
    private final NoteRepository noteRepository;
    private final NotebookRepository notebookRepository;
    private final CategoryRepository categoryRepository;
    private final TagRepository tagRepository;
    private final CommentRepository commentRepository;
    private final UserRepository userRepository;
    private final CategoryMapper categoryMapper;
    private final NoteVisibilityService noteVisibilityService;

    @Transactional(readOnly = true)
    @Cacheable(value = CachingConfig.STATS_CACHE_NAME, key = "'overview'")
    public InteractionDtos.StatsOverviewResponseDto getOverview() {
        long articles = articleRepository.countByPublishedTrue();
        long essays = essayRepository.countByPublishedTrue();
        Set<Integer> privateNotebookIds = noteVisibilityService.privateNotebookIds();
        Specification<Note> publicNotes = noteVisibilityService.publicNotes(privateNotebookIds);
        long notes = noteRepository.count(publicNotes);
        long notebooks = notebookRepository.count() - privateNotebookIds.size();
        long categories = categoryRepository.count();
        long tags = tagRepository.count();
        long comments = commentRepository.countByApprovedTrue();
        long totalUsers = userRepository.count();
        long guestUsers = userRepository.countByRole("guest");
        long registeredUsers = userRepository.countByRoleIn(List.of("user", "admin"));
        long totalViews = articleRepository.sumAllViews()
                + noteRepository.sumPublicViews(privateNotebookIds.isEmpty() ? Set.of(-1) : privateNotebookIds);

        List<InteractionDtos.RecentArticleItemDto> recentArticles = articleRepository
                .findTop5ByPublishedTrueOrderByCreatedAtDesc()
                .stream()
                .map(a -> new InteractionDtos.RecentArticleItemDto(
                        a.getId(),
                        a.getSlug(),
                        a.getTitle(),
                        a.getCreatedAt(),
                        a.getViews(),
                        categoryMapper.toNameSlugDto(a.getCategory())))
                .toList();

        List<InteractionDtos.RecentEssayItemDto> recentEssays = essayRepository
                .findTop5ByPublishedTrueOrderByCreatedAtDesc()
                .stream()
                .map(e -> new InteractionDtos.RecentEssayItemDto(
                        e.getId(),
                        e.getContent(),
                        e.getMood(),
                        e.getLikes(),
                        e.getCreatedAt()))
                .toList();

        List<InteractionDtos.RecentNoteItemDto> recentNotes = noteRepository
                .findAll(publicNotes, PageRequest.of(0, 5,
                        Sort.by(Sort.Order.desc("createdAt"), Sort.Order.asc("id"))))
                .getContent()
                .stream()
                .map(n -> {
                    Notebook nb = n.getNotebook();
                    InteractionDtos.RecentNotebookInfoDto nbInfo = nb == null
                            ? null
                            : new InteractionDtos.RecentNotebookInfoDto(nb.getName(), nb.getSlug(), nb.getIcon());
                    return new InteractionDtos.RecentNoteItemDto(
                            n.getId(),
                            n.getSlug(),
                            n.getTitle(),
                            n.getCreatedAt(),
                            n.getViews(),
                            nbInfo);
                })
                .toList();

        InteractionDtos.StatsCountsDto counts = new InteractionDtos.StatsCountsDto(
                articles, essays, notes, notebooks, categories, tags, comments,
                totalUsers, guestUsers, registeredUsers, totalViews);

        return new InteractionDtos.StatsOverviewResponseDto(counts, recentArticles, recentEssays, recentNotes);
    }
}
