// app/project-details/[id]/page.tsx
'use client'; // This directive is necessary for client-side components in Next.js App Router

import React, { useState, useEffect } from 'react';
import ProjectDetailsCard from './_components/projectDetailsCard';
import ProjectPhotos from './_components/projectPhotos';
import CraftsmenStats from './_components/craftsmanStats';
import ApplySection from './_components/applySection';
import router from 'next/router';

// Define a type for a Project
interface Project {
  id: string;
  title: string;
  description: string;
  budget: string;
  photos: string[];
  interestedCraftsmen: number;
  craftsmenInContact: number;
}

// Mock project data (in a real app, you'd fetch this from a database/API)
const mockProjects: Project[] = [
  {
    id: 'proj1',
    title: 'Bathroom Renovation',
    description: 'Complete renovation of a small bathroom including tiling, plumbing fixtures, and painting. Looking for a skilled contractor with experience in modern bathroom designs.',
    budget: '$3,000',
    photos: [
      'https://picsum.photos/200/300',
      'https://picsum.photos/200/300',
      'https://picsum.photos/200/300',
    ],
    interestedCraftsmen: 12,
    craftsmenInContact: 5,
  },
  {
    id: 'proj2',
    title: 'Custom Kitchen Cabinets',
    description: 'Design, build, and install custom kitchen cabinets for a medium-sized kitchen. Seeking a carpenter or cabinet maker who can work with high-quality wood and provide bespoke solutions.',
    budget: '$8,000 - $12,000',
    photos: [
      'https://placehold.co/600x400/CCE5FF/004085?text=Kitchen+Idea+1',
      'https://placehold.co/600x400/F8D7DA/721C24?text=Kitchen+Idea+2',
    ],
    interestedCraftsmen: 8,
    craftsmenInContact: 3,
  },
  {
    id: 'proj3',
    title: 'Garden Landscaping',
    description: 'Transforming a backyard into a functional and aesthetically pleasing garden space. Includes planting, pathway installation, and a small water feature.',
    budget: '$2,000 - $4,000',
    photos: [], // Example with no photos
    interestedCraftsmen: 7,
    craftsmenInContact: 2,
  },
];

interface ProjectDetailsParams {
  id: string;
}

// Define the page props interface
interface ProjectDetailsPageProps {
  params: Promise<ProjectDetailsParams>;
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function ProjectDetailsPage({ params }: ProjectDetailsPageProps) {
  const { id } = React.use(params); // Unwrap params using React.use()
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileComplete, setProfileComplete] = useState(false);

  useEffect(() => {
    // Simulate fetching project data
    const fetchProject = () => {
      setLoading(true);
      const foundProject = mockProjects.find((p) => p.id === id);
      if (foundProject) {
        setProject(foundProject);
      } else {
        console.error('Project not found');
      }
      setLoading(false);
    };

    fetchProject();

    // Simulate checking profile completeness (e.g., from user context or API)
    // For demonstration, let's toggle it after a delay
    const profileCheckTimeout = setTimeout(() => {
      setProfileComplete(true); // After some time, profile becomes complete
    }, 2000);

    return () => clearTimeout(profileCheckTimeout);
  }, [id]);
  const handleGoBack = () => {
    router.push('/service-provider/find-rec-jobs'); // Navigate to the specified page
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 bg-gray-100 min-h-screen flex justify-center items-center">
        <p className="text-lg text-gray-600">Loading project details...</p>
        <div className="ml-3 h-5 w-5 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] text-blue-500 motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container mx-auto p-6 bg-gray-100 min-h-screen flex justify-center items-center">
        <div className="flex flex-col items-center justify-center py-10 px-4 bg-white rounded-lg shadow-md text-gray-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mb-4 text-gray-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
            />
          </svg>
          <p className="text-lg font-semibold mb-2">Project not found.</p>
          <p className="text-sm">Please check the URL or return to the project listings.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-10 py-2 bg-gray-100 min-h-screen">
      <button
        onClick={handleGoBack}
        className="inline-flex items-center px-4 py-2 mb-6 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5 mr-2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
        Go Back to Projects
      </button>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Project Details</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Main Project Details */}
          <ProjectDetailsCard project={project} />

          {/* Project Photos */}
          {project.photos && project.photos.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Project Photos</h2>
              <ProjectPhotos photos={project.photos} />
            </div>
          )}
        </div>

        <div className="lg:col-span-1 space-y-6">
          {/* Craftsmen Stats */}
          <CraftsmenStats
            interested={project.interestedCraftsmen}
            inContact={project.craftsmenInContact}
          />

          {/* Apply Section */}
          <ApplySection profileComplete={profileComplete} />
        </div>
      </div>
    </div>
  );
}