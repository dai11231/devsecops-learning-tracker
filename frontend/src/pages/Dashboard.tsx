import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { dashboardApi } from '../api/dashboard.api';
import { BookOpen } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { data: dashboard, isLoading, error, refetch } = useQuery({
    queryKey: ['dashboard'],
    queryFn: dashboardApi.getDashboard,
  });

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-32 bg-slate-200 rounded-xl"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-40 bg-slate-200 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !dashboard) {
    return (
      <div className="bg-red-50 p-6 rounded-xl text-center">
        <h2 className="text-xl font-bold text-red-600 mb-2">Unable to load dashboard</h2>
        <p className="text-red-500 mb-4">There was an error connecting to the server.</p>
        <button
          onClick={() => refetch()}
          className="bg-red-100 text-red-700 px-4 py-2 rounded-lg font-medium hover:bg-red-200"
        >
          Retry
        </button>
      </div>
    );
  }

  const { overall, categories } = dashboard;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Your Progress</h1>
        <p className="text-slate-500 mt-2">Track your journey through DevSecOps</p>
      </div>

      {/* Overall Progress */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <div className="flex justify-between items-end mb-4">
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Overall Completion</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">{overall.percentage}%</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-500">
              <span className="font-medium text-slate-900">{overall.completedTopics}</span> / {overall.totalTopics} Topics
            </p>
          </div>
        </div>
        
        <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden">
          <div 
            className="bg-blue-600 h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${overall.percentage}%` }}
          ></div>
        </div>
      </div>

      {/* Categories Grid */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-4">Learning Modules</h2>
        {categories.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-100">
            <BookOpen className="mx-auto h-12 w-12 text-slate-300 mb-3" />
            <p className="text-slate-500">No categories found yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Link 
                key={category.id} 
                to={`/categories/${category.id}`}
                className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group cursor-pointer"
              >
                <h3 className="font-bold text-lg text-slate-900 group-hover:text-blue-600 transition-colors">
                  {category.name}
                </h3>
                
                <div className="mt-4 flex justify-between items-center text-sm">
                  <span className="text-slate-500">
                    {category.completedTopics} / {category.totalTopics}
                  </span>
                  <span className="font-semibold text-slate-700">
                    {category.percentage}%
                  </span>
                </div>
                
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-2">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      category.percentage === 100 ? 'bg-green-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${category.percentage}%` }}
                  ></div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
