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
import { Input } from "@/components/ui/input"
import { CurrencyInput } from "@/components/design-system/currency-input"
import { updateGoalAction, deleteGoalAction } from "@/server/actions/goals"

export function EditGoalSheet({
  goal,
  open,
  onOpenChange,
  onDeleted,
}: {
  goal: { id: string; name: string; targetAmount: number; targetDate: Date | null }
  open: boolean
  onOpenChange: (open: boolean) => void
  onDeleted: () => void
}) {
  const router = useRouter()
  const [name, setName] = React.useState(goal.name)
  const [targetAmount, setTargetAmount] = React.useState<number | null>(goal.targetAmount)
  const [targetDate, setTargetDate] = React.useState(
    goal.targetDate ? goal.targetDate.toISOString().slice(0, 10) : ""
  )
  const [submitting, setSubmitting] = React.useState(false)
  const [deleting, setDeleting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  // Reset the form fields each time the sheet reopens.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  React.useEffect(() => {
    if (open) {
      setName(goal.name)
      setTargetAmount(goal.targetAmount)
      setTargetDate(goal.targetDate ? goal.targetDate.toISOString().slice(0, 10) : "")
      setError(null)
    }
  }, [open, goal])

  async function onSave() {
    if (!name.trim() || !targetAmount) {
      setError("Give your goal a name and target amount.")
      return
    }
    setSubmitting(true)
    setError(null)
    const result = await updateGoalAction({
      id: goal.id,
      name,
      targetAmount,
      targetDate: targetDate ? new Date(`${targetDate}T00:00:00`).toISOString() : null,
    })
    setSubmitting(false)
    if (!result.ok) {
      setError(result.error)
      return
    }
    toast.success("Goal updated")
    onOpenChange(false)
    router.refresh()
  }

  async function onDelete() {
    setDeleting(true)
    const result = await deleteGoalAction(goal.id)
    setDeleting(false)
    if (!result.ok) {
      toast.error(result.error)
      return
    }
    toast.success("Goal deleted")
    onDeleted()
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="mx-auto max-h-[85vh] w-full max-w-sm rounded-t-2xl overflow-y-auto">
        <SheetHeader className="text-left">
          <SheetTitle>Edit goal</SheetTitle>
        </SheetHeader>

        <div className="space-y-4 px-4 pb-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Goal name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
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

          <div className="flex items-center gap-3">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button type="button" variant="outline" size="icon" disabled={deleting} aria-label="Delete goal">
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this goal?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This can&apos;t be undone. Your contribution history for {goal.name} will be
                    removed too.
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
