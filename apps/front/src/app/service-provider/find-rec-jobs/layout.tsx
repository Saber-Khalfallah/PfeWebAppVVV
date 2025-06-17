import { PropsWithChildren } from "react";

type props = PropsWithChildren;

const findRecommendedJobs = ({ children }: props) => {
  return <div className="mt-18">{children}</div>;
};
export default findRecommendedJobs;
