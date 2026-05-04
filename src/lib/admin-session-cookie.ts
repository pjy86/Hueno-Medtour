import type { NextResponse } from 'next/server'

export const ADMIN_SESSION_COOKIE = 'admin_session'

const SESSION_MAX_AGE_SEC = 60 * 60 * 24 * 7

export function setAdminSessionCookie(response: NextResponse, token: string) {
  const secure = process.env.NODE_ENV === 'production'
  response.cookies.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure,
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE_SEC
  })
}

export function clearAdminSessionCookie(response: NextResponse) {
  const secure = process.env.NODE_ENV === 'production'
  response.cookies.set(ADMIN_SESSION_COOKIE, '', {
    httpOnly: true,
    secure,
    sameSite: 'lax',
    path: '/',
    maxAge: 0
  })
}
