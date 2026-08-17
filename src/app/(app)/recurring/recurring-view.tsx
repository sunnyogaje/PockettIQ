"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Plus, Repeat, Bell, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { CategoryIcon } from "@/components/design-system/category-icon"
import { EmptyState } from "@/components/design-system/empty-state"
import { formatNaira } from "@/lib/currency"
import { updateRecurringAction, deleteRecurringAction } from "@/server/actions/recurring"
import { setReminderCompletedAction, deleteReminderAction } from "@/server/actions/reminders"
import { CreateRecurringSheet } from "./create-recurring-sheet"
import { CreateReminderSheet } from "./create-reminder-sheet"

type Category = { id: string; name: string; group: string }
type RecurringItem = {
  id: string
  type: "INCOME" | "EXPENSE"
  amount: number
  frequency: "WEEKLY" | "MONTHLY" | "QUARTERLY" | "YEARLY"
  nextDate: Date
  active: boolean
  category: { name: string; icon: string }
}
type ReminderItem = {
  id: string
  title: string
  amount: number | null
  dueDate: Date
  completed: boolean
}

const FREQUENCY_LABEL: Record<RecurringItem["frequency"], string> = {
  WEEKLY: "Weekly",
  MONTHLY: "Monthly",
  QUARTERLY: "Quarterly",
  YEARLY: "Yearly",
}

const dateFormatter = new Intl.DateTimeFormat("en-NG", { day: "numeric", month: "short" })

export function RecurringView({
  recurring,
  reminders,
  expenseCategories,
  incomeCategories,
}: {
  recurring: RecurringItem[]
  reminders: ReminderItem[]
  expenseCategories: Category[]
  incomeCategories: Category[]
}) {
  const router = useRouter()
  const [tab, setTab] = React.useState<"recurring" | "reminders">("recurring")
  const [recurringSheetOpen, setRecurringSheetOpen] = React.useState(false)
  const [reminderSheetOpen, setReminderSheetOpen] = React.useState(false)

  async function toggleActive(id: string, item: RecurringItem, active: boolean) {
    const result = await updateRecurringAction({
      id,
      amount: item.amount,
      frequency: item.frequency,
      endDate: null,
      reminderDaysBefore: 3,
      active,
    })
    if (!result.ok) {
      toast.error(result.error)
      return
    }
    router.refresh()
  }

  async function removeRecurring(id: string) {
    const result = await deleteRecurringAction(id)
    if (!result.ok) toast.error(result.error)
    else {
      toast.success("Deleted")
      router.refresh()
    }
  }

  async function toggleReminder(id: string, completed: boolean) {
    const result = await setReminderCompletedAction(id, completed)
    if (!result.ok) toast.error(result.error)
    else router.refresh()
  }

  async function removeReminder(id: string) {
    const result = await deleteReminderAction(id)
    if (!result.ok) toast.error(result.error)
    else {
      toast.success("Deleted")
      router.refresh()
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Recurring</h1>
        <Button
          onClick={() => (tab === "recurring" ? setRecurringSheetOpen(true) : setReminderSheetOpen(true))}
        >
          <Plus className="size-4" />
          {tab === "recurring" ? "Add Recurring" : "Add Reminder"}
        </Button>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
        <TabsList>
          <TabsTrigger value="recurring">Recurring Transactions</TabsTrigger>
          <TabsTrigger value="reminders">Reminders</TabsTrigger>
        </TabsList>

        <TabsContent value="recurring" className="mt-4">
          {recurring.length === 0 ? (
            <EmptyState
              icon={Repeat}
              title="No recurring transactions"
              description="Add things like rent, subscriptions, or your salary so they're tracked automatically."
              action={<Button onClick={() => setRecurringSheetOpen(true)}>Add Recurring</Button>}
            />
          ) : (
            <Card>
              <CardContent className="divide-y">
                {recurring.map((r) => (
                  <div key={r.id} className="flex items-center gap-3 py-3">
                    <CategoryIcon icon={r.category.icon} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{r.category.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {FREQUENCY_LABEL[r.frequency]} · Next {dateFormatter.format(r.nextDate)}
                      </p>
                    </div>
                    <p
                      className={
                        r.type === "INCOME"
                          ? "text-sm font-semibold text-positive tabular-nums"
                          : "text-sm font-semibold tabular-nums"
                      }
                    >
                      {r.type === "INCOME" ? "+" : "-"}
                      {formatNaira(r.amount)}
                    </p>
                    <Switch
                      checked={r.active}
                      onCheckedChange={(v) => toggleActive(r.id, r, v)}
                      aria-label="Active"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeRecurring(r.id)}
                      aria-label="Delete"
                    >
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="reminders" className="mt-4">
          {reminders.length === 0 ? (
            <EmptyState
              icon={Bell}
              title="No reminders"
              description="Create reminders for bills and renewals so nothing catches you off guard."
              action={<Button onClick={() => setReminderSheetOpen(true)}>Add Reminder</Button>}
            />
          ) : (
            <Card>
              <CardContent className="divide-y">
                {reminders.map((r) => (
                  <div key={r.id} className="flex items-center gap-3 py-3">
                    <Checkbox
                      checked={r.completed}
                      onCheckedChange={(v) => toggleReminder(r.id, !!v)}
                      aria-label="Completed"
                    />
                    <div className="min-w-0 flex-1">
                      <p className={`truncate text-sm font-medium ${r.completed ? "text-muted-foreground line-through" : ""}`}>
                        {r.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Due {dateFormatter.format(r.dueDate)}
                        {r.amount != null && <> · {formatNaira(r.amount)}</>}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeReminder(r.id)}
                      aria-label="Delete"
                    >
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      <CreateRecurringSheet
        open={recurringSheetOpen}
        onOpenChange={setRecurringSheetOpen}
        expenseCategories={expenseCategories}
        incomeCategories={incomeCategories}
      />
      <CreateReminderSheet open={reminderSheetOpen} onOpenChange={setReminderSheetOpen} />
    </div>
  )
}
