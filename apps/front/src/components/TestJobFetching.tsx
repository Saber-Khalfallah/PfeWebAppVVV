"use client";
import { useState } from "react";
import { fetchUserJobs } from "../lib/actions/jobAction";
import { Job } from "../lib/types/modelTypes";

export default function TestJobFetch() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState("11340ba5-d0ff-42bc-a836-e3c95155a64a"); // Your test user ID

  const handleFetchJobs = async () => {
    setLoading(true);
    setError(null);

    const result = await fetchUserJobs(); // No userId needed

    if (result.success) {
      setJobs(result.jobs);
      console.log("Jobs fetched successfully:", result.jobs);
    } else {
      setError(result.message || "Failed to fetch jobs");
      console.error("Error:", result.backendError);
    }

    setLoading(false);
  };

  return (
    <div className="p-4">
      <h2>Test Job Fetch</h2>

      <div className="mb-4">
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="User ID"
          className="border p-2 mr-2"
        />
        <button
          onClick={handleFetchJobs}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {loading ? "Loading..." : "Fetch Jobs"}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {jobs.length > 0 && (
        <div>
          <h3>Jobs ({jobs.length}):</h3>
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(jobs, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
