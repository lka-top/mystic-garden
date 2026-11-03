package top.mysgarden.garden.mapper;

import org.springframework.stereotype.Component;

import top.mysgarden.garden.dto.TaxonomyDtos;
import top.mysgarden.garden.model.Tag;

@Component
public class TagMapper {

    public TaxonomyDtos.TagDto toDto(Tag tag, Long articleCount, Long noteCount) {
        if (tag == null) {
            return null;
        }
        return new TaxonomyDtos.TagDto(
                tag.getId(),
                tag.getName(),
                tag.getSlug(),
                articleCount,
                noteCount
        );
    }

    public TaxonomyDtos.TagBriefDto toBriefDto(Tag tag) {
        if (tag == null) {
            return null;
        }
        return new TaxonomyDtos.TagBriefDto(
                tag.getId(),
                tag.getName(),
                tag.getSlug()
        );
    }
}
