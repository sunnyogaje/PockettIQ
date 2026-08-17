import { Crown } from "lucide-react"
import { cn } from "@/lib/utils"

export function PremiumBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary",
        className
      )}
    >
      <Crown className="size-3" strokeWidth={2.5} />
      Premium
    </span>
  )
}
