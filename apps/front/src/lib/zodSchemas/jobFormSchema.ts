import { z } from "zod";

export const jobSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters long")
    .max(100, "Title must not exceed 100 characters"),

  description: z
    .string()
    .min(20, "Description must be at least 20 characters long")
    .max(1000, "Description must not exceed 1000 characters"),

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

  requestedDatetime: z
    .string()
    .min(1, "Please select when you need this service")
    .refine((date) => {
      const selectedDate = new Date(date);
      const now = new Date();
      return selectedDate > now;
    }, "Service date must be in the future"),

  estimatedCost: z.preprocess(
    (val) => {
      if (typeof val === "string") {
        const parsed = val.trim();
        if (parsed === "") return undefined;
        const num = Number(parsed);
        return isNaN(num) ? val : num; // return number or keep original if NaN to fail later
      }
      return val; // if already number or undefined/null
    },
    z
      .number()
      .positive("Budget must be a positive number")
      .max(999999.99, "Budget cannot exceed $999,999.99")
      .optional()
      .nullable()
  ),

  categoryId: z.string().min(1, "Please select a service category"),
});

export type JobFormData = z.infer<typeof jobSchema>;
