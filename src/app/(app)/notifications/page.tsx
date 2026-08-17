import type { Metadata } from "next"
import { requireOnboardedUser } from "@/server/auth/require-user"
import { listNotifications } from "@/server/services/notifications"
import { NotificationsList } from "./notifications-list"

export const metadata: Metadata = {
  title: "Notifications",
}

export default async function NotificationsPage() {
  const user = await requireOnboardedUser()
  const notifications = await listNotifications(user.id)

  return <NotificationsList notifications={notifications} />
}
