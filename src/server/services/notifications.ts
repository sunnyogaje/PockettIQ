import "server-only"
import { db } from "@/server/db"
import type { NotificationType } from "@prisma/client"

export async function getUnreadNotificationCount(userId: string) {
  return db.notification.count({ where: { userId, read: false } })
}

export async function listNotifications(userId: string) {
  return db.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 50,
  })
}

export async function createNotification(
  userId: string,
  input: { type: NotificationType; title: string; message: string }
) {
  return db.notification.create({
    data: { userId, type: input.type, title: input.title, message: input.message },
  })
}

export async function markNotificationRead(userId: string, id: string) {
  await db.notification.updateMany({ where: { id, userId }, data: { read: true } })
}

export async function markAllNotificationsRead(userId: string) {
  await db.notification.updateMany({ where: { userId, read: false }, data: { read: true } })
}
