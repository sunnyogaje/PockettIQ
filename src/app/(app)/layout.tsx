import { requireOnboardedUser } from "@/server/auth/require-user"
import { getCategoriesForUser } from "@/server/services/categories"
import { getUnreadNotificationCount } from "@/server/services/notifications"
import { runBackgroundChecks } from "@/server/services/notification-generator"
import { db } from "@/server/db"
import { AppShell } from "@/components/design-system/app-shell"

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireOnboardedUser()

  await runBackgroundChecks(user.id)

  const [expenseCategories, incomeCategories, unreadNotifications, subscription] =
    await Promise.all([
      getCategoriesForUser(user.id, "EXPENSE"),
      getCategoriesForUser(user.id, "INCOME"),
      getUnreadNotificationCount(user.id),
      db.subscription.findUnique({ where: { userId: user.id } }),
    ])

  return (
    <AppShell
      expenseCategories={expenseCategories}
      incomeCategories={incomeCategories}
      unreadNotifications={unreadNotifications}
      isPremium={subscription?.plan === "PREMIUM"}
    >
      {children}
    </AppShell>
  )
}
