package com.openclaw.skillstore.service.impl;

import com.openclaw.skillstore.common.PageResult;
import com.openclaw.skillstore.exception.BusinessException;
import com.openclaw.skillstore.exception.ResourceNotFoundException;
import com.openclaw.skillstore.model.dto.ReviewRequest;
import com.openclaw.skillstore.model.entity.Review;
import com.openclaw.skillstore.model.entity.Skill;
import com.openclaw.skillstore.model.entity.User;
import com.openclaw.skillstore.model.vo.ReviewVO;
import com.openclaw.skillstore.repository.ReviewRepository;
import com.openclaw.skillstore.repository.SkillRepository;
import com.openclaw.skillstore.repository.UserRepository;
import com.openclaw.skillstore.service.ReviewService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final SkillRepository skillRepository;
    private final UserRepository userRepository;

    @Override
    public PageResult<ReviewVO> getReviews(Long skillId, int page, int size) {
        Page<Review> reviewPage = reviewRepository.findBySkillId(skillId,
            PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt")));

        List<ReviewVO> content = reviewPage.getContent().stream()
            .map(this::toReviewVO)
            .collect(Collectors.toList());

        return PageResult.from(reviewPage, content);
    }

    @Override
    @Transactional
    public ReviewVO createReview(Long skillId, ReviewRequest request, Long userId) {
        if (reviewRepository.existsBySkillIdAndUserId(skillId, userId)) {
            throw new BusinessException("You have already reviewed this skill");
        }

        Skill skill = skillRepository.findById(skillId)
            .orElseThrow(() -> new ResourceNotFoundException("Skill not found"));
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Review review = Review.builder()
            .skill(skill)
            .user(user)
            .rating(request.getRating())
            .content(request.getContent())
            .build();

        review = reviewRepository.save(review);

        updateSkillRating(skillId);

        log.debug("Review created: skillId={}, userId={}, rating={}", skillId, userId, request.getRating());
        return toReviewVO(review);
    }

    @Override
    @Transactional
    public void deleteReview(Long reviewId, Long userId) {
        Review review = reviewRepository.findById(reviewId)
            .orElseThrow(() -> new ResourceNotFoundException("Review not found"));

        if (!review.getUser().getId().equals(userId)) {
            throw new BusinessException("Cannot delete another user's review");
        }

        Long skillId = review.getSkill().getId();
        reviewRepository.delete(review);
        updateSkillRating(skillId);

        log.debug("Review deleted: id={}", reviewId);
    }

    private void updateSkillRating(Long skillId) {
        Page<Review> reviews = reviewRepository.findBySkillId(skillId, PageRequest.of(0, 1000));
        if (reviews.getTotalElements() == 0) {
            Skill skill = skillRepository.findById(skillId).orElseThrow();
            skill.setRatingAvg(0.0);
            skill.setRatingCount(0);
            skillRepository.save(skill);
            return;
        }

        double avg = reviews.getContent().stream()
            .mapToInt(Review::getRating)
            .average()
            .orElse(0.0);

        Skill skill = skillRepository.findById(skillId).orElseThrow();
        skill.setRatingAvg(Math.round(avg * 100.0) / 100.0);
        skill.setRatingCount((int) reviews.getTotalElements());
        skillRepository.save(skill);
    }

    private ReviewVO toReviewVO(Review r) {
        return ReviewVO.builder()
            .id(r.getId())
            .rating(r.getRating())
            .content(r.getContent())
            .username(r.getUser().getUsername())
            .userAvatar(r.getUser().getAvatarUrl())
            .createdAt(r.getCreatedAt())
            .build();
    }
}
