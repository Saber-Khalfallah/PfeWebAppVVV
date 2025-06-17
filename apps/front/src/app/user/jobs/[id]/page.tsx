"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { notFound } from "next/navigation";
import AssignedCraftsmanSection from './_components/AssignedCraftsmanSection';

import ProjectDetailsCard from "./_components/ProjectDetailsCard";
import ConversationSection from "./_components/ConversationSection";
import InterestedCraftsmenSection from "./_components/InterestedCraftmanSection";
import InvitedCraftsmenSection from "./_components/InvitedCraftsmanSection";
import GetMoreResponsesCard from "./_components/GetMoreResponsesCard";
import IncreaseSuccessCard from "./_components/IncreaseSuccessRate";
import { createJob, fetchJobById, updateJob } from "@/lib/actions/jobAction"; // Make sure it works client-side
import Link from "next/link";
import ServiceProviderDetailsCard from "./_components/ServiceProviderDetailsCard";
import { averageRating, Craftsman, Job } from "@/lib/types/modelTypes";
import EditProjectCard from "./_components/EditProjectCard";
import { JobFormState } from "@/lib/types/formState";
import { toast } from "@/hooks/use-toast";
import { jobSchema } from "@/lib/zodSchemas/jobFormSchema";
import { closeJob } from "@/lib/actions/jobAction";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { averageRatingInv } from "@/lib/helpers";
interface UpdateProjectResponse {
  ok: boolean;
  data?: Job;
  message?: string;
  errors?: Record<string, string[]>;
}
export default function JobDetailPage() {
  const { id } = useParams();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedProvider, setSelectedProvider] = useState<Craftsman | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const handleProviderSelect = (provider: Craftsman) => {
    setSelectedProvider({
      ...provider,
      requestStatus: provider.requestStatus // Make sure this is included
    });
  };
  const [formState, setFormState] = useState<JobFormState>({
    data: {},
    ok: null,
    message: undefined,
    errors: undefined
  }); const [validationErrors, setValidationErrors] = useState<any>({});
  if (!id || Array.isArray(id)) {
    return notFound();
  }
  const [isCloseDialogOpen, setIsCloseDialogOpen] = useState(false);
  const [closeReason, setCloseReason] = useState("");
  const [isClosing, setIsClosing] = useState(false);

  // Add this handler function in your component
  const handleCloseJob = async () => {
    if (!closeReason.trim()) {
      toast({
        title: "Error",
        description: "Please provide a reason for closing the project",
        variant: "destructive",
      });
      return;
    }

    setIsClosing(true);
    try {
      const result = await closeJob(project.id, closeReason);
      if (result.ok) {
        toast({
          title: "Success",
          description: result.message,
        });
        setIsCloseDialogOpen(false);
        // Refresh project data to show updated status
        refreshProjectData(result.data);
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to close the project",
        variant: "destructive",
      });
    } finally {
      setIsClosing(false);
    }
  };
  interface ProjectState extends Job {
    assignedCraftsman?: Craftsman | null;
    invitedCraftsmen?: Craftsman[];
    interestedCraftsmen?: Craftsman[];
    formattedLocation?: string;
  }
  const refreshProjectData = async (updatedData: Partial<ProjectState>) => {
    console.log("Refreshing project data with:", updatedData);

    // Update local state with new data including assigned craftsman
    if (updatedData.assignedCraftsman) {
      setProject((prev: ProjectState | null) => {
        if (!prev) return null;
        return {
          ...prev,
          ...updatedData,
          status: 'CLOSED',
          assignedCraftsman: updatedData.assignedCraftsman
        };
      });
      setSelectedProvider(null);
    } else {
      setProject((prev: ProjectState | null) => {
        if (!prev) return null;
        return {
          ...prev,
          ...updatedData
        };
      });
    }
  
  // Optionally, refetch from server to ensure complete sync
  if (!id) return;
  const refreshedJob = await fetchJobById(id);
  if (refreshedJob) {
    // Map the provider data to assignedCraftsman format if exists
    let assignedCraftsman = null;
    if (refreshedJob.providerId && refreshedJob.provider) {
      const provider = refreshedJob.provider;
      assignedCraftsman = {
        id: refreshedJob.providerId,
        name: `${provider.firstName} ${provider.lastName}`,
        avatar: provider.user?.avatarUrl || "",
        rating: averageRating(provider.ratings),
        email: provider.user?.email,
        phone: provider.contactInfo,
        location: provider.user?.delegation
          ? `${provider.user.delegation}${provider.user.governorate ? `, ${provider.user.governorate}` : ''}${provider.user.postalCode ? ` (${provider.user.postalCode})` : ''}`
          : "Not specified",
        specialization: provider.specialties?.map(
          (specialty: any) => specialty.category.name
        ).join(", ") || "Not specified",
        experience: provider.experienceYears
          ? `${provider.experienceYears} years`
          : "Not specified",
        companyName: provider.companyName || "Not specified",
        description: provider.description || "No description provided",
        registrationDate: provider.createdAt,
        isValidated: provider.isValidated
      };
    }

    setProject({
      ...refreshedJob,
      assignedCraftsman
    });
  }
};
useEffect(() => {
  if (!id || typeof id !== "string") return;

  const fetchData = async () => {
    setLoading(true);
    const job = await fetchJobById(id as string);
    if (!job) {
      setProject(null);
      setLoading(false);
      return;
    }
    const formattedJob = {
      ...job,
      formattedLocation: job.delegation
        ? `${job.delegation}${job.governorate ? `, ${job.governorate}` : ''}${job.postalCode ? ` (${job.postalCode})` : ''}`
        : 'Location not specified',
      // Rest of your existing mapping logic...
    };

    let assignedCraftsman = null;
    if (job.providerId) {
      const provider = job.provider;
      if (provider) {
        assignedCraftsman = {
          id: job.providerId,
          name: `${provider.firstName} ${provider.lastName}`,
          avatar: job.provider?.user?.avatarUrl || "",
          rating: averageRating(provider.ratings),
          email: job.provider?.user?.email,
          phone: provider.contactInfo,
          location: job.provider?.user?.delegation
            ? `${job.provider.user.delegation}${job.provider.user.governorate ? `, ${job.provider.user.governorate}` : ''}${job.provider.user.postalCode ? ` (${job.provider.user.postalCode})` : ''}`
            : "Not specified",
          specialization: provider.specialties?.map(
            (specialty: any) => specialty.category.name
          ).join(", ") || "Not specified",
          experience: provider.experienceYears
            ? `${provider.experienceYears} years`
            : "Not specified",
          companyName: provider.companyName || "Not specified",
          description: provider.description || "No description provided",
          registrationDate: provider.createdAt,
          isValidated: provider.isValidated
        };
      }
    }
    const invitedCraftsmen = (job.jobRequests ?? [])
      .filter((r: any) => r.type === "CLIENT_TO_PROVIDER")
      .map((r: any) => {
        const sp = r.target?.serviceProvider;
        if (!sp) return null;
        const avatarUrl = r.target?.avatarUrl || "";
        return {
          id: r.targetId,
          name: `${sp.firstName} ${sp.lastName}`,
          avatar: avatarUrl,
          rating: averageRatingInv(sp.ratings),
          email: r.target?.email,
          phone: sp.contactInfo,
          llocation: sp.delegation
            ? `${sp.delegation}${sp.governorate ? `, ${sp.governorate}` : ''}${sp.postalCode ? ` (${sp.postalCode})` : ''}`
            : "Not specified",
          specialization: sp.specialties?.map(
            (specialty: any) => specialty.category.name
          ).join(", ") || "Not specified",
          experience: sp.experienceYears
            ? `${sp.experienceYears} years`
            : "Not specified",
          companyName: sp.companyName || "Not specified",
          hourlyRate: sp.hourlyRate
            ? `$${sp.hourlyRate}/hr`
            : "Not specified",
          description: sp.description || "No description provided",
          requestType: 'CLIENT_TO_PROVIDER',
          requestId: r.id,
          requestStatus: r.status,
          requestDate: r.createdAt,
          respondedAt: r.respondedAt
        };
      })
      .filter(Boolean);

    const interestedCraftsmen = (job.jobRequests ?? [])
      .filter((r: any) => r.type === "PROVIDER_TO_CLIENT")
      .map((r: any) => {
        const sp = r.requester?.serviceProvider;
        console.log("Service Provider:", sp);
        if (!sp) return null;
        const avatarUrl = r.requester?.avatarUrl || "";
        return {
          id: r.requesterId, // Change from targetId to requesterId
          name: `${sp.firstName} ${sp.lastName}`,
          avatar: avatarUrl,
          rating: averageRatingInv(sp.ratings),
          email: r.requester?.email, // Change from target to requester
          phone: sp.contactInfo,
          location: sp.delegation
            ? `${sp.delegation}${sp.governorate ? `, ${sp.governorate}` : ''}${sp.postalCode ? ` (${sp.postalCode})` : ''}`
            : "Not specified",
          registrationDate: sp.createdAt,
          specialization: sp.specialties?.map(
            (specialty: any) => specialty.category.name
          ).join(", ") || "Not specified",
          experience: sp.experienceYears
            ? `${sp.experienceYears} years`
            : "Not specified",
          companyName: sp.companyName || "Not specified",
          hourlyRate: sp.hourlyRate
            ? `$${sp.hourlyRate}/hr`
            : "Not specified",
          description: sp.description || "No description provided",
          requestType: 'PROVIDER_TO_CLIENT',
          requestId: r.id, // Add this for handling accept/reject
          requestStatus: r.status,
          requestDate: r.createdAt,
          respondedAt: r.respondedAt
        };
      })
      .filter(Boolean);

    setProject({
      ...formattedJob,
      assignedCraftsman, // Add this
      invitedCraftsmen,
      interestedCraftsmen,
    });

    setLoading(false);
  };

  fetchData();
}, [id]);

