import { z } from "zod"

export const createBudgetSchema = z.object({
  categoryId: z.string().nullable(),
  amount: z.number().positive("Enter an amount greater than zero").max(1_000_000_000),
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(2020).max(2100),
})
export type CreateBudgetInput = z.infer<typeof createBudgetSchema>

export const updateBudgetSchema = z.object({
  id: z.string().min(1),
  amount: z.number().positive("Enter an amount greater than zero").max(1_000_000_000),
})
export type UpdateBudgetInput = z.infer<typeof updateBudgetSchema>
