"use server"

import { revalidatePath } from "next/cache"
import { requireUser } from "@/server/auth/require-user"
import * as budgetsService from "@/server/services/budgets"
import {
  createBudgetSchema,
  updateBudgetSchema,
  type CreateBudgetInput,
  type UpdateBudgetInput,
} from "@/server/validation/budget"
import type { ActionResult } from "@/server/actions/auth"

export async function createBudgetAction(input: CreateBudgetInput): Promise<ActionResult> {
  const user = await requireUser()
  const parsed = createBudgetSchema.safeParse(input)
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please fix the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    }
  }

  try {
    await budgetsService.createBudget(user.id, parsed.data)
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Couldn't create this budget." }
  }

  revalidatePath("/budgets")
  revalidatePath("/dashboard")
  return { ok: true }
}

export async function updateBudgetAction(input: UpdateBudgetInput): Promise<ActionResult> {
  const user = await requireUser()
  const parsed = updateBudgetSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, error: "Enter a valid amount." }
  }

  try {
    await budgetsService.updateBudget(user.id, parsed.data.id, parsed.data.amount)
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Couldn't update this budget." }
  }

  revalidatePath("/budgets")
  revalidatePath("/dashboard")
  return { ok: true }
}

export async function deleteBudgetAction(id: string): Promise<ActionResult> {
  const user = await requireUser()

  try {
    await budgetsService.deleteBudget(user.id, id)
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Couldn't delete this budget." }
  }

  revalidatePath("/budgets")
  revalidatePath("/dashboard")
  return { ok: true }
}
