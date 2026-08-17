import "server-only"

/**
 * In-memory sliding-window rate limiter for auth-sensitive Server Actions
 * (login, register, forgot-password). Good enough for a single-instance MVP
 * deployment; swap for Redis/Upstash if the app ever runs multi-instance.
 */

type Bucket = { hits: number[]; }

const buckets = new Map<string, Bucket>()

// Periodically drop stale buckets so this doesn't grow unbounded.
const MAX_BUCKETS = 50_000

export type RateLimitResult = { allowed: true } | { allowed: false; retryAfterSeconds: number }

export function rateLimit(
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number }
): RateLimitResult {
  const now = Date.now()
  let bucket = buckets.get(key)

  if (!bucket) {
    if (buckets.size > MAX_BUCKETS) {
      buckets.clear()
    }
    bucket = { hits: [] }
    buckets.set(key, bucket)
  }

  bucket.hits = bucket.hits.filter((t) => now - t < windowMs)

  if (bucket.hits.length >= limit) {
    const oldest = bucket.hits[0]
    const retryAfterSeconds = Math.ceil((windowMs - (now - oldest)) / 1000)
    return { allowed: false, retryAfterSeconds }
  }

  bucket.hits.push(now)
  return { allowed: true }
}
