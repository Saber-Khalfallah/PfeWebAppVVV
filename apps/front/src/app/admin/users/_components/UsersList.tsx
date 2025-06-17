// components/UserList.jsx
import UserCard from './UserCard';
import { UserListProps } from '@/lib/types/modelTypes';
type PageItem = number | '...';

const UserList = ({ users, totalResults, currentPage, onPageChange,onToggleStatus }:UserListProps) => {
  const pageSize = 5; // As seen in the image
  const totalPages = Math.ceil(totalResults / pageSize);

  
  const getPageNumbers = () : PageItem[] => {
    const pages : PageItem[] = [];
    if (totalPages <= 5) { // Show all pages if 5 or less
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else { // Show a limited set with ellipses
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
      <div className="grid grid-cols-[1.5fr_2fr_1.5fr_1.2fr_1fr_1.5fr] px-4 py-3 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
        <div>User</div>
        <div>Email</div>
        <div>User Type</div>
        <div>Created On</div>
        <div>Status</div>
        <div className="text-center">Actions</div>
      </div>

      {/* User Cards */}
      <div>
        {users.map((user) => (
          <UserCard key={user.id} user={user} onToggleStatus={onToggleStatus} />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center px-4 py-3 border-t border-gray-200">
        <div className="text-sm text-gray-600">
          Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, totalResults)} of {totalResults} results
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => onPageChange(currentPage - 1)}
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
                onClick={() => onPageChange(page)}
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
            onClick={() => onPageChange(currentPage + 1)}
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

export default UserList;