if (loading) return <div className="p-8">Loading...</div>;
if (!project) return notFound();
const handleSave = async (formData: FormData, removedImages: string[]): Promise<any> => {
  console.log("=== Starting handleSave ===");
  setValidationErrors({});

  try {
    const result = project.id
      ? await updateJob(project.id, formState, formData, removedImages)  // pass removedImages here
      : await createJob(formState, formData);

    console.log("Save/Update result:", result);

    if (!result) {
      // Handle case where result is undefined
      setFormState({
        data: project,
        ok: false,
        message: 'No response from server',
        errors: { general: ['Failed to get response from server'] }
      });
      return { ok: false, errors: { general: ['No response from server'] } };
    }

    if (result.ok) {
      const { id, ...formStateData } = result.data || {};
      setFormState({
        data: formStateData,
        ok: true,
        message: result.message || 'Project updated successfully'
      });
      setIsEditing(false);
      return { ok: true, data: result.data };
    } else {
      console.error("Operation failed:", result);
      setFormState({
        data: project,
        ok: false,
        message: result.message || 'Operation failed',
        errors: result.errors || { general: ['Unknown error occurred'] }
      });
      return { ok: false, errors: result.errors };
    }
  } catch (error) {
    console.error("Exception in handleSave:", error);
    setFormState({
      data: project,
      ok: false,
      message: "An unexpected error occurred",
      errors: { general: ['Failed to save project'] }
    });
    return {
      ok: false,
      errors: { general: ['An unexpected error occurred'] }
    };
  }
};
return (
  <div className="min-h-screen bg-gray-100 p-8">
    {/* Top Bar */}
    <div className="flex justify-between items-center mb-6">
      <Link
        href="/user/jobs"
        className="inline-flex items-center text-gray-700 hover:text-gray-900 mb-4 group text-base font-medium"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 mr-2 transform group-hover:-translate-x-1 transition-transform"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        <span className="border-b-2 border-gray-700 group-hover:border-gray-900 transition-colors">
          Back to Projects
        </span>
      </Link>
      <h1 className="text-2xl font-semibold text-gray-800">
        {project.title}
      </h1>
      <div className="flex space-x-3">
        <button
          onClick={() => setIsEditing(false)}
          className={`px-4 py-2 rounded-md transition-colors ${!isEditing
            ? 'bg-blue-500 text-white hover:bg-blue-600'
            : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
        >
          View details
        </button>
        {(project.status !== 'CLOSED' && project.status !== 'COMPLETED') && (
          <button
            onClick={() => setIsEditing(true)}
            className={`px-4 py-2 rounded-md transition-colors ${isEditing
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
          >
            Modify
          </button>
        )}
        {(project.status !== 'CLOSED' && project.status !== 'COMPLETED') && (
          <button
            onClick={() => setIsCloseDialogOpen(true)}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
          >
            Close Project
          </button>
        )}
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Left Column */}
      <div className="md:col-span-1 space-y-6">
        {/* <ConversationSection conversations={project.messages ?? []} /> */}
        {/* <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-3">Awaiting Responses</h2>
            <div className="flex items-center text-gray-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-yellow-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414L7 9.586V7a1 1 0 10-2 0v4a1 1 0 001 1h4a1 1 0 100-2H8.414l2.293-2.293z"
                  clipRule="evenodd"
                />
              </svg>
              Waiting for craftsmen to respond to your project.
            </div>
          </div> */}
        <ConversationSection conversations={project.messages ?? []} />
        {project.assignedCraftsman && (
          <AssignedCraftsmanSection
            craftsman={project.assignedCraftsman}
            onProviderSelect={handleProviderSelect}
          />
        )}
        {project.status === 'OPEN' && (
          <>
            <InterestedCraftsmenSection
              craftsmen={project.interestedCraftsmen}
              onProviderSelect={handleProviderSelect}
            />
            <InvitedCraftsmenSection
              craftsmen={project.invitedCraftsmen}
              onProviderSelect={handleProviderSelect}
            />
          </>
        )}
        <GetMoreResponsesCard />
      </div>

      {/* Right Column (Project Details) */}
      <div className="md:col-span-2 space-y-6">
        {selectedProvider ? (
          <ServiceProviderDetailsCard
            provider={selectedProvider}
            jobId={project.id}
            onBack={() => setSelectedProvider(null)}
            onSuccess={refreshProjectData}
          />
        ) : isEditing ? (
          <EditProjectCard
            project={project}
            state={formState}
            onSave={handleSave}
            onCancel={() => setIsEditing(false)}
            onSuccess={refreshProjectData}

          />
        )
          : (
            <>
              <ProjectDetailsCard project={project} />
              <IncreaseSuccessCard />
            </>
          )}
      </div>
    </div>
    <Dialog open={isCloseDialogOpen} onOpenChange={setIsCloseDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Close Project</DialogTitle>
          <DialogDescription>
            Please provide a reason for closing this project. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="my-4">
          <Textarea
            placeholder="Enter reason for closing the project..."
            value={closeReason}
            onChange={(e) => setCloseReason(e.target.value)}
            rows={4}
            className="w-full"
          />
        </div>
        <DialogFooter>
          <button
            onClick={() => setIsCloseDialogOpen(false)}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={handleCloseJob}
            disabled={isClosing || !closeReason.trim()}
            className={`px-4 py-2 text-white rounded-md ${isClosing || !closeReason.trim()
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-red-500 hover:bg-red-600'
              }`}
          >
            {isClosing ? 'Closing...' : 'Close Project'}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
);
}
