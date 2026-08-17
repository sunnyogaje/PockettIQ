import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { requireOnboardedUser } from "@/server/auth/require-user"
import { getGoalById } from "@/server/services/goals"
import { toNumber } from "@/lib/currency"
import { GoalDetailView } from "./goal-detail-view"

export async function generateMetadata({
  params,
}: PageProps<"/goals/[id]">): Promise<Metadata> {
  const { id } = await params
  return { title: `Goal · ${id}` }
}

export default async function GoalDetailPage({ params }: PageProps<"/goals/[id]">) {
  const user = await requireOnboardedUser()
  const { id } = await params

  const goal = await getGoalById(user.id, id)
  if (!goal) notFound()

  return (
    <GoalDetailView
      goal={{
        id: goal.id,
        name: goal.name,
        targetAmount: toNumber(goal.targetAmount),
        currentAmount: toNumber(goal.currentAmount),
        targetDate: goal.targetDate,
        isEmergencyFund: goal.isEmergencyFund,
      }}
      contributions={goal.contributions.map((c) => ({
        id: c.id,
        amount: toNumber(c.amount),
        date: c.date,
        note: c.note,
      }))}
    />
  )
}
