"use client"

import { Card, CardContent } from "@/components/ui/card"
import { ProgressBar } from "@/components/design-system/progress-bar"
import { CategoryIcon } from "@/components/design-system/category-icon"
import { formatNaira } from "@/lib/currency"
import { budgetPercentage, budgetRemaining, budgetStatusMessage } from "@/lib/finance"
import { cn } from "@/lib/utils"
import { AlertCircle } from "lucide-react"

export function BudgetCard({
  categoryName,
  categoryIcon,
  amount,
  spent,
  onClick,
}: {
  categoryName: string
  categoryIcon: string
  amount: number
  spent: number
  onClick?: () => void
}) {
  const percent = budgetPercentage(amount, spent)
  const remaining = budgetRemaining(amount, spent)
  const message = budgetStatusMessage(percent, categoryName)
  const over = percent >= 100

  return (
    <Card
      onClick={onClick}
      className={cn(onClick && "cursor-pointer transition-colors hover:bg-muted/40")}
    >
      <CardContent className="space-y-3">
        <div className="flex items-center gap-3">
          <CategoryIcon icon={categoryIcon} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{categoryName}</p>
            <p className="text-xs text-muted-foreground">
              {formatNaira(spent)} of {formatNaira(amount)}
            </p>
          </div>
          <p
            className={cn(
              "shrink-0 text-sm font-semibold tabular-nums",
              over ? "text-negative" : "text-muted-foreground"
            )}
          >
            {over ? "-" : ""}
            {formatNaira(Math.abs(remaining))}
            <span className="ml-1 text-xs font-normal">{over ? "over" : "left"}</span>
          </p>
        </div>

        <ProgressBar value={percent} />

        {message && (
          <p
            className={cn(
              "flex items-center gap-1.5 text-xs",
              over ? "text-negative" : "text-muted-foreground"
            )}
          >
            <AlertCircle className="size-3.5 shrink-0" />
            {message}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
