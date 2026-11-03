package top.mysgarden.garden.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import top.mysgarden.garden.repository.ArticleRepository;
import top.mysgarden.garden.repository.NoteRepository;

/**
 * 浏览量异步原子递增服务（独立 Bean 保证 Spring @Async 代理生效，且不刷新实体的 updated_at）。
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ViewCountService {

    private final ArticleRepository articleRepository;
    private final NoteRepository noteRepository;

    @Async("viewCountExecutor")
    @Transactional
    public void incrementArticleViewsAsync(Integer articleId) {
        try {
            articleRepository.incrementViews(articleId);
        } catch (Exception ex) {
            log.warn("递增文章浏览量失败 (id={}): {}", articleId, ex.getMessage());
        }
    }

    @Async("viewCountExecutor")
    @Transactional
    public void incrementNoteViewsAsync(Integer noteId) {
        try {
            noteRepository.incrementViews(noteId);
        } catch (Exception ex) {
            log.warn("递增笔记浏览量失败 (id={}): {}", noteId, ex.getMessage());
        }
    }
}
