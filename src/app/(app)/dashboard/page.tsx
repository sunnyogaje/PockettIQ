import type { Metadata } from "next"
import Link from "next/link"
import { Wallet2, PiggyBank, ArrowLeftRight } from "lucide-react"
import { requireOnboardedUser } from "@/server/auth/require-user"
import { getDashboardData } from "@/server/services/dashboard"
import { getSubscription } from "@/server/services/subscriptions"
import { AdPlaceholder } from "@/components/design-system/ad-placeholder"
import { timeOfDayGreeting } from "@/lib/greeting"
import { formatNaira } from "@/lib/currency"
import { StatCard } from "@/components/design-system/stat-card"
import { TransactionItem } from "@/components/design-system/transaction-item"
import { GoalCard } from "@/components/design-system/goal-card"
import { EmptyState } from "@/components/design-system/empty-state"
import { ProgressBar } from "@/components/design-system/progress-bar"
import { QuickAddTriggerButton } from "@/components/design-system/quick-add-trigger-button"
import { InstallPrompt } from "@/components/design-system/install-prompt"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toNumber } from "@/lib/currency"

export const metadata: Metadata = {
  title: "Dashboard",
}

export default async function DashboardPage() {
  const user = await requireOnboardedUser()
  const [data, subscription] = await Promise.all([
    getDashboardData(user.id),
    getSubscription(user.id),
  ])
  const isPremium = subscription?.plan === "PREMIUM"

  const totalSpending = data.spendingByCategory.reduce((sum, c) => sum + c.total, 0)

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <InstallPrompt />

      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          {timeOfDayGreeting()}, {user.name} 👋
        </h1>
        <p className="text-sm text-muted-foreground">Here&apos;s your money snapshot.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Available</p>
              <p className="mt-1 text-3xl font-semibold tracking-tight tabular-nums">
                {formatNaira(data.availableBalance)}
              </p>
              {data.daysRemaining != null && (
                <p className="mt-2 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{data.daysRemaining} days</span>{" "}
                  until payday
                </p>
              )}
            </div>
            {data.dailyAllowance != null && (
              <div className="rounded-xl bg-accent px-4 py-3 text-accent-foreground">
                <p className="text-xs font-medium opacity-80">You can spend about</p>
                <p className="text-xl font-semibold tabular-nums">
                  {formatNaira(data.dailyAllowance)}
                  <span className="text-sm font-normal"> /day</span>
                </p>
              </div>
            )}
          </CardContent>
          {data.daysRemaining != null && (
            <CardContent className="pt-0">
              <p className="text-xs text-muted-foreground">
                This is a suggestion based only on the numbers you&apos;ve entered — not
                financial advice.
              </p>
            </CardContent>
          )}
        </Card>

        <div className="flex flex-col gap-3">
          <QuickAddTriggerButton tab="expense" label="Add Expense" className="w-full" />
          <QuickAddTriggerButton
            tab="income"
            label="Add Income"
            variant="outline"
            className="w-full"
          />
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-sm font-semibold text-muted-foreground">This Month</h2>
        <div className="grid grid-cols-3 gap-3">
          <StatCard label="Income" amount={data.income} tone="positive" />
          <StatCard label="Spent" amount={data.expenses} />
          <StatCard label="Saved" amount={data.saved} tone="positive" />
        </div>
      </div>

      <AdPlaceholder placement="dashboard-banner" isPremium={isPremium} />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold">Spending</h2>
              <Link
                href="/reports"
                className="text-xs font-medium text-primary underline-offset-4 hover:underline"
              >
                View report
              </Link>
            </div>
            {data.spendingByCategory.length === 0 ? (
              <EmptyState
                icon={Wallet2}
                title="No spending yet"
                description="Add an expense to see your spending breakdown."
              />
            ) : (
              <div className="space-y-3">
                {data.spendingByCategory.slice(0, 5).map((c) => (
                  <div key={c.categoryId}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="font-medium">{c.categoryName}</span>
                      <span className="tabular-nums text-muted-foreground">
                        {formatNaira(c.total)}
                      </span>
                    </div>
                    <ProgressBar
                      value={totalSpending > 0 ? (c.total / totalSpending) * 100 : 0}
                    />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold">Savings Goals</h2>
              <Link
                href="/goals"
                className="text-xs font-medium text-primary underline-offset-4 hover:underline"
              >
                View all
              </Link>
            </div>
            {data.savingsGoals.length === 0 ? (
              <EmptyState
                icon={PiggyBank}
                title="What are you saving for?"
                description="Create a goal and track your progress toward it."
                action={
                  <Button asChild size="sm">
                    <Link href="/goals">Create Goal</Link>
                  </Button>
                }
              />
            ) : (
              <div className="space-y-3">
                {data.savingsGoals.map((goal) => (
                  <GoalCard
                    key={goal.id}
                    id={goal.id}
                    name={goal.name}
                    targetAmount={toNumber(goal.targetAmount)}
                    currentAmount={toNumber(goal.currentAmount)}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent>
          <div className="mb-1 flex items-center justify-between">
            <h2 className="text-sm font-semibold">Recent Transactions</h2>
            <Link
              href="/transactions"
              className="text-xs font-medium text-primary underline-offset-4 hover:underline"
            >
              View all
            </Link>
          </div>
          {data.recentTransactions.length === 0 ? (
            <EmptyState
              icon={ArrowLeftRight}
              title="Your money story starts here"
              description="Add your first expense to start understanding where your money goes."
              action={<QuickAddTriggerButton tab="expense" label="Add Expense" />}
            />
          ) : (
            <div className="divide-y">
              {data.recentTransactions.map((t) => (
                <TransactionItem
                  key={t.id}
                  transaction={{
                    id: t.id,
                    type: t.type,
                    amount: toNumber(t.amount),
                    description: t.description,
                    transactionDate: t.transactionDate,
                    category: { name: t.category.name, icon: t.category.icon },
                  }}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
