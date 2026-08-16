import { apiClient } from './client';
import type { Progress } from '../types/api.types';

export const progressApi = {
  getProgress: async (topicId: number): Promise<Progress> => {
    const res = await apiClient.get(`/progress/${topicId}`);
    return res.data;
  },
  updateProgress: async (topicId: number, status: 'IN_PROGRESS' | 'COMPLETED'): Promise<Progress> => {
    const res = await apiClient.patch(`/progress/${topicId}`, { status });
    return res.data;
  }
};
