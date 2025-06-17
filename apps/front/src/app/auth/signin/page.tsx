// app/auth/signin/page.tsx
import Link from "next/link";
import SignInFormComponent from "./_components/signInForm"; // Ensure this path is correct

const SignInPage = () => {
  return (
    // Align main layout with SignUpPage: flex, min-h-screen, items-center, pt-24 for top padding
    <main className="flex min-h-screen flex-col items-center pt-24 px-4">
      {/* Card styling aligned with SignUpPage: bg-card, text-card-foreground, padding, rounded, shadow, max-width */}
      <div className="bg-card text-card-foreground p-6 sm:p-8 rounded-xl shadow-xl w-full max-w-md">
        {/* Title section aligned with SignUpPage */}
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Welcome Back
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Sign in to your Account
          </p>
        </div>

        <SignInFormComponent />

        {/* "Don't have an account?" link aligned with SignUpPage */}
        <div className="mt-6 text-center text-sm">
          <p className="text-muted-foreground">
            Don't have an account?{" "}
            <Link
              className="font-medium text-primary underline-offset-4 hover:underline"
              href={"/auth/signup"} // Adjust if your signup route is different
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default SignInPage;
