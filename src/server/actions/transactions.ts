"use server"

import { revalidatePath } from "next/cache"
import { requireUser } from "@/server/auth/require-user"
import * as transactionsService from "@/server/services/transactions"
import {
  createExpenseSchema,
  createIncomeSchema,
  updateTransactionSchema,
  type CreateExpenseInput,
  type CreateIncomeInput,
  type UpdateTransactionInput,
} from "@/server/validation/transaction"
import type { ActionResult } from "@/server/actions/auth"

function refreshTransactionViews() {
  revalidatePath("/dashboard")
  revalidatePath("/transactions")
  revalidatePath("/budgets")
  revalidatePath("/reports")
}

export async function createExpenseAction(input: CreateExpenseInput): Promise<ActionResult> {
  const user = await requireUser()
  const parsed = createExpenseSchema.safeParse(input)
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please fix the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    }
  }

  try {
    await transactionsService.createTransaction(user.id, {
      type: "EXPENSE",
      amount: parsed.data.amount,
      categoryId: parsed.data.categoryId,
      transactionDate: new Date(parsed.data.transactionDate),
      paymentMethod: parsed.data.paymentMethod ?? null,
      description: parsed.data.description ?? null,
    })
  } catch {
    return { ok: false, error: "Your expense wasn't saved. Please try again." }
  }

  refreshTransactionViews()
  return { ok: true }
}

export async function createIncomeAction(input: CreateIncomeInput): Promise<ActionResult> {
  const user = await requireUser()
  const parsed = createIncomeSchema.safeParse(input)
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please fix the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    }
  }

  try {
    await transactionsService.createTransaction(user.id, {
      type: "INCOME",
      amount: parsed.data.amount,
      categoryId: parsed.data.categoryId,
      transactionDate: new Date(parsed.data.transactionDate),
      description: parsed.data.description ?? null,
    })
  } catch {
    return { ok: false, error: "Your income wasn't saved. Please try again." }
  }

  refreshTransactionViews()
  return { ok: true }
}

export async function updateTransactionAction(
  input: UpdateTransactionInput
): Promise<ActionResult> {
  const user = await requireUser()
  const parsed = updateTransactionSchema.safeParse(input)
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please fix the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    }
  }

  try {
    await transactionsService.updateTransaction(user.id, parsed.data.id, {
      amount: parsed.data.amount,
      categoryId: parsed.data.categoryId,
      transactionDate: new Date(parsed.data.transactionDate),
      paymentMethod: parsed.data.paymentMethod ?? null,
      description: parsed.data.description ?? null,
    })
  } catch {
    return { ok: false, error: "Couldn't update this transaction. Please try again." }
  }

  refreshTransactionViews()
  return { ok: true }
}

export async function deleteTransactionAction(id: string): Promise<ActionResult> {
  const user = await requireUser()

  try {
    await transactionsService.deleteTransaction(user.id, id)
  } catch {
    return { ok: false, error: "Couldn't delete this transaction. Please try again." }
  }

  refreshTransactionViews()
  return { ok: true }
}
