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
        <div className="pointer-events-auto mx-auto w-full max-w-site px-4 lg:px-16 py-12 md:py-28 relative">
          <div className="max-w-3xl">
            {/* Main Title - Rich Text */}
            {title && (
              <h1
                className="font-bold text-[#1a3a5c] mb-4 md:mb-6 leading-tight text-left text-3xl md:text-5xl lg:text-6xl xl:text-[4rem]"
                dangerouslySetInnerHTML={{ __html: title }}
              />
            )}

            {/* Subtitle - Rich Text */}
            {subtitle && (
              <div
                className="text-base md:text-2xl text-gray-600 mb-6 md:mb-8 text-left"
                dangerouslySetInnerHTML={{ __html: subtitle }}
              />
            )}

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-3">
              <button
                onClick={() => router.push(`/${locale}/checkup`)}
                className="inline-flex items-center justify-center gap-2 bg-[#1861D7] hover:bg-[#1250a0] text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors cursor-pointer w-full sm:w-auto"
              >
                Checkup
                <ArrowRight size={20} />
              </button>
              <button
                onClick={() => router.push(`/${locale}/stem-cell`)}
                className="inline-flex items-center justify-center gap-2 bg-[#1861D7] hover:bg-[#1250a0] text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors cursor-pointer w-full sm:w-auto"
              >
                Stem Cell
                <ArrowRight size={20} />
              </button>
              <button
                onClick={() => router.push(`/${locale}/cancer-oncology`)}
                className="inline-flex items-center justify-center gap-2 bg-[#1861D7] hover:bg-[#1250a0] text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors cursor-pointer w-full sm:w-auto"
              >
                Cancer & Oncology
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
