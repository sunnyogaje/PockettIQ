import "server-only"
import { db } from "@/server/db"
import { hashPassword } from "@/server/auth/password"

export async function findUserByEmail(email: string) {
  return db.user.findUnique({ where: { email } })
}

export async function createUser(input: {
  name: string
  email: string
  password: string
}) {
  const passwordHash = await hashPassword(input.password)

  return db.user.create({
    data: {
      name: input.name,
      email: input.email,
      passwordHash,
      subscription: {
        create: { plan: "FREE", status: "ACTIVE" },
      },
    },
  })
}
