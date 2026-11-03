package top.mysgarden.garden.mapper;

import org.springframework.stereotype.Component;

import top.mysgarden.garden.dto.UserDtos;
import top.mysgarden.garden.model.User;

@Component
public class UserMapper {

    public UserDtos.LoginUserDto toLoginUserDto(User user) {
        return new UserDtos.LoginUserDto(
                user.getId(),
                user.getUsername(),
                user.getNickname(),
                user.getAvatar(),
                user.getRole()
        );
    }

    public UserDtos.RegisteredUserDto toRegisteredUserDto(User user) {
        return new UserDtos.RegisteredUserDto(
                user.getId(),
                user.getUsername(),
                user.getNickname(),
                user.getAvatar(),
                user.getEmail(),
                user.getRole(),
                user.getCreatedAt()
        );
    }

    public UserDtos.UserProfileDto toProfileDto(User user) {
        return new UserDtos.UserProfileDto(
                user.getId(),
                user.getUsername(),
                user.getNickname(),
                user.getAvatar(),
                user.getEmail(),
                user.getBio(),
                user.getRole(),
                user.getCreatedAt()
        );
    }

    public UserDtos.AuthorDto toAuthorDto(User user) {
        if (user == null) {
            return null;
        }
        return new UserDtos.AuthorDto(
                user.getId(),
                user.getNickname(),
                user.getAvatar(),
                user.getBio()
        );
    }

    public UserDtos.SimpleAuthorDto toSimpleAuthorDto(User user) {
        if (user == null) {
            return null;
        }
        return new UserDtos.SimpleAuthorDto(
                user.getId(),
                user.getNickname(),
                user.getAvatar()
        );
    }

    public UserDtos.CommentUserDto toCommentUserDto(User user) {
        if (user == null) {
            return null;
        }
        return new UserDtos.CommentUserDto(
                user.getId(),
                user.getUsername(),
                user.getNickname(),
                user.getAvatar(),
                user.getRole()
        );
    }
}
