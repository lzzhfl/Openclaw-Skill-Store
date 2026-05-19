package com.openclaw.skillstore.repository;

import com.openclaw.skillstore.model.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    Page<Review> findBySkillId(Long skillId, Pageable pageable);

    Optional<Review> findBySkillIdAndUserId(Long skillId, Long userId);

    boolean existsBySkillIdAndUserId(Long skillId, Long userId);
}
