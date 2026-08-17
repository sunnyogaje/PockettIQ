"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useQuickAdd } from "@/components/design-system/quick-add-context"
import { cn } from "@/lib/utils"

export function QuickAddTriggerButton({
  tab = "expense",
  label = "Add Expense",
  variant = "default",
  className,
}: {
  tab?: "expense" | "income"
  label?: string
  variant?: React.ComponentProps<typeof Button>["variant"]
  className?: string
}) {
  const { openQuickAdd } = useQuickAdd()

  return (
    <Button
      type="button"
      variant={variant}
      onClick={() => openQuickAdd(tab)}
      className={cn(className)}
    >
      <Plus className="size-4" />
      {label}
    </Button>
  )
}
