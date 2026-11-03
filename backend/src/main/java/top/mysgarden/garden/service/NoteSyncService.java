package top.mysgarden.garden.service;

import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Caching;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import top.mysgarden.garden.config.CachingConfig;
import top.mysgarden.garden.dto.NoteDtos;
import top.mysgarden.garden.exception.BusinessException;
import top.mysgarden.garden.model.Note;
import top.mysgarden.garden.model.Notebook;
import top.mysgarden.garden.model.Tag;
import top.mysgarden.garden.model.User;
import top.mysgarden.garden.repository.NoteRepository;
import top.mysgarden.garden.repository.NotebookRepository;
import top.mysgarden.garden.repository.TagRepository;
import top.mysgarden.garden.repository.UserRepository;
import top.mysgarden.garden.util.SlugUtils;

/**
 * 本地 Markdown 知识库增量同步服务，事务内完成多级目录与笔记的幂等 Upsert，
 * 行为与原 {@code server/api/v1/notes/sync.post.ts} 完全一致。
 */
@Service
@RequiredArgsConstructor
public class NoteSyncService {

    private final UserRepository userRepository;
    private final NotebookRepository notebookRepository;
    private final NoteRepository noteRepository;
    private final TagRepository tagRepository;

    @Transactional
    @Caching(evict = {
            @CacheEvict(value = CachingConfig.TAG_CACHE_NAME, allEntries = true),
            @CacheEvict(value = CachingConfig.CATEGORY_CACHE_NAME, allEntries = true),
            @CacheEvict(value = CachingConfig.STATS_CACHE_NAME, allEntries = true)
    })
    public NoteDtos.NoteSyncResultDto syncNotes(NoteDtos.NoteSyncRequest request) {
        User adminAuthor = userRepository.findFirstByRoleOrderByIdAsc("admin")
                .orElseThrow(() -> BusinessException.conflict("尚未初始化管理员账号，无法同步笔记"));

        int created = 0;
        int updated = 0;
        Map<String, Integer> notebookIds = new HashMap<>();

        List<NoteDtos.SyncDirectoryItem> sortedDirs = request.directoriesOrEmpty().stream()
                .sorted(Comparator.comparingInt(d -> d.path().trim().split("/").length))
                .toList();

        for (NoteDtos.SyncDirectoryItem dir : sortedDirs) {
            String path = dir.path().trim();
            String parentPath = (dir.parentPath() != null && !dir.parentPath().isBlank())
                    ? dir.parentPath().trim()
                    : null;
            Integer parentId = null;
            if (parentPath != null) {
                parentId = notebookIds.get(parentPath);
                if (parentId == null) {
                    throw BusinessException.unprocessable("目录缺少父级：" + path);
                }
            }

            Notebook nb = notebookRepository.findByPath(path).orElseGet(Notebook::new);
            if (nb.getId() == null) {
                nb.setPath(path);
            }
            nb.setName(dir.name().trim());
            nb.setSlug(dir.slug().trim());
            nb.setDescription(dir.description() != null ? dir.description().trim() : "");
            nb.setIcon(dir.icon().trim());
            nb.setParentId(parentId);
            Notebook savedNb = notebookRepository.save(nb);
            notebookIds.put(path, savedNb.getId());
        }

        for (NoteDtos.SyncNoteItem item : request.notes()) {
            String dirPath = (item.directoryPath() != null && !item.directoryPath().isBlank())
                    ? item.directoryPath().trim()
                    : null;
            Notebook notebook = null;
            if (dirPath != null) {
                notebook = notebookRepository.findByPath(dirPath)
                        .orElseThrow(() -> BusinessException.unprocessable("笔记目录不存在：" + dirPath));
            }

            Set<Tag> noteTags = new LinkedHashSet<>();
            for (String tagName : item.distinctTrimmedTags()) {
                Tag tag = tagRepository.findByName(tagName).orElseGet(() -> {
                    Tag t = new Tag();
                    t.setName(tagName);
                    t.setSlug(SlugUtils.createSyncTagSlug(tagName));
                    return tagRepository.save(t);
                });
                noteTags.add(tag);
            }

            String sourcePath = item.sourcePath().trim();
            Note existing = noteRepository.findBySourcePath(sourcePath).orElse(null);
            if (existing != null) {
                existing.setTitle(item.title().trim());
                existing.setSummary(item.summary().trim());
                existing.setContent(item.content().trim());
                existing.setSourcePath(sourcePath);
                existing.setNotebook(notebook);
                existing.setPublished(true);
                existing.setEncrypted(false);
                existing.setTags(noteTags);
                noteRepository.save(existing);
                updated += 1;
            } else {
                Note createdNote = new Note();
                createdNote.setTitle(item.title().trim());
                createdNote.setSlug(item.slug().trim());
                createdNote.setSummary(item.summary().trim());
                createdNote.setContent(item.content().trim());
                createdNote.setSourcePath(sourcePath);
                createdNote.setNotebook(notebook);
                createdNote.setAuthor(adminAuthor);
                createdNote.setPublished(true);
                createdNote.setEncrypted(false);
                createdNote.setTags(noteTags);
                noteRepository.save(createdNote);
                created += 1;
            }
        }

        return new NoteDtos.NoteSyncResultDto(created, updated);
    }
}
