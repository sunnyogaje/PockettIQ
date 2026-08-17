import "server-only"
import { db } from "@/server/db"
import { toNumber } from "@/lib/currency"
import {
  totalIncome,
  totalExpenses,
  categorySpending,
  budgetPercentage,
  savingsRate,
  financialHealthScore,
  type MoneyTransaction,
} from "@/lib/finance"

function monthRange(monthsAgo: number, now: Date = new Date()) {
  const start = new Date(now.getFullYear(), now.getMonth() - monthsAgo, 1)
  const end = new Date(now.getFullYear(), now.getMonth() - monthsAgo + 1, 1)
  return { start, end }
}

async function monthTransactions(userId: string, monthsAgo: number): Promise<MoneyTransaction[]> {
  const { start, end } = monthRange(monthsAgo)
  const rows = await db.transaction.findMany({
    where: { userId, transactionDate: { gte: start, lt: end } },
    include: { category: true },
  })
  return rows.map((t) => ({
    type: t.type,
    amount: toNumber(t.amount),
    categoryId: t.categoryId,
    categoryName: t.category.name,
  }))
}

function monthlyEquivalent(amount: number, frequency: string): number {
  switch (frequency) {
    case "WEEKLY":
      return amount * 4.33
    case "MONTHLY":
      return amount
    case "QUARTERLY":
      return amount / 3
    case "YEARLY":
      return amount / 12
    default:
      return amount
  }
}

export async function getReportData(userId: string) {
  const now = new Date()

  const [current, previous] = await Promise.all([
    monthTransactions(userId, 0),
    monthTransactions(userId, 1),
  ])

  const income = totalIncome(current)
  const expenses = totalExpenses(current)
  const saved = Math.max(0, income - expenses)

  const prevIncome = totalIncome(previous)
  const prevExpenses = totalExpenses(previous)
  const prevSaved = Math.max(0, prevIncome - prevExpenses)

  const spendingByCategory = categorySpending(current)
  const prevSpendingByCategory = categorySpending(previous)

  // Last 6 months trend (oldest first).
  const trend: { label: string; income: number; expenses: number }[] = []
  for (let i = 5; i >= 0; i--) {
    const monthTx = i === 0 ? current : i === 1 ? previous : await monthTransactions(userId, i)
    const { start } = monthRange(i)
    trend.push({
      label: new Intl.DateTimeFormat("en-NG", { month: "short" }).format(start),
      income: totalIncome(monthTx),
      expenses: totalExpenses(monthTx),
    })
  }

  // ---- Financial health score inputs ----
  const { start: monthStart, end: monthEnd } = monthRange(0)
  const budgets = await db.budget.findMany({
    where: { userId, month: monthStart.getMonth() + 1, year: monthStart.getFullYear() },
  })

  let budgetAdherence = 50 // neutral default when the user hasn't set any budgets yet
  if (budgets.length > 0) {
    const scores = await Promise.all(
      budgets.map(async (b) => {
        const spentAgg = await db.transaction.aggregate({
          where: {
            userId,
            type: "EXPENSE",
            transactionDate: { gte: monthStart, lt: monthEnd },
            ...(b.categoryId ? { categoryId: b.categoryId } : {}),
          },
          _sum: { amount: true },
        })
        const percent = budgetPercentage(toNumber(b.amount), toNumber(spentAgg._sum.amount))
        return percent <= 100 ? 100 : Math.max(0, 100 - (percent - 100))
      })
    )
    budgetAdherence = scores.reduce((sum, s) => sum + s, 0) / scores.length
  }

  const savingsRatePercent = savingsRate(income, saved)
  const expenseToIncomeRatio = income > 0 ? Math.min(2, expenses / income) : expenses > 0 ? 1 : 0

  const emergencyFund = await db.savingsGoal.findFirst({
    where: { userId, isEmergencyFund: true },
  })
  const emergencyFundProgress = emergencyFund
    ? Math.min(
        100,
        (toNumber(emergencyFund.currentAmount) / Math.max(1, toNumber(emergencyFund.targetAmount))) *
          100
      )
    : 0

  const recurringExpenses = await db.recurringTransaction.findMany({
    where: { userId, type: "EXPENSE", active: true },
  })
  const recurringMonthlyTotal = recurringExpenses.reduce(
    (sum, r) => sum + monthlyEquivalent(toNumber(r.amount), r.frequency),
    0
  )
  const recurringBurdenPercent =
    income > 0 ? Math.min(100, (recurringMonthlyTotal / income) * 100) : 0

  const health = financialHealthScore({
    budgetAdherence,
    savingsRatePercent,
    expenseToIncomeRatio,
    emergencyFundProgress,
    recurringBurdenPercent,
  })

  // ---- Deterministic insights (no AI — plain arithmetic) ----
  const insights: string[] = []

  for (const cat of spendingByCategory.slice(0, 5)) {
    const prev = prevSpendingByCategory.find((p) => p.categoryId === cat.categoryId)
    if (prev && prev.total > 0) {
      const change = ((cat.total - prev.total) / prev.total) * 100
      if (Math.abs(change) >= 10) {
        insights.push(
          `You spent ${Math.round(Math.abs(change))}% ${change > 0 ? "more" : "less"} on ${cat.categoryName} than last month.`
        )
      }
    }
  }

  for (const b of budgets) {
    if (!b.categoryId) continue
    const category = await db.category.findUnique({ where: { id: b.categoryId } })
    if (!category) continue
    const spentAgg = await db.transaction.aggregate({
      where: {
        userId,
        type: "EXPENSE",
        categoryId: b.categoryId,
        transactionDate: { gte: monthStart, lt: monthEnd },
      },
      _sum: { amount: true },
    })
    const percent = budgetPercentage(toNumber(b.amount), toNumber(spentAgg._sum.amount))
    if (percent >= 90) {
      insights.push(`You've used ${Math.round(Math.min(percent, 999))}% of your ${category.name} budget.`)
    }
  }

  if (saved > prevSaved && prevSaved >= 0) {
    const diff = saved - prevSaved
    if (diff > 0) insights.push(`You saved ${formatNairaLocal(diff)} more than last month.`)
  }

  if (income > 0 && expenses > income) {
    insights.push("Your expenses were higher than your recorded income this month.")
  }

  return {
    income,
    expenses,
    saved,
    spendingByCategory,
    trend,
    health,
    insights,
  }
}

function formatNairaLocal(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount)
}
