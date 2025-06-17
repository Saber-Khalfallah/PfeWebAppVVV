// components/SearchBar.tsx
import React from 'react';

const SearchBar: React.FC = () => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-wrap gap-4 items-center">
      <div className="relative flex-grow min-w-[200px]">
        <input
          type="text"
          placeholder="Search providers..."
          className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <svg
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          ></path>
        </svg>
      </div>

      <select className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
        <option>Registration Date</option>
        <option>Newest</option>
        <option>Oldest</option>
      </select>

      <select className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
        <option>All Locations</option>
        <option>New York, NY</option>
        <option>Los Angeles, CA</option>
        <option>Chicago, IL</option>
        <option>Houston, TX</option>
        <option>Phoenix, AZ</option>
        <option>Boston, MA</option>
      </select>

      <select className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
        <option>All Categories</option>
        <option>Electrician</option>
        <option>Cleaner</option>
        <option>Plumber</option>
        <option>Tutor</option>
        <option>Handyman</option>
        <option>Pet Care</option>
      </select>
    </div>
  );
};

export default SearchBar;