import { z } from "zod"

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Enter your first name")
    .max(60, "That name is too long"),
  email: z.email("Enter a valid email address").toLowerCase().trim(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password is too long")
    .regex(/[a-z]/, "Include at least one lowercase letter")
    .regex(/[A-Z]/, "Include at least one uppercase letter")
    .regex(/[0-9]/, "Include at least one number"),
})
export type RegisterInput = z.infer<typeof registerSchema>

export const loginSchema = z.object({
  email: z.email("Enter a valid email address").toLowerCase().trim(),
  password: z.string().min(1, "Enter your password"),
})
export type LoginInput = z.infer<typeof loginSchema>

export const forgotPasswordSchema = z.object({
  email: z.email("Enter a valid email address").toLowerCase().trim(),
})
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>

export const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password is too long")
    .regex(/[a-z]/, "Include at least one lowercase letter")
    .regex(/[A-Z]/, "Include at least one uppercase letter")
    .regex(/[0-9]/, "Include at least one number"),
})
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>
