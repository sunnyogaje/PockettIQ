import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/server/auth/session"
import { RegisterForm } from "./register-form"

export const metadata: Metadata = {
  title: "Create your account",
  description: "Create a free PockettIQ account and start tracking your money in minutes.",
}

export default async function RegisterPage() {
  const user = await getCurrentUser()
  if (user) redirect("/dashboard")

  return <RegisterForm />
}
