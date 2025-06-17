// components/ProviderJobCard.tsx
'use client';

import React from 'react';
import { Job } from '@/lib/types/modelTypes';

interface ProviderJobCardProps {
  job: Job;
  onApply: (jobId: string) => void;
}

const ProviderJobCard: React.FC<ProviderJobCardProps> = ({ job, onApply }) => {
  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const posted = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - posted.getTime()) / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);
    
    if (diffInDays === 0) {
      return '1 day ago';
    } else if (diffInDays === 1) {
      return '1 day ago';
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else {
      const weeks = Math.floor(diffInDays / 7);
      return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg px-6 py-2 hover:shadow-md transition-shadow duration-200">
      <div className="grid grid-cols-12 gap-4 items-start">
        {/* Job Title */}
        <div className="col-span-5">
          <h3 className="text-lg font-medium text-gray-900 hover:text-blue-600 cursor-pointer">
            {job.title}
          </h3>
          <p className="text-sm text-gray-600 mt1 line-clamp-2 truncate">
            {job.description}
          </p>
        </div>

        {/* Category */}
        <div className="col-span-1">
          <span className="text-sm text-gray-700">{job.category.name}</span>
        </div>

        {/* Location */}
        <div className="col-span-1">
          <span className="text-sm text-gray-700">{job.location}</span>
        </div>

        {/* Posted Date */}
        <div className="col-span-2">
          <span className="text-sm text-gray-700">{getTimeAgo(job.requestedDatetime)}</span>
        </div>

        {/* Salary */}
        <div className="col-span-2">
          <span className="text-sm font-medium text-gray-900">
            {job.estimatedCost || 'Negotiable'}
          </span>
        </div>

        {/* Action Button */}
        <div className="col-span-1 flex justify-center">
          <button
            onClick={() => onApply(job.id)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProviderJobCard;