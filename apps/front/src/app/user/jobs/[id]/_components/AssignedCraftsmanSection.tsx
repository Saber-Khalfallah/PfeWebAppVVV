import React from 'react';
import Image from 'next/image';
import { Craftsman } from '@/lib/types/modelTypes';

interface AssignedCraftsmanSectionProps {
  craftsman: Craftsman | null;
  onProviderSelect: (provider: Craftsman) => void;
}

const AssignedCraftsmanSection: React.FC<AssignedCraftsmanSectionProps> = ({
  craftsman,
  onProviderSelect
}) => {
  if (!craftsman) return null;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4 text-green-600 flex items-center">
        <svg 
          className="w-5 h-5 mr-2" 
          fill="currentColor" 
          viewBox="0 0 20 20"
        >
          <path 
            fillRule="evenodd" 
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
            clipRule="evenodd" 
          />
        </svg>
        Assigned Craftsman
      </h2>

      <div 
        className="border rounded-lg p-4 hover:border-green-500 transition-colors cursor-pointer"
        onClick={() => onProviderSelect(craftsman)}
      >
        <div className="flex items-center space-x-4">
          <div className="relative w-16 h-16 rounded-full overflow-hidden">
            <Image
              src={craftsman.avatar}
              alt={craftsman.name}
              layout="fill"
              objectFit="cover"
            />
          </div>
          
          <div className="flex-1">
            <h3 className="font-medium text-gray-900">{craftsman.name}</h3>
            <div className="flex items-center mt-1">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${
                    i < craftsman.rating ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.381-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="ml-2 text-sm text-gray-600">
                ({craftsman.rating.toFixed(1)})
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">{craftsman.specialization}</p>
          </div>

          <div className="flex flex-col items-end">
            <span className="text-green-600 font-medium">Assigned</span>
            <span className="text-sm text-gray-500">Click to view details</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignedCraftsmanSection;