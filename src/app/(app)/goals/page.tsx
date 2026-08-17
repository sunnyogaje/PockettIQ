import type { Metadata } from "next"
import { requireOnboardedUser } from "@/server/auth/require-user"
import { listGoals, getEmergencyFund } from "@/server/services/goals"
import { toNumber } from "@/lib/currency"
import { GoalsView } from "./goals-view"

export const metadata: Metadata = {
  title: "Savings Goals",
}

export default async function GoalsPage() {
  const user = await requireOnboardedUser()
  const [goals, emergencyFund] = await Promise.all([
    listGoals(user.id),
    getEmergencyFund(user.id),
  ])

  return (
    <div className="mx-auto max-w-3xl">
      <GoalsView
        goals={goals.map((g) => ({
          id: g.id,
          name: g.name,
          targetAmount: toNumber(g.targetAmount),
          currentAmount: toNumber(g.currentAmount),
        }))}
        emergencyFund={
          emergencyFund
            ? {
                targetAmount: toNumber(emergencyFund.targetAmount),
                currentAmount: toNumber(emergencyFund.currentAmount),
              }
            : null
        }
      />
    </div>
  )
}
