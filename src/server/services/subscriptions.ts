import "server-only"
import { db } from "@/server/db"

export const FREE_GOAL_LIMIT = 3

export async function getSubscription(userId: string) {
  return db.subscription.findUnique({ where: { userId } })
}

export async function isPremium(userId: string): Promise<boolean> {
  const sub = await getSubscription(userId)
  return sub?.plan === "PREMIUM" && sub.status === "ACTIVE"
}

/**
 * Mocked upgrade — flips the plan directly with no payment processing, per
 * the spec's explicit "do not implement payment processing" instruction.
 * `paymentProvider`/`providerReference` stay null so a real Paystack/
 * Flutterwave webhook can later drive this same row without a schema
 * change — this function is the seam to swap out.
 */
export async function mockUpgradeToPremium(userId: string) {
  return db.subscription.upsert({
    where: { userId },
    update: { plan: "PREMIUM", status: "ACTIVE", startDate: new Date(), endDate: null },
    create: { userId, plan: "PREMIUM", status: "ACTIVE" },
  })
}

export async function mockDowngradeToFree(userId: string) {
  return db.subscription.upsert({
    where: { userId },
    update: { plan: "FREE", status: "ACTIVE" },
    create: { userId, plan: "FREE", status: "ACTIVE" },
  })
}
