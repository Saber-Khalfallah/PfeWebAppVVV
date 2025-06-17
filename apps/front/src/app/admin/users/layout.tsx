import { PropsWithChildren } from "react";

type props = PropsWithChildren;

const UsersLayout = ({ children }: props) => {
  return <div className="mt-24">{children}</div>;
};
export default UsersLayout;
