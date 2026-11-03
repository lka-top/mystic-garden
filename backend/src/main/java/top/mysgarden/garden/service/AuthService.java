package top.mysgarden.garden.service;

import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import top.mysgarden.garden.config.CachingConfig;
import top.mysgarden.garden.dto.LoginRequest;
import top.mysgarden.garden.dto.RegisterRequest;
import top.mysgarden.garden.dto.UserDtos;
import top.mysgarden.garden.exception.BusinessException;
import top.mysgarden.garden.exception.NotFoundException;
import top.mysgarden.garden.mapper.UserMapper;
import top.mysgarden.garden.model.User;
import top.mysgarden.garden.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final UserMapper userMapper;

    @Transactional(readOnly = true)
    public UserDtos.AuthTokenResponse<UserDtos.LoginUserDto> login(LoginRequest request) {
        User user = userRepository.findByUsername(request.username())
                .orElseThrow(() -> BusinessException.unauthorized("用户名或密码错误"));

        if (user.getPasswordHash() == null || !passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw BusinessException.unauthorized("用户名或密码错误");
        }

        String token = jwtService.signToken(user.getId(), user.getUsername(), user.getRole());
        return new UserDtos.AuthTokenResponse<>(token, userMapper.toLoginUserDto(user));
    }

    @Transactional
    @CacheEvict(value = CachingConfig.STATS_CACHE_NAME, allEntries = true)
    public UserDtos.AuthTokenResponse<UserDtos.RegisteredUserDto> register(
            RegisterRequest request,
            String ipAddress,
            String userAgent) {

        if (userRepository.findByUsername(request.username()).isPresent()) {
            throw BusinessException.conflict("该用户名已被占用，请换一个");
        }

        String passwordHash = passwordEncoder.encode(request.password());
        String defaultAvatar = "https://api.dicebear.com/7.x/bottts/svg?seed=" + request.username();
        String normalizedEmail = (request.email() != null && !request.email().isBlank())
                ? request.email().trim()
                : null;

        User targetUser = null;
        if (request.guestUuid() != null && !request.guestUuid().isBlank()) {
            User existingGuest = userRepository.findByGuestUuid(request.guestUuid()).orElse(null);
            if (existingGuest != null && "guest".equals(existingGuest.getRole())) {
                existingGuest.setUsername(request.username());
                existingGuest.setPasswordHash(passwordHash);
                existingGuest.setNickname(request.nickname());
                existingGuest.setEmail(normalizedEmail);
                if (existingGuest.getAvatar() == null || existingGuest.getAvatar().isBlank()) {
                    existingGuest.setAvatar(defaultAvatar);
                }
                existingGuest.setRole("user");
                existingGuest.setIpAddress(ipAddress);
                existingGuest.setUserAgent(userAgent);
                targetUser = userRepository.save(existingGuest);
            }
        }

        if (targetUser == null) {
            User newUser = new User();
            newUser.setUsername(request.username());
            newUser.setPasswordHash(passwordHash);
            newUser.setNickname(request.nickname());
            newUser.setEmail(normalizedEmail);
            newUser.setAvatar(defaultAvatar);
            newUser.setRole("user");
            newUser.setGuestUuid(null);
            newUser.setIpAddress(ipAddress);
            newUser.setUserAgent(userAgent);
            targetUser = userRepository.save(newUser);
        }

        String token = jwtService.signToken(targetUser.getId(), targetUser.getUsername(), targetUser.getRole());
        return new UserDtos.AuthTokenResponse<>(token, userMapper.toRegisteredUserDto(targetUser));
    }

    @Transactional(readOnly = true)
    public UserDtos.UserProfileDto getCurrentProfile(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("用户不存在"));
        return userMapper.toProfileDto(user);
    }
}
