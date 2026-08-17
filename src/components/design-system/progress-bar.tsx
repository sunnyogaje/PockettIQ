import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

export function ProgressBar({
  value,
  className,
  indicatorClassName,
}: {
  /** 0–100+. Values above 100 render as a full, differently-colored bar. */
  value: number
  className?: string
  indicatorClassName?: string
}) {
  const clamped = Math.max(0, Math.min(100, value))
  const over = value > 100

  return (
    <Progress
      value={clamped}
      className={cn("h-2", className)}
      indicatorClassName={cn(over && "bg-destructive", indicatorClassName)}
    />
  )
}
