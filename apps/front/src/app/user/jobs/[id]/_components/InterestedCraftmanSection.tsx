// user/job/[id]/_components/InterestedCraftsmenSection.tsx
import React from "react";
import Image from "next/image";

interface Craftsman {
  id: string;
  name: string; // full name string
  avatar: string; // avatar URL
  rating: number; // rating score (e.g., 4.2)
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
}

interface InterestedCraftsmenSectionProps {
  craftsmen: Craftsman[];
  onProviderSelect: (provider: Craftsman) => void;

}

const InterestedCraftsmenSection: React.FC<InterestedCraftsmenSectionProps> = ({
  craftsmen,
  onProviderSelect
}) => {
  return (
    console.log(
      "Rendering InterestedCraftsmenSection with craftsmen:",
      craftsmen,
    ),
    (
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-3">Interested Craftsmen</h2>
        {craftsmen.length === 0 ? (
          <div className="text-gray-600">
            No craftsmen have responded to your project yet.
          </div>
        ) : (
          <div className="space-y-4">
            {craftsmen.map((craftsman) => (
              <div
                key={craftsman.id}
                className="flex items-center justify-between"
              >
                <div className="flex items-center">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3">
                    <Image
                      src={craftsman.avatar || "/images/default-avatar.png"}
                      alt={craftsman.name}
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">
                      {craftsman.name}
                    </p>
                    <div className="flex items-center text-sm text-gray-600">
                      {Array.from({ length: 5 }, (_, i) => (
                        <svg
                          key={i}
                          className={`h-4 w-4 ${i < Math.floor(craftsman.rating) ? "text-yellow-400" : "text-gray-300"}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.381-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="ml-1">
                        ({craftsman.rating.toFixed(1)})
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => onProviderSelect(craftsman)}
                  className="text-blue-600 hover:text-blue-700"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  );
};

export default InterestedCraftsmenSection;
