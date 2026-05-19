package com.openclaw.skillstore.service;

import com.openclaw.skillstore.model.dto.SkillCreateRequest;
import com.openclaw.skillstore.model.dto.SkillQueryRequest;
import com.openclaw.skillstore.model.vo.SkillDetailVO;
import com.openclaw.skillstore.model.vo.SkillVO;
import com.openclaw.skillstore.common.PageResult;

public interface SkillService {
    PageResult<SkillVO> querySkills(SkillQueryRequest request);
    SkillDetailVO getSkillDetail(String slug);
    SkillDetailVO createSkill(SkillCreateRequest request, Long authorId);
    void recordInstall(Long skillId, String ipAddress, String userAgent);
}
