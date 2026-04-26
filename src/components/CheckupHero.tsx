'use client'

import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { useCMS, getImageByKey, getContentByKey } from '@/components/CMSProvider'

export default function CheckupHero() {
  const t = useTranslations('checkup')
  const params = useParams()
  const locale = (params.locale as string) || 'en'
  const cmsData = useCMS()

  const bgImage = getImageByKey(cmsData, 'checkup_hero_bg')
  const title = getContentByKey(cmsData, 'checkup_hero_title', locale) || t('defaultTitle')
  const subtitle = getContentByKey(cmsData, 'checkup_hero_subtitle', locale) || t('defaultSubtitle')

  const handleBookNow = () => {
    const element = document.getElementById('contact')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <section
      id="top"
      className="relative min-h-[80vh] lg:min-h-[92vh] flex items-center justify-center overflow-hidden scroll-mt-28 bg-white"
    >
      {/* Background Image - Full cover, no overlay */}
      {bgImage && (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${bgImage})`
          }}
        />
      )}

      {/* Content Container */}
      <div className="relative z-10 w-full px-4 lg:px-16 py-20">
        <div className="max-w-3xl">
          <div className="space-y-6">
            <h1
              className="font-bold text-[#1a3a5c] leading-tight text-left"
              style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
              dangerouslySetInnerHTML={{ __html: title }}
            />

            <div
              className="text-lg md:text-xl text-gray-600 text-left leading-relaxed max-w-2xl"
              dangerouslySetInnerHTML={{ __html: subtitle }}
            />

            {/* CTA Button */}
            <button
              onClick={handleBookNow}
              className="inline-flex items-center gap-2 bg-[#4fa3e8] hover:bg-[#3d8fd4] text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl"
            >
              {t('bookNow')}
              <ArrowRight size={20} />
            </button>

            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-4 pt-4">
              {[
                t('trust1'),
                t('trust2'),
                t('trust3')
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-gray-600 text-sm">
                  <CheckCircle2 size={16} className="text-[#4fa3e8]" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
