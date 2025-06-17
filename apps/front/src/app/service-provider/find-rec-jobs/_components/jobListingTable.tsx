// app/_components/find-projects/JobListingTable.tsx
import React from 'react';

interface Job {
  id: string;
  jobTitle: string;
  description: string;
  category: string;
  postedDate: string;
  location: string;
}

interface JobListingTableProps {
  jobs: Job[];
}

const JobListingTable: React.FC<JobListingTableProps> = ({ jobs }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Job Title
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Category
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Posted Date
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Location
            </th>
            <th
              scope="col"
              className="px-9.5 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Action
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {jobs.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                No jobs found matching your criteria.
              </td>
            </tr>
          ) : (
            jobs.map((job) => (
              <tr key={job.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{job.jobTitle}</div>
                  <div className="text-sm text-gray-500 max-w-sm truncate">{job.description}</div> {/* Truncate long descriptions */}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      job.category === 'Cleaning' ? 'bg-indigo-100 text-indigo-800' :
                      job.category === 'Plumbing' ? 'bg-purple-100 text-purple-800' :
                      job.category === 'Tutoring' ? 'bg-yellow-100 text-yellow-800' :
                      job.category === 'Electrical' ? 'bg-pink-100 text-pink-800' :
                      job.category === 'Gardening' ? 'bg-green-100 text-green-800' :
                      job.category === 'Pet Care' ? 'bg-red-100 text-red-800' :
                      job.category === 'Painting' ? 'bg-blue-100 text-blue-800' :
                      job.category === 'Handyman' ? 'bg-orange-100 text-orange-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                    {job.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{job.postedDate}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{job.location}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => alert(`Showing details for job: ${job.jobTitle}`)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Details
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default JobListingTable;