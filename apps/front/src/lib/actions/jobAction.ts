import axios from "axios";
import { Job, FetchUserJobsResponse } from "../types/modelTypes";
import { JobFormState } from "../types/formState";
import { jobSchema } from "../zodSchemas/jobFormSchema";

export type JobQueryParams = Partial<Job> & {
  page?: number;
  pageSize?: number;
  searchTerm?: string;
  jobType?: string;
  datePosted?: string;
  orderBy?: string;
};

export const fetchUserJobs = async (
  params?: JobQueryParams,
): Promise<FetchUserJobsResponse> => {
  try {
    const queryParams = new URLSearchParams();

    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.pageSize)
      queryParams.append("pageSize", params.pageSize.toString());

    if (params?.searchTerm && params.searchTerm.trim() !== "") {
      queryParams.append("searchTerm", params.searchTerm);
    }

    if (params?.category?.id && params.category.id !== "All") {
      queryParams.append("categoryId", params.category.id);
    }

    if (params?.status && params.status !== "All") {
      queryParams.append("status", params.status);
    }

    if (params?.orderBy) {
      queryParams.append("orderBy", params.orderBy);
    }

    const url = `http://localhost:8000/api/job/my-jobs${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
    console.log("Fetching jobs from URL:", url);

    const response = await axios.get(url, { withCredentials: true });

    const {
      jobs,
      totalCount,
      currentPage,
      totalPages,
      hasNextPage,
      hasPreviousPage,
    } = response.data;

    return {
      jobs,
      success: true,
      totalCount,
      currentPage,
      totalPages,
      hasNextPage,
      hasPreviousPage,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        return {
          jobs: [],
          success: false,
          message:
            error.response.data?.message ||
            error.response.data?.error ||
            `Request failed with status ${error.response.status}`,
          statusCode: error.response.status,
          backendError: error.response.data,
        };
      } else if (error.request) {
        return {
          jobs: [],
          success: false,
          message: "Network error. Please check your connection.",
        };
      }
    }

    return {
      jobs: [],
      success: false,
      message: "An unexpected error occurred.",
    };
  }
};

export const fetchJobById = async (id: string): Promise<Job | null> => {
  try {
    const response = await axios.get(`http://localhost:8000/api/job/${id}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching job by ID:", error);
    return null;
  }
};

export async function createJob(
  state: JobFormState,
  jobData: FormData,
): Promise<JobFormState> {
  // Get non-file data for validation
  const data = Object.fromEntries(jobData.entries());
  
  // Remove files from validation data since Zod can't validate File objects
  const validationData = { ...data };
  delete validationData.images;
  
  console.log('estimatedCost before validation:', validationData.estimatedCost, typeof validationData.estimatedCost);
  
  const validatedFields = jobSchema.safeParse(validationData);
  
  if (!validatedFields.success) {
    return {
      ok: false,
      data: data,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    // Send the raw FormData object (not JSON) for file uploads
    const response = await axios.post(
      "http://localhost:8000/api/job",
      jobData, // Send the raw FormData object
      {
        headers: {
          // Don't set Content-Type - let axios set it automatically for FormData
          // This will be 'multipart/form-data' with boundary
        },
        withCredentials: true,
      },
    );

    if (response.data) {
      return {
        message: "Success ! New Job Saved",
        ok: true,
        data: response.data,
      };
    } else {
      return {
        ok: false,
        data: data,
        errors: { title: ["Unknown error occurred."] },
      };
    }
  } catch (error: any) {
    let errorMsg = "Unknown error occurred.";
    if (axios.isAxiosError(error) && error.response?.data?.errors) {
      return {
        ok: false,
        data: data,
        errors: error.response.data.errors,
      };
    }
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      errorMsg = error.response.data.message;
    } else if (error?.message) {
      errorMsg = error.message;
    }
    return {
      ok: false,
      data: data,
      errors: { title: [errorMsg] },
    };
  }
}