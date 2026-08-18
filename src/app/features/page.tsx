import type { Metadata } from "next"
import Link from "next/link"
import {
  Wallet2,
  ArrowLeftRight,
  PiggyBank,
  Repeat,
  Bell,
  BarChart3,
  Calendar,
  ShieldCheck,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { MarketingHeader } from "@/components/design-system/marketing-header"
import { MarketingFooter } from "@/components/design-system/marketing-footer"

export const metadata: Metadata = {
  title: "Features",
  description:
    "Everything PockettIQ helps you do: track income and expenses, budget by category, save toward goals, and see your salary countdown.",
}

const FEATURES = [
  {
    icon: ArrowLeftRight,
    title: "Fast expense & income tracking",
    description: "Add a transaction in under 10 seconds with Nigerian-relevant categories.",
  },
  {
    icon: Calendar,
    title: "Salary countdown",
    description: "See how many days until payday and a recommended daily spending amount.",
  },
  {
    icon: Wallet2,
    title: "Budgets",
    description: "Set an overall or per-category monthly budget with friendly progress tracking.",
  },
  {
    icon: PiggyBank,
    title: "Savings goals",
    description: "Save toward anything — a laptop, rent, or an emergency fund — with progress tracking.",
  },
  {
    icon: Repeat,
    title: "Recurring transactions",
    description: "Track salary, rent, subscriptions, and other regular payments automatically.",
  },
  {
    icon: Bell,
    title: "Reminders & notifications",
    description: "Bill reminders and budget alerts, right inside the app.",
  },
  {
    icon: BarChart3,
    title: "Reports & insights",
    description: "Simple monthly reports with deterministic, rule-based insights — no AI, no guesswork.",
  },
  {
    icon: ShieldCheck,
    title: "Your data, protected",
    description: "Your financial data is private to your account, secured with proper authentication.",
  },
]

export default function FeaturesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <MarketingHeader />
      <main className="flex-1">
        <section className="mx-auto max-w-3xl px-4 py-16 text-center">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Everything you need to manage your money
          </h1>
          <p className="mt-3 text-muted-foreground">
            No complicated accounting. No bank connection required. Just clarity.
          </p>
        </section>

        <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div key={f.title} className="rounded-xl border p-6">
                <div className="flex size-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <f.icon className="size-5" />
                </div>
                <h2 className="mt-4 font-semibold">{f.title}</h2>
                <p className="mt-1.5 text-sm text-muted-foreground">{f.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-4 pb-16 text-center">
          <Button asChild size="lg">
            <Link href="/register">Start Managing Your Money</Link>
          </Button>
        </section>
      </main>
      <MarketingFooter />
    </div>
  )
}
