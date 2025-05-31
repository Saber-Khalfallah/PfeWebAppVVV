import { PropsWithChildren } from "react";
import DesktopNavbar from "./desktopNavbar";
import MobileNavbar from "./mobileNavbar";
import NavbarWrapper from "./desktopNavbarWrapper";

type Props = PropsWithChildren;

const NavbarContainer = (props: Props) => {
  return (
    <div className="relative">
      <NavbarWrapper />
      <MobileNavbar>{props.children}</MobileNavbar>
    </div>
  );
};

export default NavbarContainer;
