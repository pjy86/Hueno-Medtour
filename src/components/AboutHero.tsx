'use client'

import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import { useCMS, getContentByKey } from '@/components/CMSProvider'

export default function AboutHero() {
  const t = useTranslations('about')
  const params = useParams()
  const locale = (params.locale as string) || 'en'
  const cmsData = useCMS()

  const title = getContentByKey(cmsData, 'about_hero_title', locale) || t('defaultTitle')
  const description = getContentByKey(cmsData, 'about_hero_description', locale) || t('defaultDescription')

  return (
    <section
      id="top"
      className="relative flex items-center justify-center overflow-hidden scroll-mt-28 bg-[#E1EDFB]"
    >
      <div className="w-full px-4 lg:px-16 py-20 lg:py-28">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h1
            className="font-bold text-[#1861D7] leading-tight"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
            dangerouslySetInnerHTML={{ __html: title }}
          />

          <div
            className="text-lg md:text-xl text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: description }}
          />

          <p className="text-sm text-gray-500 pt-4">
            All We Care About Is Your Health.{'\u00A9'}2026 HuenoMedtourChina. All Rights Reserved
          </p>
        </div>
      </div>
    </section>
  )
}
