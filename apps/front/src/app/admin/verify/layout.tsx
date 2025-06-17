import { PropsWithChildren } from "react";

type props = PropsWithChildren;

const VerifyLayout = ({ children }: props) => {
  return <div className="mt-24">{children}</div>;
};
export default VerifyLayout;
