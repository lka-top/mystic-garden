package top.mysgarden.garden.mapper;

import java.util.List;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import top.mysgarden.garden.dto.NoteDtos;
import top.mysgarden.garden.dto.TaxonomyDtos;
import top.mysgarden.garden.model.Note;

@Component
@RequiredArgsConstructor
public class NoteMapper {

    private final NotebookMapper notebookMapper;
    private final TagMapper tagMapper;
    private final UserMapper userMapper;

    public NoteDtos.NoteListItemDto toListItemDto(Note note) {
        List<TaxonomyDtos.TagBriefDto> tags = note.getTags().stream()
                .map(tagMapper::toBriefDto)
                .toList();
        Integer notebookId = note.getNotebook() != null ? note.getNotebook().getId() : null;
        Integer authorId = note.getAuthor() != null ? note.getAuthor().getId() : null;
        return new NoteDtos.NoteListItemDto(
                note.getId(),
                note.getTitle(),
                note.getSlug(),
                note.getSourcePath(),
                note.getContent(),
                note.getSummary(),
                note.isPinned(),
                note.isPublished(),
                note.isEncrypted(),
                note.getViews(),
                notebookId,
                authorId,
                note.getCreatedAt(),
                note.getUpdatedAt(),
                notebookMapper.toBriefDto(note.getNotebook()),
                tags,
                userMapper.toSimpleAuthorDto(note.getAuthor())
        );
    }

    public NoteDtos.NoteDetailDto toDetailDto(Note note) {
        List<TaxonomyDtos.TagBriefDto> tags = note.getTags().stream()
                .map(tagMapper::toBriefDto)
                .toList();
        Integer notebookId = note.getNotebook() != null ? note.getNotebook().getId() : null;
        Integer authorId = note.getAuthor() != null ? note.getAuthor().getId() : null;
        return new NoteDtos.NoteDetailDto(
                note.getId(),
                note.getTitle(),
                note.getSlug(),
                note.getSourcePath(),
                note.getContent(),
                note.getSummary(),
                note.isPinned(),
                note.isPublished(),
                note.isEncrypted(),
                note.getViews(),
                notebookId,
                authorId,
                note.getCreatedAt(),
                note.getUpdatedAt(),
                notebookMapper.toDto(note.getNotebook()),
                userMapper.toSimpleAuthorDto(note.getAuthor()),
                tags
        );
    }
}
