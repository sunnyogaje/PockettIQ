"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
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
import { Textarea } from "@/components/ui/textarea"
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
import {
  updateTransactionSchema,
  type UpdateTransactionInput,
} from "@/server/validation/transaction"
import { updateTransactionAction, deleteTransactionAction } from "@/server/actions/transactions"

type Category = { id: string; name: string; group: string }

export type EditableTransaction = {
  id: string
  type: "INCOME" | "EXPENSE"
  amount: number
  categoryId: string
  transactionDate: Date
  paymentMethod: "CASH" | "BANK" | "CARD" | "TRANSFER" | "OTHER" | null
  description: string | null
}

const PAYMENT_METHODS = [
  { value: "CASH", label: "Cash" },
  { value: "BANK", label: "Bank" },
  { value: "CARD", label: "Card" },
  { value: "TRANSFER", label: "Transfer" },
  { value: "OTHER", label: "Other" },
] as const

export function EditTransactionSheet({
  transaction,
  categories,
  open,
  onOpenChange,
}: {
  transaction: EditableTransaction
  categories: Category[]
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const router = useRouter()
  const [submitting, setSubmitting] = React.useState(false)
  const [deleting, setDeleting] = React.useState(false)
  const [formError, setFormError] = React.useState<string | null>(null)

  const form = useForm<UpdateTransactionInput>({
    resolver: zodResolver(updateTransactionSchema),
    values: {
      id: transaction.id,
      amount: transaction.amount,
      categoryId: transaction.categoryId,
      transactionDate: transaction.transactionDate.toISOString(),
      paymentMethod: transaction.paymentMethod,
      description: transaction.description,
    },
  })

  const values = form.watch()

  const groups = React.useMemo(() => {
    const map = new Map<string, Category[]>()
    for (const c of categories) {
      const list = map.get(c.group) ?? []
      list.push(c)
      map.set(c.group, list)
    }
    return [...map.entries()]
  }, [categories])

  async function onSubmit(data: UpdateTransactionInput) {
    setSubmitting(true)
    setFormError(null)
    const result = await updateTransactionAction(data)
    setSubmitting(false)
    if (!result.ok) {
      setFormError(result.error)
      return
    }
    toast.success("Transaction updated")
    onOpenChange(false)
    router.refresh()
  }

  async function onDelete() {
    setDeleting(true)
    const result = await deleteTransactionAction(transaction.id)
    setDeleting(false)
    if (!result.ok) {
      toast.error(result.error)
      return
    }
    toast.success("Transaction deleted")
    onOpenChange(false)
    router.refresh()
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="mx-auto max-h-[90vh] w-full max-w-sm rounded-t-2xl overflow-y-auto">
        <SheetHeader className="text-left">
          <SheetTitle>Edit {transaction.type === "INCOME" ? "income" : "expense"}</SheetTitle>
        </SheetHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 px-4 pb-4" noValidate>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Amount</label>
            <CurrencyInput
              value={values.amount ?? null}
              onChange={(v) => form.setValue("amount", v as number)}
            />
            {form.formState.errors.amount && (
              <p className="text-sm text-destructive">{form.formState.errors.amount.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">
              {transaction.type === "INCOME" ? "Source" : "Category"}
            </label>
            <Select value={values.categoryId} onValueChange={(v) => form.setValue("categoryId", v)}>
              <SelectTrigger className="w-full">
                <SelectValue />
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
              <label className="text-sm font-medium">Date</label>
              <Input
                type="date"
                value={values.transactionDate.slice(0, 10)}
                onChange={(e) =>
                  form.setValue(
                    "transactionDate",
                    new Date(`${e.target.value}T00:00:00`).toISOString()
                  )
                }
              />
            </div>
            {transaction.type === "EXPENSE" && (
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Payment</label>
                <Select
                  value={values.paymentMethod ?? undefined}
                  onValueChange={(v) =>
                    form.setValue("paymentMethod", v as UpdateTransactionInput["paymentMethod"])
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    {PAYMENT_METHODS.map((m) => (
                      <SelectItem key={m.value} value={m.value}>
                        {m.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Note (optional)</label>
            <Textarea rows={2} {...form.register("description")} />
          </div>

          {formError && <p className="text-sm text-destructive">{formError}</p>}

          <div className="flex items-center gap-3 pt-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button type="button" variant="outline" size="icon" disabled={deleting} aria-label="Delete transaction">
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this transaction?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This can&apos;t be undone. This will permanently remove it from your
                    records.
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

            <Button type="submit" className="flex-1" disabled={submitting}>
              {submitting ? "Saving…" : "Save changes"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
