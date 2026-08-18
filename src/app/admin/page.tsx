import type { Metadata } from "next"
import { Users, UserPlus, Crown, Activity, ArrowLeftRight, CheckCircle2 } from "lucide-react"
import { getAdminStats } from "@/server/services/admin"
import { formatNaira } from "@/lib/currency"
import { Card, CardContent } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
}

export default async function AdminPage() {
  const stats = await getAdminStats()

  const cards = [
    { label: "Total users", value: stats.totalUsers.toLocaleString(), icon: Users },
    { label: "New this week", value: stats.newUsersThisWeek.toLocaleString(), icon: UserPlus },
    { label: "New this month", value: stats.newUsersThisMonth.toLocaleString(), icon: UserPlus },
    { label: "Active users (30d)", value: stats.activeUsers.toLocaleString(), icon: Activity },
    { label: "Premium users", value: stats.premiumUsers.toLocaleString(), icon: Crown },
    { label: "Free users", value: stats.freeUsers.toLocaleString(), icon: Users },
    {
      label: "Est. monthly revenue",
      value: formatNaira(stats.monthlyRevenue),
      icon: Crown,
    },
    { label: "Total transactions", value: stats.totalTransactions.toLocaleString(), icon: ArrowLeftRight },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Aggregate usage statistics. Individual users&apos; financial data is not shown here.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {cards.map((c) => (
          <Card key={c.label}>
            <CardContent>
              <div className="flex items-center gap-2 text-muted-foreground">
                <c.icon className="size-4" />
                <p className="text-xs font-medium">{c.label}</p>
              </div>
              <p className="mt-2 text-xl font-semibold tabular-nums tracking-tight">{c.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent>
          <h2 className="mb-3 text-sm font-semibold">System Health</h2>
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle2 className="size-4 text-primary" />
            Database: {stats.systemHealth.database === "ok" ? "Operational" : "Issue detected"}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
