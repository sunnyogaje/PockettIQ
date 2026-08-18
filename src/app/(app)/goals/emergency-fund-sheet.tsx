"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CurrencyInput } from "@/components/design-system/currency-input"
import { formatNaira } from "@/lib/currency"
import { createEmergencyFundAction } from "@/server/actions/goals"

export function EmergencyFundSheet({
  open,
  onOpenChange,
  initialMonthlyExpenses,
  initialMonths,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialMonthlyExpenses?: number | null
  initialMonths?: number | null
}) {
  const router = useRouter()
  const [monthlyExpenses, setMonthlyExpenses] = React.useState<number | null>(
    initialMonthlyExpenses ?? null
  )
  const [months, setMonths] = React.useState(initialMonths ?? 3)
  const [submitting, setSubmitting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  // Reset the form fields each time the sheet reopens.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  React.useEffect(() => {
    if (open) {
      setMonthlyExpenses(initialMonthlyExpenses ?? null)
      setMonths(initialMonths ?? 3)
      setError(null)
    }
  }, [open, initialMonthlyExpenses, initialMonths])

  const target = (monthlyExpenses ?? 0) * months

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!monthlyExpenses) {
      setError("Enter your monthly essential expenses.")
      return
    }
    setSubmitting(true)
    setError(null)
    const result = await createEmergencyFundAction({
      monthlyExpenses,
      monthsOfCoverage: months,
    })
    setSubmitting(false)
    if (!result.ok) {
      setError(result.error)
      return
    }
    toast.success("Emergency fund goal set")
    onOpenChange(false)
    router.refresh()
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="mx-auto max-h-[85vh] w-full max-w-sm rounded-t-2xl overflow-y-auto">
        <SheetHeader className="text-left">
          <SheetTitle>Emergency fund</SheetTitle>
          <SheetDescription>
            A cushion for the unexpected. This is a planning tool, not financial advice.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={onSubmit} className="space-y-4 px-4 pb-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Monthly essential expenses</label>
            <CurrencyInput value={monthlyExpenses} onChange={setMonthlyExpenses} autoFocus />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Desired coverage (months)</label>
            <Input
              type="number"
              min={1}
              max={24}
              value={months}
              onChange={(e) => setMonths(Number(e.target.value) || 1)}
            />
          </div>

          <div className="rounded-lg bg-accent px-3 py-2.5 text-sm text-accent-foreground">
            Target: <span className="font-semibold">{formatNaira(target)}</span>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "Saving…" : "Save Emergency Fund"}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  )
}
