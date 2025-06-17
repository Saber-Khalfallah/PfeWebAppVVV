import { z } from "zod";

// Define the Role enum to match your backend enum values
const RoleEnum = z.enum(["client", "serviceProvider", "administrator"]);

export const SignUpFormSchema = z
  .object({
    firstName: z
      .string({ required_error: "First name is required." })
      .min(1, "First name cannot be empty.")
      .min(2, "First name must be at least 2 characters long.")
      .trim(),
    lastName: z
      .string({ required_error: "Last name is required." })
      .min(1, "Last name cannot be empty.")
      .min(2, "Last name must be at least 2 characters long.")
      .trim(),
    email: z
      .string({ required_error: "Email is required." })
      .email("Invalid email address.")
      .trim(),
    password: z
      .string({ required_error: "Password is required." })
      .min(8, "Password must be at least 8 characters long.")
      .regex(/[a-zA-Z]/, {
        message: "Password must contain at least one letter.",
      })
      .regex(/[0-9]/, { message: "Password must contain at least one number." })
      .regex(/[^a-zA-Z0-9]/, {
        message: "Password must contain at least one special character.",
      })
      .trim(),
    confirmPassword: z.string({
      required_error: "Please confirm your password.",
    }),
    role: RoleEnum,
    contactInfo: z.string().optional().or(z.literal("")),
    companyName: z.string().optional().or(z.literal("")),
    // Address fields for Tunisia
    governorate: z
      .string({ required_error: "Governorate is required." })
      .min(1, "Governorate cannot be empty.")
      .trim(),
    governorateAr: z
      .string({ required_error: "Arabic governorate is required." })
      .min(1, "Arabic governorate cannot be empty.")
      .trim(),
    delegation: z
      .string({ required_error: "Delegation is required." })
      .min(1, "Delegation cannot be empty.")
      .trim(),
    delegationAr: z
      .string({ required_error: "Arabic delegation is required." })
      .min(1, "Arabic delegation cannot be empty.")
      .trim(),
    postalCode: z
      .string({ required_error: "Postal code is required." })
      .min(4, "Postal code must be at least 4 characters long.")
      .max(4, "Postal code must be exactly 4 characters long.")
      .regex(/^\d{4}$/, "Postal code must be 4 digits.")
      .trim(),
    latitude: z.coerce.number()
      .min(-90, "Latitude must be between -90 and 90.")
      .max(90, "Latitude must be between -90 and 90."),
    longitude: z.coerce.number()
      .min(-180, "Longitude must be between -180 and 180.")
      .max(180, "Longitude must be between -180 and 180."),
    termsAccepted: z
      .boolean()
      .or(z.enum(["on"]))
      .transform((val) => val === true || val === "on")
      .refine((val) => val === true, {
        message: "You must accept the terms and conditions",
      }),
    avatar: z.instanceof(File).optional().nullable(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .superRefine((data, ctx) => {
    if (!data.role) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please select a role",
        path: ["role"],
      });
    }
    if (
      data.role === "serviceProvider" &&
      (!data.companyName || data.companyName.trim() === "")
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Company name is required for service providers.",
        path: ["companyName"],
      });
    }
  });