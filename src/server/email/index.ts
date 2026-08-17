import "server-only"
import { consoleEmailSender } from "@/server/email/console-sender"
import type { EmailSender } from "@/server/email/sender"

export const emailSender: EmailSender = consoleEmailSender

export function verificationEmail(name: string, verifyUrl: string) {
  return {
    subject: "Verify your PockettIQ email",
    text: `Hi ${name},\n\nWelcome to PockettIQ. Confirm your email address to activate your account:\n\n${verifyUrl}\n\nThis link expires in 24 hours. If you didn't create a PockettIQ account, you can ignore this email.\n\n— PockettIQ`,
  }
}

export function passwordResetEmail(name: string, resetUrl: string) {
  return {
    subject: "Reset your PockettIQ password",
    text: `Hi ${name},\n\nWe received a request to reset your PockettIQ password. Choose a new password here:\n\n${resetUrl}\n\nThis link expires in 1 hour. If you didn't request this, you can safely ignore this email — your password won't change.\n\n— PockettIQ`,
  }
}
