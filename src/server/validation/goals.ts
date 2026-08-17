import { z } from "zod"

export const createGoalSchema = z.object({
  name: z.string().trim().min(1, "Give your goal a name").max(60),
  targetAmount: z.number().positive("Enter an amount greater than zero").max(1_000_000_000),
  targetDate: z.string().datetime().nullable(),
})
export type CreateGoalInput = z.infer<typeof createGoalSchema>

export const createEmergencyFundSchema = z.object({
  monthlyExpenses: z.number().positive("Enter your monthly essential expenses").max(1_000_000_000),
  monthsOfCoverage: z.number().int().min(1).max(24),
})
export type CreateEmergencyFundInput = z.infer<typeof createEmergencyFundSchema>

export const updateGoalSchema = z.object({
  id: z.string().min(1),
  name: z.string().trim().min(1).max(60),
  targetAmount: z.number().positive().max(1_000_000_000),
  targetDate: z.string().datetime().nullable(),
})
export type UpdateGoalInput = z.infer<typeof updateGoalSchema>

export const contributeToGoalSchema = z.object({
  goalId: z.string().min(1),
  amount: z.number().positive("Enter an amount greater than zero").max(1_000_000_000),
  note: z.string().trim().max(140).nullable().optional(),
})
export type ContributeToGoalInput = z.infer<typeof contributeToGoalSchema>
