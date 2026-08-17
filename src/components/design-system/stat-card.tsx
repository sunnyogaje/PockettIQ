import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { formatNaira } from "@/lib/currency"

export function StatCard({
  label,
  amount,
  tone = "default",
  className,
}: {
  label: string
  amount: number
  tone?: "default" | "positive" | "negative"
  className?: string
}) {
  return (
    <Card className={cn("gap-1.5 py-4", className)}>
      <CardContent className="px-4">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p
          className={cn(
            "mt-1 text-xl font-semibold tracking-tight tabular-nums",
            tone === "positive" && "text-positive",
            tone === "negative" && "text-negative"
          )}
        >
          {formatNaira(amount)}
        </p>
      </CardContent>
    </Card>
  )
}
