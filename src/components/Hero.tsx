'use client'

import { useTranslations } from 'next-intl'
import { useParams, useRouter } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { useCMS, getImageByKey, getContentByKey } from '@/components/CMSProvider'

export default function Hero() {
  const t = useTranslations('hero')
  const params = useParams()
  const router = useRouter()
  const locale = (params.locale as string) || 'en'
  const cmsData = useCMS()

  const bgImage = getImageByKey(cmsData, 'hero_bg')
  const title = getContentByKey(cmsData, 'hero_title', locale) || ''
  const subtitle = getContentByKey(cmsData, 'hero_subtitle', locale) || ''
  const ctaText = getContentByKey(cmsData, 'hero_cta_text', locale) || t('cta')

  return (
    <section
      id="top"
      className="relative min-h-screen flex items-center justify-center overflow-hidden scroll-mt-28 bg-white"
    >
      {/* Background Image - Only show if configured */}
      {bgImage && (
        <div
          className="absolute inset-0 bg-cover bg-right bg-no-repeat md:bg-center"
          style={{
            backgroundImage: `url(${bgImage})`
          }}
        >
          {/* Overlay - Subtle neutral overlay */}
          <div className="absolute inset-0 max-md:bg-white/50 md:bg-white/30" />
          {/* Mobile: left emphasis so headline separates from right-weight background */}
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/95 via-white/70 to-transparent md:hidden"
            aria-hidden
          />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 w-full px-4 lg:px-16 py-32">
        <div className="max-w-3xl">
          {/* Main Title - Rich Text */}
          {title && (
            <h1
              className="font-bold text-[#1a3a5c] mb-6 leading-tight text-left"
              style={{ fontSize: 'clamp(2rem, 5vw, 4rem)' }}
              dangerouslySetInnerHTML={{ __html: title }}
            />
          )}

          {/* Subtitle - Rich Text */}
          {subtitle && (
            <div
              className="text-xl md:text-2xl text-gray-600 mb-8 text-left"
              dangerouslySetInnerHTML={{ __html: subtitle }}
            />
          )}

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => router.push(`/${locale}/checkup`)}
              className="inline-flex items-center gap-2 bg-[#1861D7] hover:bg-[#1250a0] text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors cursor-pointer"
            >
              Checkup
              <ArrowRight size={20} />
            </button>
            <button
              onClick={() => router.push(`/${locale}/stem-cell`)}
              className="inline-flex items-center gap-2 bg-[#1861D7] hover:bg-[#1250a0] text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors cursor-pointer"
            >
              Stem Cell
              <ArrowRight size={20} />
            </button>
            <button
              onClick={() => router.push(`/${locale}/cancer-oncology`)}
              className="inline-flex items-center gap-2 bg-[#1861D7] hover:bg-[#1250a0] text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors cursor-pointer"
            >
              Cancer & Oncology
              <ArrowRight size={20} />
            </button>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-8 right-8 hidden lg:block">
          <div className="flex gap-4">
            <div className="w-2 h-2 bg-[#a8ddf9] rounded-full" />
            <div className="w-2 h-2 bg-white/50 rounded-full" />
            <div className="w-2 h-2 bg-white/50 rounded-full" />
            <div className="w-2 h-2 bg-white/50 rounded-full" />
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 lg:hidden">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-white rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  )
}
