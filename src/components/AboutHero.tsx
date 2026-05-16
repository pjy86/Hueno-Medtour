'use client'

import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import { useCMS, getContentByKey } from '@/components/CMSProvider'

export default function AboutHero() {
  const t = useTranslations('about')
  const tServices = useTranslations('services')
  const params = useParams()
  const locale = (params.locale as string) || 'en'
  const cmsData = useCMS()

  const title = getContentByKey(cmsData, 'about_hero_title', locale) || t('defaultTitle')
  const description = getContentByKey(cmsData, 'about_hero_description', locale) || t('defaultDescription')

  return (
    <section
      id="top"
      className="relative flex items-center justify-center overflow-hidden scroll-mt-[6.5rem] lg:scroll-mt-[7.5rem] bg-[#E1EDFB]"
    >
      <div className="mx-auto w-full max-w-site px-4 lg:px-16 py-[5.25rem] lg:py-[7.35rem]">
        <div className="text-center space-y-6">
          <div className="max-w-6xl mx-auto">
            <h1
              className="font-bold text-[#1861D7] leading-tight text-4xl md:text-5xl lg:text-[3.5rem]"
              dangerouslySetInnerHTML={{ __html: title }}
            />
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            <div
              className="text-lg md:text-xl text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: description }}
            />

            <p className="text-sm text-gray-500 pt-4">
              {tServices('disclaimer')}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
