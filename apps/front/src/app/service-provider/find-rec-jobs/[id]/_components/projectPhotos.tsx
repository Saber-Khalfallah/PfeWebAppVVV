// app/_components/project-details/ProjectPhotos.tsx
import React from 'react';

interface ProjectPhotosProps {
  photos: string[];
}

const ProjectPhotos: React.FC<ProjectPhotosProps> = ({ photos }) => {
  if (!photos || photos.length === 0) {
    return (
      <div className="text-center text-gray-500 py-4">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="mx-auto w-12 h-12 mb-2 text-gray-400">
          <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6.75a1.5 1.5 0 0 0-1.5-1.5H3.75a1.5 1.5 0 0 0-1.5 1.5v10.5a1.5 1.5 0 0 0 1.5 1.5Zm7.5-10.5a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
        </svg>
        No photos available for this project.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {photos.map((photo, index) => (
        <div key={index} className="w-full h-48 bg-gray-200 rounded-md overflow-hidden shadow-sm">
          <img
            src={photo}
            alt={`Project photo ${index + 1}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = `https://placehold.co/600x400/E0E0E0/888888?text=Image+Error`; // Fallback image
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default ProjectPhotos;