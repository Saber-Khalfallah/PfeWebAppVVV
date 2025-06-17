'use client';

import { useState } from 'react';
import ProfileCard from './_components/ProfileCard';

export default function ExpertsPage() {
  // Hardcoded data for demonstration
  const [profiles] = useState([
    {
      id: 1,
      avatar: 'https://saberstorage1.blob.core.windows.net/pfefileupload/avatars/user-email-jdoe07564_gmail_com/09fdc6de-abf3-4d94-b9e6-dfa2d27ba879.jpg', // Placeholder image
      name: 'Saber Khalfallah',
      title: 'Carpenting',
      rating: 4.5,
      reviews: 2,
      description: 'Specialized in creating modern, sustainable closets , also provide installation for houses .',
      location: 'MSAKEN (Messadine)(4013)',
      projectsCompleted: 2,
      responseTime: 'Usually responds within 2 hours',
      skills: ['WordPress', 'React', 'UI/UX', 'Figma'],
    },
    {
      id: 2,
      avatar: '/fallback-avatar.png', // Placeholder image
      name: 'Wael Kouada',
      title: 'Electricity',
      rating: 5.0,
      reviews: 1,
      description: 'over 10 years experience in installation and maintenance of electrical systems for houses',
      location: 'MSAKEN (Msaken) 4070',
      projectsCompleted: 1,
      responseTime: 'Usually responds within 1 day',
      skills: ['UI Design', 'Branding', 'Adobe XD', 'Sketch'],
    },
    
  ]);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Recommended Craftsman </h1>

      <div className="container mx-auto">
        {/* Grid of Profile Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profiles.map((profile) => (
            <ProfileCard key={profile.id} profile={profile} />
          ))}
        </div>

        {/* Pagination
        <div className="flex justify-center items-center mt-8 space-x-1">
          <button className="px-3 py-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50" disabled>
            &lt;
          </button>
          <button className="px-3 py-1 border border-gray-300 rounded-md bg-blue-500 text-white hover:bg-blue-600">
            1
          </button>
          <button className="px-3 py-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
            2
          </button>
          <button className="px-3 py-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
            3
          </button>
          <button className="px-3 py-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
            &gt;
          </button>
        </div> */}
      </div>
    </div>
  );
}