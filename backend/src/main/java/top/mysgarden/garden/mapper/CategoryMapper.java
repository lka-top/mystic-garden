package top.mysgarden.garden.mapper;

import org.springframework.stereotype.Component;

import top.mysgarden.garden.dto.TaxonomyDtos;
import top.mysgarden.garden.model.Category;

@Component
public class CategoryMapper {

    public TaxonomyDtos.CategoryDto toDto(Category category) {
        return toDto(category, null);
    }

    public TaxonomyDtos.CategoryDto toDto(Category category, Long articleCount) {
        if (category == null) {
            return null;
        }
        return new TaxonomyDtos.CategoryDto(
                category.getId(),
                category.getName(),
                category.getSlug(),
                category.getDescription(),
                articleCount
        );
    }

    public TaxonomyDtos.CategoryBriefDto toBriefDto(Category category) {
        if (category == null) {
            return null;
        }
        return new TaxonomyDtos.CategoryBriefDto(
                category.getId(),
                category.getName(),
                category.getSlug()
        );
    }

    public TaxonomyDtos.NameSlugDto toNameSlugDto(Category category) {
        if (category == null) {
            return null;
        }
        return new TaxonomyDtos.NameSlugDto(category.getName(), category.getSlug());
    }
}
