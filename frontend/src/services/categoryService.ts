import apiClient from './apiClient';

export interface CategoryVO {
  id: number;
  name: string;
  slug: string;
  description: string;
  iconUrl: string;
  skillCount: number;
  children?: CategoryVO[];
}

export const categoryService = {
  async getCategories(): Promise<CategoryVO[]> {
    const response = await apiClient.get('/api/categories');
    return response.data.data;
  },
};
