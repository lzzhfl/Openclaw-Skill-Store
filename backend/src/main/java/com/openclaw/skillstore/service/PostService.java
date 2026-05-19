package com.openclaw.skillstore.service;

import com.openclaw.skillstore.common.PageResult;
import com.openclaw.skillstore.model.dto.PostRequest;
import com.openclaw.skillstore.model.vo.CommentVO;
import com.openclaw.skillstore.model.vo.PostVO;

import java.util.List;

public interface PostService {
    PageResult<PostVO> getPosts(String postType, int page, int size);
    PostVO getPost(Long id);
    PostVO createPost(PostRequest request, Long authorId);
    void deletePost(Long id, Long userId);
    List<CommentVO> getComments(Long postId);
    CommentVO createComment(Long postId, String content, Long userId, Long parentId);
}
