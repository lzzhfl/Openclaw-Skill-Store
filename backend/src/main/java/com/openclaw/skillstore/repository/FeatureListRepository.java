package com.openclaw.skillstore.repository;

import com.openclaw.skillstore.model.entity.FeatureList;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FeatureListRepository extends JpaRepository<FeatureList, Long> {

    List<FeatureList> findBySkillIdOrderBySortOrder(Long skillId);
}
