import type { Metadata } from "next"
import { ResetPasswordForm } from "./reset-password-form"

export const metadata: Metadata = {
  title: "Reset password",
  description: "Choose a new password for your PockettIQ account.",
}

export default async function ResetPasswordPage({
  searchParams,
}: PageProps<"/reset-password">) {
  const params = await searchParams
  const token = typeof params.token === "string" ? params.token : null

  return <ResetPasswordForm token={token} />
}
