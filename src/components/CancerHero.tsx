'use client'

import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { useCMS, getImageByKey, getContentByKey } from '@/components/CMSProvider'
import BookConsultationModal from './BookConsultationModal'
import { useState } from 'react'

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
        className="relative min-h-[80vh] lg:min-h-[92vh] flex items-center justify-center overflow-hidden scroll-mt-28 bg-white"
      >
        {bgImage && (
          <div
            className="absolute inset-0 bg-cover bg-right bg-no-repeat md:bg-center"
            style={{
              backgroundImage: `url(${bgImage})`
            }}
          >
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/95 via-white/78 to-transparent md:hidden"
              aria-hidden
            />
          </div>
        )}

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
      </section>

      <BookConsultationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  )
}
