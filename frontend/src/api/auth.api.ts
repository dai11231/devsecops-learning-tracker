import { apiClient } from './client';
import type { User } from '../types/api.types';

export const authApi = {
  login: async (username: string, password: string): Promise<User> => {
    const res = await apiClient.post('/auth/login', { username, password });
    return res.data;
  },
  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },
  getCurrentUser: async (): Promise<User> => {
    const res = await apiClient.get('/auth/me');
    return res.data;
  },
};
