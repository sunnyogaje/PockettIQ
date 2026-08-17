import type { Metadata } from "next"
import Link from "next/link"
import { Download, Bell, Crown, FileText, Shield, ChevronRight } from "lucide-react"
import { requireOnboardedUser } from "@/server/auth/require-user"
import { db } from "@/server/db"
import { Card, CardContent } from "@/components/ui/card"
import { PremiumBadge } from "@/components/design-system/premium-badge"
import { LogoutButton } from "./logout-button"
import { DeleteAccountDialog } from "./delete-account-dialog"

export const metadata: Metadata = {
  title: "Settings",
}

const INCOME_FREQUENCY_LABEL: Record<string, string> = {
  MONTHLY: "Monthly",
  WEEKLY: "Weekly",
  BIWEEKLY: "Biweekly",
  IRREGULAR: "Irregular",
}

function paydayLabel(user: {
  paydayType: string | null
  paydayDay: number | null
  paydayDate: Date | null
}) {
  if (user.paydayType === "DAY_OF_MONTH" && user.paydayDay) {
    return `Day ${user.paydayDay} of the month`
  }
  if (user.paydayType === "SPECIFIC_DATE" && user.paydayDate) {
    return new Intl.DateTimeFormat("en-NG", { day: "numeric", month: "long" }).format(
      user.paydayDate
    )
  }
  if (user.paydayType === "NOT_FIXED") return "Not fixed"
  return "Not set"
}

export default async function SettingsPage() {
  const user = await requireOnboardedUser()
  const subscription = await db.subscription.findUnique({ where: { userId: user.id } })
  const isPremium = subscription?.plan === "PREMIUM"

  return (
    <div className="mx-auto max-w-xl space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>

      <Card>
        <CardContent>
          <h2 className="mb-3 text-sm font-semibold text-muted-foreground">Profile</h2>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Name</dt>
              <dd className="font-medium">{user.name}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Email</dt>
              <dd className="font-medium">{user.email}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Currency</dt>
              <dd className="font-medium">{user.currency}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Country</dt>
              <dd className="font-medium">{user.country === "NG" ? "Nigeria" : user.country}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Payday</dt>
              <dd className="font-medium">{paydayLabel(user)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Income frequency</dt>
              <dd className="font-medium">
                {user.incomeFrequency ? INCOME_FREQUENCY_LABEL[user.incomeFrequency] : "Not set"}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="divide-y p-0">
          <SettingsLink href="/install" icon={Download} label="Install App" />
          <SettingsLink href="/notifications" icon={Bell} label="Notifications" />
          <SettingsLink
            href="/pricing"
            icon={Crown}
            label="Premium"
            trailing={isPremium ? <PremiumBadge /> : undefined}
          />
          <SettingsLink href="/privacy" icon={Shield} label="Privacy Policy" />
          <SettingsLink href="/terms" icon={FileText} label="Terms of Service" />
        </CardContent>
      </Card>

      <div className="space-y-2">
        <LogoutButton />
        <DeleteAccountDialog />
      </div>
    </div>
  )
}

function SettingsLink({
  href,
  icon: Icon,
  label,
  trailing,
}: {
  href: string
  icon: React.ComponentType<{ className?: string }>
  label: string
  trailing?: React.ReactNode
}) {
  return (
    <Link href={href} className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-muted/40">
      <Icon className="size-4.5 text-muted-foreground" />
      <span className="flex-1 text-sm font-medium">{label}</span>
      {trailing}
      <ChevronRight className="size-4 text-muted-foreground" />
    </Link>
  )
}
