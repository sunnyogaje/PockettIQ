import type { Metadata } from "next"
import { MarketingHeader } from "@/components/design-system/marketing-header"
import { MarketingFooter } from "@/components/design-system/marketing-footer"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "What data PockettIQ collects, why, how it's stored, and how to delete your account.",
}

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <MarketingHeader />
      <main className="mx-auto max-w-2xl flex-1 px-4 py-16">
        <h1 className="text-3xl font-semibold tracking-tight">Privacy Policy</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: August 2026</p>

        <div className="prose-sm mt-8 space-y-8 text-muted-foreground">
          <section>
            <h2 className="text-lg font-semibold text-foreground">What we collect</h2>
            <p className="mt-2">
              We collect the minimum information needed to run PockettIQ:
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Your name and email address, to create and secure your account.</li>
              <li>A securely hashed password (we never store your password in plain text).</li>
              <li>
                The financial information you choose to enter — income, expenses, budgets,
                savings goals, recurring transactions, and reminders.
              </li>
              <li>
                Onboarding preferences — currency, country, payday, and income frequency —
                used to power features like the salary countdown.
              </li>
              <li>Basic product usage events (e.g. that an expense was added), without amounts.</li>
            </ul>
            <p className="mt-2">
              We do not collect your BVN, NIN, bank login details, card numbers, or PINs.
              PockettIQ does not connect to your bank account and has no reason to ask for
              this information.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">Why we collect it</h2>
            <p className="mt-2">
              Your financial data is used solely to power the features you use — your
              dashboard, budgets, reports, and reminders. We use your email to verify your
              account and send account-related messages (like password resets). We never sell
              your data.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">How it&apos;s stored</h2>
            <p className="mt-2">
              Your data is stored in an encrypted-at-rest PostgreSQL database. Passwords are
              hashed with bcrypt and never stored or logged in plain text. Every request is
              authenticated with a revocable, server-side session — your financial records are
              only ever readable by your own account, enforced on the server for every query.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">Advertising</h2>
            <p className="mt-2">
              Free accounts may see advertisements. Ad placements never receive your
              transaction amounts or financial details — only that an ad slot should be shown.
              Premium accounts do not see ads.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">Deleting your account</h2>
            <p className="mt-2">
              You can permanently delete your account at any time from{" "}
              <strong>Settings → Delete account</strong>. This immediately and permanently
              removes your profile and every piece of financial data associated with it —
              transactions, budgets, goals, recurring items, reminders, and notifications.
              This action cannot be undone.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">Contact</h2>
            <p className="mt-2">
              Questions about this policy or your data? Reach out through the contact details
              on our support channels.
            </p>
          </section>
        </div>
      </main>
      <MarketingFooter />
    </div>
  )
}
