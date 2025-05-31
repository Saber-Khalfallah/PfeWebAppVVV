// user/job/[id]/_components/GetMoreResponsesCard.tsx
import React from "react";
import Link from "next/link";

const GetMoreResponsesCard: React.FC = () => {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-3">Get More Responses</h2>
      <p className="text-gray-600 text-sm mb-4">
        Send requests to additional recommended craftsmen to increase your
        chances of finding the perfect match.
      </p>
      <Link
        href="/user/job/recommend-craftsmen"
        className="text-blue-600 font-medium hover:underline flex items-center"
      >
        View recommended craftsmen
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 ml-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
          />
        </svg>
      </Link>
    </div>
  );
};

export default GetMoreResponsesCard;
