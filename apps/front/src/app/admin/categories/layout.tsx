import { PropsWithChildren } from "react";

type props = PropsWithChildren;

const CategoriesPage = ({ children }: props) => {
  return <div className="mt-18">{children}</div>;
};
export default CategoriesPage;
