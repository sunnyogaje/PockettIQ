import "server-only"
import { db } from "@/server/db"
import type { TransactionType } from "@prisma/client"

/** Default (global) categories plus this user's own custom categories. */
export async function getCategoriesForUser(userId: string, type?: TransactionType) {
  return db.category.findMany({
    where: {
      type,
      OR: [{ userId: null }, { userId }],
    },
    orderBy: [{ group: "asc" }, { name: "asc" }],
  })
}
