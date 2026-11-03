package top.mysgarden.garden.mapper;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import top.mysgarden.garden.dto.InteractionDtos;
import top.mysgarden.garden.model.Essay;

@Component
@RequiredArgsConstructor
public class EssayMapper {

    private final UserMapper userMapper;

    public InteractionDtos.EssayDto toDto(Essay essay, Long commentCount) {
        Integer authorId = essay.getAuthor() != null ? essay.getAuthor().getId() : null;
        InteractionDtos.CommentCountMetaDto countMeta = commentCount != null
                ? new InteractionDtos.CommentCountMetaDto(commentCount)
                : null;
        return new InteractionDtos.EssayDto(
                essay.getId(),
                essay.getContent(),
                essay.getMood(),
                essay.getWeather(),
                essay.getLocation(),
                essay.getImages(),
                essay.isPinned(),
                essay.isPublished(),
                essay.getLikes(),
                authorId,
                essay.getCreatedAt(),
                essay.getUpdatedAt(),
                userMapper.toSimpleAuthorDto(essay.getAuthor()),
                countMeta,
                commentCount
        );
    }
}
