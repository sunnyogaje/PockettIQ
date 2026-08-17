import { z } from "zod"

const MAX_AMOUNT = 1_000_000_000 // ₦1B — sensible ceiling for a personal finance app

export const paymentMethodSchema = z.enum(["CASH", "BANK", "CARD", "TRANSFER", "OTHER"])

export const createExpenseSchema = z.object({
  amount: z.number().positive("Enter an amount greater than zero").max(MAX_AMOUNT),
  categoryId: z.string().min(1, "Choose a category"),
  transactionDate: z.string().datetime(),
  paymentMethod: paymentMethodSchema.nullable().optional(),
  description: z.string().trim().max(280).nullable().optional(),
})
export type CreateExpenseInput = z.infer<typeof createExpenseSchema>

export const createIncomeSchema = z.object({
  amount: z.number().positive("Enter an amount greater than zero").max(MAX_AMOUNT),
  categoryId: z.string().min(1, "Choose a source"),
  transactionDate: z.string().datetime(),
  description: z.string().trim().max(280).nullable().optional(),
})
export type CreateIncomeInput = z.infer<typeof createIncomeSchema>

export const updateTransactionSchema = z.object({
  id: z.string().min(1),
  amount: z.number().positive("Enter an amount greater than zero").max(MAX_AMOUNT),
  categoryId: z.string().min(1),
  transactionDate: z.string().datetime(),
  paymentMethod: paymentMethodSchema.nullable().optional(),
  description: z.string().trim().max(280).nullable().optional(),
})
export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>
