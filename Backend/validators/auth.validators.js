import { z } from "zod";

exports.signupSchema = z.object({
  name: z.string().min(1, "Name is Required"),
  email: z.string().email("Invalid Email"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .refine((val) => /[A-Z]/.test(val), {
      message: "Password must contain at least one uppercase letter",
    })
    .refine((val) => /[a-z]/.test(val), {
      message: "Password must contain at least one lowercase letter",
    })
    .refine((val) => /[0-9]/.test(val), {
      message: "Password must contain at least one number",
    })
    .refine((val) => /[!@#$%^&*(),.?":{}|<>]/.test(val), {
      message: "Password must contain at least one special character",
    }),
});
