package com.openclaw.skillstore.repository;

import com.openclaw.skillstore.model.entity.Download;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface DownloadRepository extends JpaRepository<Download, Long> {

    long countBySkillId(Long skillId);

    List<Download> findBySkillIdAndIpAddressAndDownloadedAtAfter(
        Long skillId, String ipAddress, LocalDateTime since);

    long countByDownloadedAtAfter(LocalDateTime since);
}
