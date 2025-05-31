// _components/JobList.tsx
import { Job } from "@/lib/types/modelTypes";
import JobCard from "./jobCard";
import Pagination from "@/components/pagination"; // Assuming you have a Pagination component

type Props = {
  jobs: Job[];
  currentPage: number;
  totalPages: number;
  currentQueryParams: URLSearchParams;
};

const JobList = ({
  jobs,
  currentPage,
  totalPages,
  currentQueryParams,
}: Props) => {
  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          currentQueryParams={currentQueryParams}
        />
      )}
    </div>
  );
};

export default JobList;
