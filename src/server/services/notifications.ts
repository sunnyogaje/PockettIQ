import "server-only"
import { db } from "@/server/db"

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
