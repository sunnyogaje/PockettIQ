import { z } from "zod"

export const createReminderSchema = z.object({
  title: z.string().trim().min(1, "Give this reminder a title").max(100),
  amount: z.number().positive().max(1_000_000_000).nullable().optional(),
  dueDate: z.string().datetime(),
  recurring: z.boolean(),
  frequency: z.enum(["WEEKLY", "MONTHLY", "QUARTERLY", "YEARLY"]).nullable().optional(),
})
export type CreateReminderInput = z.infer<typeof createReminderSchema>

export const updateReminderSchema = z.object({
  id: z.string().min(1),
  completed: z.boolean(),
})
export type UpdateReminderInput = z.infer<typeof updateReminderSchema>
