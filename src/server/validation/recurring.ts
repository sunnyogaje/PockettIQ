import { z } from "zod"

export const recurrenceFrequencySchema = z.enum(["WEEKLY", "MONTHLY", "QUARTERLY", "YEARLY"])

export const createRecurringSchema = z.object({
  type: z.enum(["INCOME", "EXPENSE"]),
  amount: z.number().positive("Enter an amount greater than zero").max(1_000_000_000),
  categoryId: z.string().min(1, "Choose a category"),
  frequency: recurrenceFrequencySchema,
  startDate: z.string().datetime(),
  endDate: z.string().datetime().nullable().optional(),
  reminderDaysBefore: z.number().int().min(0).max(30).nullable().optional(),
})
export type CreateRecurringInput = z.infer<typeof createRecurringSchema>

export const updateRecurringSchema = z.object({
  id: z.string().min(1),
  amount: z.number().positive().max(1_000_000_000),
  frequency: recurrenceFrequencySchema,
  endDate: z.string().datetime().nullable().optional(),
  reminderDaysBefore: z.number().int().min(0).max(30).nullable().optional(),
  active: z.boolean(),
})
export type UpdateRecurringInput = z.infer<typeof updateRecurringSchema>
