import type { Metadata } from "next"
import { requireOnboardedUser } from "@/server/auth/require-user"
import { listBudgetsWithSpending, getBudgetedCategoryIds } from "@/server/services/budgets"
import { getCategoriesForUser } from "@/server/services/categories"
import { BudgetsView } from "./budgets-view"

export const metadata: Metadata = {
  title: "Budgets",
}

export default async function BudgetsPage() {
  const user = await requireOnboardedUser()
  const now = new Date()
  const month = now.getMonth() + 1
  const year = now.getFullYear()

  const [budgets, budgetedCategoryIds, expenseCategories] = await Promise.all([
    listBudgetsWithSpending(user.id, month, year),
    getBudgetedCategoryIds(user.id, month, year),
    getCategoriesForUser(user.id, "EXPENSE"),
  ])

  const budgetedSet = new Set(budgetedCategoryIds.filter((id): id is string => id != null))
  const availableCategories = expenseCategories.filter((c) => !budgetedSet.has(c.id))
  const hasOverallBudget = budgetedCategoryIds.includes(null)

  return (
    <div className="mx-auto max-w-3xl">
      <BudgetsView
        budgets={budgets}
        availableCategories={availableCategories}
        hasOverallBudget={hasOverallBudget}
        month={month}
        year={year}
      />
    </div>
  )
}
