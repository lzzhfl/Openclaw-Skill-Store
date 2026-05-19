import { create } from 'zustand';
import { skillService, SkillQueryParams } from '../services/skillService';
import type { SkillVO } from '../types/skill';

interface SkillState {
  skills: SkillVO[];
  featured: SkillVO[];
  trending: SkillVO[];
  loading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
  totalElements: number;

  fetchSkills: (params?: SkillQueryParams) => Promise<void>;
  fetchFeatured: () => Promise<void>;
  fetchTrending: () => Promise<void>;
  clearError: () => void;
}

export const useSkillStore = create<SkillState>((set) => ({
  skills: [],
  featured: [],
  trending: [],
  loading: false,
  error: null,
  totalPages: 0,
  currentPage: 0,
  totalElements: 0,

  fetchSkills: async (params?: SkillQueryParams) => {
    set({ loading: true, error: null });
    try {
      const result = await skillService.getSkills(params);
      set({
        skills: result.content,
        totalPages: result.totalPages,
        currentPage: result.page,
        totalElements: result.totalElements,
        loading: false,
      });
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to fetch skills';
      set({ error: msg, loading: false });
    }
  },

  fetchFeatured: async () => {
    set({ loading: true, error: null });
    try {
      const featured = await skillService.getFeatured();
      set({ featured, loading: false });
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to fetch featured skills';
      set({ error: msg, loading: false });
    }
  },

  fetchTrending: async () => {
    set({ loading: true, error: null });
    try {
      const trending = await skillService.getTrending();
      set({ trending, loading: false });
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to fetch trending skills';
      set({ error: msg, loading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
