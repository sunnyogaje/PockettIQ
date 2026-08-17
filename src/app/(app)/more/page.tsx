import type { Metadata } from "next"
import Link from "next/link"
import { Repeat, BarChart3, Bell, Settings, ChevronRight } from "lucide-react"
import { requireOnboardedUser } from "@/server/auth/require-user"
import { getUnreadNotificationCount } from "@/server/services/notifications"
import { Card, CardContent } from "@/components/ui/card"
import { Logo } from "@/components/design-system/logo"

export const metadata: Metadata = {
  title: "More",
}

export default async function MorePage() {
  const user = await requireOnboardedUser()
  const unread = await getUnreadNotificationCount(user.id)

  const links = [
    { href: "/recurring", icon: Repeat, label: "Recurring" },
    { href: "/reports", icon: BarChart3, label: "Reports" },
    { href: "/notifications", icon: Bell, label: "Notifications", badge: unread },
    { href: "/settings", icon: Settings, label: "Settings" },
  ]

  return (
    <div className="mx-auto max-w-xl space-y-4">
      <Logo className="lg:hidden" />
      <h1 className="text-2xl font-semibold tracking-tight">More</h1>

      <Card>
        <CardContent className="divide-y p-0">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-muted/40"
            >
              <link.icon className="size-4.5 text-muted-foreground" />
              <span className="flex-1 text-sm font-medium">{link.label}</span>
              {!!link.badge && (
                <span className="flex size-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                  {link.badge}
                </span>
              )}
              <ChevronRight className="size-4 text-muted-foreground" />
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
