// components/ServiceProvidersList.tsx
'use client';
import React from 'react';
import ServiceProviderCard from './ServiceProviderCard';

interface ServiceProvidersListProps {
  providers: {
    id: string;
    providerName: string;
    email: string;
    serviceCategory: string;
    registrationDate: string;
    location: string;
    status: string;
    avatar: string;
  }[];
}

type PageItem = number | '...';

const ServiceProvidersList: React.FC<ServiceProvidersListProps> = ({ providers }) => {
  const itemsPerPage = 6;
  const totalResults = 24;
  const currentPage = 1;
  const totalPages = Math.ceil(totalResults / itemsPerPage);

  const getPageNumbers = (): PageItem[] => {
    const pages: PageItem[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage > totalPages - 3) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Table Headers */}
      <div className="grid grid-cols-[1.5fr_1.5fr_1.5fr_1.2fr_1fr_1.5fr] px-4 py-3 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
        <div>Provider Name</div>
        <div>Service Category</div>
        <div>Registration Date</div>
        <div>Location</div>
        <div>Status</div>
        <div className="text-right">Actions</div>
      </div>

      {/* Service Provider Cards */}
      <div>
        {providers.map((provider) => (
          <ServiceProviderCard key={provider.id} provider={provider} />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center px-4 py-3 border-t border-gray-200">
        <div className="text-sm text-gray-600">
          Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalResults)} of {totalResults} results
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => { /* Implement page change */ }}
            disabled={currentPage === 1}
            className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          {getPageNumbers().map((page, index) => (
            page === '...' ? (
              <span key={index} className="px-3 py-1 text-gray-600">...</span>
            ) : (
              <button
                key={page}
                onClick={() => { /* Implement page change to 'page' */ }}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  currentPage === page
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {page}
              </button>
            )
          ))}
          <button
            onClick={() => { /* Implement next page */ }}
            disabled={currentPage === totalPages}
            className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceProvidersList;