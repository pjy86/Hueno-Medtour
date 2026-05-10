import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { CMSProvider } from '@/components/CMSProvider'
import TopBar from '@/components/TopBar'
import { getCmsData } from '@/lib/get-cms-data'
import type { CMSData } from '@/lib/cms-types'

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }))
}

async function resolveCmsData(): Promise<CMSData> {
  try {
    return await getCmsData()
  } catch (error) {
    console.error('[locale layout] CMS load failed:', error)
    return { contents: [], images: [] }
  }
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const [messages, cmsData] = await Promise.all([getMessages(), resolveCmsData()])

  return (
    <NextIntlClientProvider messages={messages}>
      <CMSProvider initialData={cmsData}>
        <TopBar />
        {/*
          Reserve space for fixed chrome: TopBar (h-10) + Header nav (h-16 / lg:h-20).
          globals.css also sets main padding-top for legacy/admin; zero it here so we don't double-offset.
        */}
        <div className="pt-[calc(2.5rem+4rem)] lg:pt-[calc(2.5rem+5rem)] [&_main]:pt-0">
          {children}
        </div>
      </CMSProvider>
    </NextIntlClientProvider>
  )
}
