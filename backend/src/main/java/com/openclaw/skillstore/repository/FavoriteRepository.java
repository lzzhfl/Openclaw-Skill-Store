package com.openclaw.skillstore.repository;

import com.openclaw.skillstore.model.entity.Favorite;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface FavoriteRepository extends JpaRepository<Favorite, Long> {

    Page<Favorite> findByUserId(Long userId, Pageable pageable);

    Optional<Favorite> findByUserIdAndSkillId(Long userId, Long skillId);

    boolean existsByUserIdAndSkillId(Long userId, Long skillId);
}
