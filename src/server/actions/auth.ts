"use server"

import { db } from "@/server/db"
import { createUser, findUserByEmail } from "@/server/services/users"
import { verifyPassword } from "@/server/auth/password"
import { createSession, destroyCurrentSession, destroyAllUserSessions } from "@/server/auth/session"
import { createVerificationToken, consumeVerificationToken } from "@/server/auth/tokens"
import { emailSender, verificationEmail, passwordResetEmail } from "@/server/email"
import { hashPassword } from "@/server/auth/password"
import { rateLimit } from "@/server/rate-limit"
import { getClientIp } from "@/server/request-ip"
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  type RegisterInput,
  type LoginInput,
  type ForgotPasswordInput,
  type ResetPasswordInput,
} from "@/server/validation/auth"

export type ActionResult =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> }

function baseUrl() {
  return process.env.APP_URL ?? "http://localhost:3000"
}

export async function registerAction(input: RegisterInput): Promise<ActionResult> {
  const parsed = registerSchema.safeParse(input)
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please fix the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    }
  }

  const ip = await getClientIp()
  const limited = rateLimit(`register:${ip}`, { limit: 8, windowMs: 60 * 60 * 1000 })
  if (!limited.allowed) {
    return { ok: false, error: "Too many attempts. Please try again later." }
  }

  const existing = await findUserByEmail(parsed.data.email)
  if (existing) {
    return {
      ok: false,
      error: "An account with this email already exists. Try logging in instead.",
      fieldErrors: { email: ["Already registered"] },
    }
  }

  const user = await createUser(parsed.data)

  const rawToken = await createVerificationToken(user.id, "EMAIL_VERIFY")
  const verifyUrl = `${baseUrl()}/verify-email?token=${rawToken}`
  const { subject, text } = verificationEmail(user.name, verifyUrl)
  await emailSender.send({ to: user.email, subject, text })

  await createSession(user.id)

  return { ok: true }
}

export async function loginAction(input: LoginInput): Promise<ActionResult> {
  const parsed = loginSchema.safeParse(input)
  if (!parsed.success) {
    return {
      ok: false,
      error: "Enter a valid email and password.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    }
  }

  const ip = await getClientIp()
  const limited = rateLimit(`login:${ip}:${parsed.data.email}`, {
    limit: 10,
    windowMs: 15 * 60 * 1000,
  })
  if (!limited.allowed) {
    return { ok: false, error: "Too many attempts. Please try again in a few minutes." }
  }

  const user = await findUserByEmail(parsed.data.email)
  if (!user) {
    return { ok: false, error: "Incorrect email or password." }
  }

  const validPassword = await verifyPassword(parsed.data.password, user.passwordHash)
  if (!validPassword) {
    return { ok: false, error: "Incorrect email or password." }
  }

  await createSession(user.id)
  return { ok: true }
}

export async function logoutAction(): Promise<void> {
  await destroyCurrentSession()
}

export async function verifyEmailAction(
  token: string
): Promise<ActionResult | { ok: false; error: string; alreadyVerified: true }> {
  const result = await consumeVerificationToken(token, "EMAIL_VERIFY")
  if (!result.ok) {
    if (result.reason === "used") {
      return {
        ok: false,
        error: "This email is already verified.",
        alreadyVerified: true,
      }
    }
    return { ok: false, error: "This verification link is invalid or has expired." }
  }

  await db.user.update({
    where: { id: result.userId },
    data: { emailVerified: new Date() },
  })

  return { ok: true }
}

export async function forgotPasswordAction(
  input: ForgotPasswordInput
): Promise<ActionResult> {
  const parsed = forgotPasswordSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, error: "Enter a valid email address." }
  }

  const ip = await getClientIp()
  const limited = rateLimit(`forgot-password:${ip}:${parsed.data.email}`, {
    limit: 5,
    windowMs: 60 * 60 * 1000,
  })
  if (!limited.allowed) {
    return { ok: false, error: "Too many attempts. Please try again later." }
  }

  const user = await findUserByEmail(parsed.data.email)
  // Always return success — don't reveal whether an email is registered.
  if (user) {
    const rawToken = await createVerificationToken(user.id, "PASSWORD_RESET")
    const resetUrl = `${baseUrl()}/reset-password?token=${rawToken}`
    const { subject, text } = passwordResetEmail(user.name, resetUrl)
    await emailSender.send({ to: user.email, subject, text })
  }

  return { ok: true }
}

export async function resetPasswordAction(
  input: ResetPasswordInput
): Promise<ActionResult> {
  const parsed = resetPasswordSchema.safeParse(input)
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please fix the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    }
  }

  const result = await consumeVerificationToken(parsed.data.token, "PASSWORD_RESET")
  if (!result.ok) {
    return { ok: false, error: "This reset link is invalid or has expired." }
  }

  const passwordHash = await hashPassword(parsed.data.password)
  await db.user.update({
    where: { id: result.userId },
    data: { passwordHash },
  })

  // Force re-login everywhere after a password reset.
  await destroyAllUserSessions(result.userId)

  return { ok: true }
}
