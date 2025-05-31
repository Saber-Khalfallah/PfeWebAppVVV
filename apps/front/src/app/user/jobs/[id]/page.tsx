"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { notFound } from "next/navigation";

import ProjectDetailsCard from "./_components/ProjectDetailsCard";
import ConversationSection from "./_components/ConversationSection";
import InterestedCraftsmenSection from "./_components/InterestedCraftmanSection";
import InvitedCraftsmenSection from "./_components/InvitedCraftsmanSection";
import GetMoreResponsesCard from "./_components/GetMoreResponsesCard";
import IncreaseSuccessCard from "./_components/IncreaseSuccessRate";
import { fetchJobById } from "@/lib/actions/jobAction"; // Make sure it works client-side
import { averageRating } from "@/lib/helpers";
import Link from "next/link";
import ServiceProviderDetailsCard from "./_components/ServiceProviderDetailsCard";
import { Craftsman } from "@/lib/types/modelTypes";

export default function JobDetailPage() {
  const { id } = useParams();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedProvider, setSelectedProvider] = useState<Craftsman | null>(null);

  const handleProviderSelect = (provider : Craftsman) => {
    setSelectedProvider(provider);
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
            rating: averageRating(sp.ratings),
            email: r.target?.email,
            phone: sp.contactInfo,
            location: sp.location || "Not specified",
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
            id: r.targetId,
            name: `${sp.firstName} ${sp.lastName}`,
            avatar: avatarUrl,
            rating: averageRating(sp.ratings),
            email: r.target?.email,
            phone: sp.contactInfo,
            location: sp.location || "Not specified",
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
            requestStatus: r.status,
            requestDate: r.createdAt,
            respondedAt: r.respondedAt
          };
        })
        .filter(Boolean);

      setProject({
        ...job,
        invitedCraftsmen,
        interestedCraftsmen,
      });

      setLoading(false);
    };

    fetchData();
  }, [id]);

  if (loading) return <div className="p-8">Loading...</div>;
  if (!project) return notFound();

  console.log("Project data:", project);
  console.log ("interestedCraftsmen:", project.interestedCraftsmen);
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
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors">
            View details
          </button>
          <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors">
            Modify
          </button>
          <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors">
            Close the project
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="md:col-span-1 space-y-6">
          <ConversationSection conversations={project.messages ?? []} />
          <div className="bg-white p-4 rounded-lg shadow">
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
          </div>
          <InterestedCraftsmenSection
            craftsmen={project.interestedCraftsmen}
            onProviderSelect={handleProviderSelect}

          />
          <InvitedCraftsmenSection craftsmen={project.invitedCraftsmen} />
          <GetMoreResponsesCard />
        </div>

        {/* Right Column (Project Details) */}
        <div className="md:col-span-2 space-y-6">
          {selectedProvider ? (
            <ServiceProviderDetailsCard 
              provider={selectedProvider}
              onBack={() => setSelectedProvider(null)}
            />
          ) : (
            <>
              <ProjectDetailsCard project={project} />
              <IncreaseSuccessCard />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
