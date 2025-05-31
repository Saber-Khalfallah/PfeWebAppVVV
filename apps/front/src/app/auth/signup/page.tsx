// app/your-signup-route/page.tsx
import Link from "next/link";
import SignUpForm from "./_components/signUpForm"; // Ensure this path is correct

const SignUpPage = () => {
  return (
    // The card itself. The layout will center it.
    // Consider using max-w-md for a slightly wider, common form width.
    // Or keep w-96 if that specific width is intended.
    <main className="flex min-h-screen flex-col items-center pt-24 px-4">
      {" "}
      {/* << ADJUST THIS PADDING-TOP VALUE */}
      <div className="bg-card text-card-foreground p-6 sm:p-8 rounded-xl shadow-xl w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Create Account
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Choose your role and fill in the details.
          </p>
        </div>

        <SignUpForm />

        <div className="mt-6 text-center text-sm">
          <p className="text-muted-foreground">
            Already have an account?{" "}
            <Link
              className="font-medium text-primary underline-offset-4 hover:underline"
              href={"/auth/signin"} // Consider a more dynamic way to get this path if needed
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default SignUpPage;
