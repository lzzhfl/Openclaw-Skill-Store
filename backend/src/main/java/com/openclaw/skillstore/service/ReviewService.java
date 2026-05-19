package com.openclaw.skillstore.service;

import com.openclaw.skillstore.common.PageResult;
import com.openclaw.skillstore.model.dto.ReviewRequest;
import com.openclaw.skillstore.model.vo.ReviewVO;

public interface ReviewService {
    PageResult<ReviewVO> getReviews(Long skillId, int page, int size);
    ReviewVO createReview(Long skillId, ReviewRequest request, Long userId);
    void deleteReview(Long reviewId, Long userId);
}
