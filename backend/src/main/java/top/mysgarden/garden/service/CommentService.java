package top.mysgarden.garden.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;

import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Caching;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import top.mysgarden.garden.config.CachingConfig;
import top.mysgarden.garden.dto.InteractionDtos;
import top.mysgarden.garden.dto.PageResult;
import top.mysgarden.garden.exception.BusinessException;
import top.mysgarden.garden.exception.NotFoundException;
import top.mysgarden.garden.mapper.CommentMapper;
import top.mysgarden.garden.model.Comment;
import top.mysgarden.garden.model.User;
import top.mysgarden.garden.repository.ArticleRepository;
import top.mysgarden.garden.repository.CommentRepository;
import top.mysgarden.garden.repository.EssayRepository;
import top.mysgarden.garden.repository.UserRepository;
import top.mysgarden.garden.util.AuthenticatedUser;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final ArticleRepository articleRepository;
    private final EssayRepository essayRepository;
    private final UserRepository userRepository;
    private final CommentMapper commentMapper;

    @Transactional(readOnly = true)
    public PageResult<InteractionDtos.CommentDto> listComments(
            String targetType,
            Integer articleId,
            Integer essayId,
            int page,
            int pageSize,
            boolean includeUnapproved) {

        validateListTarget(targetType, articleId, essayId, includeUnapproved);

        Specification<Comment> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.equal(root.get("targetType"), targetType));
            predicates.add(cb.isNull(root.get("parentId")));
            if (!includeUnapproved) {
                predicates.add(cb.isTrue(root.get("approved")));
            }
            if ("article".equals(targetType) && articleId != null) {
                predicates.add(cb.equal(root.get("articleId"), articleId));
            } else if ("essay".equals(targetType) && essayId != null) {
                predicates.add(cb.equal(root.get("essayId"), essayId));
            }
            return cb.and(predicates.toArray(Predicate[]::new));
        };

        Pageable pageable = PageRequest.of(
                page - 1,
                pageSize,
                Sort.by(Sort.Order.desc("pinned"), Sort.Order.desc("createdAt")));

        Page<Comment> topPage = commentRepository.findAll(spec, pageable);
        List<Comment> topComments = topPage.getContent();

        Map<Integer, List<InteractionDtos.CommentDto>> repliesByParent = new HashMap<>();
        if (!topComments.isEmpty()) {
            List<Integer> parentIds = topComments.stream().map(Comment::getId).toList();
            List<Comment> replies = includeUnapproved
                    ? commentRepository.findByParentIdInOrderByCreatedAtAsc(parentIds)
                    : commentRepository.findByParentIdInAndApprovedTrueOrderByCreatedAtAsc(parentIds);
            for (Comment reply : replies) {
                repliesByParent
                        .computeIfAbsent(reply.getParentId(), k -> new ArrayList<>())
                        .add(commentMapper.toPlainDto(reply, true, includeUnapproved));
            }
        }

        List<InteractionDtos.CommentDto> list = topComments.stream()
                .map(c -> commentMapper.toDto(c, repliesByParent.getOrDefault(c.getId(), List.of()), includeUnapproved))
                .toList();

        return PageResult.of(list, topPage.getTotalElements(), page, pageSize);
    }

    @Transactional
    @Caching(evict = {
            @CacheEvict(value = CachingConfig.ARTICLE_LIST_CACHE_NAME, allEntries = true),
            @CacheEvict(value = CachingConfig.ESSAY_LIST_CACHE_NAME, allEntries = true),
            @CacheEvict(value = CachingConfig.STATS_CACHE_NAME, allEntries = true)
    })
    public InteractionDtos.CommentDto createComment(
            InteractionDtos.CreateCommentRequest request,
            AuthenticatedUser currentUser,
            String ipAddress,
            String userAgent) {

        CommentTarget target = validateTarget(request);
        User commentAuthor = null;

        if (currentUser != null && currentUser.userId() != null) {
            commentAuthor = userRepository.findById(currentUser.userId()).orElse(null);
        }
        boolean isLoggedIn = commentAuthor != null;

        if (commentAuthor == null) {
            String guestUuid = (request.guestUuid() != null && !request.guestUuid().isBlank())
                    ? request.guestUuid()
                    : "guest_" + System.currentTimeMillis() + "_" + randomSuffix(6);

            commentAuthor = userRepository.findByGuestUuid(guestUuid).orElseGet(() -> {
                String cleanOnlyAlphaNum = guestUuid.replaceAll("[^a-zA-Z0-9]", "");
                String cleanId = cleanOnlyAlphaNum.length() >= 4
                        ? cleanOnlyAlphaNum.substring(cleanOnlyAlphaNum.length() - 4).toLowerCase(Locale.ROOT)
                        : randomSuffix(4);
                String prefix = guestUuid.length() > 16 ? guestUuid.substring(0, 16) : guestUuid;

                User guest = new User();
                guest.setUsername("guest_" + prefix + "_" + randomSuffix(4));
                guest.setPasswordHash(null);
                guest.setNickname("漫步花友_" + cleanId);
                guest.setAvatar("https://api.dicebear.com/7.x/bottts/svg?seed=" + cleanId);
                guest.setRole("guest");
                guest.setGuestUuid(guestUuid);
                guest.setIpAddress(ipAddress);
                guest.setUserAgent(userAgent);
                return userRepository.save(guest);
            });
        }

        Comment comment = new Comment();
        comment.setTargetType(target.targetType());
        comment.setArticleId(target.articleId());
        comment.setEssayId(target.essayId());
        comment.setParentId(target.parentId());
        comment.setUser(commentAuthor);
        comment.setContent(request.content());
        comment.setIpAddress(ipAddress);
        comment.setUserAgent(userAgent);
        comment.setApproved(isLoggedIn);
        comment.setPinned(false);

        Comment saved = commentRepository.save(comment);
        return commentMapper.toPlainDto(saved, true, false);
    }

    @Transactional
    @Caching(evict = {
            @CacheEvict(value = CachingConfig.ARTICLE_LIST_CACHE_NAME, allEntries = true),
            @CacheEvict(value = CachingConfig.ESSAY_LIST_CACHE_NAME, allEntries = true),
            @CacheEvict(value = CachingConfig.STATS_CACHE_NAME, allEntries = true)
    })
    public InteractionDtos.CommentDto approveComment(Integer id, boolean approved) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("资源不存在或已被删除"));
        comment.setApproved(approved);
        Comment saved = commentRepository.save(comment);
        return commentMapper.toPlainDto(saved, false, true);
    }

    @Transactional
    @Caching(evict = {
            @CacheEvict(value = CachingConfig.ARTICLE_LIST_CACHE_NAME, allEntries = true),
            @CacheEvict(value = CachingConfig.ESSAY_LIST_CACHE_NAME, allEntries = true),
            @CacheEvict(value = CachingConfig.STATS_CACHE_NAME, allEntries = true)
    })
    public void deleteComment(Integer id) {
        if (!commentRepository.existsById(id)) {
            throw new NotFoundException("资源不存在或已被删除");
        }
        commentRepository.deleteById(id);
    }

    private static String randomSuffix(int len) {
        return UUID.randomUUID().toString().replace("-", "").substring(0, len);
    }

    private static void validateListTarget(
            String targetType,
            Integer articleId,
            Integer essayId,
            boolean adminOverview) {
        switch (targetType) {
            case "article" -> {
                if (essayId != null || (articleId == null && !adminOverview)) {
                    throw BusinessException.badRequest("查询文章评论时必须且只能指定 articleId");
                }
            }
            case "essay" -> {
                if (articleId != null || (essayId == null && !adminOverview)) {
                    throw BusinessException.badRequest("查询随笔评论时必须且只能指定 essayId");
                }
            }
            case "guestbook" -> {
                if (articleId != null || essayId != null) {
                    throw BusinessException.badRequest("查询留言板时不能指定文章或随笔 ID");
                }
            }
            default -> throw BusinessException.badRequest("无效的评论目标类型");
        }
    }

    private CommentTarget validateTarget(InteractionDtos.CreateCommentRequest request) {
        String targetType = request.targetTypeOrDefault();
        Integer articleId = request.articleId();
        Integer essayId = request.essayId();

        switch (targetType) {
            case "article" -> {
                if (articleId == null || essayId != null) {
                    throw BusinessException.badRequest("文章评论必须且只能指定 articleId");
                }
                if (!articleRepository.existsById(articleId)) {
                    throw new NotFoundException("评论的文章不存在或已被删除");
                }
            }
            case "essay" -> {
                if (essayId == null || articleId != null) {
                    throw BusinessException.badRequest("随笔评论必须且只能指定 essayId");
                }
                if (!essayRepository.existsById(essayId)) {
                    throw new NotFoundException("评论的随笔不存在或已被删除");
                }
            }
            case "guestbook" -> {
                if (articleId != null || essayId != null) {
                    throw BusinessException.badRequest("留言板评论不能指定文章或随笔 ID");
                }
            }
            default -> throw BusinessException.badRequest("无效的评论目标类型");
        }

        Integer parentId = request.parentId();
        if (parentId != null) {
            Comment parent = commentRepository.findById(parentId)
                    .orElseThrow(() -> new NotFoundException("父评论不存在或已被删除"));
            if (parent.getParentId() != null) {
                throw BusinessException.badRequest("评论回复仅支持两级结构");
            }
            if (!targetType.equals(parent.getTargetType())
                    || !Objects.equals(articleId, parent.getArticleId())
                    || !Objects.equals(essayId, parent.getEssayId())) {
                throw BusinessException.badRequest("回复必须与父评论属于同一内容");
            }
        }

        return new CommentTarget(targetType, articleId, essayId, parentId);
    }

    private record CommentTarget(String targetType, Integer articleId, Integer essayId, Integer parentId) {
    }
}
