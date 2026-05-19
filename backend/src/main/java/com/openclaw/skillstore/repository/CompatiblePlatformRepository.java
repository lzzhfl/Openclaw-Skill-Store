package com.openclaw.skillstore.repository;

import com.openclaw.skillstore.model.entity.CompatiblePlatform;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CompatiblePlatformRepository extends JpaRepository<CompatiblePlatform, Long> {

    List<CompatiblePlatform> findBySkillId(Long skillId);
}
