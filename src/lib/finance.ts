// Pure, framework-agnostic financial calculations. Every page/report/service
// that needs one of these numbers should call through here rather than
// re-deriving it — this file is the single source of truth.

export type MoneyTransaction = {
  type: "INCOME" | "EXPENSE"
  amount: number
  categoryId?: string
  categoryName?: string
}

export function totalIncome(transactions: MoneyTransaction[]): number {
  return transactions
    .filter((t) => t.type === "INCOME")
    .reduce((sum, t) => sum + t.amount, 0)
}

export function totalExpenses(transactions: MoneyTransaction[]): number {
  return transactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((sum, t) => sum + t.amount, 0)
}

export function netCashFlow(transactions: MoneyTransaction[]): number {
  return totalIncome(transactions) - totalExpenses(transactions)
}

export function categorySpending(
  transactions: MoneyTransaction[]
): { categoryId: string; categoryName: string; total: number }[] {
  const byCategory = new Map<string, { categoryName: string; total: number }>()

  for (const t of transactions) {
    if (t.type !== "EXPENSE" || !t.categoryId) continue
    const existing = byCategory.get(t.categoryId)
    if (existing) {
      existing.total += t.amount
    } else {
      byCategory.set(t.categoryId, {
        categoryName: t.categoryName ?? "Other",
        total: t.amount,
      })
    }
  }

  return [...byCategory.entries()]
    .map(([categoryId, v]) => ({ categoryId, ...v }))
    .sort((a, b) => b.total - a.total)
}

/**
 * Friendly, non-shaming budget threshold copy per spec — only returns a
 * message at 75/90/100%+, null otherwise so callers can skip rendering.
 */
export function budgetStatusMessage(
  percentage: number,
  categoryName: string
): string | null {
  if (percentage >= 100) return `You've reached your ${categoryName} budget.`
  if (percentage >= 90) return `You're close to your ${categoryName} budget limit.`
  if (percentage >= 75) return `You've used most of your ${categoryName} budget.`
  return null
}

export function budgetRemaining(budgetAmount: number, spent: number): number {
  return budgetAmount - spent
}

/** 0–100+, uncapped so callers can detect over-budget (>100). */
export function budgetPercentage(budgetAmount: number, spent: number): number {
  if (budgetAmount <= 0) return spent > 0 ? 100 : 0
  return (spent / budgetAmount) * 100
}

/** Savings as a share of income, 0–100. */
export function savingsRate(income: number, savings: number): number {
  if (income <= 0) return 0
  return Math.max(0, Math.min(100, (savings / income) * 100))
}

export function dailySpendingAllowance({
  availableBalance,
  upcomingExpenses,
  daysRemaining,
}: {
  availableBalance: number
  upcomingExpenses: number
  daysRemaining: number
}): number {
  const spendable = availableBalance - upcomingExpenses
  if (daysRemaining <= 0) return Math.max(0, spendable)
  return Math.max(0, spendable / daysRemaining)
}

export function daysUntil(target: Date, from: Date = new Date()): number {
  const startOfFrom = new Date(from.getFullYear(), from.getMonth(), from.getDate())
  const startOfTarget = new Date(target.getFullYear(), target.getMonth(), target.getDate())
  const diffMs = startOfTarget.getTime() - startOfFrom.getTime()
  return Math.round(diffMs / (1000 * 60 * 60 * 24))
}

/**
 * Next payday from today, given the user's configured payday settings.
 * Returns null if the user hasn't configured a payday (NOT_FIXED or unset).
 */
export function nextPayday({
  paydayType,
  paydayDay,
  paydayDate,
  from = new Date(),
}: {
  paydayType: "DAY_OF_MONTH" | "SPECIFIC_DATE" | "NOT_FIXED" | null
  paydayDay: number | null
  paydayDate: Date | null
  from?: Date
}): Date | null {
  if (paydayType === "DAY_OF_MONTH" && paydayDay) {
    const thisMonth = new Date(from.getFullYear(), from.getMonth(), paydayDay)
    if (thisMonth >= new Date(from.getFullYear(), from.getMonth(), from.getDate())) {
      return thisMonth
    }
    return new Date(from.getFullYear(), from.getMonth() + 1, paydayDay)
  }

  if (paydayType === "SPECIFIC_DATE" && paydayDate) {
    if (paydayDate >= from) return paydayDate
    return null
  }

  return null
}

export type FinancialHealthInputs = {
  /** Average % of category budgets kept under 100 this month, 0–100. */
  budgetAdherence: number
  /** Savings as % of income this month, 0–100. */
  savingsRatePercent: number
  /** Expenses / income this month, as a plain ratio (e.g. 0.7). */
  expenseToIncomeRatio: number
  /** Emergency fund progress, 0–100. */
  emergencyFundProgress: number
  /** Recurring monthly expense burden as % of income, 0–100 (lower is better). */
  recurringBurdenPercent: number
}

export type FinancialHealth = {
  score: number
  status: "Excellent" | "Good" | "Fair" | "Needs Attention"
}

/**
 * Deterministic 100-point score: budget adherence (25) + savings rate (25) +
 * expense/income ratio (25) + emergency fund progress (15) + recurring
 * burden (10). Not a credit score — just a simple, explainable summary of
 * the user's own manually-entered numbers.
 */
export function financialHealthScore(inputs: FinancialHealthInputs): FinancialHealth {
  const budgetPoints = clamp01(inputs.budgetAdherence / 100) * 25
  const savingsPoints = clamp01(inputs.savingsRatePercent / 100) * 25
  const ratioPoints = clamp01(1 - inputs.expenseToIncomeRatio) * 25
  const emergencyPoints = clamp01(inputs.emergencyFundProgress / 100) * 15
  const recurringPoints = clamp01(1 - inputs.recurringBurdenPercent / 100) * 10

  const score = Math.round(
    budgetPoints + savingsPoints + ratioPoints + emergencyPoints + recurringPoints
  )

  let status: FinancialHealth["status"]
  if (score >= 80) status = "Excellent"
  else if (score >= 60) status = "Good"
  else if (score >= 40) status = "Fair"
  else status = "Needs Attention"

  return { score, status }
}

function clamp01(n: number): number {
  if (Number.isNaN(n)) return 0
  return Math.max(0, Math.min(1, n))
}
