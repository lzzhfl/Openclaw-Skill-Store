package com.openclaw.skillstore.controller;

import com.openclaw.skillstore.common.PageResult;
import com.openclaw.skillstore.common.Result;
import com.openclaw.skillstore.model.dto.PostRequest;
import com.openclaw.skillstore.model.vo.CommentVO;
import com.openclaw.skillstore.model.vo.PostVO;
import com.openclaw.skillstore.service.PostService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    @GetMapping
    public Result<PageResult<PostVO>> list(
            @RequestParam(required = false) String type,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return Result.success(postService.getPosts(type, page, size));
    }

    @GetMapping("/{id}")
    public Result<PostVO> get(@PathVariable Long id) {
        return Result.success(postService.getPost(id));
    }

    @PostMapping
    public Result<PostVO> create(
            @Valid @RequestBody PostRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = Long.parseLong(userDetails.getUsername().split(":")[0]);
        return Result.success(postService.createPost(request, userId));
    }

    @DeleteMapping("/{id}")
    public Result<Void> delete(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = Long.parseLong(userDetails.getUsername().split(":")[0]);
        postService.deletePost(id, userId);
        return Result.success();
    }

    @GetMapping("/{id}/comments")
    public Result<List<CommentVO>> comments(@PathVariable Long id) {
        return Result.success(postService.getComments(id));
    }

    @PostMapping("/{id}/comments")
    public Result<CommentVO> createComment(
            @PathVariable Long id,
            @RequestBody Map<String, Object> body,
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = Long.parseLong(userDetails.getUsername().split(":")[0]);
        String content = (String) body.get("content");
        Object parentIdObj = body.get("parentId");
        Long parentId = parentIdObj != null ? ((Number) parentIdObj).longValue() : null;
        return Result.success(postService.createComment(id, content, userId, parentId));
    }
}
