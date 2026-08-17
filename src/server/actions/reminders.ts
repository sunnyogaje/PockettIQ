"use server"

import { revalidatePath } from "next/cache"
import { requireUser } from "@/server/auth/require-user"
import * as remindersService from "@/server/services/reminders"
import { createReminderSchema, type CreateReminderInput } from "@/server/validation/reminders"
import type { ActionResult } from "@/server/actions/auth"

function refresh() {
  revalidatePath("/recurring")
  revalidatePath("/notifications")
}

export async function createReminderAction(input: CreateReminderInput): Promise<ActionResult> {
  const user = await requireUser()
  const parsed = createReminderSchema.safeParse(input)
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please fix the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    }
  }

  await remindersService.createReminder(user.id, {
    title: parsed.data.title,
    amount: parsed.data.amount ?? null,
    dueDate: new Date(parsed.data.dueDate),
    recurring: parsed.data.recurring,
    frequency: parsed.data.recurring ? (parsed.data.frequency ?? null) : null,
  })

  refresh()
  return { ok: true }
}

export async function setReminderCompletedAction(
  id: string,
  completed: boolean
): Promise<ActionResult> {
  const user = await requireUser()

  try {
    await remindersService.setReminderCompleted(user.id, id, completed)
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Couldn't update this." }
  }

  refresh()
  return { ok: true }
}

export async function deleteReminderAction(id: string): Promise<ActionResult> {
  const user = await requireUser()

  try {
    await remindersService.deleteReminder(user.id, id)
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Couldn't delete this." }
  }

  refresh()
  return { ok: true }
}
