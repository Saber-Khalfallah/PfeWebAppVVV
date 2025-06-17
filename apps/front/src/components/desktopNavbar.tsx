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
  const [mounted, setMounted] = useState(false);

  const handleScroll = () => {
    // Only update scrollPosition if the component is mounted
    if (mounted) {
      setScrollPosition(window.scrollY);
    }
  };

  useEffect(() => {
    // Mark as mounted once on the client
    setMounted(true);

    // Set initial scroll position if already scrolled down on load
    // This is important for users who refresh/land directly on a scrolled page
    if (window.scrollY > 10) {
      setScrollPosition(window.scrollY);
    }

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [mounted]);

  const isScrollDown = mounted && scrollPosition > 10; // Only check scroll after mounted

  return (
    <nav
      className={cn(
        "hidden fixed top-0 left-0 w-full transition-all duration-300 z-50 px-5 py-0.5 md:block", // Changed p-4 to px-4 py-2
        isScrollDown
          ? "bg-white shadow-md text-blue-600"
          : "bg-gradient-to-b from-blue-600 to-blue-700 text-white shadow-md border-b border-blue-800",
      )}
    >
      <div>
        <Navbar isScrollDown={isScrollDown} session={session} />
      </div>

    </nav>
  );
};

export default DesktopNavbar;
