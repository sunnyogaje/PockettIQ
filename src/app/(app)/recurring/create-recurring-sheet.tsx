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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select"
import { CurrencyInput } from "@/components/design-system/currency-input"
import { createRecurringAction } from "@/server/actions/recurring"

type Category = { id: string; name: string; group: string }

const FREQUENCIES = [
  { value: "WEEKLY", label: "Weekly" },
  { value: "MONTHLY", label: "Monthly" },
  { value: "QUARTERLY", label: "Quarterly" },
  { value: "YEARLY", label: "Yearly" },
] as const

function todayIso() {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
}

export function CreateRecurringSheet({
  open,
  onOpenChange,
  expenseCategories,
  incomeCategories,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  expenseCategories: Category[]
  incomeCategories: Category[]
}) {
  const router = useRouter()
  const [type, setType] = React.useState<"EXPENSE" | "INCOME">("EXPENSE")
  const [amount, setAmount] = React.useState<number | null>(null)
  const [categoryId, setCategoryId] = React.useState("")
  const [frequency, setFrequency] = React.useState<(typeof FREQUENCIES)[number]["value"]>("MONTHLY")
  const [startDate, setStartDate] = React.useState(todayIso().slice(0, 10))
  const [submitting, setSubmitting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  // Reset the form fields each time the sheet reopens.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  React.useEffect(() => {
    if (open) {
      setType("EXPENSE")
      setAmount(null)
      setCategoryId("")
      setFrequency("MONTHLY")
      setStartDate(todayIso().slice(0, 10))
      setError(null)
    }
  }, [open])

  const categories = type === "EXPENSE" ? expenseCategories : incomeCategories
  const groups = React.useMemo(() => {
    const map = new Map<string, Category[]>()
    for (const c of categories) {
      const list = map.get(c.group) ?? []
      list.push(c)
      map.set(c.group, list)
    }
    return [...map.entries()]
  }, [categories])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!amount || !categoryId) {
      setError("Fill in the amount and category.")
      return
    }
    setSubmitting(true)
    setError(null)
    const result = await createRecurringAction({
      type,
      amount,
      categoryId,
      frequency,
      startDate: new Date(`${startDate}T00:00:00`).toISOString(),
      endDate: null,
      reminderDaysBefore: 3,
    })
    setSubmitting(false)
    if (!result.ok) {
      setError(result.error)
      return
    }
    toast.success("Recurring transaction created")
    onOpenChange(false)
    router.refresh()
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="mx-auto max-h-[90vh] w-full max-w-sm rounded-t-2xl overflow-y-auto">
        <SheetHeader className="text-left">
          <SheetTitle>New recurring transaction</SheetTitle>
          <SheetDescription>e.g. Rent, Netflix, Salary.</SheetDescription>
        </SheetHeader>

        <form onSubmit={onSubmit} className="space-y-4 px-4 pb-4">
          <Tabs value={type} onValueChange={(v) => { setType(v as "EXPENSE" | "INCOME"); setCategoryId("") }}>
            <TabsList className="w-full">
              <TabsTrigger value="EXPENSE" className="flex-1">Expense</TabsTrigger>
              <TabsTrigger value="INCOME" className="flex-1">Income</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Amount</label>
            <CurrencyInput value={amount} onChange={setAmount} />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Category</label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {groups.map(([group, items]) => (
                  <SelectGroup key={group}>
                    <SelectLabel>{group}</SelectLabel>
                    {items.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
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
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Start date</label>
              <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "Saving…" : "Create Recurring Transaction"}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  )
}
