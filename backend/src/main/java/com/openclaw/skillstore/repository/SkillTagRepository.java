package com.openclaw.skillstore.repository;

import com.openclaw.skillstore.model.entity.SkillTag;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SkillTagRepository extends JpaRepository<SkillTag, Long> {
    List<SkillTag> findBySkillId(Long skillId);
}
