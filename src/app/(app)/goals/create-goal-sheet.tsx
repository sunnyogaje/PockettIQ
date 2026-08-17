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
import { createGoalAction } from "@/server/actions/goals"

export function CreateGoalSheet({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const router = useRouter()
  const [name, setName] = React.useState("")
  const [targetAmount, setTargetAmount] = React.useState<number | null>(null)
  const [targetDate, setTargetDate] = React.useState("")
  const [submitting, setSubmitting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (open) {
      setName("")
      setTargetAmount(null)
      setTargetDate("")
      setError(null)
    }
  }, [open])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !targetAmount) {
      setError("Give your goal a name and a target amount.")
      return
    }
    setSubmitting(true)
    setError(null)
    const result = await createGoalAction({
      name,
      targetAmount,
      targetDate: targetDate ? new Date(`${targetDate}T00:00:00`).toISOString() : null,
    })
    setSubmitting(false)
    if (!result.ok) {
      setError(result.error)
      return
    }
    toast.success("Goal created")
    onOpenChange(false)
    router.refresh()
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="mx-auto max-h-[85vh] w-full max-w-sm rounded-t-2xl overflow-y-auto">
        <SheetHeader className="text-left">
          <SheetTitle>Create a savings goal</SheetTitle>
          <SheetDescription>What are you saving for?</SheetDescription>
        </SheetHeader>

        <form onSubmit={onSubmit} className="space-y-4 px-4 pb-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Goal name</label>
            <Input
              placeholder="New Laptop"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Target amount</label>
            <CurrencyInput value={targetAmount} onChange={setTargetAmount} />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Target date (optional)</label>
            <Input type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "Creating…" : "Create Goal"}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  )
}
