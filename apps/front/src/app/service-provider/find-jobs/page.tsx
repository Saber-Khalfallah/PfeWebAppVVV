// app/jobs/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import SearchBar from './_components/SearchBar';
import AllJobList from './_components/AllJobList';
import { Job, mockJobs } from '@/lib/types/modelTypes'; // Adjust the import path as necessary

const JobsPage: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>(mockJobs);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('Most Recent');

  // Filter jobs based on search criteria
  useEffect(() => {
    let filtered = [...jobs];

    // Apply search term filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply location filter
    if (selectedLocation !== 'All Locations') {
      filtered = filtered.filter(job => job.location === selectedLocation);
    }

    // Apply category filter
    if (selectedCategory !== 'All Categories') {
      filtered = filtered.filter(job => job.category.name === selectedCategory);
    }

    setFilteredJobs(filtered);

    // Update active filters
    const filters: string[] = [];
    if (selectedCategory !== 'All Categories') {
      filters.push(selectedCategory);
    }
    if (selectedLocation !== 'All Locations') {
      filters.push(selectedLocation);
    }
    setActiveFilters(filters);
  }, [searchTerm, selectedLocation, selectedCategory, jobs]);

  const handleSearch = (search: string, location: string, category: string) => {
    setSearchTerm(search);
    setSelectedLocation(location);
    setSelectedCategory(category);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedLocation('All Locations');
    setSelectedCategory('All Categories');
    setActiveFilters([]);
  };

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy);
  };

  const handleApply = (jobId: string) => {
    // Handle job application logic here
    console.log('Applying to job:', jobId);
    
    // You could show a modal, navigate to application form, etc.
    alert(`Applied to job ${jobId}. This would typically open an application form or modal.`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SearchBar
        onSearch={handleSearch}
        onClearFilters={handleClearFilters}
        activeFilters={activeFilters}
        onSortChange={handleSortChange}
        currentSort={sortBy}
      />
      
      <AllJobList
        jobs={filteredJobs}
        searchTerm={searchTerm}
        location={selectedLocation}
        category={selectedCategory}
        onClearFilters={handleClearFilters}
        onApply={handleApply}
        sortBy={sortBy}
      />
    </div>
  );
};

export default JobsPage;