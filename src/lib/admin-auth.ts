import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { ADMIN_SESSION_COOKIE } from '@/lib/admin-session-cookie'

export interface AdminJwtPayload {
  adminId: number
  username: string
}

const WEAK_DEFAULT_SECRET = 'secret'

/**
 * Resolves JWT signing key: `ADMIN_JWT_SECRET` overrides `NEXTAUTH_SECRET`.
 * In production: must set a strong value; `'secret'` is rejected.
 */
export function resolveAdminJwtSecret(): { secret: string } | { response: NextResponse } {
  const isProd = process.env.NODE_ENV === 'production'
  const raw = (process.env.ADMIN_JWT_SECRET || process.env.NEXTAUTH_SECRET || '').trim()

  if (!raw) {
    if (isProd) {
      return {
        response: NextResponse.json(
          { error: 'Server misconfiguration: set ADMIN_JWT_SECRET or NEXTAUTH_SECRET' },
          { status: 503 }
        )
      }
    }
    return { secret: WEAK_DEFAULT_SECRET }
  }

  if (isProd && raw === WEAK_DEFAULT_SECRET) {
    return {
      response: NextResponse.json(
        {
          error:
            'Server misconfiguration: do not use the default JWT secret in production'
        },
        { status: 503 }
      )
    }
  }

  return { secret: raw }
}

function readToken(request: NextRequest): string | null {
  const fromCookie = request.cookies.get(ADMIN_SESSION_COOKIE)?.value
  if (fromCookie?.trim()) {
    return fromCookie.trim()
  }

  const auth = request.headers.get('authorization')
  if (auth?.toLowerCase().startsWith('bearer ')) {
    const t = auth.slice(7).trim()
    if (t) return t
  }

  return null
}

/** Validates HttpOnly session cookie or `Authorization: Bearer` (scripts / tools). */
export function requireAdmin(request: NextRequest): AdminJwtPayload | NextResponse {
  const resolved = resolveAdminJwtSecret()
  if ('response' in resolved) {
    return resolved.response
  }
  const { secret } = resolved

  const token = readToken(request)
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const payload = jwt.verify(token, secret) as jwt.JwtPayload & Partial<AdminJwtPayload>
    if (
      typeof payload.adminId !== 'number' ||
      typeof payload.username !== 'string'
    ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return { adminId: payload.adminId, username: payload.username }
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}
