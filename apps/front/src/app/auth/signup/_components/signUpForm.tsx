"use client";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { getDelegations, type DelegationData } from "@/lib/actions/locations";
import SubmitButton from "@/components/SubmitButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { signUp } from "@/lib/actions/auth"; // Your server action
import { useActionState, useState, useRef, useEffect } from "react"; // Import useRef
import { PersonIcon, BackpackIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import React from "react";

const SignUpForm = () => {
  const [state, action] = useActionState(signUp, undefined);
  const [role, setUserType] = useState<"client" | "serviceProvider" | null>(
    null,
  );
  const [open, setOpen] = useState(false);
  const [delegations, setDelegations] = useState<DelegationData[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<DelegationData | null>(null);
  const [searchInput, setSearchInput] = useState('');
  console.log(selectedLocation)
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
  
  useEffect(() => {
    const fetchDelegations = async () => {
      try {
        const data = await getDelegations();
        if (Array.isArray(data)) {
          setDelegations(data);
        } else {
          console.error('Invalid delegation data format');
          setDelegations([]);
        }
      } catch (error) {
        console.error('Failed to fetch delegations:', error);
        setDelegations([]);
      }
    };

    fetchDelegations();
  }, []);
  
  const LocationField = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [showOptions, setShowOptions] = useState(false);

    // Filter delegations based on postal code input
    const filteredDelegations = React.useMemo(() => {
      if (!delegations?.length) {
        console.log('No delegations available');
        return []
      };
      const search = searchQuery.trim();
      if (!search) {
        console.log('No search query');
        return [];
      }

      console.log('Filtering delegations...');
      return delegations.filter(delegation => {
        // Log each delegation being checked
        // Make sure we have the correct property names
        const postalCode = delegation?.postalCode;
        if (!postalCode) {
          return false;
        }

        const matches = postalCode.toString().startsWith(search);
        return matches;
      }).slice(0, 5);
    }, [delegations, searchQuery]);

    return (
      <div className="flex flex-col space-y-2 relative">
        <Label>Location (Search by postal code) *</Label>
        <div className="relative">
          <Input
            type="text"
            placeholder={selectedLocation ? `${selectedLocation.delegation} (${selectedLocation.postalCode})` : "Type postal code..."}
            value={selectedLocation ? `${selectedLocation.delegation} (${selectedLocation.postalCode})` : searchQuery}
            onChange={(e) => {
              if (selectedLocation) {
                // If there's a selection, clear it and start fresh search
                setSelectedLocation(null);
                const value = e.target.value.replace(/[^0-9]/g, '');
                setSearchQuery(value);
              } else {
                const value = e.target.value.replace(/[^0-9]/g, ''); // Only allow numbers
                setSearchQuery(value);
              }
              setShowOptions(true);
            }}
            onFocus={() => {
              if (selectedLocation) {
                // If clicking on selected item, clear it to allow new search
                setSelectedLocation(null);
                setSearchQuery('');
              }
              setShowOptions(true);
            }}
            className={cn(
              "w-full",
              selectedLocation && "text-blue-600 font-medium",
              // Add error styling for any address field errors
              (state?.errors?.postalCode || 
               state?.errors?.governorate || 
               state?.errors?.delegation || 
               state?.errors?.latitude || 
               state?.errors?.longitude) && "border-red-500"
            )}
            readOnly={selectedLocation ? true : false}
          />

          {/* Results dropdown */}
          {showOptions && searchQuery && !selectedLocation && (
            <div className="absolute w-full mt-1 bg-white rounded-md border shadow-lg z-50 max-h-[200px] overflow-y-auto">
              {filteredDelegations.length > 0 ? (
                filteredDelegations.map((delegation) => (
                  <button
                    key={delegation.delegation}
                    type="button"
                    className="w-full text-left px-4 py-2 hover:bg-slate-100 flex items-center space-x-2"
                    onClick={() => {
                      setSelectedLocation(delegation);
                      setSearchQuery('');
                      setShowOptions(false);
                    }}
                  >
                    <span>{delegation.delegation} ({delegation.postalCode})</span>
                  </button>
                ))
              ) : (
                <div className="px-4 py-2 text-sm text-gray-500">
                  No matching postal code found
                </div>
              )}
            </div>
          )}
        </div>

        {/* Hidden inputs - Always render, but with empty values if no selection */}
        <input type="hidden" name="postalCode" value={selectedLocation?.postalCode || ""} />
        <input type="hidden" name="governorate" value={selectedLocation?.governorate || ""} />
        <input type="hidden" name="governorateAr" value={selectedLocation?.governorateAr || ""} />
        <input type="hidden" name="delegation" value={selectedLocation?.delegation || ""} />
        <input type="hidden" name="delegationAr" value={selectedLocation?.delegationAr || ""} />
        <input type="hidden" name="latitude" value={String(selectedLocation?.latitude || "")} />
        <input type="hidden" name="longitude" value={String(selectedLocation?.longitude || "")} />

        {/* Show any address-related errors */}
        {(state?.errors?.postalCode || 
          state?.errors?.governorate || 
          state?.errors?.delegation || 
          state?.errors?.governorateAr || 
          state?.errors?.delegationAr || 
          state?.errors?.latitude || 
          state?.errors?.longitude) && (
          <div className="text-red-500 text-sm space-y-1">
            {state?.errors?.postalCode?.map((err, i) => <p key={i}>{err}</p>)}
            {state?.errors?.governorate?.map((err, i) => <p key={i}>{err}</p>)}
            {state?.errors?.delegation?.map((err, i) => <p key={i}>{err}</p>)}
            {state?.errors?.governorateAr?.map((err, i) => <p key={i}>{err}</p>)}
            {state?.errors?.delegationAr?.map((err, i) => <p key={i}>{err}</p>)}
            {state?.errors?.latitude?.map((err, i) => <p key={i}>{err}</p>)}
            {state?.errors?.longitude?.map((err, i) => <p key={i}>{err}</p>)}
            {/* Generic message if no specific error */}
            {(!state?.errors?.postalCode && !state?.errors?.governorate && !state?.errors?.delegation && 
              !state?.errors?.governorateAr && !state?.errors?.delegationAr && 
              !state?.errors?.latitude && !state?.errors?.longitude) && (
              <p>Please select a valid location</p>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    // The form's 'action' prop with 'useActionState' automatically handles FormData when file inputs are present.
    <form action={action} className="space-y-6 w-full max-w-md mx-auto">
      {
      !!state?.message && (
        <p className="text-red-500 text-sm p-3 bg-red-100 rounded-md">
          {state.message}
          {typeof state.data.latitude}
        </p>
      )}

      {/* Role Selection */}
      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setUserType("serviceProvider")}
            className={`p-4 border rounded-md flex flex-col items-center justify-center transition-colors cursor-pointer ${role === "serviceProvider"
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
            className={`p-4 border rounded-md flex flex-col items-center justify-center transition-colors cursor-pointer ${role === "client"
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
            defaultValue={state?.data?.firstName}
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
            defaultValue={state?.data?.lastName}
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
          defaultValue={state?.data?.email}
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
          defaultValue={state?.data?.contactInfo}
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
            defaultValue={state?.data?.companyName}
          />
          {!!state?.errors?.companyName &&
            state.errors.companyName.map((err) => (
              <p key={err} className="text-red-500 text-sm">
                {err}
              </p>
            ))}
        </div>
      )}

      <LocationField />

      {/* Avatar Upload Field */}
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
          defaultValue={state?.data?.password}
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
          defaultValue={state?.data?.confirmPassword}
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