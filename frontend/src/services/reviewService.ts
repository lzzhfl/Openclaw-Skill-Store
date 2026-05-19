import apiClient from './apiClient';
import type { ReviewVO } from '../types/review';
import type { PageResult } from '../types/api';

export const reviewService = {
  async getReviews(
    skillId: number,
    page: number = 0,
    size: number = 10
  ): Promise<PageResult<ReviewVO>> {
    const response = await apiClient.get(`/api/skills/${skillId}/reviews`, {
      params: { page, size },
    });
    return response.data.data;
  },

  async createReview(
    skillId: number,
    data: { rating: number; content: string }
  ): Promise<ReviewVO> {
    const response = await apiClient.post(`/api/skills/${skillId}/reviews`, data);
    return response.data.data;
  },

  async deleteReview(reviewId: number): Promise<void> {
    await apiClient.delete(`/api/reviews/${reviewId}`);
  },
};
