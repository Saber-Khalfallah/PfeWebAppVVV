// components/AllJobList.tsx
'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Job } from '@/lib/types/modelTypes';
import ProviderJobCard from './ProviderJobCard';
import NoJobs from './NoJobs';

interface AllJobListProps {
    jobs: Job[];
    searchTerm?: string;
    location?: string;
    category?: string;
    onClearFilters: () => void;
    onApply: (jobId: string) => void;
    sortBy: string;
}

const AllJobList: React.FC<AllJobListProps> = ({
    jobs,
    searchTerm,
    location,
    category,
    onClearFilters,
    onApply,
    sortBy
}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const jobsPerPage = 5;

    // Sort jobs based on selected criteria
    const sortedJobs = [...jobs].sort((a, b) => {
        switch (sortBy) {
            case 'Most Recent':
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            case 'Oldest':
                return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            case 'Salary High to Low':
                const aMax = a.estimatedCost ? parseInt(a.estimatedCost.split('-')[1]?.replace(/\D/g, '') || '0') : 0;
                const bMax = b.estimatedCost ? parseInt(b.estimatedCost.split('-')[1]?.replace(/\D/g, '') || '0') : 0;
                return bMax - aMax;
            case 'Salary Low to High':
                const aMin = a.estimatedCost ? parseInt(a.estimatedCost.split('-')[0]?.replace(/\D/g, '') || '0') : 0;
                const bMin = b.estimatedCost ? parseInt(b.estimatedCost.split('-')[0]?.replace(/\D/g, '') || '0') : 0;
                return aMin - bMin;
            default:
                return 0;
        }
    });

    // Pagination logic
    const totalPages = Math.ceil(sortedJobs.length / jobsPerPage);
    const startIndex = (currentPage - 1) * jobsPerPage;
    const endIndex = startIndex + jobsPerPage;
    const currentJobs = sortedJobs.slice(startIndex, endIndex);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Show NoJobs component if no jobs are found
    if (jobs.length === 0) {
        return (
            <NoJobs
                searchTerm={searchTerm}
                location={location}
                category={category}
                onClearFilters={onClearFilters}
            />
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="px-6 py-4">
                {/* Results header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600">
                            <strong>{jobs.length}</strong> jobs found matching your criteria
                        </span>
                    </div>
                </div>

                {/* Table headers */}
                <div className="bg-white border border-gray-200 rounded-t-lg">
                    <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-gray-200 bg-gray-50 rounded-t-lg">
                        <div className="col-span-5 text-sm font-medium text-gray-700">Job Title</div>
                        <div className="col-span-1 text-sm font-medium text-gray-700">Category</div>
                        <div className="col-span-1 text-sm font-medium text-gray-700">Location</div>
                        <div className="col-span-2 text-sm font-medium text-gray-700">Posted Date</div>
                        <div className="col-span-2 text-sm font-medium text-gray-700">Salary</div>
                        <div className="col-span-1 flex justify-center items-center">
                            <div className="px-4 rounded-md text-sm font-medium text-gray-700">
                                Action
                            </div>
                        </div>          </div>
                </div>

                {/* Job cards */}
                <div className="space-y-0 border-x border-gray-200">
                    {currentJobs.map((job, index) => (
                        <div key={job.id} className={`${index < currentJobs.length - 1 ? 'border-b border-gray-200' : ''}`}>
                            <ProviderJobCard job={job} onApply={onApply} />
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="bg-white border border-gray-200 rounded-b-lg px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>

                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                let pageNum;
                                if (totalPages <= 5) {
                                    pageNum = i + 1;
                                } else if (currentPage <= 3) {
                                    pageNum = i + 1;
                                } else if (currentPage >= totalPages - 2) {
                                    pageNum = totalPages - 4 + i;
                                } else {
                                    pageNum = currentPage - 2 + i;
                                }

                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => handlePageChange(pageNum)}
                                        className={`px-3 py-2 rounded-md text-sm font-medium ${currentPage === pageNum
                                                ? 'bg-blue-600 text-white'
                                                : 'text-gray-700 hover:bg-gray-100'
                                            }`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}

                            {totalPages > 5 && currentPage < totalPages - 2 && (
                                <>
                                    <span className="px-2 text-gray-500">...</span>
                                    <button
                                        onClick={() => handlePageChange(totalPages)}
                                        className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
                                    >
                                        {totalPages}
                                    </button>
                                </>
                            )}

                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllJobList;