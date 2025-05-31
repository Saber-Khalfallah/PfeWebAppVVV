import { z } from "zod";

export const loginFormSchema = z.object({
  email: z.string().email(),
  password: z
    .string({ required_error: "Password is required." })
    .min(1, "Password must be at least 1 characters long."),
});
