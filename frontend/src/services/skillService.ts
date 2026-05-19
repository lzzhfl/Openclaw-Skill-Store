import apiClient from './apiClient';
import type { SkillVO, SkillDetailVO } from '../types/skill';
import type { PageResult } from '../types/api';

export interface SkillQueryParams {
  page?: number;
  size?: number;
  sort?: string;
  category?: string;
  securityLevel?: string;
  platform?: string;
}

export const skillService = {
  async getSkills(params: SkillQueryParams = {}): Promise<PageResult<SkillVO>> {
    const response = await apiClient.get('/api/skills', { params });
    return response.data.data;
  },

  async searchSkills(
    query: string,
    params: SkillQueryParams = {}
  ): Promise<PageResult<SkillVO>> {
    const response = await apiClient.get('/api/skills/search', {
      params: { q: query, ...params },
    });
    return response.data.data;
  },

  async getFeatured(): Promise<SkillVO[]> {
    const response = await apiClient.get('/api/skills/featured');
    return response.data.data;
  },

  async getTrending(): Promise<SkillVO[]> {
    const response = await apiClient.get('/api/skills/trending');
    return response.data.data;
  },

  async getSkillBySlug(slug: string): Promise<SkillDetailVO> {
    const response = await apiClient.get(`/api/skills/${slug}`);
    return response.data.data;
  },

  async createSkill(data: Record<string, unknown> | FormData): Promise<SkillVO> {
    const isFormData = data instanceof FormData;
    const response = await apiClient.post('/api/skills', data, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
    });
    return response.data.data;
  },

  async recordInstall(skillId: number): Promise<void> {
    await apiClient.post(`/api/skills/${skillId}/install`);
  },
};
