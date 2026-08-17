import type { Metadata } from "next"
import { VerifyEmailStatus } from "./verify-email-status"

export const metadata: Metadata = {
  title: "Verify email",
  description: "Confirm your PockettIQ email address.",
}

export default async function VerifyEmailPage({
  searchParams,
}: PageProps<"/verify-email">) {
  const params = await searchParams
  const token = typeof params.token === "string" ? params.token : null

  return <VerifyEmailStatus token={token} />
}
