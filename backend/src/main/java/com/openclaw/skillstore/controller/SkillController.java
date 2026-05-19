package com.openclaw.skillstore.controller;

import com.openclaw.skillstore.common.PageResult;
import com.openclaw.skillstore.common.Result;
import com.openclaw.skillstore.model.dto.SkillCreateRequest;
import com.openclaw.skillstore.model.dto.SkillQueryRequest;
import com.openclaw.skillstore.model.vo.SkillDetailVO;
import com.openclaw.skillstore.model.vo.SkillVO;
import com.openclaw.skillstore.service.SkillService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/skills")
@RequiredArgsConstructor
public class SkillController {

    private final SkillService skillService;

    @GetMapping
    public Result<PageResult<SkillVO>> listSkills(SkillQueryRequest request) {
        return Result.success(skillService.querySkills(request));
    }

    @GetMapping("/search")
    public Result<PageResult<SkillVO>> search(SkillQueryRequest request) {
        return Result.success(skillService.querySkills(request));
    }

    @GetMapping("/featured")
    public Result<PageResult<SkillVO>> featured(SkillQueryRequest request) {
        request.setFeatured(true);
        return Result.success(skillService.querySkills(request));
    }

    @GetMapping("/trending")
    public Result<PageResult<SkillVO>> trending(SkillQueryRequest request) {
        request.setSortBy("popular");
        return Result.success(skillService.querySkills(request));
    }

    @GetMapping("/{slug}")
    public Result<SkillDetailVO> getSkill(@PathVariable String slug) {
        return Result.success(skillService.getSkillDetail(slug));
    }

    @PostMapping
    public Result<SkillDetailVO> createSkill(
            @Valid @RequestBody SkillCreateRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        Long authorId = Long.parseLong(userDetails.getUsername().split(":")[0]);
        return Result.success(skillService.createSkill(request, authorId));
    }

    @PostMapping("/{id}/install")
    public Result<Void> install(@PathVariable Long id, HttpServletRequest request) {
        String ip = request.getRemoteAddr();
        String ua = request.getHeader("User-Agent");
        skillService.recordInstall(id, ip, ua);
        return Result.success();
    }
}
