import type { Metadata } from "next"
import { MarketingHeader } from "@/components/design-system/marketing-header"
import { MarketingFooter } from "@/components/design-system/marketing-footer"

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms that govern your use of PockettIQ.",
}

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <MarketingHeader />
      <main className="mx-auto max-w-2xl flex-1 px-4 py-16">
        <h1 className="text-3xl font-semibold tracking-tight">Terms of Service</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: August 2026</p>

        <div className="mt-8 space-y-8 text-muted-foreground">
          <section>
            <h2 className="text-lg font-semibold text-foreground">1. What PockettIQ is</h2>
            <p className="mt-2">
              PockettIQ is a personal budgeting and expense-tracking tool. It is{" "}
              <strong>not a bank</strong> and does not hold your money, move funds, extend
              credit, or provide loans, investment products, or insurance. All balances,
              budgets, and summaries shown in PockettIQ are calculated entirely from
              information you manually enter — PockettIQ does not connect to your bank
              account.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">2. Not financial advice</h2>
            <p className="mt-2">
              Figures like your recommended daily spending amount, suggested monthly savings
              contribution, and financial health score are simple calculations based on the
              numbers you&apos;ve entered. They are provided for informational purposes only
              and are not professional financial, investment, tax, or legal advice.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">3. Your account</h2>
            <p className="mt-2">
              You&apos;re responsible for keeping your password confidential and for all
              activity under your account. Let us know if you believe your account has been
              accessed without authorization.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">4. Free and Premium plans</h2>
            <p className="mt-2">
              PockettIQ offers a free plan and a paid Premium plan. Premium features and
              pricing are described on our <a href="/pricing" className="underline underline-offset-2">Pricing</a> page
              and may change with notice. Free accounts may display advertisements; Premium
              accounts do not.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">5. Acceptable use</h2>
            <p className="mt-2">
              Don&apos;t use PockettIQ for unlawful purposes, to misrepresent your identity, or
              to attempt to access another user&apos;s data. Accounts found doing so may be
              suspended.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">6. Your data</h2>
            <p className="mt-2">
              See our <a href="/privacy" className="underline underline-offset-2">Privacy Policy</a> for
              details on what we collect and how you can delete your account and data at any
              time.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">7. Changes</h2>
            <p className="mt-2">
              We may update these terms as PockettIQ evolves. Continued use of PockettIQ after
              a change means you accept the updated terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">8. Governing law</h2>
            <p className="mt-2">
              These terms are governed by the laws of the Federal Republic of Nigeria.
            </p>
          </section>
        </div>
      </main>
      <MarketingFooter />
    </div>
  )
}
