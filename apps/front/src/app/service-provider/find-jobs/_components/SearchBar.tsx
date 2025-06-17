// components/SearchBar.tsx
'use client';

import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  onSearch: (searchTerm: string, location: string, category: string) => void;
  onClearFilters: () => void;
  activeFilters: string[];
  onSortChange: (sortBy: string) => void;
  currentSort: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onClearFilters, activeFilters, onSortChange, currentSort }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('All Locations');
  const [category, setCategory] = useState('All Categories'); 

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm, location, category);
  };

  const locations = [
    'All Locations',
    'New York',
    'Chicago', 
    'Los Angeles',
    'Houston',
    'Phoenix',
    'Remote'
  ];

  const categories = [
    'All Categories',
    'Cleaning',
    'Plumbing',
    'Tutoring',
    'Landscaping',
    'Electrical'
  ];

  const removeFilter = (filter: string) => {
    // Handle removing specific filters
    if (filter === 'Cleaning' || filter === 'New York') {
      onClearFilters();
    }
  };

  return (
    <div className="bg-white p-6 border-b">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold text-gray-900">Find Jobs</h1>
        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
          Help & Support
        </button>
      </div>
      
      <form onSubmit={handleSearch} className="flex gap-4 mb-4">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search jobs by title, keyword or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        
        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white min-w-[150px]"
        >
          {locations.map((loc) => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>
        
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white min-w-[150px]"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        
        <select
          value={currentSort}
          onChange={(e) => onSortChange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white min-w-[150px]"
        >
          <option value="Most Recent">Most Recent</option>
          <option value="Oldest">Oldest</option>
          <option value="Salary High to Low">Salary High to Low</option>
          <option value="Salary Low to High">Salary Low to High</option>
        </select>
      </form>

      {activeFilters.length > 0 && (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-600">Active filters:</span>
          {activeFilters.map((filter) => (
            <span
              key={filter}
              className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full"
            >
              {filter}
              <button
                onClick={() => removeFilter(filter)}
                className="hover:bg-blue-200 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
          <button
            onClick={onClearFilters}
            className="text-blue-600 hover:text-blue-700 ml-2"
          >
            Clear All
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchBar;