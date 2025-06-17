// app/_components/find-projects/SearchBar.tsx
'use client';

import React, { useState } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onAddFilter?: (filter: string) => void; // Optional for quick filter buttons
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onAddFilter }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="relative flex-grow">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 text-gray-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search for jobs, locations, or keywords"
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <button
        type="submit"
        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Search
      </button>
      {/* Optional: Add quick filter buttons below search bar, similar to the job image */}
      {/*
      <div className="flex gap-2 mt-2 md:mt-0">
        <button type="button" onClick={() => onAddFilter && onAddFilter('New York')} className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm">New York</button>
        <button type="button" onClick={() => onAddFilter && onAddFilter('Cleaning')} className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm">Cleaning</button>
        <button type="button" onClick={() => onAddFilter && onAddFilter('Last week')} className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm">Last week</button>
      </div>
      */}
    </form>
  );
};

export default SearchBar;