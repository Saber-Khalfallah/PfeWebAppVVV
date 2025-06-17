import React from 'react';
import StarRating from './StarRating'; // Import the StarRating component

interface Profile {
  id: number;
  avatar: string;
  name: string;
  title: string;
  rating: number;
  reviews: number;
  description: string;
  location: string;
  projectsCompleted: number;
  responseTime: string;
  skills: string[];
}

interface ProfileCardProps {
  profile: Profile;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col h-full">
      <div className="flex items-center mb-4">
        <img
          src={profile.avatar}
          alt={profile.name}
          className="w-16 h-16 rounded-full object-cover mr-4 border-2 border-blue-500" // Added a subtle border
        />
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{profile.name}</h3>
          <p className="text-sm text-gray-600">{profile.title}</p>
        </div>
      </div>

      <div className="flex items-center text-sm text-gray-700 mb-3">
        <StarRating rating={profile.rating} />
        <span className="ml-2">{profile.rating.toFixed(1)} ({profile.reviews} reviews)</span>
      </div>

      <p className="text-gray-700 text-sm mb-4 flex-grow">{profile.description}</p>

      <div className="text-sm text-gray-600 mb-3 space-y-1">
        <p>📍 {profile.location}</p>
        <p>💼 {profile.projectsCompleted}+ projects completed</p>
      </div>
      <button className="mt-auto w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
        Send Invitation
      </button>
    </div>
  );
};

export default ProfileCard;