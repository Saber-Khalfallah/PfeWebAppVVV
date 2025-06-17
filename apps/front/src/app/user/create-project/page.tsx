import { PropsWithChildren } from "react";
import CreateJobContainer from "./_components/CreateJobContainer";

type props = PropsWithChildren;

const CreateProjectPage = ({ children }: props) => {
  return (
    <div className="mt-17">
      <h1 className="text-2xl font-bold mb-4  ml-100">Create a New Project</h1>
      <CreateJobContainer />
    </div>
  );
};

export default CreateProjectPage;
