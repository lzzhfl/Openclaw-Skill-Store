import { create } from 'zustand';
import { skillService, SkillQueryParams } from '../services/skillService';
import type { SkillVO } from '../types/skill';

interface SearchFilters {
  securityLevels: string[];
  platforms: string[];
  sort: string;
}

interface SearchState {
  query: string;
  results: SkillVO[];
  filters: SearchFilters;
  loading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
  totalElements: number;

  setQuery: (query: string) => void;
  setFilters: (filters: Partial<SearchFilters>) => void;
  search: (page?: number) => Promise<void>;
  clearResults: () => void;
}

export const useSearchStore = create<SearchState>((set, get) => ({
  query: '',
  results: [],
  filters: {
    securityLevels: [],
    platforms: [],
    sort: 'popular',
  },
  loading: false,
  error: null,
  totalPages: 0,
  currentPage: 0,
  totalElements: 0,

  setQuery: (query: string) => set({ query }),

  setFilters: (filters: Partial<SearchFilters>) =>
    set((state) => ({
      filters: { ...state.filters, ...filters },
    })),

  search: async (page: number = 0) => {
    const { query, filters } = get();
    set({ loading: true, error: null });
    try {
      const params: SkillQueryParams = {
        page,
        size: 12,
        sort: filters.sort,
      };
      if (filters.securityLevels.length > 0) {
        params.securityLevel = filters.securityLevels.join(',');
      }
      if (filters.platforms.length > 0) {
        params.platform = filters.platforms.join(',');
      }

      let result;
      if (query.trim()) {
        result = await skillService.searchSkills(query.trim(), params);
      } else {
        result = await skillService.getSkills(params);
      }

      set({
        results: result.content,
        totalPages: result.totalPages,
        currentPage: result.page,
        totalElements: result.totalElements,
        loading: false,
      });
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Search failed';
      set({ error: msg, loading: false });
    }
  },

  clearResults: () =>
    set({
      results: [],
      query: '',
      totalPages: 0,
      currentPage: 0,
      totalElements: 0,
    }),
}));
