import type { Metadata } from "next"
import Link from "next/link"
import { Check } from "lucide-react"
import { getCurrentUser } from "@/server/auth/session"
import { getSubscription } from "@/server/services/subscriptions"
import { Logo } from "@/components/design-system/logo"
import { Card, CardContent } from "@/components/ui/card"
import { formatNaira } from "@/lib/currency"
import { UpgradeButton } from "./upgrade-button"

export const metadata: Metadata = {
  title: "Pricing",
  description: "PockettIQ is free to use. Upgrade to Premium for ₦500/month to remove ads and unlock advanced features.",
}

const FREE_FEATURES = [
  "Expense tracking",
  "Income tracking",
  "Basic budgets",
  "Basic reports",
  "Savings goals (up to 3)",
  "Recurring transactions",
  "Basic reminders",
]

const PREMIUM_FEATURES = [
  "Everything in Free",
  "No ads",
  "Advanced reports",
  "Unlimited savings goals",
  "Advanced budgeting",
  "PDF export",
  "Family budgeting",
  "More customization",
]

export default async function PricingPage() {
  const user = await getCurrentUser()
  const subscription = user ? await getSubscription(user.id) : null
  const isPremium = subscription?.plan === "PREMIUM"

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Link href="/" className="mb-8 inline-block">
        <Logo />
      </Link>

      <div className="text-center">
        <h1 className="text-3xl font-semibold tracking-tight">Simple, honest pricing</h1>
        <p className="mt-2 text-muted-foreground">
          PockettIQ is free to use. Upgrade any time for a few extras.
        </p>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <Card>
          <CardContent className="flex h-full flex-col">
            <h2 className="text-lg font-semibold">Free</h2>
            <p className="mt-1 text-3xl font-semibold tracking-tight">₦0</p>
            <p className="text-sm text-muted-foreground">per month</p>
            <ul className="mt-6 flex-1 space-y-2.5">
              {FREE_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                  {f}
                </li>
              ))}
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <Check className="mt-0.5 size-4 shrink-0" />
                Includes ads
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-primary">
          <CardContent className="flex h-full flex-col">
            <h2 className="text-lg font-semibold">PockettIQ Premium</h2>
            <p className="mt-1 text-3xl font-semibold tracking-tight">{formatNaira(500)}</p>
            <p className="text-sm text-muted-foreground">per month</p>
            <ul className="mt-6 flex-1 space-y-2.5">
              {PREMIUM_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                  {f}
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <UpgradeButton loggedIn={!!user} isPremium={isPremium} />
              {user && !isPremium && (
                <p className="mt-2 text-center text-xs text-muted-foreground">
                  Demo mode — this switches your plan instantly, no payment required yet.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        The free plan is fully usable on its own — upgrade only if you want the extras.
      </p>
    </div>
  )
}
