package com.openclaw.skillstore.repository;

import com.openclaw.skillstore.model.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    Optional<Category> findBySlug(String slug);

    List<Category> findByParentIsNullOrderBySortOrder();

    List<Category> findByParentIdOrderBySortOrder(Long parentId);
}
