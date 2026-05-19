package com.openclaw.skillstore.service.impl;

import com.openclaw.skillstore.common.PageResult;
import com.openclaw.skillstore.common.PostType;
import com.openclaw.skillstore.exception.BusinessException;
import com.openclaw.skillstore.exception.ResourceNotFoundException;
import com.openclaw.skillstore.model.dto.PostRequest;
import com.openclaw.skillstore.model.entity.Comment;
import com.openclaw.skillstore.model.entity.Post;
import com.openclaw.skillstore.model.entity.User;
import com.openclaw.skillstore.model.vo.CommentVO;
import com.openclaw.skillstore.model.vo.PostVO;
import com.openclaw.skillstore.repository.CommentRepository;
import com.openclaw.skillstore.repository.PostRepository;
import com.openclaw.skillstore.repository.UserRepository;
import com.openclaw.skillstore.service.PostService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class PostServiceImpl implements PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final CommentRepository commentRepository;

    @Override
    public PageResult<PostVO> getPosts(String postType, int page, int size) {
        Sort sort = Sort.by(Sort.Direction.DESC, "isPinned", "createdAt");
        PageRequest pageable = PageRequest.of(page, size, sort);

        Page<Post> postPage;
        if (postType != null && !postType.isBlank()) {
            try {
                PostType type = PostType.valueOf(postType.toUpperCase());
                postPage = postRepository.findByPostType(type, pageable);
            } catch (IllegalArgumentException e) {
                postPage = postRepository.findAll(pageable);
            }
        } else {
            postPage = postRepository.findAll(pageable);
        }

        List<PostVO> content = postPage.getContent().stream()
            .map(this::toPostVO)
            .collect(Collectors.toList());

        return PageResult.from(postPage, content);
    }

    @Override
    public PostVO getPost(Long id) {
        Post post = postRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Post not found"));
        post.setViewCount(post.getViewCount() + 1);
        postRepository.save(post);
        return toPostVO(post);
    }

    @Override
    @Transactional
    public PostVO createPost(PostRequest request, Long authorId) {
        User author = userRepository.findById(authorId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        PostType type = PostType.TIPS;
        if (request.getPostType() != null) {
            try { type = PostType.valueOf(request.getPostType().toUpperCase()); }
            catch (IllegalArgumentException ignored) {}
        }

        Post post = Post.builder()
            .title(request.getTitle())
            .content(request.getContent())
            .author(author)
            .postType(type)
            .build();

        post = postRepository.save(post);
        log.debug("Post created: id={}, type={}", post.getId(), type);
        return toPostVO(post);
    }

    @Override
    @Transactional
    public void deletePost(Long id, Long userId) {
        Post post = postRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Post not found"));
        if (!post.getAuthor().getId().equals(userId)) {
            throw new BusinessException("Cannot delete another user's post");
        }
        postRepository.delete(post);
    }

    @Override
    public List<CommentVO> getComments(Long postId) {
        List<Comment> comments = commentRepository.findByPostIdOrderByCreatedAtAsc(postId);

        Map<Long, List<Comment>> childrenMap = comments.stream()
            .filter(c -> c.getParent() != null)
            .collect(Collectors.groupingBy(c -> c.getParent().getId()));

        return comments.stream()
            .filter(c -> c.getParent() == null)
            .map(c -> toCommentVO(c, childrenMap))
            .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public CommentVO createComment(Long postId, String content, Long userId, Long parentId) {
        Post post = postRepository.findById(postId)
            .orElseThrow(() -> new ResourceNotFoundException("Post not found"));
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Comment.CommentBuilder builder = Comment.builder()
            .post(post).user(user).content(content);

        if (parentId != null) {
            Comment parent = commentRepository.findById(parentId)
                .orElseThrow(() -> new ResourceNotFoundException("Parent comment not found"));
            builder.parent(parent);
        }

        Comment comment = commentRepository.save(builder.build());
        post.setReplyCount(commentRepository.findByPostIdOrderByCreatedAtAsc(postId).size());
        postRepository.save(post);

        return CommentVO.builder()
            .id(comment.getId())
            .content(comment.getContent())
            .username(user.getUsername())
            .userAvatar(user.getAvatarUrl())
            .parentId(parentId)
            .createdAt(comment.getCreatedAt())
            .build();
    }

    private PostVO toPostVO(Post p) {
        return PostVO.builder()
            .id(p.getId())
            .title(p.getTitle())
            .content(p.getContent())
            .postType(p.getPostType().name())
            .authorName(p.getAuthor().getUsername())
            .authorAvatar(p.getAuthor().getAvatarUrl())
            .viewCount(p.getViewCount())
            .replyCount(p.getReplyCount())
            .isPinned(p.getIsPinned())
            .createdAt(p.getCreatedAt())
            .build();
    }

    private CommentVO toCommentVO(Comment c, Map<Long, List<Comment>> childrenMap) {
        List<Comment> children = childrenMap.getOrDefault(c.getId(), List.of());
        return CommentVO.builder()
            .id(c.getId())
            .content(c.getContent())
            .username(c.getUser().getUsername())
            .userAvatar(c.getUser().getAvatarUrl())
            .parentId(c.getParent() != null ? c.getParent().getId() : null)
            .replies(children.isEmpty() ? null : children.stream()
                .map(child -> toCommentVO(child, childrenMap))
                .collect(Collectors.toList()))
            .createdAt(c.getCreatedAt())
            .build();
    }
}
