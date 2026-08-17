import crypto from "crypto"
import { db } from "@/server/db"
import type { VerificationTokenType } from "@prisma/client"

const TOKEN_TTL_MINUTES: Record<VerificationTokenType, number> = {
  EMAIL_VERIFY: 60 * 24,
  PASSWORD_RESET: 60,
}

function hashToken(rawToken: string): string {
  return crypto.createHash("sha256").update(rawToken).digest("hex")
}

/**
 * Creates a single-use token, returning the raw (unhashed) value to send to
 * the user. Only the hash is persisted.
 */
export async function createVerificationToken(
  userId: string,
  type: VerificationTokenType
): Promise<string> {
  const rawToken = crypto.randomBytes(32).toString("hex")
  const expiresAt = new Date(
    Date.now() + TOKEN_TTL_MINUTES[type] * 60 * 1000
  )

  await db.verificationToken.create({
    data: {
      userId,
      type,
      tokenHash: hashToken(rawToken),
      expiresAt,
    },
  })

  return rawToken
}

type ConsumeResult =
  | { ok: true; userId: string }
  | { ok: false; reason: "invalid" | "expired" | "used" }

/**
 * Validates and marks a token as used in one step so it cannot be replayed.
 */
export async function consumeVerificationToken(
  rawToken: string,
  type: VerificationTokenType
): Promise<ConsumeResult> {
  const tokenHash = hashToken(rawToken)
  const record = await db.verificationToken.findUnique({
    where: { tokenHash },
  })

  if (!record || record.type !== type) {
    return { ok: false, reason: "invalid" }
  }
  if (record.usedAt) {
    return { ok: false, reason: "used" }
  }
  if (record.expiresAt < new Date()) {
    return { ok: false, reason: "expired" }
  }

  await db.verificationToken.update({
    where: { id: record.id },
    data: { usedAt: new Date() },
  })

  return { ok: true, userId: record.userId }
}
