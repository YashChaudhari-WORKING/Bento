import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().trim().min(1, "Name is Required"),
  email: z
    .string()
    .trim()
    .min(5, "Email is Too Short")
    .max(100, "Email is Too Long")
    .email("Invalid Email"),
  password: z
    .string()
    .trim()
    .min(6, "Password must be at least 6 character")
    .max(180, "Password is Too Long")
    .regex(/[A-Z]/, "Password must contain At least one uppercase letter")
    .regex(/[a-z]/, "Password must contain At least one lowercase letter")
    .regex(/[^A-Za-z0-9]/, "Password must contain At least Special Character"),
});

export type signupFormData = z.infer<typeof signupSchema>;
