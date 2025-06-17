// app/_components/find-projects/ActiveFilters.tsx
import React from 'react';

interface ActiveFiltersProps {
  filters: string[];
  onRemoveFilter: (filter: string) => void;
  onClearAll: () => void;
}

const ActiveFilters: React.FC<ActiveFiltersProps> = ({ filters, onRemoveFilter, onClearAll }) => {
  if (filters.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      <span className="font-medium text-gray-700 mr-1">Active filters:</span>
      {filters.map((filter) => (
        <span key={filter} className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800">
          {filter}
          <button
            type="button"
            onClick={() => onRemoveFilter(filter)}
            className="ml-2 -mr-1 h-4 w-4 flex items-center justify-center rounded-full hover:bg-blue-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-3 h-3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </span>
      ))}
      <button
        type="button"
        onClick={onClearAll}
        className="ml-2 text-blue-600 hover:underline"
      >
        Clear all filters
      </button>
    </div>
  );
};

export default ActiveFilters;