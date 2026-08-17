import "server-only"
import { addWeeks, addMonths, addYears } from "date-fns"
import { db } from "@/server/db"
import { createNotification } from "@/server/services/notifications"
import { formatNaira, toNumber } from "@/lib/currency"
import type { RecurrenceFrequency, TransactionType } from "@prisma/client"

class ValidationError extends Error {}

export function advanceDate(date: Date, frequency: RecurrenceFrequency): Date {
  switch (frequency) {
    case "WEEKLY":
      return addWeeks(date, 1)
    case "MONTHLY":
      return addMonths(date, 1)
    case "QUARTERLY":
      return addMonths(date, 3)
    case "YEARLY":
      return addYears(date, 1)
  }
}

export async function listRecurring(userId: string) {
  return db.recurringTransaction.findMany({
    where: { userId },
    include: { category: true },
    orderBy: { nextDate: "asc" },
  })
}

async function assertUsableCategory(userId: string, categoryId: string, type: TransactionType) {
  const category = await db.category.findFirst({
    where: { id: categoryId, type, OR: [{ userId: null }, { userId }] },
    select: { id: true },
  })
  if (!category) throw new ValidationError("That category isn't available.")
}

export async function createRecurring(
  userId: string,
  input: {
    type: TransactionType
    amount: number
    categoryId: string
    frequency: RecurrenceFrequency
    startDate: Date
    endDate: Date | null
    reminderDaysBefore: number | null
  }
) {
  await assertUsableCategory(userId, input.categoryId, input.type)

  return db.recurringTransaction.create({
    data: {
      userId,
      type: input.type,
      amount: input.amount,
      categoryId: input.categoryId,
      frequency: input.frequency,
      startDate: input.startDate,
      endDate: input.endDate,
      nextDate: input.startDate,
      reminderDaysBefore: input.reminderDaysBefore,
    },
  })
}

export async function updateRecurring(
  userId: string,
  id: string,
  input: {
    amount: number
    frequency: RecurrenceFrequency
    endDate: Date | null
    reminderDaysBefore: number | null
    active: boolean
  }
) {
  const result = await db.recurringTransaction.updateMany({
    where: { id, userId },
    data: input,
  })
  if (result.count === 0) throw new ValidationError("Recurring transaction not found.")
}

export async function deleteRecurring(userId: string, id: string) {
  const result = await db.recurringTransaction.deleteMany({ where: { id, userId } })
  if (result.count === 0) throw new ValidationError("Recurring transaction not found.")
}

/**
 * Lazily materializes any recurring transaction whose nextDate has arrived
 * into a real Transaction row, then advances nextDate. There's no
 * background cron in this MVP, so this runs on each authenticated page
 * load — cheap (indexed, per-user) and self-healing if the user is away
 * for a while (it just catches up).
 */
export async function processDueRecurringTransactions(userId: string) {
  const now = new Date()
  const due = await db.recurringTransaction.findMany({
    where: { userId, active: true, nextDate: { lte: now } },
    include: { category: true },
  })

  for (const recurring of due) {
    let cursor = recurring.nextDate
    let iterations = 0
    // Catch up through any missed occurrences (capped so a very old/stale
    // recurring item can't loop indefinitely).
    while (cursor <= now && iterations < 36) {
      if (recurring.endDate && cursor > recurring.endDate) break

      await db.transaction.create({
        data: {
          userId,
          type: recurring.type,
          amount: recurring.amount,
          categoryId: recurring.categoryId,
          transactionDate: cursor,
          description: `${recurring.category.name} (recurring)`,
          recurringTransactionId: recurring.id,
        },
      })

      await createNotification(userId, {
        type: "RECURRING_PAYMENT_REMINDER",
        title: `${recurring.category.name} recorded`,
        message: `Your recurring ${recurring.type === "EXPENSE" ? "expense" : "income"} of ${formatNaira(toNumber(recurring.amount))} for ${recurring.category.name} was added automatically.`,
      })

      cursor = advanceDate(cursor, recurring.frequency)
      iterations++
    }

    const stillActive = !recurring.endDate || cursor <= recurring.endDate
    await db.recurringTransaction.update({
      where: { id: recurring.id },
      data: { nextDate: cursor, active: stillActive },
    })
  }
}
