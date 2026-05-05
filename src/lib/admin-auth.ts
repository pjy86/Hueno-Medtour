import { createHash } from 'crypto'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { ADMIN_SESSION_COOKIE } from '@/lib/admin-session-cookie'

export interface AdminJwtPayload {
  adminId: number
  username: string
}

const WEAK_DEFAULT_SECRET = 'secret'

/** Render sets `IS_PULL_REQUEST=true` for PR preview deployments only. See https://render.com/docs/environment-variables */
function isRenderPullRequestPreview(): boolean {
  return process.env.IS_PULL_REQUEST === 'true'
}

/**
 * Deterministic JWT secret per preview deploy (distinct from prod). Allows admin login on
 * PR previews when NEXTAUTH_SECRET is not synced from the prod service blueprint.
 */
function deriveRenderPreviewJwtSecret(): string {
  const entropy = [
    'hntravel-admin-jwt-v1',
    process.env.RENDER_SERVICE_ID ?? '',
    process.env.RENDER_GIT_COMMIT ?? '',
    process.env.RENDER_EXTERNAL_URL ?? ''
  ].join('|')
  return createHash('sha256').update(entropy).digest('hex')
}

/**
 * Resolves JWT signing key: `ADMIN_JWT_SECRET` overrides `NEXTAUTH_SECRET`.
 * In production: must set a strong value; `'secret'` is rejected.
 * On Render pull request previews, if those are unset, a per-preview derived secret is used.
 */
export function resolveAdminJwtSecret(): { secret: string } | { response: NextResponse } {
  const isProd = process.env.NODE_ENV === 'production'
  let raw = (process.env.ADMIN_JWT_SECRET || process.env.NEXTAUTH_SECRET || '').trim()

  if (!raw && isProd && isRenderPullRequestPreview()) {
    raw = deriveRenderPreviewJwtSecret()
  }

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
