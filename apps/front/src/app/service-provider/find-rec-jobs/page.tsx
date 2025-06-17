// app/find-projects/page.tsx
'use client'; // This directive is necessary for client-side components in Next.js App Router

import React, { useState, useEffect } from 'react';
import SearchBar from './_components/SearchBar';
import ActiveFilters from './_components/ActiveFilters';
import JobListingTable from './_components/jobListingTable';
import Pagination from './_components/pagination';
import SortDropdown from './_components/sortDropDown';

// Define a type for a job item for better type safety
interface Job {
  id: string;
  jobTitle: string;
  description: string;
  category: string;
  postedDate: string;
  location: string;
}

export default function FindProjectsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState('Newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [totalJobs, setTotalJobs] = useState(0);
  const jobsPerPage = 6; // As seen in the example image

  // Mock data for demonstration
  const allJobs: Job[] = [
    {
      id: '1',
      jobTitle: 'Home Cleaning Service',
      description: 'Looking for experienced cleaners for a 3-bedroom apartment...',
      category: 'Cleaning',
      postedDate: 'May 28, 2023',
      location: 'New York, NY',
    },
    {
      id: '2',
      jobTitle: 'Plumbing Repair Specialist',
      description: 'Needed for fixing kitchen sink and bathroom leaks...',
      category: 'Plumbing',
      postedDate: 'May 27, 2023',
      location: 'Los Angeles, CA',
    },
    {
      id: '3',
      jobTitle: 'Math Tutor for High School Student',
      description: 'Looking for an experienced math tutor for algebra and calculus...',
      category: 'Tutoring',
      postedDate: 'May 26, 2023',
      location: 'Chicago, IL',
    },
    {
      id: '4',
      jobTitle: 'Electrical Wiring Specialist',
      description: 'Need help with installing new light fixtures and outlets...',
      category: 'Electrical',
      postedDate: 'May 25, 2023',
      location: 'Miami, FL',
    },
    {
      id: '5',
      jobTitle: 'Landscaping and Garden Maintenance',
      description: 'Weekly garden maintenance including mowing, trimming...',
      category: 'Gardening',
      postedDate: 'May 24, 2023',
      location: 'Seattle, WA',
    },
    {
      id: '6',
      jobTitle: 'Deep House Cleaning',
      description: 'Full house deep cleaning service needed for a 4-bedroom home...',
      category: 'Cleaning',
      postedDate: 'May 24, 2023',
      location: 'New York, NY',
    },
    {
      id: '7',
      jobTitle: 'Dog Walking Service',
      description: 'Regular walks for a medium-sized dog, twice a day.',
      category: 'Pet Care',
      postedDate: 'May 23, 2023',
      location: 'Boston, MA',
    },
    {
      id: '8',
      jobTitle: 'Interior Painting Job',
      description: 'Painting for two rooms and a hallway.',
      category: 'Painting',
      postedDate: 'May 22, 2023',
      location: 'New York, NY',
    },
    {
      id: '9',
      jobTitle: 'Furniture Assembly',
      description: 'Assembly of IKEA furniture including a bed and dresser.',
      category: 'Handyman',
      postedDate: 'May 21, 2023',
      location: 'Philadelphia, PA',
    },
  ];

  // Simulate fetching data based on filters/search/sort/pagination
  useEffect(() => {
    let filteredAndSortedJobs = [...allJobs];

    // Apply search term (simple check for now)
    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      filteredAndSortedJobs = filteredAndSortedJobs.filter(job =>
        job.jobTitle.toLowerCase().includes(lowerCaseSearchTerm) ||
        job.description.toLowerCase().includes(lowerCaseSearchTerm) ||
        job.location.toLowerCase().includes(lowerCaseSearchTerm) ||
        job.category.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }

    // Apply active filters (e.g., location, category, time)
    activeFilters.forEach(filter => {
      const lowerCaseFilter = filter.toLowerCase();
      if (lowerCaseFilter === 'new york') {
        filteredAndSortedJobs = filteredAndSortedJobs.filter(job => job.location.includes('New York'));
      } else if (lowerCaseFilter === 'cleaning') {
        filteredAndSortedJobs = filteredAndSortedJobs.filter(job => job.category.includes('Cleaning'));
      } else if (lowerCaseFilter === 'last week') {
        // This would require actual date parsing. For now, a simplified check.
        // In a real app, you'd compare postedDate with current date.
        // Example: Only showing jobs from May 24, 2023 onwards for "Last week"
        const lastWeekThreshold = new Date('2023-05-23'); // A mock date for "last week"
        filteredAndSortedJobs = filteredAndSortedJobs.filter(job => new Date(job.postedDate) >= lastWeekThreshold);
      }
      // Add more filter logic as needed for other filter types
    });

    // Apply sorting
    if (sortOption === 'Newest') {
      filteredAndSortedJobs.sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime());
    }
    // Add other sort options if needed

    setTotalJobs(filteredAndSortedJobs.length);

    // Apply pagination
    const startIndex = (currentPage - 1) * jobsPerPage;
    const endIndex = startIndex + jobsPerPage;
    setJobs(filteredAndSortedJobs.slice(startIndex, endIndex));

  }, [searchTerm, activeFilters, sortOption, currentPage]); // Re-run effect when these dependencies change

  const handleSearch = (query: string) => {
    setSearchTerm(query);
    setCurrentPage(1); // Reset to first page on new search
  };

  const handleAddFilter = (filter: string) => {
    if (!activeFilters.includes(filter)) {
      setActiveFilters((prev) => [...prev, filter]);
      setCurrentPage(1); // Reset to first page on new filter
    }
  };

  const handleRemoveFilter = (filterToRemove: string) => {
    setActiveFilters((prev) => prev.filter((filter) => filter !== filterToRemove));
    setCurrentPage(1); // Reset to first page when a filter is removed
  };

  const handleClearAllFilters = () => {
    setActiveFilters([]);
    setCurrentPage(1); // Reset to first page
  };

  const handleSortChange = (option: string) => {
    setSortOption(option);
    setCurrentPage(1); // Reset to first page on sort change
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const totalPages = Math.ceil(totalJobs / jobsPerPage);

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
      <div className="bg-white rounded-lg shadow-md p-8">
        {/* Search Bar */}
        <SearchBar onSearch={handleSearch} onAddFilter={handleAddFilter} /> {/* Pass onAddFilter for quick filters */}

        {/* Filters and Sort */}
        <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between">
          <ActiveFilters filters={activeFilters} onRemoveFilter={handleRemoveFilter} onClearAll={handleClearAllFilters} />
          <div className="mt-4 md:mt-0 flex items-center">
            <span className="text-gray-600 text-sm mr-2">Sort by:</span>
            <SortDropdown selectedOption={sortOption} onSelectOption={handleSortChange} />
          </div>
        </div>

        {/* Job Listings Count */}
        <div className="mt-6 text-gray-700 text-sm">
          <p className="font-semibold">{totalJobs} jobs found</p>
        </div>

        {/* Job Listing Table */}
        <div className="mt-4">
          <JobListingTable jobs={jobs} />
        </div>

        {/* Pagination */}
        <div className="mt-8 flex justify-end">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            resultsPerPage={jobsPerPage}
            totalResults={totalJobs}
          />
        </div>
      </div>
    </div>
  );
}