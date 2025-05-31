import { Button } from "@/components/ui/button";
import { PencilSquareIcon, PlusIcon } from "@heroicons/react/20/solid";
import Link from "next/link";

const NoJobs = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h2 className="text-2xl font-bold mb-4">No Jobs Found</h2>
      <p className="text-gray-600">You have not created any jobs yet.</p>
      <p className="text-gray-600">Start by creating a new job!</p>
      <Button asChild className="mt-4">
        <Link
          href="/user/create-job"
          className="flex items-center justify-center"
        >
          <span>
            <PlusIcon className="w-4" />
          </span>
          <span>Publish your first Project</span>
        </Link>
      </Button>
    </div>
  );
};
export default NoJobs;
