import type { Metadata } from "next"
import { MarketingHeader } from "@/components/design-system/marketing-header"
import { MarketingFooter } from "@/components/design-system/marketing-footer"

export const metadata: Metadata = {
  title: "About",
  description: "Why PockettIQ exists and who it's built for.",
}

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <MarketingHeader />
      <main className="mx-auto max-w-2xl flex-1 px-4 py-16">
        <h1 className="text-3xl font-semibold tracking-tight">About PockettIQ</h1>
        <div className="mt-6 space-y-4 text-muted-foreground">
          <p>
            PockettIQ was built on a simple idea: managing your money shouldn&apos;t require a
            spreadsheet, a finance degree, or a bank account you don&apos;t have.
          </p>
          <p>
            We built PockettIQ for Nigerian salary earners, students, NYSC members,
            freelancers, and anyone trying to understand where their money goes and make it
            last a little longer — whether income arrives monthly, weekly, or irregularly.
          </p>
          <p>
            PockettIQ is not a bank. It doesn&apos;t hold your money, move it, or lend it to
            you. It&apos;s a place to record what you earn and spend, plan a budget, and save
            toward the things that matter to you — entirely through information you enter
            yourself.
          </p>
          <p>
            The product is intentionally simple: no complicated accounting, no jargon, no
            AI making decisions for you. Just clear numbers and a few honest calculations
            based on what you tell it.
          </p>
        </div>
      </main>
      <MarketingFooter />
    </div>
  )
}
