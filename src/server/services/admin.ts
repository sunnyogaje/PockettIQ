import "server-only"
import { db } from "@/server/db"

function daysAgo(n: number) {
  return new Date(Date.now() - n * 24 * 60 * 60 * 1000)
}

export async function getAdminStats() {
  const [
    totalUsers,
    newUsersThisWeek,
    newUsersThisMonth,
    premiumUsers,
    activeUserIds,
    totalTransactions,
  ] = await Promise.all([
    db.user.count(),
    db.user.count({ where: { createdAt: { gte: daysAgo(7) } } }),
    db.user.count({ where: { createdAt: { gte: daysAgo(30) } } }),
    db.subscription.count({ where: { plan: "PREMIUM", status: "ACTIVE" } }),
    db.transaction.findMany({
      where: { createdAt: { gte: daysAgo(30) } },
      select: { userId: true },
      distinct: ["userId"],
    }),
    db.transaction.count(),
  ])

  const freeUsers = totalUsers - premiumUsers
  const monthlyRevenue = premiumUsers * 500

  // DB connectivity is implicitly proven by the queries above succeeding.
  const systemHealth = { database: "ok" as const }

  return {
    totalUsers,
    newUsersThisWeek,
    newUsersThisMonth,
    premiumUsers,
    freeUsers,
    activeUsers: activeUserIds.length,
    totalTransactions,
    monthlyRevenue,
    systemHealth,
  }
}
