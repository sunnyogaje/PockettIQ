"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
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
  createExpenseSchema,
  createIncomeSchema,
  type CreateExpenseInput,
  type CreateIncomeInput,
} from "@/server/validation/transaction"
import { createExpenseAction, createIncomeAction } from "@/server/actions/transactions"

type Category = { id: string; name: string; icon: string; group: string }

const PAYMENT_METHODS = [
  { value: "CASH", label: "Cash" },
  { value: "BANK", label: "Bank" },
  { value: "CARD", label: "Card" },
  { value: "TRANSFER", label: "Transfer" },
  { value: "OTHER", label: "Other" },
] as const

function todayIso() {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
}

export function QuickAddSheet({
  open,
  onOpenChange,
  expenseCategories,
  incomeCategories,
  defaultTab = "expense",
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  expenseCategories: Category[]
  incomeCategories: Category[]
  defaultTab?: "expense" | "income"
}) {
  const router = useRouter()
  const [tab, setTab] = React.useState<"expense" | "income">(defaultTab)

  // Reset to the requested tab each time the sheet reopens.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  React.useEffect(() => {
    if (open) setTab(defaultTab)
  }, [open, defaultTab])

  function handleSaved() {
    onOpenChange(false)
    router.refresh()
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="mx-auto max-h-[90vh] w-full max-w-sm rounded-t-2xl overflow-y-auto">
        <SheetHeader className="pb-0 text-left">
          <SheetTitle>Add transaction</SheetTitle>
          <SheetDescription>Takes less than 10 seconds.</SheetDescription>
        </SheetHeader>

        <Tabs value={tab} onValueChange={(v) => setTab(v as "expense" | "income")} className="px-4 pb-4">
          <TabsList className="w-full">
            <TabsTrigger value="expense" className="flex-1">Expense</TabsTrigger>
            <TabsTrigger value="income" className="flex-1">Income</TabsTrigger>
          </TabsList>

          <TabsContent value="expense" className="mt-4">
            <ExpenseForm categories={expenseCategories} onSaved={handleSaved} />
          </TabsContent>
          <TabsContent value="income" className="mt-4">
            <IncomeForm categories={incomeCategories} onSaved={handleSaved} />
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  )
}

function CategorySelect({
  categories,
  value,
  onChange,
  placeholder,
}: {
  categories: Category[]
  value: string
  onChange: (v: string) => void
  placeholder: string
}) {
  const groups = React.useMemo(() => {
    const map = new Map<string, Category[]>()
    for (const c of categories) {
      const list = map.get(c.group) ?? []
      list.push(c)
      map.set(c.group, list)
    }
    return [...map.entries()]
  }, [categories])

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
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
  )
}

