// User model
export interface User {
  id: string;
  email: string;
  passwordHash: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  avatarUrl: string;

  role: string | null; // Role can be a string or null
  roleData: {
    firstName: string;
    lastName: string;
    contactInfo?: string | null; // Optional contact info
    location?: string | null; // Optional location
  }
  client?: boolean | null;
  serviceProvider?: boolean | null;
  administrator?: boolean | null;
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
// export interface Job {
//   id: string;
//   title: string;
//   description: string;
//   postalCode?: string;
//   governorate?: string;
//   governorateAr?: string;
//   delegation?: string;
//   delegationAr?: string;
//   latitude?: number;
//   longitude?: number;
//   requestedDatetime: string;
//   status: string;
//   estimatedCost: string | null;
//   actualCost: string | null;
//   createdAt: string;
//   updatedAt: string;
//   media: JobMmedia[];
//   providerId?: string | null;
//   client: {
//     userId: string;
//     firstName: string;
//     lastName: string;
//     contactInfo: string;
//     registrationDate: string;
//     createdAt: string;
//     updatedAt: string;
//     user: {
//       governorate?: string;
//       governorateAr?: string;
//       delegation?: string;
//       delegationAr?: string;
//       postalCode?: string;
//       latitude?: number;
//       longitude?: number;
//       id: string;
//       email: string;
//       avatarUrl: string;
//       createdAt: string;
//       updatedAt: string;
//     };
//   };
//     provider: {
//     userId: string;
//     firstName: string;
//     lastName: string;
//     contactInfo: string;
//     registrationDate: string;
//     createdAt: string;
//     updatedAt: string;
//     user: {
//       governorate?: string;
//       governorateAr?: string;
//       delegation?: string;
//       delegationAr?: string;
//       postalCode?: string;
//       latitude?: number;
//       longitude?: number;
//       id: string;
//       email: string;
//       avatarUrl: string;
//       createdAt: string;
//       updatedAt: string;
//     };
//   };



//   category: {
//     id: string;
//     name: string;
//     description: string;
//     createdAt: string;
//     updatedAt: string;
//   };

//   jobRequests?: Array<{
//     id: string;
//     jobId: string;
//     requesterId: string;
//     targetId: string;
//     type: string;
//     status: string;
//     message: string | null;
//     createdAt: string;
//     updatedAt: string;
//     respondedAt: string | null;
//     requester: {
//       id: string;
//       email: string;
//       avatarUrl: string;
//       createdAt: string;
//       updatedAt: string;
//     };
//     target: {
//       id: string;
//       email: string;
//       avatarUrl: string;
//       createdAt: string;
//       updatedAt: string;
//     };
//   }>;

//   messages?: any[]; // You can refine this based on your message object schema
// }
export interface Job {
  id: string;
  clientId: string;
  providerId?: string;
  categoryId: string;
  title: string;
  description: string;
  governorate?: string;
  governorateAr?: string;
  delegation?: string;
  delegationAr?: string;
  country?: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  requestedDatetime: string;
  status: JobStatus;
  estimatedCost?: number;
  actualCost?: number;
  completionDate?: string;
  createdAt: string;
  updatedAt: string;
  closedAt?: string;
  closedReason?: string;
  assignedAt?: string;

  // Relationships
  client: {
    userId: string;
    firstName: string;
    lastName: string;
    contactInfo: string;
    registrationDate: string;
    createdAt: string;
    updatedAt: string;
    user: {
      id: string;
      email: string;
      avatarUrl?: string;
      governorate?: string;
      governorateAr?: string;
      delegation?: string;
      delegationAr?: string;
      postalCode?: string;
      latitude?: number;
      longitude?: number;
    };
  };

  provider?: {
    userId: string;
    firstName: string;
    lastName: string;
    companyName?: string;
    contactInfo: string;
    description?: string;
    experienceYears?: number;
    hourlyRate?: number;
    isValidated: boolean;
    createdAt: string;
    updatedAt: string;
    ratings?: Rating[]; 
    specialties?: Array<{
      category: {
        name: string;
      };
    }>;
    user: {
      id: string;
      email: string;
      avatarUrl?: string;
      governorate?: string;
      governorateAr?: string;
      delegation?: string;
      delegationAr?: string;
      postalCode?: string;
      latitude?: number;
      longitude?: number;
    };
  };

  category: {
    id: string;
    name: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
  };

  media: Array<{
    id: string;
    jobId: string;
    mediaUrl: string;
    mediaType: string;
    caption?: string;
    uploadedAt: string;
    createdAt: string;
    updatedAt: string;
  }>;

  jobRequests?: Array<{
    id: string;
    jobId: string;
    requesterId: string;
    targetId: string;
    type: 'CLIENT_TO_PROVIDER' | 'PROVIDER_TO_CLIENT';
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';
    message?: string;
    createdAt: string;
    updatedAt: string;
    respondedAt?: string;
    requester: {
      id: string;
      email: string;
      avatarUrl?: string;
      serviceProvider?: {
        firstName: string;
        lastName: string;
        companyName?: string;
        contactInfo: string;
        description?: string;
        experienceYears?: number;
        hourlyRate?: number;
        ratings: any[];
        specialties: Array<{
          category: {
            name: string;
          };
        }>;
      };
    };
    target: {
      id: string;
      email: string;
      avatarUrl?: string;
      serviceProvider?: {
        firstName: string;
        lastName: string;
        companyName?: string;
        contactInfo: string;
        description?: string;
        experienceYears?: number;
        hourlyRate?: number;
        ratings: any[];
        specialties: Array<{
          category: {
            name: string;
          };
        }>;
      };
    };
  }>;

  messages?: Array<{
    id: string;
    jobId: string;
    senderId: string;
    receiverId: string;
    text: string;
    timestamp: string;
    isRead: boolean;
    createdAt: string;
    updatedAt: string;
  }>;
}

export enum JobStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  CLOSED = 'CLOSED'
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
export interface Rating {
  id: string;
  score: number;
  comment?: string;
  createdAt: string;
  updatedAt: string;
  serviceProviderId: string;
  clientId: string;
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
  requestStatus?: string;
  requestId?: string;
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




export interface UserListProps {
  users: User[];
  totalResults: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onToggleStatus: (userId: string) => void;

}
export interface FilterState {
  searchTerm: string;
  userType: string;
  accountStatus: string;
  createdAt: string;
  page: number;
  pageSize: number;

}

export function averageRating(ratings?: Rating[]): number {
  if (!ratings || ratings.length === 0) {
    return 0;
  }
  
  const sum = ratings.reduce((acc, rating) => acc + rating.score, 0);
  return Number((sum / ratings.length).toFixed(1));
}