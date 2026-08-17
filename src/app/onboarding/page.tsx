import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { requireUser } from "@/server/auth/require-user"
import { Logo } from "@/components/design-system/logo"
import { OnboardingWizard } from "./onboarding-wizard"

export const metadata: Metadata = {
  title: "Set up your account",
  description: "A few quick questions to personalize PockettIQ for you.",
}

export default async function OnboardingPage() {
  const user = await requireUser()
  if (user.onboardingCompleted) redirect("/dashboard")

  return (
    <div className="flex min-h-screen flex-col bg-muted/40">
      <header className="flex justify-center py-8">
        <Logo />
      </header>
      <main className="flex flex-1 items-start justify-center px-4 pb-16">
        <div className="w-full max-w-sm">
          <OnboardingWizard initialName={user.name} />
        </div>
      </main>
    </div>
  )
}
