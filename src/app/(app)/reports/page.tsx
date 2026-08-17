import type { Metadata } from "next"
import { Lightbulb, BarChart3 } from "lucide-react"
import { requireOnboardedUser } from "@/server/auth/require-user"
import { getReportData } from "@/server/services/reports"
import { formatNaira } from "@/lib/currency"
import { Card, CardContent } from "@/components/ui/card"
import { StatCard } from "@/components/design-system/stat-card"
import { FinancialHealthCard } from "@/components/design-system/financial-health-card"
import { EmptyState } from "@/components/design-system/empty-state"
import { CategorySpendingChart } from "@/components/charts/category-spending-chart"
import { IncomeExpenseChart } from "@/components/charts/income-expense-chart"
import { SpendingTrendChart } from "@/components/charts/spending-trend-chart"

export const metadata: Metadata = {
  title: "Reports",
}

export default async function ReportsPage() {
  const user = await requireOnboardedUser()
  const report = await getReportData(user.id)

  const hasAnyData = report.income > 0 || report.expenses > 0

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">Reports</h1>

      {!hasAnyData ? (
        <EmptyState
          icon={BarChart3}
          title="Nothing to report yet"
          description="Add some income and expenses to see your monthly report."
        />
      ) : (
        <>
          <div className="grid grid-cols-3 gap-3">
            <StatCard label="Income" amount={report.income} tone="positive" />
            <StatCard label="Expenses" amount={report.expenses} />
            <StatCard label="Savings" amount={report.saved} tone="positive" />
          </div>

          <FinancialHealthCard score={report.health.score} status={report.health.status} />

          {report.insights.length > 0 && (
            <Card>
              <CardContent>
                <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold">
                  <Lightbulb className="size-4 text-primary" />
                  Insights
                </h2>
                <ul className="space-y-2">
                  {report.insights.map((insight, i) => (
                    <li key={i} className="text-sm text-muted-foreground">
                      {insight}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent>
              <h2 className="mb-3 text-sm font-semibold">Income vs Expenses</h2>
              <IncomeExpenseChart income={report.income} expenses={report.expenses} />
            </CardContent>
          </Card>

          {report.spendingByCategory.length > 0 && (
            <Card>
              <CardContent>
                <h2 className="mb-3 text-sm font-semibold">Spending by Category</h2>
                <CategorySpendingChart data={report.spendingByCategory} />
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent>
              <h2 className="mb-3 text-sm font-semibold">Monthly Spending Trend</h2>
              <SpendingTrendChart data={report.trend} />
            </CardContent>
          </Card>

          <p className="text-center text-xs text-muted-foreground">
            This month so far: {formatNaira(report.income)} in,{" "}
            {formatNaira(report.expenses)} out.
          </p>
        </>
      )}
    </div>
  )
}
