// components/ApplicationStatusTracker.tsx
"use client";

import React from 'react';

interface StatusTrackerProps {
  status: string;
  appliedDate: string;
  viewedDate?: string | null;
}

export default function ApplicationStatusTracker({ 
  status, 
  appliedDate,
  viewedDate 
}: StatusTrackerProps) {
  
  const statuses = [
    { key: 'pending', label: 'Applied', icon: '📝' },
    { key: 'viewed', label: 'Viewed', icon: '👀' },
    { key: 'shortlisted', label: 'Shortlisted', icon: '⭐' },
    { key: 'interviewing', label: 'Interview', icon: '💼' },
    { key: 'accepted', label: 'Accepted', icon: '✅' },
    { key: 'rejected', label: 'Rejected', icon: '❌' },
  ];

  const getCurrentIndex = () => {
    const index = statuses.findIndex(s => s.key === status);
    return index === -1 ? 0 : index;
  };

  const currentIndex = getCurrentIndex();
  const isRejected = status === 'rejected';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
        Application Progress
      </h3>
      
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute top-5 left-0 w-full h-0.5 bg-gray-200 dark:bg-gray-700">
          <div 
            className={`h-full transition-all duration-500 ${
              isRejected ? 'bg-red-500' : 'bg-green-500'
            }`}
            style={{ width: `${(currentIndex / (statuses.length - 1)) * 100}%` }}
          />
        </div>

        {/* Status Points */}
        <div className="relative flex justify-between">
          {statuses.map((s, idx) => {
            const isActive = idx <= currentIndex;
            const isCurrent = s.key === status;
            
            // Don't show rejected in normal flow
            if (s.key === 'rejected' && !isRejected) return null;
            // Don't show other statuses if rejected
            if (isRejected && s.key !== 'rejected' && s.key !== 'pending') return null;
            
            return (
              <div key={s.key} className="flex flex-col items-center relative">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all ${
                    isCurrent 
                      ? 'bg-primary-600 scale-110 ring-4 ring-primary-100 dark:ring-primary-900' 
                      : isActive 
                        ? isRejected && s.key === 'rejected'
                          ? 'bg-red-500'
                          : 'bg-green-500'
                        : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  {s.icon}
                </div>
                <span className={`mt-2 text-xs font-medium ${
                  isActive 
                    ? 'text-gray-900 dark:text-white' 
                    : 'text-gray-400'
                }`}>
                  {s.label}
                </span>
                {isCurrent && (
                  <span className="mt-1 text-[10px] text-gray-500">
                    {s.key === 'pending' ? new Date(appliedDate).toLocaleDateString() : 'Current'}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Status Message */}
      <div className="mt-6 p-3 rounded-lg bg-gray-50 dark:bg-gray-900">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          {status === 'pending' && '⏳ Your application has been submitted'}
          {status === 'viewed' && '👀 Employer has viewed your application'}
          {status === 'shortlisted' && '⭐ You\'ve been shortlisted!'}
          {status === 'interviewing' && '💼 Interview scheduled or in progress'}
          {status === 'accepted' && '🎉 Congratulations! You got the job'}
          {status === 'rejected' && '😔 Unfortunately, you weren\'t selected this time'}
        </p>
        {viewedDate && status !== 'pending' && (
          <p className="text-xs text-gray-500 mt-1">
            Last updated: {new Date(viewedDate).toLocaleDateString()}
          </p>
        )}
      </div>
    </div>
  );
}