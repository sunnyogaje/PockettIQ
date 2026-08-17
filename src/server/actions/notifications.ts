"use server"

import { revalidatePath } from "next/cache"
import { requireUser } from "@/server/auth/require-user"
import * as notificationsService from "@/server/services/notifications"

export async function markNotificationReadAction(id: string) {
  const user = await requireUser()
  await notificationsService.markNotificationRead(user.id, id)
  revalidatePath("/notifications")
}

export async function markAllNotificationsReadAction() {
  const user = await requireUser()
  await notificationsService.markAllNotificationsRead(user.id)
  revalidatePath("/notifications")
}
