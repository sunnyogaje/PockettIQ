import "server-only"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/server/auth/session"
import type { User } from "@prisma/client"

/** Use in server components/actions that require a logged-in user. */
export async function requireUser(): Promise<User> {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/login")
  }
  return user
}

/** Use in the authenticated app shell — also enforces onboarding is complete. */
export async function requireOnboardedUser(): Promise<User> {
  const user = await requireUser()
  if (!user.onboardingCompleted) {
    redirect("/onboarding")
  }
  return user
}

/** Use in admin-only server components/actions. */
export async function requireAdmin(): Promise<User> {
  const user = await requireUser()
  if (user.role !== "ADMIN") {
    redirect("/dashboard")
  }
  return user
}
