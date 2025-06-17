import { PropsWithChildren } from "react";

type props = PropsWithChildren;

const CompleteProfileLayout = ({ children }: props) => {
  return <div className="mt-10">{children}</div>;
};
export default CompleteProfileLayout;
