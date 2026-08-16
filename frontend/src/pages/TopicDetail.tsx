import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import ReactMarkdown from 'react-markdown';
import DOMPurify from 'dompurify';
import { topicsApi } from '../api/topics.api';
import { progressApi } from '../api/progress.api';
import { ArrowLeft, CheckCircle2, Circle, ExternalLink, FileText } from 'lucide-react';

const TopicDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const topicId = Number(id);

  const { data: topic, isLoading: isTopicLoading } = useQuery({
    queryKey: ['topic', topicId],
    queryFn: () => topicsApi.getTopic(topicId),
  });

  const { data: notes } = useQuery({
    queryKey: ['topic-notes', topicId],
    queryFn: () => topicsApi.getNotes(topicId),
  });

  const { data: resources } = useQuery({
    queryKey: ['topic-resources', topicId],
    queryFn: () => topicsApi.getResources(topicId),
  });

  const { data: progress } = useQuery({
    queryKey: ['progress', topicId],
    queryFn: () => progressApi.getProgress(topicId),
    retry: false,
  });

  const isCompleted = progress?.status === 'COMPLETED';

  const updateProgressMutation = useMutation({
    mutationFn: (status: 'COMPLETED' | 'IN_PROGRESS') => progressApi.updateProgress(topicId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['progress', topicId] });
    },
  });

  if (isTopicLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-12 bg-slate-200 rounded w-1/3"></div>
        <div className="h-64 bg-slate-200 rounded-xl"></div>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="bg-red-50 p-6 rounded-xl text-center">
        <h2 className="text-xl font-bold text-red-600 mb-2">Topic not found</h2>
        <button onClick={() => navigate('/dashboard')} className="mt-4 text-blue-600 font-medium">
          ← Back to Dashboard
        </button>
      </div>
    );
  }

  const handleToggleProgress = () => {
    updateProgressMutation.mutate(isCompleted ? 'IN_PROGRESS' : 'COMPLETED');
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center space-x-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
          <ArrowLeft size={24} className="text-slate-600" />
        </button>
        <div className="flex-1 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{topic.name}</h1>
          </div>
          <button
            onClick={handleToggleProgress}
            disabled={updateProgressMutation.isPending}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              isCompleted 
                ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isCompleted ? <CheckCircle2 size={20} /> : <Circle size={20} />}
            <span>{isCompleted ? 'Completed' : 'Mark as Completed'}</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Notes (Markdown) */}
        <div className="lg:col-span-2 space-y-6">
          {notes && notes.length > 0 ? (
            notes.map(note => {
              // Sanitize markdown content before rendering
              const cleanContent = DOMPurify.sanitize(note.content);
              return (
                <div key={note.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                  <h2 className="text-xl font-bold text-slate-900 border-b pb-4 mb-4 flex items-center space-x-2">
                    <FileText size={20} className="text-blue-500" />
                    <span>{note.title}</span>
                  </h2>
                  <div className="prose prose-slate max-w-none">
                    <ReactMarkdown>{cleanContent}</ReactMarkdown>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 text-center text-slate-500">
              No notes available for this topic yet.
            </div>
          )}
        </div>

        {/* Resources Sidebar */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-lg text-slate-900 mb-4">Resources</h3>
            {resources && resources.length > 0 ? (
              <ul className="space-y-3">
                {resources.map(resource => (
                  <li key={resource.id}>
                    <a 
                      href={resource.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-start space-x-3 group"
                    >
                      <ExternalLink size={18} className="text-blue-500 mt-1 flex-shrink-0 group-hover:text-blue-600" />
                      <div>
                        <p className="font-medium text-slate-700 group-hover:text-blue-600 transition-colors">
                          {resource.title}
                        </p>
                        <p className="text-xs text-slate-400 capitalize">{resource.type}</p>
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-500">No external resources linked.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default TopicDetail;
