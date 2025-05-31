"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation"; // Import useRouter
import { fetchUserJobs, JobQueryParams } from "@/lib/actions/jobAction"; // Ensure JobQueryParams is exported from jobAction
import { fetchCategories } from "@/lib/actions/categoriesAction"; // Import the real function
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";
import NoJobs from "./_components/noJobs";
import JobList from "./_components/jobList";
import JobSearchAndFilters from "./_components/SearchBar"; // Import the new component
import { Job, ServiceCategory } from "@/lib/types/modelTypes";

const UserJobsPage = () => {
  const router = useRouter(); // For updating URL
  const searchParams = useSearchParams();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0); // To display total jobs

  // State for categories
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  // Get parameters from URL
  const pageParam = searchParams.get("page");
  const statusParam: string | undefined =
    searchParams.get("status") ?? undefined;
  const searchTermParam = searchParams.get("searchTerm");
  const categoryIdParam = searchParams.get("categoryId");
  const orderByParam =
    (searchParams.get("orderBy") as "asc" | "desc") || "desc";

  const currentPage = pageParam ? parseInt(pageParam) : 1;

  const buildFilterParams = () => {
    const params = new URLSearchParams();

    if (searchTermParam) params.set("searchTerm", searchTermParam);
    if (categoryIdParam && categoryIdParam !== "All")
      params.set("categoryId", categoryIdParam);
    if (statusParam && statusParam !== "All") params.set("status", statusParam);
    if (orderByParam) params.set("orderBy", orderByParam);

    return params;
  };

  const currentFilterParams = buildFilterParams();
  // Load categories on component mount
  useEffect(() => {
    const loadCategories = async () => {
      setCategoriesLoading(true);
      try {
        const categoriesData = await fetchCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error("Failed to load categories:", error);
        // Fallback to empty array if categories fail to load
        setCategories([]);
      } finally {
        setCategoriesLoading(false);
      }
    };

    loadCategories();
  }, []);

  // Callback for handling filter changes from JobSearchAndFilters
  const handleFilterChange = useCallback(
    (filters: {
      searchTerm?: string;
      categoryId?: string;
      status?: string;
      orderBy?: "asc" | "desc";
    }) => {
      const currentParams = new URLSearchParams(searchParams.toString());

      if (filters.searchTerm && filters.searchTerm.trim() !== "") {
        currentParams.set("searchTerm", filters.searchTerm.trim());
      } else {
        currentParams.delete("searchTerm");
      }

      if (filters.categoryId && filters.categoryId !== "All") {
        currentParams.set("categoryId", filters.categoryId);
      } else {
        currentParams.delete("categoryId");
      }

      if (filters.status && filters.status !== "All") {
        currentParams.set("status", filters.status);
      } else {
        currentParams.delete("status");
      }

      if (filters.orderBy) {
        currentParams.set("orderBy", filters.orderBy);
      } else {
        currentParams.delete("orderBy");
      }

      // Reset page to 1 on any filter change
      currentParams.set("page", "1");

      router.push(`?${currentParams.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  useEffect(() => {
    const loadJobs = async () => {
      setLoading(true);
      setError(null);

      const params: JobQueryParams = {
        page: currentPage,
        pageSize: DEFAULT_PAGE_SIZE,
        // Only include params if they have a value
        ...(statusParam && { status: statusParam }),
        ...(searchTermParam && { searchTerm: searchTermParam }),
        ...(categoryIdParam && { categoryId: categoryIdParam }),
      };

      const jobsResult = await fetchUserJobs(params);

      if (!jobsResult.success) {
        setError(jobsResult.message || "Failed to load jobs");
        setJobs([]); // Clear jobs on error
        setTotalPages(1);
        setTotalCount(0);
      } else {
        setJobs(jobsResult.jobs);
        setTotalPages(jobsResult.totalPages || 1);
        setTotalCount(jobsResult.totalCount || 0);
      }
      setLoading(false);
    };

    loadJobs();
  }, [
    pageParam,
    statusParam,
    searchTermParam,
    categoryIdParam,
    currentPage,
    orderByParam,
  ]); // Depend on params from URL

  // Show loading if either jobs or categories are still loading
  const isInitialLoading = loading && categoriesLoading;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Your Jobs</h1>

      {/* Integrate the Search and Filters Bar */}
      <div className="mb-6 rounded-lg shadow">
        {categoriesLoading ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-600">Loading filters...</p>
          </div>
        ) : (
          <JobSearchAndFilters
            onFilterChange={handleFilterChange}
            initialFilters={{
              searchTerm: searchTermParam || "",
              categoryId: categoryIdParam || "All",
              // add here:
              status: statusParam,
              orderBy: orderByParam,
            }}
            categoryOptions={categories.map((category) => ({
              id: category.id,
              name: category.name,
            }))}
          />
        )}
      </div>

      {isInitialLoading && (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-3 text-gray-600">Loading jobs...</p>
        </div>
      )}

      {!loading && error && (
        <div className="text-red-600 bg-red-100 p-4 rounded-md">
          Error loading jobs: {error}
        </div>
      )}

      {!loading && !error && (
        <>
          {jobs.length === 0 ? (
            <NoJobs />
          ) : (
            <JobList
              jobs={jobs}
              currentPage={currentPage}
              totalPages={totalPages}
              currentQueryParams={currentFilterParams}
              // totalCount={totalCount} // You can pass totalCount to JobList if needed
            />
          )}
        </>
      )}
    </div>
  );
};

export default UserJobsPage;
