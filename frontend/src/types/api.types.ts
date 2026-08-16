export interface User {
  id: number;
  username: string;
  email: string;
}

export interface DashboardResponse {
  overall: {
    totalTopics: number;
    completedTopics: number;
    percentage: number;
  };
  categories: CategoryStat[];
}

export interface CategoryStat {
  id: number;
  name: string;
  totalTopics: number;
  completedTopics: number;
  percentage: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  order: number;
  topics?: Topic[];
}

export interface Topic {
  id: number;
  categoryId: number;
  name: string;
  slug: string;
  description?: string;
  order: number;
  notes?: Note[];
  resources?: Resource[];
}

export interface Note {
  id: number;
  topicId: number;
  title: string;
  content: string;
}

export interface Resource {
  id: number;
  topicId: number;
  title: string;
  url: string;
  type: string;
}

export interface Progress {
  id: number;
  userId: number;
  topicId: number;
  status: 'IN_PROGRESS' | 'COMPLETED';
  completedAt?: string;
}
