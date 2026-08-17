"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  Wallet,
  Calendar,
  PiggyBank,
  Repeat,
  FileBarChart,
  Bell,
  type LucideIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { EmptyState } from "@/components/design-system/empty-state"
import { cn } from "@/lib/utils"
import {
  markNotificationReadAction,
  markAllNotificationsReadAction,
} from "@/server/actions/notifications"

type NotificationType =
  | "BUDGET_WARNING"
  | "PAYDAY_REMINDER"
  | "SAVINGS_GOAL_REMINDER"
  | "RECURRING_PAYMENT_REMINDER"
  | "MONTHLY_REPORT_READY"
  | "BILL_REMINDER"
  | "GENERAL"

type NotificationItem = {
  id: string
  type: NotificationType
  title: string
  message: string
  read: boolean
  createdAt: Date
}

const ICONS: Record<NotificationType, LucideIcon> = {
  BUDGET_WARNING: Wallet,
  PAYDAY_REMINDER: Calendar,
  SAVINGS_GOAL_REMINDER: PiggyBank,
  RECURRING_PAYMENT_REMINDER: Repeat,
  MONTHLY_REPORT_READY: FileBarChart,
  BILL_REMINDER: Calendar,
  GENERAL: Bell,
}

const relativeFormatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" })

function relativeTime(date: Date) {
  const diffMs = date.getTime() - Date.now()
  const diffHours = Math.round(diffMs / (1000 * 60 * 60))
  if (Math.abs(diffHours) < 24) return relativeFormatter.format(diffHours, "hour")
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24))
  return relativeFormatter.format(diffDays, "day")
}

export function NotificationsList({ notifications }: { notifications: NotificationItem[] }) {
  const router = useRouter()

  async function onNotificationClick(n: NotificationItem) {
    if (n.read) return
    await markNotificationReadAction(n.id)
    router.refresh()
  }

  async function onMarkAllRead() {
    await markAllNotificationsReadAction()
    router.refresh()
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Notifications</h1>
        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" onClick={onMarkAllRead}>
            Mark all read
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="You're all caught up"
          description="Budget warnings, payday reminders, and bill reminders will show up here."
        />
      ) : (
        <Card>
          <CardContent className="divide-y px-0">
            {notifications.map((n) => {
              const Icon = ICONS[n.type]
              return (
                <button
                  key={n.id}
                  onClick={() => onNotificationClick(n)}
                  className={cn(
                    "flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/40",
                    !n.read && "bg-accent/40"
                  )}
                >
                  <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                    <Icon className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-medium">{n.title}</p>
                      {!n.read && <span className="size-1.5 shrink-0 rounded-full bg-primary" />}
                    </div>
                    <p className="text-sm text-muted-foreground">{n.message}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {relativeTime(n.createdAt)}
                    </p>
                  </div>
                </button>
              )
            })}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
