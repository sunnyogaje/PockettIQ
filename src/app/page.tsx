import Link from "next/link"
import { Wallet2, Calendar, PiggyBank, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MarketingHeader } from "@/components/design-system/marketing-header"
import { MarketingFooter } from "@/components/design-system/marketing-footer"

const FEATURES = [
  {
    icon: Wallet2,
    title: "Understand Your Spending",
    description:
      "Know exactly where your money goes with clear categories built for everyday Nigerian spending.",
  },
  {
    icon: Calendar,
    title: "Make Your Salary Last",
    description:
      "Track your spending against the days remaining until payday, with a recommended daily amount.",
  },
  {
    icon: PiggyBank,
    title: "Save With Purpose",
    description: "Create goals and monitor your progress, from a new laptop to an emergency fund.",
  },
  {
    icon: Users,
    title: "Built for Everyday Nigerians",
    description:
      "Familiar categories and financial habits — no bank account or credit card required to get started.",
  },
]

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <MarketingHeader />

      <main className="flex-1">
        <section className="mx-auto flex max-w-3xl flex-col items-center px-4 py-16 text-center sm:py-24">
          <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            Your Money. Smarter.
          </h1>
          <p className="mt-4 max-w-md text-balance text-muted-foreground">
            PockettIQ helps you track your spending, manage your budget, and make your
            money last longer.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/register">Start Managing Your Money</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/features">See How It Works</Link>
            </Button>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-12 sm:px-8">
          <div className="grid gap-6 sm:grid-cols-2">
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

        <section className="mx-auto max-w-3xl px-4 py-16 text-center">
          <h2 className="text-2xl font-semibold tracking-tight">Know where your money goes.</h2>
          <p className="mt-3 text-muted-foreground">
            Free to start, no bank connection required. Add your first expense in seconds.
          </p>
          <Button asChild size="lg" className="mt-6">
            <Link href="/register">Start Managing Your Money</Link>
          </Button>
        </section>
      </main>

      <MarketingFooter />
    </div>
  )
}
