"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Trash2 } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { CurrencyInput } from "@/components/design-system/currency-input"
import { updateBudgetAction, deleteBudgetAction } from "@/server/actions/budgets"

export type EditableBudget = {
  id: string
  categoryName: string
  amount: number
}

export function EditBudgetSheet({
  budget,
  open,
  onOpenChange,
}: {
  budget: EditableBudget
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const router = useRouter()
  const [amount, setAmount] = React.useState<number | null>(budget.amount)
  const [submitting, setSubmitting] = React.useState(false)
  const [deleting, setDeleting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (open) setAmount(budget.amount)
  }, [open, budget.amount])

  async function onSave() {
    if (!amount) {
      setError("Enter a budget amount.")
      return
    }
    setSubmitting(true)
    setError(null)
    const result = await updateBudgetAction({ id: budget.id, amount })
    setSubmitting(false)
    if (!result.ok) {
      setError(result.error)
      return
    }
    toast.success("Budget updated")
    onOpenChange(false)
    router.refresh()
  }

  async function onDelete() {
    setDeleting(true)
    const result = await deleteBudgetAction(budget.id)
    setDeleting(false)
    if (!result.ok) {
      toast.error(result.error)
      return
    }
    toast.success("Budget deleted")
    onOpenChange(false)
    router.refresh()
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="mx-auto max-h-[85vh] w-full max-w-sm rounded-t-2xl overflow-y-auto">
        <SheetHeader className="text-left">
          <SheetTitle>{budget.categoryName} budget</SheetTitle>
        </SheetHeader>

        <div className="space-y-4 px-4 pb-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Monthly amount</label>
            <CurrencyInput value={amount} onChange={setAmount} autoFocus />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex items-center gap-3">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button type="button" variant="outline" size="icon" disabled={deleting}>
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this budget?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This won&apos;t delete any transactions, just the budget plan for{" "}
                    {budget.categoryName}.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={onDelete}
                    className="bg-destructive text-white hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Button type="button" className="flex-1" onClick={onSave} disabled={submitting}>
              {submitting ? "Saving…" : "Save changes"}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
