// components/SearchBar.jsx
import { ChangeEvent, useState } from 'react';

interface FilterValues {
    userType: string;
    accountStatus: string;
    createdAt: string;
    searchTerm: string;  // Add this line

}

interface SearchBarProps {
    value: string;
    onSearch: (searchTerm: string) => void;
    onFilterChange: (filters: FilterValues) => void;  // Changed from string to FilterValues
}

type FilterName = 'userType' | 'accountStatus' | 'createdAt';

const SearchBar = ({ onSearch, onFilterChange }: SearchBarProps) => {
     const [searchTerm, setSearchTerm] = useState('');
  const [userType, setUserType] = useState('All Users');
  const [accountStatus, setAccountStatus] = useState('All Status');
  const [createdAt, setCreatedAt] = useState('desc');
    const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newSearchTerm = e.target.value;
        setSearchTerm(newSearchTerm);

        // Immediately trigger the filter change with updated search term
        const newFilters: FilterValues = {
            searchTerm: newSearchTerm,
            userType,
            accountStatus,
            createdAt,
        };

        onFilterChange(newFilters);
    };
    const handleFilterChange = (filterName: FilterName, value: string) => {
        // Update the state
        let newUserType = userType;
        let newAccountStatus = accountStatus;
        let newCreatedAt = createdAt;

        switch (filterName) {
            case 'userType':
                newUserType = value;
                setUserType(value);
                break;
            case 'accountStatus':
                newAccountStatus = value;
                setAccountStatus(value);
                break;
            case 'createdAt':
                newCreatedAt = value;
                setCreatedAt(value);
                break;
        }

        // Create new filters object with updated values
        const newFilters: FilterValues = {
            searchTerm,
            userType: newUserType,
            accountStatus: newAccountStatus,
            createdAt: newCreatedAt,
        };

        onFilterChange(newFilters);
    };
    return (
        <div className="bg-white rounded-lg shadow-md p-4 mb-6 flex flex-wrap items-center justify-between space-y-4 md:space-y-0 md:flex-row">
            <div className="flex flex-wrap items-center space-x-4">
                {/* User Type Filter */}
                <div className="flex flex-col">
                    <label htmlFor="userType" className="text-xs font-semibold text-gray-500 mb-1">
                        User Type
                    </label>
                    <div className="relative">
                        <select
                            id="userType"
                            className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-md leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={userType}
                            onChange={(e) => handleFilterChange('userType', e.target.value)}
                        >
                            <option>All Users</option>
                            <option>Admin</option>
                            <option>Client</option>
                            <option>Service Provider</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 6.757 7.586 5.343 9z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Account Status Filter */}
                <div className="flex flex-col">
                    <label htmlFor="accountStatus" className="text-xs font-semibold text-gray-500 mb-1">
                        Account Status
                    </label>
                    <div className="relative">
                        <select
                            id="accountStatus"
                            className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-md leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={accountStatus}
                            onChange={(e) => handleFilterChange('accountStatus', e.target.value)}
                        >
                            <option>All Status</option>
                            <option>Active</option>
                            <option>Inactive</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 6.757 7.586 5.343 9z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Date Created Filter */}
                <div className="flex flex-col">
                    <label htmlFor="dateCreated" className="text-xs font-semibold text-gray-500 mb-1">
                        Date Created
                    </label>
                    <div className="relative">
                        <select
                            id="dateCreated"
                            className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-md leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={createdAt}
                            onChange={(e) => handleFilterChange('createdAt', e.target.value)}
                        >
                            <option value="desc">Newest First</option>
                            <option value="asc">Oldest First</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 6.757 7.586 5.343 9z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-auto">
                <input
                    type="text"
                    placeholder="Search by name or email.."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>
        </div>
    );
};

export default SearchBar;