package com.openclaw.skillstore.repository;

import com.openclaw.skillstore.common.SkillStatus;
import com.openclaw.skillstore.model.entity.Skill;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;

public interface SkillRepository extends JpaRepository<Skill, Long> {

    Optional<Skill> findBySlug(String slug);

    Page<Skill> findByStatus(SkillStatus status, Pageable pageable);

    Page<Skill> findByCategoryIdAndStatus(Long categoryId, SkillStatus status, Pageable pageable);

    @Query("SELECT s FROM Skill s WHERE s.status = :status AND s.isFeatured = true ORDER BY s.downloadsCount DESC")
    Page<Skill> findFeatured(@Param("status") SkillStatus status, Pageable pageable);

    @Query("SELECT s FROM Skill s WHERE s.status = :status ORDER BY s.downloadsCount DESC")
    Page<Skill> findTrending(@Param("status") SkillStatus status, Pageable pageable);

    @Query("SELECT s FROM Skill s WHERE s.status = :status AND " +
           "(LOWER(s.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(s.shortDescription) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(s.description) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<Skill> search(@Param("query") String query, @Param("status") SkillStatus status, Pageable pageable);

    Page<Skill> findByAuthorId(Long authorId, Pageable pageable);

    long countByStatus(SkillStatus status);
}
