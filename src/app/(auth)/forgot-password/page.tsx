import type { Metadata } from "next"
import { ForgotPasswordForm } from "./forgot-password-form"

export const metadata: Metadata = {
  title: "Forgot password",
  description: "Reset your PockettIQ account password.",
}

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />
}
