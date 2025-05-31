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

  location: z
    .string()
    .min(1, "Location is required")
    .max(100, "Location must not exceed 100 characters"),
    

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
