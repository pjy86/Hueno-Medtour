/** Browser-only helpers for authenticated admin fetch (HttpOnly cookie session). */

type LoginRouter = { push: (href: string) => void }

const UNAUTHORIZED_REDIRECT_COOLDOWN_MS = 8000

let unauthorizedHandlingLogged = false

export async function checkAdminSession(): Promise<boolean> {
  const res = await fetch('/api/admin/session', { credentials: 'include' })
  return res.ok
}

export async function sessionRedirectUnauthorized(
  router: LoginRouter,
  message?: string
): Promise<void> {
  if (typeof window === 'undefined') return

  await fetch('/api/admin/logout', { method: 'POST', credentials: 'include' }).catch(() => {})
  localStorage.removeItem('adminToken')

  if (!unauthorizedHandlingLogged) {
    unauthorizedHandlingLogged = true
    window.alert(message ?? '登录已失效或无权访问，请重新登录')
    setTimeout(() => {
      unauthorizedHandlingLogged = false
    }, UNAUTHORIZED_REDIRECT_COOLDOWN_MS)
  }

  router.push('/admin/login')
}

/** Uses credentialed fetch so HttpOnly `admin_session` is sent. Handles 401 with alert + redirect. */
export async function adminFetch(
  input: RequestInfo | URL,
  router: LoginRouter,
  init?: RequestInit
): Promise<Response> {
  const headers = new Headers(init?.headers)
  const response = await fetch(input, {
    ...init,
    credentials: 'include',
    headers
  })
  if (response.status === 401) {
    await sessionRedirectUnauthorized(router)
  }
  return response
}

/** Legacy no-op; session is cookie-based. */
export function adminAuthHeaders(): HeadersInit {
  return {}
}

export function adminJsonHeaders(): HeadersInit {
  return { 'Content-Type': 'application/json' }
}
