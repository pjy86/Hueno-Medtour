type Bucket = { count: number; resetAt: number }

const buckets = new Map<string, Bucket>()

function getLimits() {
  const max = Math.max(
    1,
    Number.parseInt(process.env.ADMIN_LOGIN_MAX_ATTEMPTS_PER_WINDOW || '15', 10)
  )
  const windowSec = Math.max(
    60,
    Number.parseInt(process.env.ADMIN_LOGIN_WINDOW_SECONDS || '900', 10)
  )
  return { max, windowMs: windowSec * 1000 }
}

/** Returns true if request allowed, false if rate limited. Uses fixed window per key. */
export function consumeLoginAttempt(key: string): boolean {
  const { max, windowMs } = getLimits()
  const now = Date.now()
  const b = buckets.get(key)
  if (!b || now >= b.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return true
  }
  if (b.count >= max) {
    return false
  }
  b.count += 1
  return true
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim() || 'unknown'
  }
  return request.headers.get('x-real-ip')?.trim() || 'unknown'
}
