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

/** Render sets `RENDER=true` on all deploys. See https://render.com/docs/environment-variables */
function isRenderRuntime(): boolean {
  return process.env.RENDER === 'true'
}

/** Render sets `IS_PULL_REQUEST=true` for PR preview deployments only. */
function isRenderPullRequestPreview(): boolean {
  return process.env.IS_PULL_REQUEST === 'true'
}

/**
 * JWT secret for PR previews when env is not synced (distinct from production).
 * Includes commit so previews stay isolated; admins re-login after redeploys is fine.
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
 * Stable JWT secret for a production Render web service when no explicit env is set.
 * Tied to `RENDER_SERVICE_ID` so it survives normal deploys without invalidating sessions
 * on every commit (unlike hashing the commit SHA).
 */
function deriveRenderProductionJwtSecret(): string | null {
  const id = process.env.RENDER_SERVICE_ID?.trim()
  if (!id) return null
  return createHash('sha256').update(`hntravel-admin-jwt-v1|prod|${id}`).digest('hex')
}

/**
 * Resolves JWT signing key: `ADMIN_JWT_SECRET` overrides `NEXTAUTH_SECRET`.
 * In production outside Render: those must be set; literal `secret` is rejected.
 * On Render: if unset, derives a secret (PR previews vs production web service) so admin works
 * without manual env when Blueprint secrets are missing.
 */
export function resolveAdminJwtSecret(): { secret: string } | { response: NextResponse } {
  const isProd = process.env.NODE_ENV === 'production'
  let raw = (process.env.ADMIN_JWT_SECRET || process.env.NEXTAUTH_SECRET || '').trim()

  if (!raw && isProd && isRenderPullRequestPreview()) {
    raw = deriveRenderPreviewJwtSecret()
  }

  if (!raw && isProd && isRenderRuntime()) {
    const derived = deriveRenderProductionJwtSecret()
    if (derived) {
      raw = derived
    }
  }

  if (!raw) {
    if (isProd) {
      return {
        response: NextResponse.json(
          {
            error:
              'Server misconfiguration: set ADMIN_JWT_SECRET or NEXTAUTH_SECRET (required when not running on Render, or if RENDER_SERVICE_ID is missing)'
          },
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
