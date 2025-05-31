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
    location: z.string().optional().or(z.literal("")),
    termsAccepted: z
      .boolean()
      .or(z.enum(["on"]))
      .transform((val) => val === true || val === "on")
      .refine((val) => val === true, {
        message: "You must accept the terms and conditions",
      }),
    avatar: z.instanceof(File).optional().nullable(), // Explicitly allow null if no file is selected
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

    if (!data.location || data.location.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Location is required.",
        path: ["location"],
      });
    }
  });
