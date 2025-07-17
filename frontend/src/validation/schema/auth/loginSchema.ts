import { z } from "zod";
export const loginSchema = z.object({
  email: z.string().trim().min(1, "Email is Required"),
  password: z.string().trim().min(1, "Password is Required"),
});
export type LoginFormData = z.infer<typeof loginSchema>;
