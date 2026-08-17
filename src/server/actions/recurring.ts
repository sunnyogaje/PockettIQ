"use server"

import { revalidatePath } from "next/cache"
import { requireUser } from "@/server/auth/require-user"
import * as recurringService from "@/server/services/recurring"
import {
  createRecurringSchema,
  updateRecurringSchema,
  type CreateRecurringInput,
  type UpdateRecurringInput,
} from "@/server/validation/recurring"
import type { ActionResult } from "@/server/actions/auth"

function refresh() {
  revalidatePath("/recurring")
  revalidatePath("/dashboard")
}

export async function createRecurringAction(input: CreateRecurringInput): Promise<ActionResult> {
  const user = await requireUser()
  const parsed = createRecurringSchema.safeParse(input)
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please fix the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    }
  }

  try {
    await recurringService.createRecurring(user.id, {
      type: parsed.data.type,
      amount: parsed.data.amount,
      categoryId: parsed.data.categoryId,
      frequency: parsed.data.frequency,
      startDate: new Date(parsed.data.startDate),
      endDate: parsed.data.endDate ? new Date(parsed.data.endDate) : null,
      reminderDaysBefore: parsed.data.reminderDaysBefore ?? null,
    })
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Couldn't create this." }
  }

  refresh()
  return { ok: true }
}

export async function updateRecurringAction(input: UpdateRecurringInput): Promise<ActionResult> {
  const user = await requireUser()
  const parsed = updateRecurringSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, error: "Please fix the highlighted fields." }
  }

  try {
    await recurringService.updateRecurring(user.id, parsed.data.id, {
      amount: parsed.data.amount,
      frequency: parsed.data.frequency,
      endDate: parsed.data.endDate ? new Date(parsed.data.endDate) : null,
      reminderDaysBefore: parsed.data.reminderDaysBefore ?? null,
      active: parsed.data.active,
    })
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Couldn't update this." }
  }

  refresh()
  return { ok: true }
}

export async function deleteRecurringAction(id: string): Promise<ActionResult> {
  const user = await requireUser()

  try {
    await recurringService.deleteRecurring(user.id, id)
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Couldn't delete this." }
  }

  refresh()
  return { ok: true }
}
