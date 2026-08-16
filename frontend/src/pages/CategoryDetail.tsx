import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { categoriesApi } from '../api/categories.api';
import { progressApi } from '../api/progress.api';
import { CheckCircle2, Circle, ArrowLeft } from 'lucide-react';

const TopicChecklistItem: React.FC<{ topicId: number; name: string }> = ({ topicId, name }) => {
  const { data: progress } = useQuery({
    queryKey: ['progress', topicId],
    queryFn: () => progressApi.getProgress(topicId),
    retry: false,
  });

  const isCompleted = progress?.status === 'COMPLETED';

  return (
    <Link 
      to={`/topics/${topicId}`}
      className="flex items-center space-x-4 p-4 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0"
    >
      {isCompleted ? (
        <CheckCircle2 className="text-green-500 flex-shrink-0" size={24} />
      ) : (
        <Circle className="text-slate-300 flex-shrink-0" size={24} />
      )}
      <span className={`font-medium ${isCompleted ? 'text-slate-500 line-through' : 'text-slate-900'}`}>
        {name}
      </span>
    </Link>
  );
};

const CategoryDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const categoryId = Number(id);

  const { data: category, isLoading: isCatLoading, error: catError } = useQuery({
    queryKey: ['category', categoryId],
    queryFn: () => categoriesApi.getCategory(categoryId),
  });

  const { data: topics, isLoading: isTopicsLoading } = useQuery({
    queryKey: ['category-topics', categoryId],
    queryFn: () => categoriesApi.getCategoryTopics(categoryId),
  });

  if (isCatLoading || isTopicsLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-12 bg-slate-200 rounded w-1/3"></div>
        <div className="h-64 bg-slate-200 rounded-xl"></div>
      </div>
    );
  }

  if (catError || !category) {
    return (
      <div className="bg-red-50 p-6 rounded-xl text-center">
        <h2 className="text-xl font-bold text-red-600 mb-2">Category not found</h2>
        <button onClick={() => navigate('/dashboard')} className="mt-4 text-blue-600 font-medium">
          ← Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
          <ArrowLeft size={24} className="text-slate-600" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{category.name}</h1>
          {category.description && (
            <p className="text-slate-500 mt-1">{category.description}</p>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        {topics && topics.length > 0 ? (
          <div className="flex flex-col">
            {topics.map(topic => (
              <TopicChecklistItem key={topic.id} topicId={topic.id} name={topic.name} />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-slate-500">
            No topics available in this category yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryDetail;
