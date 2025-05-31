import React, { useState, useEffect, useRef } from "react";
import { useDebounce } from "use-debounce";

// SVG Icons (can be moved to a separate file or component library)
const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5 text-gray-400"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
    />
  </svg>
);

const ChevronDownIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className="w-4 h-4 text-gray-500"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m19.5 8.25-7.5 7.5-7.5-7.5"
    />
  </svg>
);

interface JobSearchAndFiltersProps {
  onFilterChange: (filters: {
    searchTerm?: string;
    categoryId?: string;
    status?: string;
    orderBy?: "asc" | "desc";
  }) => void;
  initialFilters: {
    searchTerm?: string;
    categoryId?: string;
    status?: string;
    orderBy?: "asc" | "desc";
  };
  categoryOptions: Array<{ id: string; name: string }>;
  statusOptions?: Array<{ id: string; name: string }>;
}

const JobSearchAndFilters: React.FC<JobSearchAndFiltersProps> = ({
  onFilterChange,
  initialFilters,
  categoryOptions = [],
  statusOptions = [
    { id: "All", name: "All Statuses" }, // Changed to 'All Statuses' to match image
    { id: "OPEN", name: "OPEN" },
    { id: "CLOSED", name: "CLOSED" },
    { id: "INPROGRESS", name: "IN PROGRESS" },
    { id: "CANCELLED", name: "CANCELLED" },
    { id: "COMPLETED", name: "COMPLETED" },
  ],
}) => {
  const [searchTerm, setSearchTerm] = useState(initialFilters.searchTerm || "");
  const [selectedCategoryId, setSelectedCategoryId] = useState(
    initialFilters.categoryId || "All",
  );
  const [selectedStatus, setSelectedStatus] = useState(
    initialFilters.status || "All",
  );
  const [selectedOrderBy, setSelectedOrderBy] = useState<"asc" | "desc">(
    initialFilters.orderBy || "desc",
  );

  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

  const lastFilters = useRef<{
    searchTerm?: string;
    categoryId?: string;
    status?: string;
    orderBy?: "asc" | "desc";
  }>({});

  useEffect(() => {
    const filtersToApply: {
      searchTerm?: string;
      categoryId?: string;
      status?: string;
      orderBy?: "asc" | "desc";
    } = {};

    filtersToApply.searchTerm = debouncedSearchTerm.trim();
    filtersToApply.categoryId =
      selectedCategoryId !== "All" ? selectedCategoryId : undefined;
    filtersToApply.status =
      selectedStatus !== "All" ? selectedStatus : undefined;
    filtersToApply.orderBy = selectedOrderBy;

    const isSameFilters =
      (lastFilters.current.searchTerm || "") ===
        (filtersToApply.searchTerm || "") &&
      (lastFilters.current.categoryId || undefined) ===
        (filtersToApply.categoryId || undefined) && // Ensure undefined comparison
      (lastFilters.current.status || undefined) ===
        (filtersToApply.status || undefined) && // Ensure undefined comparison
      (lastFilters.current.orderBy || "") === (filtersToApply.orderBy || "");

    if (!isSameFilters) {
      lastFilters.current = { ...filtersToApply }; // Store a copy
      onFilterChange(filtersToApply);
    }
  }, [
    debouncedSearchTerm,
    selectedCategoryId,
    selectedStatus,
    selectedOrderBy,
    onFilterChange,
  ]);

  const selectBaseClasses =
    "bg-white border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5 appearance-none pr-8";
  const selectContainerBaseClasses = "relative";
  const selectIconContainerBaseClasses =
    "absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none";

  return (
    <div className="p-4 bg-sky-50 border border-sky-200 rounded-lg">
      {" "}
      {/* Outer container with light blue border */}
      <div className="flex flex-wrap items-center gap-4">
        {" "}
        {/* Changed gap to 4 for closer spacing like image */}
        {/* Search Input */}
        <div className="relative flex-grow sm:flex-grow-0 sm:w-auto md:min-w-[280px] lg:min-w-[350px]">
          {" "}
          {/* Adjusted min-width */}
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <SearchIcon />
          </div>
          <input
            type="text"
            placeholder="Search projects..." // Changed placeholder
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full pl-10 p-2.5"
          />
        </div>
        {/* Status Select */}
        <div className={`${selectContainerBaseClasses} min-w-[150px]`}>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className={selectBaseClasses}
          >
            {statusOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
          <div className={selectIconContainerBaseClasses}>
            <ChevronDownIcon />
          </div>
        </div>
        {/* Category Select */}
        {categoryOptions.length > 0 && (
          <div className={`${selectContainerBaseClasses} min-w-[150px]`}>
            <select
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
              className={selectBaseClasses}
            >
              <option value="All">All Categories</option>
              {categoryOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
            <div className={selectIconContainerBaseClasses}>
              <ChevronDownIcon />
            </div>
          </div>
        )}
        {/* OrderBy Select */}
        <div className={`${selectContainerBaseClasses} min-w-[180px]`}>
          {" "}
          {/* Adjusted min-width for longer text */}
          <select
            value={selectedOrderBy}
            onChange={(e) =>
              setSelectedOrderBy(e.target.value as "asc" | "desc")
            }
            className={selectBaseClasses}
          >
            <option value="desc">Sort by: Newest</option> {/* Changed text */}
            <option value="asc">Sort by: Oldest</option> {/* Changed text */}
          </select>
          <div className={selectIconContainerBaseClasses}>
            <ChevronDownIcon />
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSearchAndFilters;
