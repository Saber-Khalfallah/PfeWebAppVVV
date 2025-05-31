"use client";

import { useActionState } from "react";
import UpsertJobForm from "./UpsertJobForm";
import { createJob } from "@/lib/actions/jobAction";
const CreatePostContainer = () => {
  const [state, action] = useActionState(createJob, undefined);
  return <UpsertJobForm state={state} formAction={action} />;
};

export default CreatePostContainer;
