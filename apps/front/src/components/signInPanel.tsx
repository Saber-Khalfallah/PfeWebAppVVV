// SignInPanel.tsx
import Link from "next/link";

type SignInPanelProps = {
  isScrollDown: boolean;
};

const SignInPanel = ({ isScrollDown }: SignInPanelProps) => {
  return (
    <div className="w-full md:w-auto flex flex-col space-y-3 md:space-y-0 md:flex-row md:items-center md:justify-end md:space-x-4">
      <Link
        href="/auth/signin"
        className={`
          font-semibold
          w-full text-center py-3 text-gray-800
          hover:text-blue-200 hover:bg-blue-800
          transition-colors duration-50
          md:w-auto md:px-4 md:py-2 md:border md:rounded md:duration-200
          ${
            isScrollDown
              ? "md:border-blue-600 md:text-blue-600 md:hover:bg-blue-600 md:hover:text-white"
              : "md:border-white md:text-white md:hover:bg-white md:hover:text-blue-600"
          }
        `}
      >
        Login
      </Link>
      <Link
        href="/auth/signup"
        className={`
          font-semibold transition-colors duration-50
          w-full text-center py-3 text-gray-800
          hover:text-blue-200 hover:bg-blue-800
          md:w-auto md:px-4 md:py-2 md:rounded
          md:bg-[#F2994A] md:text-blue-900
          md:hover:bg-orange-500
        `}
      >
        Sign Up
      </Link>
    </div>
  );
};

export default SignInPanel;
