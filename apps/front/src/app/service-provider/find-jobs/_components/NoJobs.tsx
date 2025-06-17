// components/NoJobs.tsx
import React from 'react';
import { Search, MapPin, Briefcase } from 'lucide-react';

interface NoJobsProps {
  searchTerm?: string;
  location?: string;
  category?: string;
  onClearFilters: () => void;
}

const NoJobs: React.FC<NoJobsProps> = ({ 
  searchTerm, 
  location, 
  category, 
  onClearFilters 
}) => {
  const hasFilters = searchTerm || (location && location !== 'All Locations') || (category && category !== 'All Categories');

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="text-center max-w-md">
        <div className="mb-6">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No jobs found
          </h3>
          <p className="text-gray-600 mb-6">
            {hasFilters 
              ? "We couldn't find any jobs matching your current search criteria."
              : "There are currently no jobs available."
            }
          </p>
        </div>

        {hasFilters && (
          <div className="space-y-4">
            <div className="text-sm text-gray-500">
              <p className="mb-2">Current filters:</p>
              <div className="space-y-1">
                {searchTerm && (
                  <div className="flex items-center justify-center gap-2">
                    <Search className="w-4 h-4" />
                    <span>"{searchTerm}"</span>
                  </div>
                )}
                {location && location !== 'All Locations' && (
                  <div className="flex items-center justify-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{location}</span>
                  </div>
                )}
                {category && category !== 'All Categories' && (
                  <div className="flex items-center justify-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    <span>{category}</span>
                  </div>
                )}
              </div>
            </div>
            
            <button
              onClick={onClearFilters}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Clear all filters
            </button>
          </div>
        )}

        <div className="mt-8 text-sm text-gray-500">
          <p>Try adjusting your search criteria or check back later for new opportunities.</p>
        </div>
      </div>
    </div>
  );
};

export default NoJobs;