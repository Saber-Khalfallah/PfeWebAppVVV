import { Session } from "@/lib/session";
import Link from "next/link";
import { FaWrench } from "react-icons/fa6";
import { LuLogOut } from "react-icons/lu";

import SignInPanel from "./signInPanel";
import Profile from "./profile";

type Props = {
  isScrollDown: boolean;
  session: Session | null; // import your type accordingly
};
const Navbar = ({ isScrollDown, session }: Props) => {
  return (
    <>
      {/* Main container for the navbar */}
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between py-3 md:py-2">
        {" "}
        {/* Added some vertical padding for typical navbar appearance */}
        {/* Logo/Brand Section - Unchanged */}
        <div className="text-xl font-bold flex items-center gap-2 mb-4 md:mb-0">
          {" "}
          {/* Added margin-bottom for mobile stacking */}
          <FaWrench className="text-xl" />
          <span className="font-bold text-lg">FixMate</span>
          <span className="text-sm hidden md:inline">
            - Local Help, Anytime
          </span>
        </div>
        {/* Navigation Links Section */}
        {/* Applied the group styling approach from the target example.
            Common styles for Link children are defined here.
            Original styles: font-semibold, hover:text-blue-200, transition-colors, duration-50
        */}
        <div
          className="
  flex flex-col items-center md:flex-row md:space-x-6 mb-4 md:mb-0
  /* Base styles for all child links (<a> tags) */
  [&>a]:font-semibold 
  [&>a]:transition-colors [&>a]:duration-50
  /* Mobile-specific styles for child links (default) */
  [&>a]:w-full           /* Make links take full width */
  [&>a]:text-center      /* Center text within the link */
  [&>a]:py-3             /* Vertical padding (adjust as needed, e.g., py-2 or py-3) */
  /* Mobile-specific hover styles for child links */
  [&>a:hover]:text-blue-200 /* Your existing hover text color */
  [&>a:hover]:bg-blue-800   /* Contrasting background (e.g., dark blue for light blue text) */
  /* Desktop (md and up) overrides for child links */
  md:[&>a]:w-auto         /* Reset width to auto */
  md:[&>a]:text-left      /* Align text to the left */
  md:[&>a]:py-0           /* Reset/set desktop vertical padding (matches your original md:py-0) */
  /* Desktop (md and up) hover overrides for child links */
  md:[&>a:hover]:bg-transparent /* Remove background color on hover for desktop */
"
        >
          {/* Link components will be simpler now */}
          <Link href="/">Home</Link>
          <Link href="/find-a-pro">Find a Pro</Link>
          <Link href="/about-us">About Us</Link>
          <Link href="/blog">Blog</Link>
        </div>
        {session && session.user ? (
          <Profile user={session.user} />
        ) : (
          <SignInPanel isScrollDown={isScrollDown} />
        )}
      </div>
    </>
  );
};

export default Navbar;
