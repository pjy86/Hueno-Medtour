'use client'

import { useParams, useRouter } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { useCMS, getImageByKey, getContentByKey } from '@/components/CMSProvider'
import HeroBackgroundImage from '@/components/HeroBackgroundImage'
import { heroFrameHomeClass } from '@/components/hero-shared'

export default function Hero() {
  const params = useParams()
  const router = useRouter()
  const locale = (params.locale as string) || 'en'
  const cmsData = useCMS()

  const bgImage = getImageByKey(cmsData, 'hero_bg')
  const title = getContentByKey(cmsData, 'hero_title', locale) || ''
  const subtitle = getContentByKey(cmsData, 'hero_subtitle', locale) || ''

  return (
    <section
      id="top"
      className="relative w-full min-w-0 max-w-full overflow-x-clip overflow-hidden scroll-mt-[6.5rem] lg:scroll-mt-[7.5rem] bg-white"
    >
      <div className={heroFrameHomeClass}>
        {bgImage ? (
          <>
            <HeroBackgroundImage src={bgImage} />
            <div
              className="pointer-events-none absolute inset-0 max-md:bg-white/50 md:bg-white/30"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/95 via-white/70 to-transparent md:hidden"
              aria-hidden
            />
          </>
        ) : (
          <div className="absolute inset-0 bg-white" aria-hidden />
        )}
      </div>

      <div className="absolute inset-0 z-10 flex flex-col justify-center pointer-events-none">
        <div className="pointer-events-auto mx-auto w-full max-w-site px-4 lg:px-16 py-16 md:py-28 relative">
          <div className="max-w-3xl">
            {/* Main Title - Rich Text */}
            {title && (
              <h1
                className="font-bold text-[#1a3a5c] mb-6 leading-tight text-left text-4xl md:text-5xl lg:text-6xl xl:text-[4rem]"
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
      </div>

      {/* Scroll Indicator */}
      <div className="pointer-events-none absolute bottom-8 left-1/2 z-20 -translate-x-1/2 lg:hidden">
        <div className="w-6 h-10 border-2 border-gray-400/60 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-gray-500 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  )
}
