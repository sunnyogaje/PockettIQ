import { Card, CardContent } from "@/components/ui/card"
import { ProgressBar } from "@/components/design-system/progress-bar"
import { cn } from "@/lib/utils"

const STATUS_COLOR: Record<string, string> = {
  Excellent: "text-chart-good",
  Good: "text-primary",
  Fair: "text-chart-4",
  "Needs Attention": "text-negative",
}

export function FinancialHealthCard({
  score,
  status,
}: {
  score: number
  status: string
}) {
  return (
    <Card>
      <CardContent>
        <h2 className="mb-3 text-sm font-semibold">Financial Health</h2>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-semibold tabular-nums tracking-tight">{score}</span>
          <span className="text-sm text-muted-foreground">/100</span>
          <span className={cn("ml-auto text-sm font-medium", STATUS_COLOR[status])}>
            {status}
          </span>
        </div>
        <ProgressBar value={score} className="mt-3" />
        <p className="mt-3 text-xs text-muted-foreground">
          Based on your budget adherence, savings rate, expense-to-income ratio, emergency
          fund progress, and recurring expense burden. Not an official credit score — just a
          simple summary of the numbers you&apos;ve entered.
        </p>
      </CardContent>
    </Card>
  )
}
