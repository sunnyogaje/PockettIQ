import { z } from "zod"

export const onboardingSchema = z
  .object({
    firstName: z.string().trim().min(1, "Enter your first name").max(60),
    incomeSources: z.array(z.string()),
    incomeFrequency: z
      .enum(["MONTHLY", "WEEKLY", "BIWEEKLY", "IRREGULAR"])
      .nullable(),
    usualIncomeAmount: z.number().positive().max(1_000_000_000).nullable(),
    paydayType: z
      .enum(["DAY_OF_MONTH", "SPECIFIC_DATE", "NOT_FIXED"])
      .nullable(),
    paydayDay: z.number().int().min(1).max(31).nullable(),
    paydayDate: z.string().datetime().nullable(),
    mainGoal: z
      .enum([
        "SAVE_MORE",
        "CONTROL_SPENDING",
        "BUILD_EMERGENCY_FUND",
        "PAY_OFF_DEBT",
        "TRACK_MY_MONEY",
        "SAVE_FOR_SOMETHING_SPECIFIC",
      ])
      .nullable(),
  })
  .refine(
    (data) => data.paydayType !== "DAY_OF_MONTH" || data.paydayDay != null,
    { message: "Choose a day of the month", path: ["paydayDay"] }
  )
  .refine(
    (data) => data.paydayType !== "SPECIFIC_DATE" || data.paydayDate != null,
    { message: "Choose a date", path: ["paydayDate"] }
  )

export type OnboardingInput = z.infer<typeof onboardingSchema>
