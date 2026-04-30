import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

const handleI18nRouting = createMiddleware({
  ...routing,
  localePrefix: 'always',
  localeDetection: false
})

export default function proxy(request: Parameters<typeof handleI18nRouting>[0]) {
  return handleI18nRouting(request)
}

export const config = {
  matcher: ['/', '/(en|zh|id)/:path*']
}
