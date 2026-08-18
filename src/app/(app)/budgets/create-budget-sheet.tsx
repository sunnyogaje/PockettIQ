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
import { createBudgetAction } from "@/server/actions/budgets"

type Category = { id: string; name: string; group: string }

export function CreateBudgetSheet({
  open,
  onOpenChange,
  categories,
  hasOverallBudget,
  month,
  year,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  categories: Category[]
  hasOverallBudget: boolean
  month: number
  year: number
}) {
  const router = useRouter()
  const [target, setTarget] = React.useState<string>(hasOverallBudget ? "" : "overall")
  const [amount, setAmount] = React.useState<number | null>(null)
  const [submitting, setSubmitting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  // Reset the form fields each time the sheet reopens.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  React.useEffect(() => {
    if (open) {
      setTarget(hasOverallBudget ? categories[0]?.id ?? "" : "overall")
      setAmount(null)
      setError(null)
    }
  }, [open, hasOverallBudget, categories])

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
    if (!amount) {
      setError("Enter a budget amount.")
      return
    }
    setSubmitting(true)
    setError(null)
    const result = await createBudgetAction({
      categoryId: target === "overall" ? null : target,
      amount,
      month,
      year,
    })
    setSubmitting(false)
    if (!result.ok) {
      setError(result.error)
      return
    }
    toast.success("Budget created")
    onOpenChange(false)
    router.refresh()
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="mx-auto max-h-[85vh] w-full max-w-sm rounded-t-2xl overflow-y-auto">
        <SheetHeader className="text-left">
          <SheetTitle>Create budget</SheetTitle>
          <SheetDescription>Give your money a plan for this month.</SheetDescription>
        </SheetHeader>

        <form onSubmit={onSubmit} className="space-y-4 px-4 pb-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Budget for</label>
            <Select value={target} onValueChange={setTarget}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {!hasOverallBudget && (
                  <SelectItem value="overall">Overall monthly budget</SelectItem>
                )}
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
            {categories.length === 0 && hasOverallBudget && (
              <p className="text-xs text-muted-foreground">
                You&apos;ve already got budgets for every category this month.
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Monthly amount</label>
            <CurrencyInput value={amount} onChange={setAmount} autoFocus />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" className="w-full" disabled={submitting || !target}>
            {submitting ? "Saving…" : "Create Budget"}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  )
}
