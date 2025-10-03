const { z } = require("zod");

const membershipSchema = z.object({
  userId: z.string().min(1, "UserId is required"), // ObjectId as string
  role: z.enum(["admin", "member", "viewer"]).default("member"),
});

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
exports.loginSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email address"),
  password: z.string({ required_error: "Password is required" }),
});
exports.workSpaceSchema = z.object({
  name: z.string().min(1, "WorkSpace Name Is required"),
  slug: z
    .string()
    .min(1, "Workspace Slug is required")
    .regex(
      /^[a-z0-9]+(-[a-z0-9]+)*$/,
      "Slug must be lowercase, alphanumeric, and can include hyphens (e.g. dev-team)"
    ),
});

exports.teamSchema = z.object({
  name: z.string().min(2, "Team name must be at least 2 characters"),
  slug: z
    .string()
    .min(1, "Team slug is required")
    .regex(
      /^[A-Z0-9]+$/,
      "Slug must contain only capital letters and numbers (e.g. DEV, TEAM1, BACKEND)"
    ),
  workspaceId: z.string().min(1, "WorkspaceId is required"), // ObjectId as string
});
