import "server-only"
import { db } from "@/server/db"
import { toNumber, formatNaira } from "@/lib/currency"
import { budgetPercentage, budgetStatusMessage, nextPayday, daysUntil } from "@/lib/finance"
import { createNotification } from "@/server/services/notifications"
import { processDueRecurringTransactions } from "@/server/services/recurring"

function startOfToday() {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate())
}

async function alreadyNotifiedToday(userId: string, title: string) {
  const existing = await db.notification.findFirst({
    where: { userId, title, createdAt: { gte: startOfToday() } },
    select: { id: true },
  })
  return !!existing
}

async function generateBudgetWarnings(userId: string) {
  const now = new Date()
  const month = now.getMonth() + 1
  const year = now.getFullYear()
  const start = new Date(year, month - 1, 1)
  const end = new Date(year, month, 1)

  const budgets = await db.budget.findMany({
    where: { userId, month, year, categoryId: { not: null } },
    include: { category: true },
  })

  for (const budget of budgets) {
    if (!budget.categoryId || !budget.category) continue

    const spentAgg = await db.transaction.aggregate({
      where: {
        userId,
        type: "EXPENSE",
        categoryId: budget.categoryId,
        transactionDate: { gte: start, lt: end },
      },
      _sum: { amount: true },
    })
    const spent = toNumber(spentAgg._sum.amount)
    const percent = budgetPercentage(toNumber(budget.amount), spent)
    const message = budgetStatusMessage(percent, budget.category.name)
    if (!message) continue

    const title = `${budget.category.name} budget: ${Math.min(100, Math.round(percent))}%+`
    if (await alreadyNotifiedToday(userId, title)) continue

    await createNotification(userId, { type: "BUDGET_WARNING", title, message })
  }
}

async function generatePaydayReminder(userId: string) {
  const user = await db.user.findUnique({ where: { id: userId } })
  if (!user) return

  const payday = nextPayday({
    paydayType: user.paydayType,
    paydayDay: user.paydayDay,
    paydayDate: user.paydayDate,
  })
  if (!payday) return

  const days = daysUntil(payday)
  if (days < 0 || days > 3) return

  const title = days === 0 ? "Payday is today" : `Payday in ${days} day${days === 1 ? "" : "s"}`
  if (await alreadyNotifiedToday(userId, title)) return

  await createNotification(userId, {
    type: "PAYDAY_REMINDER",
    title,
    message:
      days === 0
        ? "Your payday is today, based on the schedule you set up."
        : `${days} day${days === 1 ? "" : "s"} until your next payday.`,
  })
}

async function generateReminderNotifications(userId: string) {
  const now = new Date()
  const soon = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000)

  const reminders = await db.reminder.findMany({
    where: { userId, completed: false, dueDate: { gte: now, lte: soon } },
  })

  for (const reminder of reminders) {
    const days = daysUntil(reminder.dueDate)
    const title = `${reminder.title} due in ${days} day${days === 1 ? "" : "s"}`
    if (await alreadyNotifiedToday(userId, title)) continue

    await createNotification(userId, {
      type: "RECURRING_PAYMENT_REMINDER",
      title,
      message: reminder.amount
        ? `${reminder.title} (${formatNaira(toNumber(reminder.amount))}) is due in ${days} day${days === 1 ? "" : "s"}.`
        : `${reminder.title} is due in ${days} day${days === 1 ? "" : "s"}.`,
    })
  }
}

/**
 * Runs the deterministic, rule-based notification checks plus recurring
 * transaction processing. Called once per authenticated page load — every
 * check below is cheap and self-deduplicating (at most one notification
 * per title per day), so repeated calls are safe.
 */
export async function runBackgroundChecks(userId: string) {
  await processDueRecurringTransactions(userId)
  await Promise.all([
    generateBudgetWarnings(userId),
    generatePaydayReminder(userId),
    generateReminderNotifications(userId),
  ])
}
