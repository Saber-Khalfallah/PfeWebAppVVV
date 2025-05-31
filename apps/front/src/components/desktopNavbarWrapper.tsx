import DesktopNavbar from "./desktopNavbar";
import { getSession } from "@/lib/session";

const NavbarWrapper = async () => {
  const session = await getSession();

  return <DesktopNavbar session={session} />;
};

export default NavbarWrapper;
