package com.openclaw.skillstore.repository;

import com.openclaw.skillstore.common.PostType;
import com.openclaw.skillstore.model.entity.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostRepository extends JpaRepository<Post, Long> {

    Page<Post> findByPostType(PostType postType, Pageable pageable);

    Page<Post> findByAuthorId(Long authorId, Pageable pageable);
}
