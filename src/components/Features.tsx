'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import { useCMS, getContentByKey, getImageByKey } from '@/components/CMSProvider'

function normalizeFeatureImageUrl(url: string | null): string | null {
  if (url == null || typeof url !== 'string') return null
  const t = url.trim()
  if (!t) return null
  if (t.startsWith('https://') || t.startsWith('http://') || t.startsWith('/')) return t
  return null
}

function FeatureImage({ src, title }: { src: string | null; title: string }) {
  const [failed, setFailed] = useState(false)
  const safe = normalizeFeatureImageUrl(src)
  if (!safe || failed) {
    return <div className="w-full h-full bg-[#e8f4fc]" aria-hidden />
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={safe}
      alt={title ?? ''}
      className="w-full h-full object-cover"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
    />
  )
}

export default function Features() {
  const t = useTranslations('features')
  const params = useParams()
  const locale = (params.locale as string) || 'en'
  const cmsData = useCMS()

  const features = [
    {
      key: '1',
      title: getContentByKey(cmsData, 'feature_1_title', locale) || t('professional.title'),
      subtitle: getContentByKey(cmsData, 'feature_1_subtitle', locale) || '',
      desc: getContentByKey(cmsData, 'feature_1_desc', locale) || t('professional.desc'),
      image: getImageByKey(cmsData, 'feature_icon_1')
    },
    {
      key: '2',
      title: getContentByKey(cmsData, 'feature_2_title', locale) || t('safe.title'),
      subtitle: getContentByKey(cmsData, 'feature_2_subtitle', locale) || '',
      desc: getContentByKey(cmsData, 'feature_2_desc', locale) || t('safe.desc'),
      image: getImageByKey(cmsData, 'feature_icon_2')
    },
    {
      key: '3',
      title: getContentByKey(cmsData, 'feature_3_title', locale) || t('costEffective.title'),
      subtitle: getContentByKey(cmsData, 'feature_3_subtitle', locale) || '',
      desc: getContentByKey(cmsData, 'feature_3_desc', locale) || t('costEffective.desc'),
      image: getImageByKey(cmsData, 'feature_icon_3')
    }
  ]

  return (
    <section id="stem-cell" className="py-20 bg-white scroll-mt-28">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1861D7]">
            Why Choose Hueno Medtour China
          </h2>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map(({ key, title, subtitle, desc, image }) => (
            <div
              key={key}
              className="flex flex-col items-center text-center p-6 rounded-xl"
            >
              {/* Image */}
              <div className="w-80 h-[250px] mb-6 overflow-hidden bg-[#e8f4fc] rounded-xl">
                <FeatureImage src={image} title={title} />
              </div>

              {/* Title */}
              <h3 className="text-6xl font-bold mb-2 text-center" style={{ color: '#1861D7' }}>
                {title}
              </h3>

              {/* Subtitle */}
              {subtitle && (
                <p className="text-gray-600 text-sm leading-relaxed font-bold mb-2">
                  {subtitle}
                </p>
              )}

              {/* Description */}
              <p className="text-gray-600 text-sm leading-relaxed">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
