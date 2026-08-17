import "server-only"
import { db } from "@/server/db"
import { toNumber } from "@/lib/currency"

class ValidationError extends Error {}

export async function listBudgetsWithSpending(userId: string, month: number, year: number) {
  const start = new Date(year, month - 1, 1)
  const end = new Date(year, month, 1)

  const [budgets, expenseSums, totalAgg] = await Promise.all([
    db.budget.findMany({
      where: { userId, month, year },
      include: { category: true },
      orderBy: { createdAt: "asc" },
    }),
    db.transaction.groupBy({
      by: ["categoryId"],
      where: { userId, type: "EXPENSE", transactionDate: { gte: start, lt: end } },
      _sum: { amount: true },
    }),
    db.transaction.aggregate({
      where: { userId, type: "EXPENSE", transactionDate: { gte: start, lt: end } },
      _sum: { amount: true },
    }),
  ])

  const totalSpent = toNumber(totalAgg._sum.amount)

  const spentByCategory = new Map(
    expenseSums.map((s) => [s.categoryId, toNumber(s._sum.amount)])
  )

  return budgets.map((b) => ({
    id: b.id,
    categoryId: b.categoryId,
    categoryName: b.category?.name ?? "Overall",
    categoryIcon: b.category?.icon ?? "wallet",
    amount: toNumber(b.amount),
    spent: b.categoryId ? (spentByCategory.get(b.categoryId) ?? 0) : totalSpent,
  }))
}

export async function getBudgetedCategoryIds(userId: string, month: number, year: number) {
  const budgets = await db.budget.findMany({
    where: { userId, month, year },
    select: { categoryId: true },
  })
  return budgets.map((b) => b.categoryId)
}

export async function createBudget(
  userId: string,
  input: { categoryId: string | null; amount: number; month: number; year: number }
) {
  if (input.categoryId) {
    const category = await db.category.findFirst({
      where: {
        id: input.categoryId,
        type: "EXPENSE",
        OR: [{ userId: null }, { userId }],
      },
      select: { id: true },
    })
    if (!category) throw new ValidationError("That category isn't available.")
  }

  const existing = await db.budget.findFirst({
    where: { userId, categoryId: input.categoryId, month: input.month, year: input.year },
  })
  if (existing) {
    throw new ValidationError("A budget already exists for this category this month.")
  }

  return db.budget.create({
    data: {
      userId,
      categoryId: input.categoryId,
      amount: input.amount,
      month: input.month,
      year: input.year,
    },
  })
}

export async function updateBudget(userId: string, id: string, amount: number) {
  const result = await db.budget.updateMany({
    where: { id, userId },
    data: { amount },
  })
  if (result.count === 0) throw new ValidationError("Budget not found.")
}

export async function deleteBudget(userId: string, id: string) {
  const result = await db.budget.deleteMany({ where: { id, userId } })
  if (result.count === 0) throw new ValidationError("Budget not found.")
}
