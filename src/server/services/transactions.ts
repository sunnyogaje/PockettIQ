import "server-only"
import { db } from "@/server/db"
import type { TransactionType, PaymentMethod } from "@prisma/client"

class ValidationError extends Error {}

/**
 * A category is usable by a user only if it's a global default (userId
 * null) or one they own — and its type must match the transaction being
 * recorded. This is the choke point that stops a crafted categoryId from
 * one user's account being attached to another user's transaction.
 */
async function assertUsableCategory(
  userId: string,
  categoryId: string,
  type: TransactionType
) {
  const category = await db.category.findFirst({
    where: { id: categoryId, type, OR: [{ userId: null }, { userId }] },
    select: { id: true },
  })
  if (!category) {
    throw new ValidationError("That category isn't available.")
  }
}

export async function createTransaction(
  userId: string,
  input: {
    type: TransactionType
    amount: number
    categoryId: string
    transactionDate: Date
    paymentMethod?: PaymentMethod | null
    description?: string | null
  }
) {
  await assertUsableCategory(userId, input.categoryId, input.type)

  return db.transaction.create({
    data: {
      userId,
      type: input.type,
      amount: input.amount,
      categoryId: input.categoryId,
      transactionDate: input.transactionDate,
      paymentMethod: input.type === "EXPENSE" ? (input.paymentMethod ?? null) : null,
      description: input.description ?? null,
    },
    include: { category: true },
  })
}

export async function updateTransaction(
  userId: string,
  id: string,
  input: {
    amount: number
    categoryId: string
    transactionDate: Date
    paymentMethod?: PaymentMethod | null
    description?: string | null
  }
) {
  const existing = await db.transaction.findFirst({ where: { id, userId } })
  if (!existing) {
    throw new ValidationError("Transaction not found.")
  }

  await assertUsableCategory(userId, input.categoryId, existing.type)

  return db.transaction.update({
    where: { id: existing.id },
    data: {
      amount: input.amount,
      categoryId: input.categoryId,
      transactionDate: input.transactionDate,
      paymentMethod: existing.type === "EXPENSE" ? (input.paymentMethod ?? null) : null,
      description: input.description ?? null,
    },
    include: { category: true },
  })
}

export async function deleteTransaction(userId: string, id: string) {
  // deleteMany scoped to userId means a foreign id simply deletes nothing,
  // rather than needing a separate ownership check + delete race.
  const result = await db.transaction.deleteMany({ where: { id, userId } })
  if (result.count === 0) {
    throw new ValidationError("Transaction not found.")
  }
}

export type TransactionFilters = {
  type?: TransactionType
  categoryId?: string
  paymentMethod?: PaymentMethod
  dateFrom?: Date
  dateTo?: Date
  minAmount?: number
  maxAmount?: number
  search?: string
  cursor?: string
  take?: number
}

export async function listTransactions(userId: string, filters: TransactionFilters = {}) {
  const take = Math.min(filters.take ?? 30, 100)

  const where = {
    userId,
    ...(filters.type ? { type: filters.type } : {}),
    ...(filters.categoryId ? { categoryId: filters.categoryId } : {}),
    ...(filters.paymentMethod ? { paymentMethod: filters.paymentMethod } : {}),
    ...(filters.dateFrom || filters.dateTo
      ? {
          transactionDate: {
            ...(filters.dateFrom ? { gte: filters.dateFrom } : {}),
            ...(filters.dateTo ? { lte: filters.dateTo } : {}),
          },
        }
      : {}),
    ...(filters.minAmount != null || filters.maxAmount != null
      ? {
          amount: {
            ...(filters.minAmount != null ? { gte: filters.minAmount } : {}),
            ...(filters.maxAmount != null ? { lte: filters.maxAmount } : {}),
          },
        }
      : {}),
    ...(filters.search
      ? {
          OR: [
            { description: { contains: filters.search, mode: "insensitive" as const } },
            { category: { name: { contains: filters.search, mode: "insensitive" as const } } },
            { source: { contains: filters.search, mode: "insensitive" as const } },
          ],
        }
      : {}),
  }

  const transactions = await db.transaction.findMany({
    where,
    include: { category: true },
    orderBy: [{ transactionDate: "desc" }, { createdAt: "desc" }],
    take: take + 1,
    ...(filters.cursor ? { cursor: { id: filters.cursor }, skip: 1 } : {}),
  })

  const hasMore = transactions.length > take
  const page = hasMore ? transactions.slice(0, take) : transactions

  return {
    transactions: page,
    nextCursor: hasMore ? page[page.length - 1].id : null,
  }
}

export async function getTransactionById(userId: string, id: string) {
  return db.transaction.findFirst({ where: { id, userId }, include: { category: true } })
}
