import "server-only"
import { db } from "@/server/db"

class ValidationError extends Error {}

export async function listGoals(userId: string) {
  return db.savingsGoal.findMany({
    where: { userId, isEmergencyFund: false },
    orderBy: { createdAt: "desc" },
  })
}

export async function getEmergencyFund(userId: string) {
  return db.savingsGoal.findFirst({ where: { userId, isEmergencyFund: true } })
}

export async function getGoalById(userId: string, id: string) {
  return db.savingsGoal.findFirst({
    where: { id, userId },
    include: { contributions: { orderBy: { date: "desc" } } },
  })
}

export async function createGoal(
  userId: string,
  input: { name: string; targetAmount: number; targetDate: Date | null }
) {
  return db.savingsGoal.create({
    data: {
      userId,
      name: input.name,
      targetAmount: input.targetAmount,
      targetDate: input.targetDate,
    },
  })
}

export async function createOrUpdateEmergencyFund(
  userId: string,
  input: { monthlyExpenses: number; monthsOfCoverage: number }
) {
  const targetAmount = input.monthlyExpenses * input.monthsOfCoverage
  const existing = await getEmergencyFund(userId)

  if (existing) {
    return db.savingsGoal.update({
      where: { id: existing.id },
      data: { targetAmount },
    })
  }

  return db.savingsGoal.create({
    data: {
      userId,
      name: "Emergency Fund",
      targetAmount,
      currentAmount: 0,
      isEmergencyFund: true,
    },
  })
}

export async function updateGoal(
  userId: string,
  id: string,
  input: { name: string; targetAmount: number; targetDate: Date | null }
) {
  const result = await db.savingsGoal.updateMany({
    where: { id, userId },
    data: { name: input.name, targetAmount: input.targetAmount, targetDate: input.targetDate },
  })
  if (result.count === 0) throw new ValidationError("Goal not found.")
}

export async function deleteGoal(userId: string, id: string) {
  const result = await db.savingsGoal.deleteMany({ where: { id, userId } })
  if (result.count === 0) throw new ValidationError("Goal not found.")
}

export async function addContribution(
  userId: string,
  goalId: string,
  amount: number,
  note?: string | null
) {
  const goal = await db.savingsGoal.findFirst({ where: { id: goalId, userId } })
  if (!goal) throw new ValidationError("Goal not found.")

  return db.$transaction([
    db.savingsContribution.create({
      data: { goalId, amount, note: note ?? null },
    }),
    db.savingsGoal.update({
      where: { id: goalId },
      data: { currentAmount: { increment: amount } },
    }),
  ])
}
