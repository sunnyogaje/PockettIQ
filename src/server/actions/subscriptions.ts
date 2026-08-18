"use server"

import { revalidatePath } from "next/cache"
import { requireUser } from "@/server/auth/require-user"
import * as subscriptionsService from "@/server/services/subscriptions"
import type { ActionResult } from "@/server/actions/auth"

export async function mockUpgradeToPremiumAction(): Promise<ActionResult> {
  const user = await requireUser()
  await subscriptionsService.mockUpgradeToPremium(user.id)
  revalidatePath("/", "layout")
  return { ok: true }
}

export async function mockDowngradeToFreeAction(): Promise<ActionResult> {
  const user = await requireUser()
  await subscriptionsService.mockDowngradeToFree(user.id)
  revalidatePath("/", "layout")
  return { ok: true }
}
