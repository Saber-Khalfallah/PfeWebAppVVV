// user/job/[id]/_components/IncreaseSuccessCard.tsx
import React from "react";

const IncreaseSuccessCard: React.FC = () => {
  return (
    <div className="bg-purple-700 text-white p-6 rounded-lg shadow text-center">
      <div className="flex items-center justify-center mb-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13 7h-1v4h-1V7H8.5L12 3.5 15.5 7H13zm.5 10c.5-.5 1-1.5 1-2.5 0-1.5-1-2-2.5-2.5-.5-.5-.5-1.5-.5-2.5 0-1.5 1-2 2.5-2.5.5-.5.5-1.5.5-2.5 0-1.5-1-2-2.5-2.5"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 21a9 9 0 100-18 9 9 0 000 18z"
          />
        </svg>
        <h2 className="text-xl font-semibold">
          Increase Your Chances of Success
        </h2>
      </div>
      <p className="mb-4 text-sm">
        Send requests to more craftsmen to get a wider range of quotes and find
        the best match for your bathroom renovation project.
      </p>
      <button className="bg-white text-purple-700 px-6 py-2 rounded-md font-semibold hover:bg-gray-100 transition-colors">
        Send Requests to More Craftsmen
      </button>
    </div>
  );
};

export default IncreaseSuccessCard;
