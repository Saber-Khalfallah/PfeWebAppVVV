// app/_components/project-details/CraftsmenStats.tsx
import React from 'react';

interface CraftsmenStatsProps {
  interested: number;
  inContact: number;
}

const CraftsmenStats: React.FC<CraftsmenStatsProps> = ({ interested, inContact }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Craftsmen Overview</h2>
      <div className="space-y-3">
        <div className="flex items-center justify-between text-gray-700">
          <span className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 mr-2 text-blue-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.672.886 9.38 9.38 0 0 0 2.688-.886m0 0v.288c0 1.115-.568 2.1-1.402 2.685L16.7 21.685a2.25 2.25 0 0 1-1.748 0L12 21.118l-1.957-.782a2.25 2.25 0 0 1-1.748 0L5.342 20.301c-.834-.584-1.402-1.57-1.402-2.685V19.128m16.5-1.128a9.38 9.38 0 0 1-2.672.886 9.38 9.38 0 0 1-2.688-.886m0 0a.75.75 0 0 0-1.285.1l-.958 1.13a.75.75 0 01-1.285 0L9.42 19.208a.75.75 0 00-1.285-.1m0 0H3.75m0 0A9.38 9.38 0 0 1 3 19.128V15.75m18 0v3.378M3.75 15.75h16.5M3.75 15.75a9.38 9.38 0 0 0 2.672-.886m0 0V7.5m0 7.128a9.38 9.38 0 0 1 2.688-.886m0 0V7.5m0 0a4.5 4.5 0 0 0 2.959 1.341M12 12.75h.008v.008H12v-.008Zm0 0a4.5 4.5 0 0 0 2.959 1.341M12 12.75V15m7.5-7.25h-.008v.008H19.5v-.008Z" />
            </svg>
            Interested Craftsmen:
          </span>
          <span className="font-bold text-lg text-blue-600">{interested}</span>
        </div>
        <div className="flex items-center justify-between text-gray-700">
          <span className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 mr-2 text-green-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H16.5m3.071-5.656a11.955 11.955 0 0 1 .585 4.582 11.955 11.955 0 0 1-.585 4.582c-.892 1.258-2.012 2.45-3.375 3.486A2.25 2.25 0 0 1 15 21.75H9a2.25 2.25 0 0 1-1.696-.682 11.955 11.955 0 0 1-3.375-3.486 11.955 11.955 0 0 1-.585-4.582 11.955 11.955 0 0 1 .585-4.582c.892-1.258 2.012-2.45 3.375-3.486A2.25 2.25 0 0 1 9 2.25h6c.556 0 1.098.22 1.496.614a11.955 11.955 0 0 1 3.375 3.486Z" />
            </svg>
            Craftsmen in Contact:
          </span>
          <span className="font-bold text-lg text-green-600">{inContact}</span>
        </div>
      </div>
    </div>
  );
};

export default CraftsmenStats;