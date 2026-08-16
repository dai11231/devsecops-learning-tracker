import { apiClient } from './client';
import type { Category, Topic } from '../types/api.types';

export const categoriesApi = {
  getCategories: async (): Promise<Category[]> => {
    const res = await apiClient.get('/categories');
    return res.data;
  },
  getCategory: async (id: number): Promise<Category> => {
    const res = await apiClient.get(`/categories/${id}`);
    return res.data;
  },
  getCategoryTopics: async (categoryId: number): Promise<Topic[]> => {
    const res = await apiClient.get(`/categories/${categoryId}/topics`);
    return res.data;
  }
};
