// _components/JobCard.tsx
import Link from "next/link";
import {
  ArrowRightIcon,
  CalendarDaysIcon,
  TagIcon,
  CheckCircleIcon,
  ClockIcon,
  MapPinIcon,
  InformationCircleIcon, // Default status icon
  ExclamationCircleIcon, // For other statuses like closed/cancelled
} from "@heroicons/react/24/outline";

// Assuming your Job type is imported from "@/lib/types/modelTypes"
// and looks something like this (or has these fields available):
// type Job = {
//   id: string;
//   title: string;
//   category: { name: string }; // Used for subtitle and category info
//   description: string;
//   status: string; // Used for the status on the right panel
//   createdAt: string | Date; // Used for "Published On"
//   location?: string; // Optional: For location info
//   durationText?: string; // Optional: For duration info e.g., "4 weeks"
//   // Potentially other fields like requestedDatetime if still needed for other logic
// };
import { Job } from "@/lib/types/modelTypes"; // Ensure this path is correct
import { formatDuration } from "@/lib/helpers";

type Props = {
  job: Job;
};

const JobCard = ({ job }: Props) => {
  // Generates display properties (icon, text, color) for the job status on the right panel
  const getStatusDisplayInfo = (status: string) => {
    const s = status ? status.toLowerCase() : "unknown";
    switch (s) {
      case "active": // Assuming 'active' is a possible status string
        return {
          icon: <CheckCircleIcon className="h-5 w-5 text-green-500" />,
          text: "Active",
          textColor: "text-green-700 font-medium",
        };
      case "published":
        return {
          icon: <CheckCircleIcon className="h-5 w-5 text-blue-500" />,
          text: "Published",
          textColor: "text-blue-700 font-medium",
        };
      case "pending":
        return {
          icon: <ClockIcon className="h-5 w-5 text-yellow-500" />,
          text: "Pending",
          textColor: "text-yellow-700 font-medium",
        };
      case "in_progress":
      case "in progress":
        return {
          icon: <ClockIcon className="h-5 w-5 text-blue-500" />,
          text: "In Progress",
          textColor: "text-blue-700 font-medium",
        };
      case "closed":
        return {
          icon: <ExclamationCircleIcon className="h-5 w-5 text-gray-500" />,
          text: "Closed",
          textColor: "text-gray-700 font-medium",
        };
      case "cancelled":
        return {
          icon: <ExclamationCircleIcon className="h-5 w-5 text-red-500" />,
          text: "Cancelled",
          textColor: "text-red-700 font-medium",
        };
      default:
        // Capitalize first letter and replace underscores for unknown statuses
        const formattedStatus = status
          .replace(/_/g, " ")
          .replace(/\b\w/g, (char) => char.toUpperCase());
        return {
          icon: <InformationCircleIcon className="h-5 w-5 text-gray-400" />,
          text: formattedStatus,
          textColor: "text-gray-600 font-medium",
        };
    }
  };

  const statusInfo = getStatusDisplayInfo(job.status);

  // Format createdAt date to YYYY-MM-DD
  const publishedDate = job.createdAt
    ? new Date(job.createdAt).toISOString().split("T")[0]
    : "N/A";

  return (
    <div className="border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-sky-50 overflow-hidden">
      <div className="flex items-stretch">
        {" "}
        {/* Ensures children (button and content) can stretch to full height */}
        {/* Details Button - Left */}
        <div className="flex-shrink-0">
          <Link href={`/user/jobs/${job.id}`} passHref>
            <button className="bg-blue-600 text-white h-full px-3 py-4 sm:px-4 sm:py-6 hover:bg-blue-700 transition-colors flex flex-col items-center justify-center rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
              <ArrowRightIcon className="h-5 w-5 sm:h-6 sm:w-6" />
              <span className="mt-1 text-xs sm:text-sm font-semibold">
                Details
              </span>
            </button>
          </Link>
        </div>
        {/* Middle and Right Sections Container */}
        <div className="flex-grow flex items-center p-4 sm:p-5">
          {/* Middle Section - Job Info */}
          <div className="flex-grow pr-4 sm:pr-6">
            {" "}
            {/* Space between middle and right sections */}
            <div className="flex items-center mb-1 sm:mb-1.5">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mr-2">
                {job.title}
              </h2>
              {/* Static "Published" tag as per image */}
              <span className="px-2.5 py-0.5 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full">
                Published
              </span>
            </div>
            {/* Subtitle using job.category.name */}
            <h3 className="text-sm sm:text-md font-medium text-gray-700 mb-1 sm:mb-1.5">
              {job.category.name}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed line-clamp-2 sm:line-clamp-3">
              {job.description}
            </p>
          </div>

          {/* Right Section - Meta Info */}
          <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm w-44 sm:w-48 flex-shrink-0">
            <div className="flex items-center">
              <CalendarDaysIcon className="h-4 w-4 text-gray-500 mr-1.5 sm:mr-2 flex-shrink-0" />
              <span className="text-gray-600">Published:</span>
              <span className="ml-1 text-gray-800 font-medium">
                {publishedDate}
              </span>
            </div>
            <div className="flex items-center">
              <TagIcon className="h-4 w-4 text-gray-500 mr-1.5 sm:mr-2 flex-shrink-0" />
              <span className="text-gray-600">Category:</span>
              {/* Category name from job.category.name */}
              <span className="ml-1 text-gray-800 font-medium">
                {job.category.name}
              </span>
            </div>
            <div className="flex items-center">
              <span className="mr-1.5 sm:mr-2 flex-shrink-0">
                {statusInfo.icon}
              </span>
              <span className="text-gray-600">Status:</span>
              <span className={`ml-1 ${statusInfo.textColor}`}>
                {statusInfo.text}
              </span>
            </div>
            {/* Conditionally render Location if job.location exists */}
            {job.location && (
              <div className="flex items-center">
                <MapPinIcon className="h-4 w-4 text-gray-500 mr-1.5 sm:mr-2 flex-shrink-0" />
                <span className="text-gray-800 font-medium">
                  {job.location}
                </span>
              </div>
            )}
            {/* Conditionally render Duration if job.durationText exists */}
            {/* Ensure your Job type has 'durationText' or a similar field for this */}
            {job.requestedDatetime && (
              <div className="flex items-center">
                <ClockIcon className="h-4 w-4 text-gray-500 mr-1.5 sm:mr-2 flex-shrink-0" />
                <span className="text-gray-600">Duration:</span>
                <span className="ml-1 text-gray-800 font-medium">
                  {formatDuration(
                    new Date(job.createdAt),
                    new Date(job.requestedDatetime),
                  )}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      {/*
      // Optional: Add Edit button or other actions, similar to the original component.
      // Example based on original logic:
      {job.status && job.status.toLowerCase() === 'pending' && ( // Check original status field if different
        <div className="p-3 bg-gray-50 border-t border-gray-200 flex justify-end">
          <Link
            href={`/dashboard/jobs/${job.id}/edit`}
            className="px-3 py-1.5 bg-gray-600 text-white text-xs rounded hover:bg-gray-700 transition-colors flex items-center"
          >
            // <PencilIcon className="h-3 w-3 mr-1" /> Edit // (Ensure PencilIcon is imported if used)
            Edit
          </Link>
        </div>
      )}
      */}
    </div>
  );
};

export default JobCard;
