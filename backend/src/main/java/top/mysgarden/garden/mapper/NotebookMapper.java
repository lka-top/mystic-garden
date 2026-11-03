package top.mysgarden.garden.mapper;

import org.springframework.stereotype.Component;

import top.mysgarden.garden.dto.NoteDtos;
import top.mysgarden.garden.dto.TaxonomyDtos;
import top.mysgarden.garden.model.Notebook;

@Component
public class NotebookMapper {

    public NoteDtos.NotebookDto toDto(Notebook notebook) {
        return toDto(notebook, null);
    }

    public NoteDtos.NotebookDto toDto(Notebook notebook, Long noteCount) {
        if (notebook == null) {
            return null;
        }
        return new NoteDtos.NotebookDto(
                notebook.getId(),
                notebook.getName(),
                notebook.getSlug(),
                notebook.getPath(),
                notebook.getParentId(),
                notebook.getDescription(),
                notebook.getIcon(),
                notebook.isPrivateNotebook(),
                notebook.getSortOrder(),
                notebook.getCreatedAt(),
                notebook.getUpdatedAt(),
                noteCount
        );
    }

    public NoteDtos.NotebookBriefDto toBriefDto(Notebook notebook) {
        if (notebook == null) {
            return null;
        }
        return new NoteDtos.NotebookBriefDto(
                notebook.getId(),
                notebook.getName(),
                notebook.getSlug(),
                notebook.getPath(),
                notebook.getParentId(),
                notebook.getIcon()
        );
    }

    public TaxonomyDtos.NameSlugDto toNameSlugDto(Notebook notebook) {
        if (notebook == null) {
            return null;
        }
        return new TaxonomyDtos.NameSlugDto(notebook.getName(), notebook.getSlug());
    }
}
