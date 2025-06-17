// app/_components/project-details/ApplySection.tsx
'use client';

import React from 'react';

interface ApplySectionProps {
  profileComplete: boolean;
}

const ApplySection: React.FC<ApplySectionProps> = ({ profileComplete }) => {
  const handleApply = () => {
    if (profileComplete) {
      alert('Applying for the project!'); // Replace with actual application logic
    } else {
      // This case should ideally be prevented by the disabled button
      // and the message, but kept for robustness.
      alert('Please complete your profile to apply.');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 text-center">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Apply for this Project</h2>
      <button
        onClick={handleApply}
        disabled={!profileComplete}
        className={`w-full py-3 rounded-md text-lg font-semibold transition duration-150 ease-in-out
          ${profileComplete
            ? 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
            : 'bg-gray-300 text-gray-600 cursor-not-allowed'
          }`}
      >
        Apply
      </button>

      {!profileComplete && (
        <p className="mt-4 text-sm text-red-600">
          Complete your profile to apply for this project.
        </p>
      )}
    </div>
  );
};

export default ApplySection;