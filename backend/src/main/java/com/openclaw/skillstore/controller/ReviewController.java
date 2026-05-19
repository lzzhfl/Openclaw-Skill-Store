package com.openclaw.skillstore.controller;

import com.openclaw.skillstore.common.PageResult;
import com.openclaw.skillstore.common.Result;
import com.openclaw.skillstore.model.dto.ReviewRequest;
import com.openclaw.skillstore.model.vo.ReviewVO;
import com.openclaw.skillstore.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/skills/{skillId}/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @GetMapping
    public Result<PageResult<ReviewVO>> list(
            @PathVariable Long skillId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return Result.success(reviewService.getReviews(skillId, page, size));
    }

    @PostMapping
    public Result<ReviewVO> create(
            @PathVariable Long skillId,
            @Valid @RequestBody ReviewRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = Long.parseLong(userDetails.getUsername().split(":")[0]);
        return Result.success(reviewService.createReview(skillId, request, userId));
    }

    @DeleteMapping("/{reviewId}")
    public Result<Void> delete(
            @PathVariable Long reviewId,
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = Long.parseLong(userDetails.getUsername().split(":")[0]);
        reviewService.deleteReview(reviewId, userId);
        return Result.success();
    }
}
