import { apiClient } from './client';
import type { Topic, Note, Resource } from '../types/api.types';

export const topicsApi = {
  getTopic: async (id: number): Promise<Topic> => {
    const res = await apiClient.get(`/topics/${id}`);
    return res.data;
  },
  getNotes: async (topicId: number): Promise<Note[]> => {
    const res = await apiClient.get(`/topics/${topicId}/notes`);
    return res.data;
  },
  getResources: async (topicId: number): Promise<Resource[]> => {
    const res = await apiClient.get(`/topics/${topicId}/resources`);
    return res.data;
  }
};
