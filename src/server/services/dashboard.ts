import "server-only"
import { db } from "@/server/db"
import { toNumber } from "@/lib/currency"
import {
  totalIncome,
  totalExpenses,
  netCashFlow,
  categorySpending,
  dailySpendingAllowance,
  nextPayday,
  daysUntil,
  type MoneyTransaction,
} from "@/lib/finance"

export function currentMonthRange(now: Date = new Date()) {
  const start = new Date(now.getFullYear(), now.getMonth(), 1)
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 1)
  return { start, end }
}

export async function getDashboardData(userId: string) {
  const user = await db.user.findUniqueOrThrow({ where: { id: userId } })
  const { start, end } = currentMonthRange()

  const [monthTransactions, allTimeAgg, recentTransactions, savingsGoals] =
    await Promise.all([
      db.transaction.findMany({
        where: { userId, transactionDate: { gte: start, lt: end } },
        include: { category: true },
      }),
      db.transaction.groupBy({
        by: ["type"],
        where: { userId },
        _sum: { amount: true },
      }),
      db.transaction.findMany({
        where: { userId },
        include: { category: true },
        orderBy: { transactionDate: "desc" },
        take: 5,
      }),
      db.savingsGoal.findMany({
        where: { userId, isEmergencyFund: false },
        orderBy: { createdAt: "desc" },
        take: 3,
      }),
    ])

  const monthMoney: MoneyTransaction[] = monthTransactions.map((t) => ({
    type: t.type,
    amount: toNumber(t.amount),
    categoryId: t.categoryId,
    categoryName: t.category.name,
  }))

  const allTimeIncome = toNumber(
    allTimeAgg.find((a) => a.type === "INCOME")?._sum.amount
  )
  const allTimeExpenses = toNumber(
    allTimeAgg.find((a) => a.type === "EXPENSE")?._sum.amount
  )
  const availableBalance = allTimeIncome - allTimeExpenses

  const income = totalIncome(monthMoney)
  const expenses = totalExpenses(monthMoney)
  const saved = Math.max(0, netCashFlow(monthMoney))
  const spendingByCategory = categorySpending(monthMoney)

  const payday = nextPayday({
    paydayType: user.paydayType,
    paydayDay: user.paydayDay,
    paydayDate: user.paydayDate,
  })
  const daysRemaining = payday ? Math.max(0, daysUntil(payday)) : null

  // Upcoming recurring expenses between now and payday, used to keep the
  // daily allowance from suggesting money that's already spoken for.
  const upcomingRecurringExpenses =
    payday != null
      ? toNumber(
          (
            await db.recurringTransaction.aggregate({
              where: {
                userId,
                type: "EXPENSE",
                active: true,
                nextDate: { gte: new Date(), lte: payday },
              },
              _sum: { amount: true },
            })
          )._sum.amount
        )
      : 0

  const dailyAllowance =
    daysRemaining != null
      ? dailySpendingAllowance({
          availableBalance,
          upcomingExpenses: upcomingRecurringExpenses,
          daysRemaining,
        })
      : null

  return {
    user,
    availableBalance,
    income,
    expenses,
    saved,
    spendingByCategory,
    recentTransactions,
    savingsGoals,
    daysRemaining,
    dailyAllowance,
  }
}
