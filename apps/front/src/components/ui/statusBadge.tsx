import React from "react";
import { JobStatusEnum } from "@/lib/types/formState"; // Adjust path as needed

interface StatusBadgeProps {
  status?: JobStatusEnum;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusColors = () => {
    switch (status) {
      case "Open":
        return "bg-green-100 text-green-700 border-green-300";
      case "InProgress":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "Completed":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "Cancelled":
        return "bg-red-100 text-red-700 border-red-300";
      case "Closed":
        return "bg-gray-100 text-gray-700 border-gray-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  return (
    <span
      className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColors()}`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
