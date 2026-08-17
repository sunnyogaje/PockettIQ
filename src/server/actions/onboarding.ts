"use server"

import { db } from "@/server/db"
import { requireUser } from "@/server/auth/require-user"
import { onboardingSchema, type OnboardingInput } from "@/server/validation/onboarding"
import type { ActionResult } from "@/server/actions/auth"

export async function completeOnboardingAction(
  input: OnboardingInput
): Promise<ActionResult> {
  const user = await requireUser()

  const parsed = onboardingSchema.safeParse(input)
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please fix the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    }
  }
  const data = parsed.data

  await db.user.update({
    where: { id: user.id },
    data: {
      name: data.firstName,
      incomeSources: data.incomeSources,
      incomeFrequency: data.incomeFrequency ?? undefined,
      usualIncomeAmount: data.usualIncomeAmount ?? undefined,
      paydayType: data.paydayType ?? undefined,
      paydayDay: data.paydayType === "DAY_OF_MONTH" ? data.paydayDay : null,
      paydayDate:
        data.paydayType === "SPECIFIC_DATE" && data.paydayDate
          ? new Date(data.paydayDate)
          : null,
      mainGoal: data.mainGoal ?? undefined,
      onboardingCompleted: true,
    },
  })

  return { ok: true }
}