function ExpenseForm({
  categories,
  onSaved,
}: {
  categories: Category[]
  onSaved: () => void
}) {
  const [submitting, setSubmitting] = React.useState(false)
  const [formError, setFormError] = React.useState<string | null>(null)
  const [online, setOnline] = React.useState(true)

  React.useEffect(() => {
    setOnline(navigator.onLine)
    const on = () => setOnline(true)
    const off = () => setOnline(false)
    window.addEventListener("online", on)
    window.addEventListener("offline", off)
    return () => {
      window.removeEventListener("online", on)
      window.removeEventListener("offline", off)
    }
  }, [])

  const form = useForm<CreateExpenseInput>({
    resolver: zodResolver(createExpenseSchema),
    defaultValues: {
      amount: undefined as unknown as number,
      categoryId: "",
      transactionDate: todayIso(),
      paymentMethod: null,
      description: "",
    },
  })

  async function onSubmit(values: CreateExpenseInput) {
    setSubmitting(true)
    setFormError(null)
    const result = await createExpenseAction(values)
    setSubmitting(false)
    if (!result.ok) {
      setFormError(result.error)
      return
    }
    toast.success("Expense saved")
    form.reset({
      amount: undefined as unknown as number,
      categoryId: "",
      transactionDate: todayIso(),
      paymentMethod: null,
      description: "",
    })
    onSaved()
  }

  const values = form.watch()

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Amount</label>
        <CurrencyInput
          autoFocus
          value={values.amount ?? null}
          onChange={(v) => form.setValue("amount", v as number)}
        />
        {form.formState.errors.amount && (
          <p className="text-sm text-destructive">{form.formState.errors.amount.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium">Category</label>
        <CategorySelect
          categories={categories}
          value={values.categoryId}
          onChange={(v) => form.setValue("categoryId", v)}
          placeholder="Select category"
        />
        {form.formState.errors.categoryId && (
          <p className="text-sm text-destructive">{form.formState.errors.categoryId.message}</p>
        )}
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
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Payment (optional)</label>
          <Select
            value={values.paymentMethod ?? undefined}
            onValueChange={(v) =>
              form.setValue("paymentMethod", v as CreateExpenseInput["paymentMethod"])
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
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium">Note (optional)</label>
        <Textarea
          rows={2}
          placeholder="What was this for?"
          {...form.register("description")}
        />
      </div>

      {!online && (
        <p className="text-sm text-destructive">
          You&apos;re offline — connect to the internet to add a transaction.
        </p>
      )}
      {formError && <p className="text-sm text-destructive">{formError}</p>}

      <Button type="submit" className="w-full" disabled={submitting || !online}>
        {submitting ? "Saving…" : "Save Expense"}
      </Button>
    </form>
  )
}

function IncomeForm({
  categories,
  onSaved,
}: {
  categories: Category[]
  onSaved: () => void
}) {
  const [submitting, setSubmitting] = React.useState(false)
  const [formError, setFormError] = React.useState<string | null>(null)
  const [online, setOnline] = React.useState(true)

  React.useEffect(() => {
    setOnline(navigator.onLine)
    const on = () => setOnline(true)
    const off = () => setOnline(false)
    window.addEventListener("online", on)
    window.addEventListener("offline", off)
    return () => {
      window.removeEventListener("online", on)
      window.removeEventListener("offline", off)
    }
  }, [])

  const form = useForm<CreateIncomeInput>({
    resolver: zodResolver(createIncomeSchema),
    defaultValues: {
      amount: undefined as unknown as number,
      categoryId: "",
      transactionDate: todayIso(),
      description: "",
    },
  })

  async function onSubmit(values: CreateIncomeInput) {
    setSubmitting(true)
    setFormError(null)
    const result = await createIncomeAction(values)
    setSubmitting(false)
    if (!result.ok) {
      setFormError(result.error)
      return
    }
    toast.success("Income saved")
    form.reset({
      amount: undefined as unknown as number,
      categoryId: "",
      transactionDate: todayIso(),
      description: "",
    })
    onSaved()
  }

  const values = form.watch()

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Amount</label>
        <CurrencyInput
          autoFocus
          value={values.amount ?? null}
          onChange={(v) => form.setValue("amount", v as number)}
        />
        {form.formState.errors.amount && (
          <p className="text-sm text-destructive">{form.formState.errors.amount.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium">Source</label>
        <CategorySelect
          categories={categories}
          value={values.categoryId}
          onChange={(v) => form.setValue("categoryId", v)}
          placeholder="Select source"
        />
        {form.formState.errors.categoryId && (
          <p className="text-sm text-destructive">{form.formState.errors.categoryId.message}</p>
        )}
      </div>

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

      <div className="space-y-1.5">
        <label className="text-sm font-medium">Note (optional)</label>
        <Textarea rows={2} placeholder="Any details?" {...form.register("description")} />
      </div>

      {!online && (
        <p className="text-sm text-destructive">
          You&apos;re offline — connect to the internet to add a transaction.
        </p>
      )}
      {formError && <p className="text-sm text-destructive">{formError}</p>}

      <Button type="submit" className="w-full" disabled={submitting || !online}>
        {submitting ? "Saving…" : "Save Income"}
      </Button>
    </form>
  )
}
