"use server"

import { revalidatePath } from "next/cache"
import { requireUser } from "@/server/auth/require-user"
import * as goalsService from "@/server/services/goals"
import {
  createGoalSchema,
  createEmergencyFundSchema,
  updateGoalSchema,
  contributeToGoalSchema,
  type CreateGoalInput,
  type CreateEmergencyFundInput,
  type UpdateGoalInput,
  type ContributeToGoalInput,
} from "@/server/validation/goals"
import type { ActionResult } from "@/server/actions/auth"

function refresh() {
  revalidatePath("/goals")
  revalidatePath("/dashboard")
}

export async function createGoalAction(input: CreateGoalInput): Promise<ActionResult> {
  const user = await requireUser()
  const parsed = createGoalSchema.safeParse(input)
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please fix the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    }
  }

  try {
    await goalsService.createGoal(user.id, {
      name: parsed.data.name,
      targetAmount: parsed.data.targetAmount,
      targetDate: parsed.data.targetDate ? new Date(parsed.data.targetDate) : null,
    })
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Couldn't create this goal." }
  }

  refresh()
  return { ok: true }
}

export async function createEmergencyFundAction(
  input: CreateEmergencyFundInput
): Promise<ActionResult> {
  const user = await requireUser()
  const parsed = createEmergencyFundSchema.safeParse(input)
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please fix the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    }
  }

  await goalsService.createOrUpdateEmergencyFund(user.id, parsed.data)

  refresh()
  return { ok: true }
}

export async function updateGoalAction(input: UpdateGoalInput): Promise<ActionResult> {
  const user = await requireUser()
  const parsed = updateGoalSchema.safeParse(input)
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please fix the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    }
  }

  try {
    await goalsService.updateGoal(user.id, parsed.data.id, {
      name: parsed.data.name,
      targetAmount: parsed.data.targetAmount,
      targetDate: parsed.data.targetDate ? new Date(parsed.data.targetDate) : null,
    })
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Couldn't update this goal." }
  }

  refresh()
  return { ok: true }
}

export async function deleteGoalAction(id: string): Promise<ActionResult> {
  const user = await requireUser()

  try {
    await goalsService.deleteGoal(user.id, id)
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Couldn't delete this goal." }
  }

  refresh()
  return { ok: true }
}

export async function contributeToGoalAction(
  input: ContributeToGoalInput
): Promise<ActionResult> {
  const user = await requireUser()
  const parsed = contributeToGoalSchema.safeParse(input)
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please fix the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    }
  }

  try {
    await goalsService.addContribution(
      user.id,
      parsed.data.goalId,
      parsed.data.amount,
      parsed.data.note
    )
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Couldn't save this contribution." }
  }

  refresh()
  return { ok: true }
}
