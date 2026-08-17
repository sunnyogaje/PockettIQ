import crypto from "crypto"
import { cookies } from "next/headers"
import { db } from "@/server/db"
import type { User } from "@prisma/client"

export const SESSION_COOKIE_NAME = "pockettiq_session"
const SESSION_TTL_DAYS = 30

function hashToken(rawToken: string): string {
  return crypto.createHash("sha256").update(rawToken).digest("hex")
}

export async function createSession(userId: string): Promise<void> {
  const rawToken = crypto.randomBytes(32).toString("hex")
  const expiresAt = new Date(Date.now() + SESSION_TTL_DAYS * 24 * 60 * 60 * 1000)

  await db.session.create({
    data: {
      userId,
      tokenHash: hashToken(rawToken),
      expiresAt,
    },
  })

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE_NAME, rawToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  })
}

/**
 * Reads the session cookie and returns the authenticated user, or null.
 * This is the single source of truth for "who is logged in" — never trust
 * a client-supplied user id anywhere else in the app.
 */
export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies()
  const rawToken = cookieStore.get(SESSION_COOKIE_NAME)?.value
  if (!rawToken) return null

  const tokenHash = hashToken(rawToken)
  const session = await db.session.findUnique({
    where: { tokenHash },
    include: { user: true },
  })

  if (!session) return null
  if (session.expiresAt < new Date()) {
    await db.session.delete({ where: { id: session.id } }).catch(() => {})
    return null
  }

  return session.user
}

export async function destroyCurrentSession(): Promise<void> {
  const cookieStore = await cookies()
  const rawToken = cookieStore.get(SESSION_COOKIE_NAME)?.value

  if (rawToken) {
    const tokenHash = hashToken(rawToken)
    await db.session.deleteMany({ where: { tokenHash } })
  }

  cookieStore.delete(SESSION_COOKIE_NAME)
}

/** Revokes every session for a user — used on password reset / account deletion. */
export async function destroyAllUserSessions(userId: string): Promise<void> {
  await db.session.deleteMany({ where: { userId } })
}
