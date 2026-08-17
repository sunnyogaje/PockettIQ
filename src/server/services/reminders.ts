import "server-only"
import { db } from "@/server/db"
import type { RecurrenceFrequency } from "@prisma/client"

class ValidationError extends Error {}

export async function listReminders(userId: string) {
  return db.reminder.findMany({ where: { userId }, orderBy: { dueDate: "asc" } })
}

export async function createReminder(
  userId: string,
  input: {
    title: string
    amount: number | null
    dueDate: Date
    recurring: boolean
    frequency: RecurrenceFrequency | null
  }
) {
  return db.reminder.create({
    data: {
      userId,
      title: input.title,
      amount: input.amount,
      dueDate: input.dueDate,
      recurring: input.recurring,
      frequency: input.recurring ? input.frequency : null,
    },
  })
}

export async function setReminderCompleted(userId: string, id: string, completed: boolean) {
  const result = await db.reminder.updateMany({ where: { id, userId }, data: { completed } })
  if (result.count === 0) throw new ValidationError("Reminder not found.")
}

export async function deleteReminder(userId: string, id: string) {
  const result = await db.reminder.deleteMany({ where: { id, userId } })
  if (result.count === 0) throw new ValidationError("Reminder not found.")
}
