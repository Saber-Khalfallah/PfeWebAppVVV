"use client";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import Navbar from "./navbar"; // Adjust the import path as needed
import { Session } from "@/lib/session";
type Props = {
  session: Session | null; // import your type accordingly
};

const DesktopNavbar = ({ session }: Props) => {
  const [scrollPosition, setScrollPosition] = useState(0);

  const handleScroll = () => {
    setScrollPosition(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const isScrollDown = scrollPosition > 10;

  return (
    <nav
      className={cn(
        "hidden fixed top-0 left-0 w-full transition-all duration-300 z-50 p-4 md:block",
        isScrollDown
          ? "bg-white shadow-md text-blue-600"
          : "bg-blue-600 text-white",
      )}
    >
      <div>
        <Navbar isScrollDown={isScrollDown} session={session} />
      </div>
    </nav>
  );
};

export default DesktopNavbar;
