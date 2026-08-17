import type { Metadata } from "next"
import { requireOnboardedUser } from "@/server/auth/require-user"
import { listRecurring } from "@/server/services/recurring"
import { listReminders } from "@/server/services/reminders"
import { getCategoriesForUser } from "@/server/services/categories"
import { toNumber } from "@/lib/currency"
import { RecurringView } from "./recurring-view"

export const metadata: Metadata = {
  title: "Recurring",
}

export default async function RecurringPage() {
  const user = await requireOnboardedUser()

  const [recurring, reminders, expenseCategories, incomeCategories] = await Promise.all([
    listRecurring(user.id),
    listReminders(user.id),
    getCategoriesForUser(user.id, "EXPENSE"),
    getCategoriesForUser(user.id, "INCOME"),
  ])

  return (
    <RecurringView
      recurring={recurring.map((r) => ({
        id: r.id,
        type: r.type,
        amount: toNumber(r.amount),
        frequency: r.frequency,
        nextDate: r.nextDate,
        active: r.active,
        category: { name: r.category.name, icon: r.category.icon },
      }))}
      reminders={reminders.map((r) => ({
        id: r.id,
        title: r.title,
        amount: r.amount != null ? toNumber(r.amount) : null,
        dueDate: r.dueDate,
        completed: r.completed,
      }))}
      expenseCategories={expenseCategories}
      incomeCategories={incomeCategories}
    />
  )
}
