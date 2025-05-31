// User model
export interface User {
  id: string;
  email: string;
  passwordHash: string;
  createdAt: string;
  updatedAt: string;
  avatarUrl: string;
}

// Category model
export interface Category {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

// Job Request model
export interface JobRequest {
  id: string;
  jobId: string;
  requesterId: string;
  targetId: string;
  type: string;
  status: string;
  message: string | null;
  createdAt: string;
  updatedAt: string;
  respondedAt: string;
  requester: User;
  target: User;
}

export interface JobMmedia {
  id: string;
  jobId: string;
  mediaUrl: string;
}
export interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  requestedDatetime: string;
  status: string;
  estimatedCost: string | null;
  actualCost: string | null;
  createdAt: string;
  updatedAt: string;
  Media: JobMmedia[];
  client: {
    userId: string;
    firstName: string;
    lastName: string;
    contactInfo: string;
    location: string;
    registrationDate: string;
    createdAt: string;
    updatedAt: string;
    user: {
      id: string;
      email: string;
      avatarUrl: string;
      createdAt: string;
      updatedAt: string;
    };
  };

  category: {
    id: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
  };

  jobRequests?: Array<{
    id: string;
    jobId: string;
    requesterId: string;
    targetId: string;
    type: string;
    status: string;
    message: string | null;
    createdAt: string;
    updatedAt: string;
    respondedAt: string | null;
    requester: {
      id: string;
      email: string;
      avatarUrl: string;
      createdAt: string;
      updatedAt: string;
    };
    target: {
      id: string;
      email: string;
      avatarUrl: string;
      createdAt: string;
      updatedAt: string;
    };
  }>;

  messages?: any[]; // You can refine this based on your message object schema
}

// API Response types
export interface FetchUserJobsResponse {
  jobs: Job[];
  success: boolean;
  message?: string;
  statusCode?: number;
  backendError?: any;
  totalCount?: number;
  currentPage?: number;
  totalPages?: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
}
export interface ServiceCategory {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}
export interface Craftsman {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  email?: string;
  phone?: string;
  location: string;
  specialization: string;
  experience: string;
  hourlyRate: number
  companyName: string;
  description: string;
  registrationDate: string;
  isValidated: boolean;
  specialties: Array<{ category: { name: string } }>;
  reviews?: Array<{
    rating: number;
    comment: string;
    createdAt: string;
    user: {
      name: string;
      avatar: string;
    };
  }>;
};