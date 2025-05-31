"use client";

import SubmitButton from "@/components/SubmitButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { signUp } from "@/lib/actions/auth"; // Your server action
import { useActionState, useState, useRef } from "react"; // Import useRef
import { PersonIcon, BackpackIcon } from "@radix-ui/react-icons";

const SignUpForm = () => {
  const [state, action] = useActionState(signUp, undefined);
  const [role, setUserType] = useState<"client" | "serviceProvider" | null>(
    null,
  );

  // State to store and display the selected file name
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  // Ref for the file input if you ever need to programmatically clear it
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handler for when the file input changes
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFileName(event.target.files[0].name);
    } else {
      setSelectedFileName(null);
    }
  };

  return (
    // The form's 'action' prop with 'useActionState' automatically handles FormData when file inputs are present.
    <form action={action} className="space-y-6 w-full max-w-md mx-auto">
      {!!state?.message && (
        <p className="text-red-500 text-sm p-3 bg-red-100 rounded-md">
          {state.message}
        </p>
      )}

      {/* Role Selection */}
      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setUserType("serviceProvider")}
            className={`p-4 border rounded-md flex flex-col items-center justify-center transition-colors cursor-pointer ${
              role === "serviceProvider"
                ? "bg-blue-600 text-primary-foreground border-primary ring-2 ring-primary ring-offset-2"
                : "bg-background hover:bg-muted"
            }`}
          >
            <BackpackIcon className="w-6 h-6 mb-2" />
            Service Provider
          </button>
          <button
            type="button"
            onClick={() => setUserType("client")}
            className={`p-4 border rounded-md flex flex-col items-center justify-center transition-colors cursor-pointer ${
              role === "client"
                ? "bg-blue-600 text-primary-foreground border-primary ring-2 ring-primary ring-offset-2"
                : "bg-background hover:bg-muted"
            }`}
          >
            <PersonIcon className="w-6 h-6 mb-2" />
            Customer
          </button>
        </div>
        <input type="hidden" name="role" value={role || ""} />
        {!!state?.errors?.role &&
          state.errors.role.map((err) => (
            <p key={err} className="text-red-500 text-sm">
              {err}
            </p>
          ))}
      </div>

      {/* First Name & Last Name */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            name="firstName"
            placeholder="John"
            required
            defaultValue={state?.data.firstName}
          />
          {!!state?.errors?.firstName &&
            state.errors.firstName.map((err) => (
              <p key={err} className="text-red-500 text-sm">
                {err}
              </p>
            ))}
        </div>
        <div>
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            name="lastName"
            placeholder="Doe"
            required
            defaultValue={state?.data.lastName}
          />
          {!!state?.errors?.lastName &&
            state.errors.lastName.map((err) => (
              <p key={err} className="text-red-500 text-sm">
                {err}
              </p>
            ))}
        </div>
      </div>

      {/* Email */}
      <div>
        <Label htmlFor="email">Email address</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          required
          defaultValue={state?.data.email}
        />
        {!!state?.errors?.email &&
          state.errors.email.map((err) => (
            <p key={err} className="text-red-500 text-sm">
              {err}
            </p>
          ))}
      </div>

      {/* Contact Info */}
      <div>
        <Label htmlFor="contactInfo">Phone Number</Label>
        <Input
          id="contactInfo"
          name="contactInfo"
          type="tel"
          placeholder="+1234567890"
          defaultValue={state?.data.contactInfo}
        />
        {!!state?.errors?.contactInfo &&
          state.errors.contactInfo.map((err) => (
            <p key={err} className="text-red-500 text-sm">
              {err}
            </p>
          ))}
      </div>

      {/* Company Name (conditional for Service Provider) */}
      {role === "serviceProvider" && (
        <div>
          <Label htmlFor="companyName">Company Name</Label>
          <Input
            id="companyName"
            name="companyName"
            placeholder="Your Business Name"
            defaultValue={state?.data.companyName}
          />
          {!!state?.errors?.companyName &&
            state.errors.companyName.map((err) => (
              <p key={err} className="text-red-500 text-sm">
                {err}
              </p>
            ))}
        </div>
      )}

      {/* Location */}
      <div>
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          name="location"
          placeholder="City, State"
          defaultValue={state?.data.location}
        />
        {!!state?.errors?.location &&
          state.errors.location.map((err) => (
            <p key={err} className="text-red-500 text-sm">
              {err}
            </p>
          ))}
      </div>

      {/* NEW: Avatar Upload Field */}
      <div>
        <Label htmlFor="avatar">Profile Picture (Optional)</Label>
        <Input
          id="avatar"
          name="avatar" // This name 'avatar' MUST match your NestJS FileInterceptor('avatar')
          type="file"
          accept="image/*" // Restrict to image files (e.g., .jpg, .png, .gif)
          onChange={handleFileChange}
          ref={fileInputRef}
        />
        {selectedFileName && (
          <p className="text-sm text-muted-foreground mt-1">
            Selected file: {selectedFileName}
          </p>
        )}
        {/* You should add error handling for the 'avatar' field from your server action if applicable */}
        {!!state?.errors?.avatar &&
          state.errors.avatar.map((err) => (
            <p key={err} className="text-red-500 text-sm">
              {err}
            </p>
          ))}
      </div>

      {/* Password */}
      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          defaultValue={state?.data.password}
        />
        {!!state?.errors?.password && (
          <div className="text-red-500 text-sm mt-1">
            <ul>
              {state.errors.password.map((err) => (
                <li key={err}>{err}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Confirm Password */}
      <div>
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          defaultValue={state?.data.confirmPassword}
        />
        {!!state?.errors?.confirmPassword &&
          state.errors.confirmPassword.map((err) => (
            <p key={err} className="text-red-500 text-sm">
              {err}
            </p>
          ))}
      </div>

      {/* Terms and Conditions */}
      <div className="flex items-center space-x-2">
        <Checkbox id="termsAccepted" name="termsAccepted" required value="on" />
        <Label
          htmlFor="termsAccepted"
          className="text-sm font-normal text-muted-foreground"
        >
          I agree to the{" "}
          <a href="/terms" className="underline hover:text-primary">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="/privacy" className="underline hover:text-primary">
            Privacy Policy
          </a>
        </Label>
      </div>
      {!!state?.errors?.termsAccepted &&
        state.errors.termsAccepted.map((err) => (
          <p key={err} className="text-red-500 text-sm">
            {err}
          </p>
        ))}

      <SubmitButton className="w-full bg-blue-600 hover:bg-blue-700 text-white">
        Create Account
      </SubmitButton>
    </form>
  );
};

export default SignUpForm;
