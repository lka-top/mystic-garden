package top.mysgarden.garden.mapper;

import java.util.List;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import top.mysgarden.garden.dto.ArticleDtos;
import top.mysgarden.garden.dto.InteractionDtos;
import top.mysgarden.garden.dto.TaxonomyDtos;
import top.mysgarden.garden.model.Article;

@Component
@RequiredArgsConstructor
public class ArticleMapper {

    private final CategoryMapper categoryMapper;
    private final TagMapper tagMapper;
    private final UserMapper userMapper;

    public ArticleDtos.ArticleListItemDto toListItemDto(Article article, long commentCount) {
        List<TaxonomyDtos.TagBriefDto> tags = article.getTags().stream()
                .map(tagMapper::toBriefDto)
                .toList();
        return new ArticleDtos.ArticleListItemDto(
                article.getId(),
                article.getSlug(),
                article.getTitle(),
                article.getSummary(),
                article.getCoverImage(),
                article.isPublished(),
                article.isPinned(),
                article.getViews(),
                article.getReadingTime(),
                article.getCreatedAt(),
                article.getUpdatedAt(),
                categoryMapper.toBriefDto(article.getCategory()),
                tags,
                new InteractionDtos.CommentCountMetaDto(commentCount),
                commentCount
        );
    }

    public ArticleDtos.ArticleDetailDto toDetailDto(Article article, long commentCount) {
        List<TaxonomyDtos.TagBriefDto> tags = article.getTags().stream()
                .map(tagMapper::toBriefDto)
                .toList();
        Integer categoryId = article.getCategory() != null ? article.getCategory().getId() : null;
        Integer authorId = article.getAuthor() != null ? article.getAuthor().getId() : null;
        return new ArticleDtos.ArticleDetailDto(
                article.getId(),
                article.getSlug(),
                article.getTitle(),
                article.getSummary(),
                article.getContent(),
                article.getCoverImage(),
                article.isPublished(),
                article.isPinned(),
                article.getViews(),
                article.getReadingTime(),
                categoryId,
                authorId,
                article.getCreatedAt(),
                article.getUpdatedAt(),
                categoryMapper.toDto(article.getCategory()),
                userMapper.toAuthorDto(article.getAuthor()),
                tags,
                new InteractionDtos.CommentCountMetaDto(commentCount),
                commentCount
        );
    }
}
