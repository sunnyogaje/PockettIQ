import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/server/auth/session"
import { LoginForm } from "./login-form"

export const metadata: Metadata = {
  title: "Log in",
  description: "Log in to your PockettIQ account.",
}

export default async function LoginPage() {
  const user = await getCurrentUser()
  if (user) redirect("/dashboard")

  return <LoginForm />
}
