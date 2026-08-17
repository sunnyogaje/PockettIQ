"use server"

import { requireUser } from "@/server/auth/require-user"
import { destroyCurrentSession } from "@/server/auth/session"
import { db } from "@/server/db"
import type { ActionResult } from "@/server/actions/auth"

/**
 * Permanently deletes the account and every row that references it.
 * Every user-owned table cascades from User via onDelete: Cascade in the
 * Prisma schema, so this single delete removes all of the user's
 * financial data — transactions, budgets, goals, recurring items,
 * reminders, notifications, sessions, and the subscription record.
 */
export async function deleteAccountAction(): Promise<ActionResult> {
  const user = await requireUser()

  await db.user.delete({ where: { id: user.id } })
  await destroyCurrentSession()

  return { ok: true }
}
