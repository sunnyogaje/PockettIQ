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
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CurrencyInput } from "@/components/design-system/currency-input"
import { createReminderAction } from "@/server/actions/reminders"

const FREQUENCIES = [
  { value: "WEEKLY", label: "Weekly" },
  { value: "MONTHLY", label: "Monthly" },
  { value: "QUARTERLY", label: "Quarterly" },
  { value: "YEARLY", label: "Yearly" },
] as const

export function CreateReminderSheet({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const router = useRouter()
  const [title, setTitle] = React.useState("")
  const [amount, setAmount] = React.useState<number | null>(null)
  const [dueDate, setDueDate] = React.useState("")
  const [recurring, setRecurring] = React.useState(false)
  const [frequency, setFrequency] = React.useState<(typeof FREQUENCIES)[number]["value"]>("MONTHLY")
  const [submitting, setSubmitting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  // Reset the form fields each time the sheet reopens.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  React.useEffect(() => {
    if (open) {
      setTitle("")
      setAmount(null)
      setDueDate("")
      setRecurring(false)
      setError(null)
    }
  }, [open])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !dueDate) {
      setError("Give this reminder a title and due date.")
      return
    }
    setSubmitting(true)
    setError(null)
    const result = await createReminderAction({
      title,
      amount,
      dueDate: new Date(`${dueDate}T00:00:00`).toISOString(),
      recurring,
      frequency: recurring ? frequency : null,
    })
    setSubmitting(false)
    if (!result.ok) {
      setError(result.error)
      return
    }
    toast.success("Reminder created")
    onOpenChange(false)
    router.refresh()
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="mx-auto max-h-[90vh] w-full max-w-sm rounded-t-2xl overflow-y-auto">
        <SheetHeader className="text-left">
          <SheetTitle>New reminder</SheetTitle>
          <SheetDescription>e.g. Electricity bill, Rent renewal.</SheetDescription>
        </SheetHeader>

        <form onSubmit={onSubmit} className="space-y-4 px-4 pb-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Title</label>
            <Input
              placeholder="Electricity bill"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Amount (optional)</label>
            <CurrencyInput value={amount} onChange={setAmount} />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Due date</label>
            <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </div>

          <div className="flex items-center justify-between rounded-lg border px-3 py-2.5">
            <span className="text-sm font-medium">Repeats</span>
            <Switch checked={recurring} onCheckedChange={setRecurring} />
          </div>

          {recurring && (
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Frequency</label>
              <Select value={frequency} onValueChange={(v) => setFrequency(v as typeof frequency)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FREQUENCIES.map((f) => (
                    <SelectItem key={f.value} value={f.value}>
                      {f.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "Saving…" : "Create Reminder"}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  )
}
