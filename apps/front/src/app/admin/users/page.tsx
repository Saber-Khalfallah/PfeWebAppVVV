// app/page.js
'use client'; // This directive is necessary for client-side components in Next.js App Router

import { useState, useEffect, SetStateAction, useCallback } from 'react';
import SearchBar from './_components/SearchBar';
import UserList from './_components/UsersList';
import NoUsers from './_components/NoUsers';
import { FilterState, User } from '@/lib/types/modelTypes';
import { fetchUsers, toggleUserStatus } from '@/lib/actions/adminAction';
import { toast } from '@/hooks/use-toast';



export default function HomePage() {
    const [currentPage, setCurrentPage] = useState(1);
    const [users, setUsers] = useState<User[]>([]);
    const [totalResults, setTotalResults] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const usersPerPage = 5; // Matches the image's "Showing 1 to 5 of 20 results"

    const [filters, setFilters] = useState<FilterState>({
        searchTerm: '',
        userType: 'All Users',
        accountStatus: 'All Status',
        createdAt: 'desc',
        page: 1,
        pageSize: 5,
    });
    const onToggleStatus = async (userId: string) => {
        try {
            setLoading(true);
            const userToUpdate = users.find(u => u.id === userId);
            if (!userToUpdate) return;

            // Use the toggleUserStatus action instead of direct fetch
            await toggleUserStatus(userId);

            // Refresh the users list to get updated data
            await loadUsers();

            toast({
                title: 'Success',
                description: `User ${userToUpdate.isActive ? 'deactivated' : 'activated'} successfully`,
                variant: 'default'
            });
        } catch (error) {
            console.error('Error toggling user status:', error);
            toast({
                title: 'Error',
                description: 'Failed to update user status. Please try again.',
                variant: 'destructive'
            });
        } finally {
            setLoading(false);
        }
    };
    const loadUsers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchUsers({
                ...filters,
                page: currentPage,
                pageSize: usersPerPage,
            });

            console.log("Fetched users:", data); // Debugging log
            if (data && data.users) {
                // Extract the users array from the response object
                setUsers(data.users);
                setTotalResults(data.totalResults || 0);
            } else {
                setUsers([]);
                setTotalResults(0);
            }
        } catch (err) {
            console.error("Failed to load users:", err);
            setError("Failed to load users. Please check your network and try again.");
            // Reset users state on error
            setUsers([]);
            setTotalResults(0);
        } finally {
            setLoading(false);
        }
    }, [filters, currentPage, usersPerPage]);
    useEffect(() => {
        loadUsers();
    }, [loadUsers]); // Re-run effect when loadUsers changes (due to filter/page change)

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const handleSearch = (term: string) => {
        setFilters(prev => ({ ...prev, searchTerm: term || '' }));
        setCurrentPage(1); // Reset to first page on search
    };

    const handleFilterChange = (newFilters: Partial<FilterState>) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
        setCurrentPage(1); // Reset to first page on filter/sort change
    };

    console.log('users:', users);
    return (
        console.log('loading :', loading, 'users :', users, 'error : ', error),
        <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">User Management</h1>
            <SearchBar onSearch={handleSearch} onFilterChange={handleFilterChange} value={filters.searchTerm} />

            {loading && (
                <div className="flex justify-center items-center py-10 bg-white rounded-lg shadow-md">
                    <p className="text-lg text-gray-600">Loading users...</p>
                    <div className="ml-3 h-5 w-5 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] text-blue-500 motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
                        <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
                    </div>
                </div>
            )}

            {error && (
                <div className="flex justify-center items-center  bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <span className="block sm:inline">{error}</span>
                </div>
            )}

            {!loading && !error && users.length === 0 && (
                <NoUsers message="No users found matching your criteria." />
            )}

            {!loading && !error && users.length > 0 && (
                <UserList
                    users={users}
                    totalResults={totalResults}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                    onToggleStatus={onToggleStatus}

                />
            )}
        </div>
    );
}