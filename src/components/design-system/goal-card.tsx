import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { ProgressBar } from "@/components/design-system/progress-bar"
import { formatNaira } from "@/lib/currency"

export function GoalCard({
  id,
  name,
  targetAmount,
  currentAmount,
}: {
  id: string
  name: string
  targetAmount: number
  currentAmount: number
}) {
  const percent = targetAmount > 0 ? (currentAmount / targetAmount) * 100 : 0

  return (
    <Link href={`/goals/${id}`}>
      <Card className="gap-2 py-4 transition-colors hover:bg-muted/40">
        <CardContent className="px-4">
          <div className="flex items-baseline justify-between gap-2">
            <p className="truncate text-sm font-medium">{name}</p>
            <p className="shrink-0 text-xs font-medium text-muted-foreground">
              {Math.round(percent)}%
            </p>
          </div>
          <ProgressBar value={percent} className="mt-2" />
          <p className="mt-1.5 text-xs text-muted-foreground">
            {formatNaira(currentAmount)} of {formatNaira(targetAmount)}
          </p>
        </CardContent>
      </Card>
    </Link>
  )
}
