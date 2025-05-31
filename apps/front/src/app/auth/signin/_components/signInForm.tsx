"use client"; // Add if you plan to use client-side hooks like useActionState

// If using server actions for sign-in:
// import { useActionState } from "react";
// import { yourSignInServerAction } from "@/lib/actions/auth"; // Replace with your actual action

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button"; // General button for social logins
import { Checkbox } from "@/components/ui/checkbox";
import SubmitButton from "@/components/SubmitButton";
import Link from "next/link";
import { useActionState } from "react";
import { signIn } from "@/lib/actions/auth";
import { BACKEND_URL } from "@/lib/constants";

// Placeholder Icons - Replace these with your actual icon components (e.g., from lucide-react or SVGs)
const GoogleIcon = () => (
  <svg aria-hidden="true" className="h-5 w-5 mr-2" viewBox="0 0 24 24">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

const FacebookIcon = () => (
  <svg
    aria-hidden="true"
    className="h-5 w-5 mr-2"
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path
      fillRule="evenodd"
      d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z"
      clipRule="evenodd"
    />
  </svg>
);

const SignInFormComponent = () => {
  const [state, action] = useActionState(signIn, undefined); // Replace with your actual sign-in action
  return (
    // Form with space-y-6 for consistent spacing, similar to SignUpForm
    <form action={action} className="space-y-6 w-full max-w-md mx-auto">
      {!!state?.message && <p className="text-red-500">{state.message}</p>}

      {/* Social login buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Button
          type="button" // Important for buttons not submitting the main form
          variant="outline"
          className="w-full flex items-center justify-center py-2.5 text-sm font-medium text-card-foreground hover:bg-muted"
        >
          <GoogleIcon />
          <a href={`${BACKEND_URL}/api/auth/google/login`}>Google</a>
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full flex items-center justify-center py-2.5 text-sm font-medium text-card-foreground hover:bg-muted"
        >
          <FacebookIcon />
          Facebook
        </Button>
      </div>

      {/* Divider "Or continue with" */}
      <div className="relative my-5">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          {/* Use theme-aware border color like 'border-border' if available, or a neutral like 'border-gray-300' */}
          <div className="w-full border-t border-border"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          {/* Use theme-aware background and text color */}
          <span className="bg-card px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      {/* Email Input */}
      <div>
        <Label
          htmlFor="email"
          className="block text-sm font-medium text-foreground mb-1"
        >
          Email address
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          required
          defaultValue={state?.data?.email} // If using useActionState
        />
        {!!state?.errors?.email && (
          <p className="text-red-500 text-sm">{state.errors.email}</p>
        )}
      </div>

      {/* Password Input & Forgot Password Link */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <Label
            htmlFor="password"
            className="block text-sm font-medium text-foreground"
          >
            Password
          </Label>
          <Link
            href="/auth/forgot-password" // Adjust path as needed
            className="text-sm font-medium text-primary hover:underline underline-offset-4"
          >
            Forgot password?
          </Link>
        </div>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          required
          defaultValue={state?.data?.password} // If using useActionState
        />
        {!!state?.errors?.password && (
          <p className="text-red-500 text-sm">{state.errors.password}</p>
        )}
      </div>

      {/* Remember me Checkbox */}
      <div className="flex items-center">
        <Checkbox
          id="remember-me"
          name="remember-me"
          className="h-4 w-4 text-primary border-border rounded focus:ring-primary"
        />
        <Label
          htmlFor="remember-me"
          className="ml-2 block text-sm text-muted-foreground"
        >
          Remember me
        </Label>
      </div>

      {/* Submit Button - styling aligned with SignUpForm's submit button */}
      <div>
        <SubmitButton className="w-full bg-blue-600 hover:bg-blue-700 text-white">
          Sign In
        </SubmitButton>
      </div>
    </form>
  );
};

export default SignInFormComponent;
