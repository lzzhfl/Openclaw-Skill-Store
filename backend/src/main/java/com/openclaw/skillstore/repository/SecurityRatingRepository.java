package com.openclaw.skillstore.repository;

import com.openclaw.skillstore.model.entity.SecurityRating;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface SecurityRatingRepository extends JpaRepository<SecurityRating, Long> {

    Optional<SecurityRating> findBySkillId(Long skillId);
}
