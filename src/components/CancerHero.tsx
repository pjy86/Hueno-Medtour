'use client'

import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { useCMS, getImageByKey, getContentByKey } from '@/components/CMSProvider'
import BookConsultationModal from './BookConsultationModal'
import { useState } from 'react'
import HeroBackgroundImage from '@/components/HeroBackgroundImage'
import { heroFrameSubpageClass } from '@/components/hero-shared'

export default function CancerHero() {
  const t = useTranslations('cancer')
  const params = useParams()
  const locale = (params.locale as string) || 'en'
  const cmsData = useCMS()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const bgImage = getImageByKey(cmsData, 'cancer_hero_bg')
  const title = getContentByKey(cmsData, 'cancer_hero_title', locale) || t('defaultTitle')
  const subtitle = getContentByKey(cmsData, 'cancer_hero_subtitle', locale) || t('defaultSubtitle')

  return (
    <>
      <section
        id="top"
        className="relative w-full min-w-0 max-w-full overflow-x-clip overflow-hidden scroll-mt-[6.5rem] lg:scroll-mt-[7.5rem] bg-white"
      >
        <div className={heroFrameSubpageClass}>
          {bgImage ? (
            <>
              <HeroBackgroundImage src={bgImage} />
              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/95 via-white/78 to-transparent md:hidden"
                aria-hidden
              />
            </>
          ) : (
            <div className="absolute inset-0 bg-white" aria-hidden />
          )}
        </div>

        <div className="absolute inset-0 z-10 flex flex-col justify-center pointer-events-none">
          <div className="pointer-events-auto mx-auto w-full max-w-site px-4 lg:px-16 py-16 md:py-20 relative">
            <div className="max-w-3xl">
              <div className="space-y-6">
                <h1
                  className="font-bold text-[#1a3a5c] leading-tight text-left text-4xl md:text-5xl lg:text-[3.5rem]"
                  dangerouslySetInnerHTML={{ __html: title }}
                />

                <div
                  className="text-lg md:text-xl text-gray-600 text-left leading-relaxed max-w-2xl"
                  dangerouslySetInnerHTML={{ __html: subtitle }}
                />

                <button
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center gap-2 bg-[#1861D7] hover:bg-[#1250a0] text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl"
                >
                  {t('freeConsultation')}
                  <ArrowRight size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <BookConsultationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  )
}
