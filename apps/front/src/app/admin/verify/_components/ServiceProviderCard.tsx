// components/ServiceProviderCard.tsx
import React from 'react';

interface ServiceProviderCardProps {
  provider: {
    id: string;
    providerName: string;
    email: string;
    serviceCategory: string;
    registrationDate: string;
    location: string;
    status: string;
    avatar: string;
  };
}

const getCategoryColorClass = (category: string) => {
  switch (category.toLowerCase()) {
    case 'electrician':
      return 'bg-blue-100 text-blue-700';
    case 'cleaner':
      return 'bg-green-100 text-green-700';
    case 'plumber':
      return 'bg-pink-100 text-pink-700';
    case 'tutor':
      return 'bg-orange-100 text-orange-700';
    case 'handyman':
      return 'bg-red-100 text-red-700';
    case 'pet care':
      return 'bg-purple-100 text-purple-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

const getStatusColorClass = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pending review':
      return 'bg-yellow-100 text-yellow-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

const ServiceProviderCard: React.FC<ServiceProviderCardProps> = ({ provider }) => {
  return (
    <div className="grid grid-cols-[1.5fr_1.5fr_1.5fr_1.2fr_1fr_1.5fr] items-center py-3 px-4 border-b border-gray-200 text-sm">
      {/* Provider Name */}
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0 w-8 h-8">
          <img src={'/fallback-avatar.png'} alt={provider.providerName} className="rounded-full w-full h-full object-cover border border-gray-300" />
        </div>
        <span className="font-medium text-gray-800 truncate">{provider.providerName}</span>
      </div>

      {/* Service Category */}
      <div>
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getCategoryColorClass(provider.serviceCategory)}`}>
          {provider.serviceCategory}
        </span>
      </div>

      {/* Registration Date */}
      <div className="text-gray-600">{provider.registrationDate}</div>

      {/* Location */}
      <div className="text-gray-600">{provider.location}</div>

      {/* Status */}
      <div>
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColorClass(provider.status)}`}>
          {provider.status}
        </span>
      </div>

      {/* Actions */}
      <div className="flex justify-end">
        <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-md shadow-sm transition duration-150 ease-in-out">
          Check Details
        </button>
      </div>
    </div>
  );
};

export default ServiceProviderCard;