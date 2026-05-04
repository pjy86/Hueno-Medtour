/** Browser-only helpers for authenticated admin fetch calls. */

type LoginRouter = { push: (href: string) => void }

const UNAUTHORIZED_REDIRECT_COOLDOWN_MS = 8000

let unauthorizedHandlingLogged = false

export function sessionRedirectUnauthorized(router: LoginRouter, message?: string) {
  if (typeof window === 'undefined') return

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

/** Attaches Bearer token when present (admin pages only). Handles 401 with alert + redirect. */
export async function adminFetch(
  input: RequestInfo | URL,
  router: LoginRouter,
  init?: RequestInit
): Promise<Response> {
  const headers = new Headers(init?.headers)
  const auth = adminAuthHeaders() as Record<string, string>
  if (auth.Authorization) {
    headers.set('Authorization', auth.Authorization)
  }
  const response = await fetch(input, { ...init, headers })
  if (response.status === 401) {
    sessionRedirectUnauthorized(router)
  }
  return response
}

export function adminAuthHeaders(): HeadersInit {
  if (typeof window === 'undefined') return {}
  const token = localStorage.getItem('adminToken')
  if (!token) return {}
  return { Authorization: `Bearer ${token}` }
}

export function adminJsonHeaders(): HeadersInit {
  return {
    ...(adminAuthHeaders() as Record<string, string>),
    'Content-Type': 'application/json'
  }
}
