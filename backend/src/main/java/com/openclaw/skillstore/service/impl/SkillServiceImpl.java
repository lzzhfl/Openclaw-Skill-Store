package com.openclaw.skillstore.service.impl;

import com.openclaw.skillstore.common.PageResult;
import com.openclaw.skillstore.common.SecurityLevel;
import com.openclaw.skillstore.common.SkillStatus;
import com.openclaw.skillstore.exception.ResourceNotFoundException;
import com.openclaw.skillstore.model.dto.SkillCreateRequest;
import com.openclaw.skillstore.model.dto.SkillQueryRequest;
import com.openclaw.skillstore.model.entity.*;
import com.openclaw.skillstore.model.vo.SkillDetailVO;
import com.openclaw.skillstore.model.vo.SkillVO;
import com.openclaw.skillstore.repository.*;
import com.openclaw.skillstore.service.SkillService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class SkillServiceImpl implements SkillService {

    private final SkillRepository skillRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final TagRepository tagRepository;
    private final SkillTagRepository skillTagRepository;
    private final SecurityRatingRepository securityRatingRepository;
    private final CompatiblePlatformRepository compatiblePlatformRepository;
    private final FeatureListRepository featureListRepository;
    private final DownloadRepository downloadRepository;

    @Override
    public PageResult<SkillVO> querySkills(SkillQueryRequest request) {
        Sort sort = getSort(request.getSortBy());
        Pageable pageable = PageRequest.of(request.getPage(), request.getSize(), sort);
        Page<Skill> page;

        if (request.getQuery() != null && !request.getQuery().isBlank()) {
            page = skillRepository.search(request.getQuery(), SkillStatus.PUBLISHED, pageable);
        } else if (request.getCategoryId() != null) {
            page = skillRepository.findByCategoryIdAndStatus(request.getCategoryId(), SkillStatus.PUBLISHED, pageable);
        } else if (Boolean.TRUE.equals(request.getFeatured())) {
            page = skillRepository.findFeatured(SkillStatus.PUBLISHED, pageable);
        } else {
            page = skillRepository.findByStatus(SkillStatus.PUBLISHED, pageable);
        }

        List<SkillVO> content = page.getContent().stream()
            .map(this::toSkillVO)
            .collect(Collectors.toList());

        log.debug("Queried skills: page={}, size={}, total={}", request.getPage(), request.getSize(), page.getTotalElements());
        return PageResult.from(page, content);
    }

    @Override
    public SkillDetailVO getSkillDetail(String slug) {
        Skill skill = skillRepository.findBySlug(slug)
            .orElseThrow(() -> new ResourceNotFoundException("Skill not found: " + slug));

        SecurityRating security = securityRatingRepository.findBySkillId(skill.getId()).orElse(null);
        List<CompatiblePlatform> platforms = compatiblePlatformRepository.findBySkillId(skill.getId());
        List<FeatureList> features = featureListRepository.findBySkillIdOrderBySortOrder(skill.getId());
        List<SkillTag> skillTags = skillTagRepository.findBySkillId(skill.getId());

        return SkillDetailVO.builder()
            .id(skill.getId())
            .name(skill.getName())
            .slug(skill.getSlug())
            .shortDescription(skill.getShortDescription())
            .description(skill.getDescription())
            .iconUrl(skill.getIconUrl())
            .coverUrl(skill.getCoverUrl())
            .version(skill.getVersion())
            .installCommand(skill.getInstallCommand())
            .tutorial(skill.getTutorial())
            .securityLevel(security != null ? security.getLevel().name() : SecurityLevel.D.name())
            .securityDescription(security != null ? security.getDescription() : null)
            .downloadsCount(skill.getDownloadsCount())
            .ratingAvg(skill.getRatingAvg())
            .ratingCount(skill.getRatingCount())
            .categoryName(skill.getCategory().getName())
            .categorySlug(skill.getCategory().getSlug())
            .author(SkillDetailVO.AuthorVO.builder()
                .id(skill.getAuthor().getId())
                .username(skill.getAuthor().getUsername())
                .avatarUrl(skill.getAuthor().getAvatarUrl())
                .build())
            .tags(skillTags.stream().map(st -> st.getTag().getName()).collect(Collectors.toList()))
            .platforms(platforms.stream().map(CompatiblePlatform::getPlatformName).collect(Collectors.toList()))
            .features(features.stream().map(f -> SkillDetailVO.FeatureVO.builder()
                .name(f.getFeatureName())
                .expectedBehavior(f.getExpectedBehavior())
                .build()).collect(Collectors.toList()))
            .createdAt(skill.getCreatedAt())
            .updatedAt(skill.getUpdatedAt())
            .build();
    }

    @Override
    @Transactional
    public SkillDetailVO createSkill(SkillCreateRequest request, Long authorId) {
        Category category = categoryRepository.findById(request.getCategoryId())
            .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        User author = userRepository.findById(authorId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String slug = request.getName().toLowerCase().replaceAll("[^a-z0-9]+", "-")
            .replaceAll("^-|-$", "");

        Skill skill = Skill.builder()
            .name(request.getName())
            .slug(slug)
            .shortDescription(request.getShortDescription())
            .description(request.getDescription())
            .category(category)
            .author(author)
            .version(request.getVersion() != null ? request.getVersion() : "1.0.0")
            .installCommand(request.getInstallCommand())
            .build();

        skill = skillRepository.save(skill);

        if (request.getPlatforms() != null) {
            for (String platformName : request.getPlatforms()) {
                compatiblePlatformRepository.save(CompatiblePlatform.builder()
                    .skill(skill).platformName(platformName).build());
            }
        }

        if (request.getFeatures() != null) {
            int order = 0;
            for (String feature : request.getFeatures()) {
                featureListRepository.save(FeatureList.builder()
                    .skill(skill).featureName(feature).sortOrder(order++).build());
            }
        }

        if (request.getTags() != null) {
            for (String tagName : request.getTags()) {
                Tag tag = tagRepository.findByName(tagName)
                    .orElseGet(() -> tagRepository.save(Tag.builder()
                        .name(tagName).slug(tagName.toLowerCase().replaceAll("[^a-z0-9]+", "-")).build()));
                skillTagRepository.save(SkillTag.builder().skill(skill).tag(tag).build());
            }
        }

        securityRatingRepository.save(SecurityRating.builder()
            .skill(skill).level(SecurityLevel.D).build());

        log.info("Skill created: id={}, slug={}", skill.getId(), slug);
        return getSkillDetail(slug);
    }

    @Override
    @Transactional
    public void recordInstall(Long skillId, String ipAddress, String userAgent) {
        Skill skill = skillRepository.findById(skillId)
            .orElseThrow(() -> new ResourceNotFoundException("Skill not found"));

        LocalDateTime oneHourAgo = LocalDateTime.now().minusHours(1);
        List<Download> recent = downloadRepository
            .findBySkillIdAndIpAddressAndDownloadedAtAfter(skillId, ipAddress, oneHourAgo);

        downloadRepository.save(Download.builder()
            .skill(skill).ipAddress(ipAddress).userAgent(userAgent).build());

        if (recent.isEmpty()) {
            skill.setDownloadsCount(skill.getDownloadsCount() + 1);
            skillRepository.save(skill);
        }

        log.debug("Install recorded: skillId={}, ip={}", skillId, ipAddress);
    }

    private SkillVO toSkillVO(Skill s) {
        SecurityRating security = securityRatingRepository.findBySkillId(s.getId()).orElse(null);
        List<SkillTag> skillTags = skillTagRepository.findBySkillId(s.getId());
        List<CompatiblePlatform> platforms = compatiblePlatformRepository.findBySkillId(s.getId());

        return SkillVO.builder()
            .id(s.getId())
            .name(s.getName())
            .slug(s.getSlug())
            .shortDescription(s.getShortDescription())
            .iconUrl(s.getIconUrl())
            .version(s.getVersion())
            .securityLevel(security != null ? security.getLevel().name() : SecurityLevel.D.name())
            .downloadsCount(s.getDownloadsCount())
            .ratingAvg(s.getRatingAvg())
            .ratingCount(s.getRatingCount())
            .categoryName(s.getCategory().getName())
            .authorName(s.getAuthor().getUsername())
            .tags(skillTags.stream().map(st -> st.getTag().getName()).collect(Collectors.toList()))
            .platforms(platforms.stream().map(CompatiblePlatform::getPlatformName).collect(Collectors.toList()))
            .createdAt(s.getCreatedAt())
            .build();
    }

    private Sort getSort(String sortBy) {
        if ("popular".equals(sortBy)) return Sort.by(Sort.Direction.DESC, "downloadsCount");
        if ("rating".equals(sortBy)) return Sort.by(Sort.Direction.DESC, "ratingAvg");
        if ("newest".equals(sortBy)) return Sort.by(Sort.Direction.DESC, "createdAt");
        return Sort.by(Sort.Direction.DESC, "downloadsCount");
    }
}
