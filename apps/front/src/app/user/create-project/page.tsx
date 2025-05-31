import { PropsWithChildren } from "react";
import CreateJobContainer from "./_components/CreateJobContainer";

type props = PropsWithChildren;

const CreateProjectPage = ({ children }: props) => {
  return (
    <div className="mt-24">
      <h1 className="text-2xl font-bold mb-4">Create a New Project</h1>
      <CreateJobContainer />
    </div>
  );
};

export default CreateProjectPage;
