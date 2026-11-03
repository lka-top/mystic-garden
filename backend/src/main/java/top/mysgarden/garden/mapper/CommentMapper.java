package top.mysgarden.garden.mapper;

import java.util.List;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import top.mysgarden.garden.dto.InteractionDtos;
import top.mysgarden.garden.model.Comment;

@Component
@RequiredArgsConstructor
public class CommentMapper {

    private final UserMapper userMapper;

    public InteractionDtos.CommentDto toDto(
            Comment comment,
            List<InteractionDtos.CommentDto> replies,
            boolean includeClientInfo) {
        Integer userId = comment.getUser() != null ? comment.getUser().getId() : null;
        return new InteractionDtos.CommentDto(
                comment.getId(),
                comment.getTargetType(),
                comment.getArticleId(),
                comment.getEssayId(),
                comment.getParentId(),
                userId,
                comment.getContent(),
                includeClientInfo ? comment.getIpAddress() : null,
                includeClientInfo ? comment.getUserAgent() : null,
                comment.isApproved(),
                comment.isPinned(),
                comment.getCreatedAt(),
                comment.getUpdatedAt(),
                userMapper.toCommentUserDto(comment.getUser()),
                replies
        );
    }

    public InteractionDtos.CommentDto toPlainDto(Comment comment, boolean includeUser, boolean includeClientInfo) {
        Integer userId = comment.getUser() != null ? comment.getUser().getId() : null;
        return new InteractionDtos.CommentDto(
                comment.getId(),
                comment.getTargetType(),
                comment.getArticleId(),
                comment.getEssayId(),
                comment.getParentId(),
                userId,
                comment.getContent(),
                includeClientInfo ? comment.getIpAddress() : null,
                includeClientInfo ? comment.getUserAgent() : null,
                comment.isApproved(),
                comment.isPinned(),
                comment.getCreatedAt(),
                comment.getUpdatedAt(),
                includeUser ? userMapper.toCommentUserDto(comment.getUser()) : null,
                null
        );
    }
}
