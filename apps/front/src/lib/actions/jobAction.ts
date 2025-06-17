import axios from "axios";
import { Job, FetchUserJobsResponse } from "../types/modelTypes";
import { JobFormState } from "../types/formState";
import { jobSchema } from "../zodSchemas/jobFormSchema";

export type JobStatus = 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'CLOSED' | 'All';

export type JobQueryParams = Partial<Job> & {
  page?: number;
  pageSize?: number;
  searchTerm?: string;
  jobType?: string;
  datePosted?: string;
  orderBy?: string;
  status?: JobStatus;
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
  // Convert FormData to a plain object
  const formDataObj = Object.fromEntries(jobData.entries());

  // Convert coordinates to numbers and handle other field conversions
  const formValues: Record<string, any> = {
    ...formDataObj,
    latitude: formDataObj.latitude ? parseFloat(formDataObj.latitude as string) : null,
    longitude: formDataObj.longitude ? parseFloat(formDataObj.longitude as string) : null,
    estimatedCost: formDataObj.estimatedCost ? parseFloat(formDataObj.estimatedCost as string) : null
  };
  if (formValues.latitude && formValues.latitude !== "") {
    formValues.latitude = parseFloat(formValues.latitude as string);
  }
  if (formValues.longitude && formValues.longitude !== "") {
    formValues.longitude = parseFloat(formValues.longitude as string);
  }
  // Get images from FormData
  const images = jobData.getAll('images');
  const imageFiles = images.filter(file => file instanceof File) as File[];

  // Remove images from validation data since Zod can't validate File objects
  const validationFields = {
    ...formValues,
    images: undefined
  };
  delete validationFields.images;

  // Validate form fields using Zod
  const validatedFields = jobSchema.safeParse(validationFields);
  console.log("Validation result:", validatedFields);

  if (!validatedFields.success) {
    console.error("Validation failed:", validatedFields.error.flatten());
    // Keep original form values but remove file objects
    const dataToReturn = { ...formDataObj } as any;
    if (dataToReturn.images) {
      delete dataToReturn.images;
    }
    return {
      data: dataToReturn,
      errors: validatedFields.error.flatten().fieldErrors,
      ok: false,
      message: "Please correct the errors in the form."
    };
  }

  try {
    console.log("Proceeding with backend API request");

    // Create new FormData for API call
    const apiFormData = new FormData();

    // Add validated non-file fields
    const locationData = {
      latitude: Number(validatedFields.data.latitude),
      longitude: Number(validatedFields.data.longitude)
    };
    const jobData = {
      title: validatedFields.data.title,
      description: validatedFields.data.description,
      categoryId: validatedFields.data.categoryId,
      governorate: validatedFields.data.governorate,
      governorateAr: validatedFields.data.governorateAr,
      delegation: validatedFields.data.delegation,
      delegationAr: validatedFields.data.delegationAr,
      postalCode: validatedFields.data.postalCode,
      estimatedCost: validatedFields.data.estimatedCost,
      requestedDatetime: validatedFields.data.requestedDatetime || undefined
    };
    // Add all validated fields
    Object.entries(validatedFields.data).forEach(([key, value]) => {
      if (value !== undefined && value !== null && key !== 'images') {
        apiFormData.append(key, value.toString());
      }
    });
    console.log("API FormData contents:", Array.from(apiFormData.entries()));
    // Add location data
    // apiFormData.append('location', JSON.stringify(locationData));

    // Add images if present
    if (imageFiles.length > 0) {
      imageFiles.forEach(file => {
        apiFormData.append('images', file);
      });
    }

    // Make API request
    const response = await axios.post(
      "http://localhost:8000/api/job", {
      ...jobData,
      ...locationData
    },
      {
        headers: {
          // Let axios set the content type for FormData
        },
        withCredentials: true,
      }
    );

    if (response.data) {
      return {
        message: "Success! New Job Saved",
        ok: true,
        data: response.data
      };
    }

  } catch (error) {
    const errorMessage = axios.isAxiosError(error)
      ? error.response?.data?.message || error.message || "Something went wrong"
      : "An unexpected error occurred";

    const errorDetails = axios.isAxiosError(error) && error.response?.data?.errors
      ? error.response.data.errors
      : {};

    // Prepare data for form re-population (without File objects)
    const dataToReturn = { ...formDataObj } as any;
    if (dataToReturn.images) {
      delete dataToReturn.images;
    }

    return {
      data: dataToReturn,
      ok: false,
      message: errorMessage,
      errors: errorDetails
    };
  }

  return {
    ok: false,
    data: formValues,
    errors: { general: ["Failed to create job"] },
    message: "An unexpected error occurred"
  };
}
export async function updateJob(
  id: string,
  state: JobFormState,
  jobData: FormData,
  removedImages: string[] = [] // Include removedImages parameter
): Promise<JobFormState> {
  // Convert FormData to a plain object
  const formDataObj = Object.fromEntries(jobData.entries());

  // Convert coordinates to numbers and handle other field conversions
  const formValues: Record<string, any> = {
    ...formDataObj,
    latitude: formDataObj.latitude ? parseFloat(formDataObj.latitude as string) : null,
    longitude: formDataObj.longitude ? parseFloat(formDataObj.longitude as string) : null,
    estimatedCost: formDataObj.estimatedCost ? parseFloat(formDataObj.estimatedCost as string) : null
  };

  // Get images from FormData
  const images = jobData.getAll('images');
  const imageFiles = images.filter(file => file instanceof File) as File[];

  // Remove images from validation data
  const validationFields = {
    ...formValues,
    images: undefined
  };
  delete validationFields.images;

  // Validate form fields using Zod
  const validatedFields = jobSchema.safeParse(validationFields);
  console.log("Update validation result:", validatedFields);

  if (!validatedFields.success) {
    console.error("Update validation failed:", validatedFields.error.flatten());
    const dataToReturn = { ...formDataObj } as any;
    if (dataToReturn.images) {
      delete dataToReturn.images;
    }
    return {
      data: dataToReturn,
      errors: validatedFields.error.flatten().fieldErrors,
      ok: false,
      message: "Please correct the errors in the form."
    };
  }

  try {
    console.log("Proceeding with update request");

    const jobPayload = {
      title: validatedFields.data.title,
      description: validatedFields.data.description,
      categoryId: validatedFields.data.categoryId,
      governorate: validatedFields.data.governorate,
      governorateAr: validatedFields.data.governorateAr,
      delegation: validatedFields.data.delegation,
      delegationAr: validatedFields.data.delegationAr,
      postalCode: validatedFields.data.postalCode,
      latitude: Number(validatedFields.data.latitude),
      longitude: Number(validatedFields.data.longitude),
      estimatedCost: Number(validatedFields.data.estimatedCost),
      requestedDatetime: validatedFields.data.requestedDatetime || undefined,
      removedImages: removedImages // Include removed images here
    };

    let response;

    // Handle form data for new images
    const formDataToSend = new FormData();
    if (imageFiles.length > 0) {
      imageFiles.forEach(file => {
        formDataToSend.append('images', file);
      });
    }

    // First, update job data (including removedImages)
    await axios.patch(
      `http://localhost:8000/api/job/${id}`,
      jobPayload, // Send job payload including removedImages
      {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true,
      }
    );

    // Then, upload new images separately
    if (imageFiles.length > 0) {
      response = await axios.patch(
        `http://localhost:8000/api/job/${id}`,
        formDataToSend, // Send new images as FormData
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
        }
      );
    } else {
      response = await axios.patch(
        `http://localhost:8000/api/job/${id}`,
        jobPayload, // Just send job data if no new images
        {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true,
        }
      );
    }

    if (response.data) {
      return {
        message: "Job Updated Successfully!",
        ok: true,
        data: response.data
      };
    }

  } catch (error) {
    const errorMessage = axios.isAxiosError(error)
      ? error.response?.data?.message || error.message || "Something went wrong"
      : "An unexpected error occurred";

    const errorDetails = axios.isAxiosError(error) && error.response?.data?.errors
      ? error.response.data.errors
      : {};

    return {
      data: formDataObj,
      ok: false,
      message: errorMessage,
      errors: errorDetails
    };
  }

  return {
    ok: false,
    data: formValues,
    errors: { general: ["Failed to update job"] },
    message: "An unexpected error occurred"
  };
}
// Add this new function to your jobAction.ts file
export async function closeJob(
  jobId: string,
  reason: string
): Promise<{ ok: boolean; message: string; data?: any }> {
  try {
    const response = await axios.patch(
      `http://localhost:8000/api/job/${jobId}/close`,
      { reason },
      {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true,
      }
    );

    if (response.data) {
      return {
        ok: true,
        message: 'Job closed successfully',
        data: response.data
      };
    }

    return {
      ok: false,
      message: 'Failed to close job'
    };

  } catch (error) {
    const errorMessage = axios.isAxiosError(error)
      ? error.response?.data?.message || error.message || "Failed to close job"
      : "An unexpected error occurred";

    return {
      ok: false,
      message: errorMessage
    };
  }
}
// First, add this new function to your jobAction.ts
export async function assignProvider(
  jobId: string,
  providerId: string
): Promise<{ ok: boolean; message: string; data?: any }> {
  try {
    console.log('assignProvider - Starting with params:', { jobId, providerId });

    if (!jobId || !providerId) {
      throw new Error('Missing required parameters');
    }

    const response = await axios.post(
      `http://localhost:8000/api/job/${jobId}/assign`,
      { providerId },
      {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true,
      }
    );

    if (!response.data) {
      throw new Error('No data received from server');
    }

    console.log('assignProvider - Success response:', response.data);
    return {
      ok: true,
      message: 'Provider assigned successfully',
      data: response.data
    };
  } catch (error) {
    console.error('assignProvider - Error details:', {
      error,
      response: axios.isAxiosError(error) ? {
        data: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText,
        headers: error.response?.headers
      } : null
    });

    return {
      ok: false,
      message: axios.isAxiosError(error)
        ? error.response?.data?.message || 'Failed to assign provider'
        : 'An unexpected error occurred'
    };
  }
}