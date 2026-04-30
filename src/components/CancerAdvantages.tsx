'use client'

import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import { useCMS, getContentByKey, getImageByKey } from '@/components/CMSProvider'

export default function CancerAdvantages() {
  const t = useTranslations('cancer')
  const params = useParams()
  const locale = (params.locale as string) || 'en'
  const cmsData = useCMS()

  const advantages = []
  for (let i = 1; i <= 6; i++) {
    const title = getContentByKey(cmsData, `cancer_advantage_${i}_title`, locale)
    const iconUrl = getImageByKey(cmsData, `cancer_advantage_${i}_icon`)

    if (title) {
      advantages.push({
        key: `cancer_advantage_${i}`,
        title,
        iconUrl
      })
    }
  }

  const sectionTitle = getContentByKey(cmsData, 'cancer_advantages_title', locale)

  if (advantages.length === 0 && !sectionTitle) {
    return null
  }

  return (
    <section id="advantages" className="py-20 bg-white scroll-mt-28">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1861D7]">
            {sectionTitle || 'Oncology Treatment Advantages'}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {advantages.map((advantage) => (
            <div
              key={advantage.key}
              className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.18)] transition-shadow duration-300"
            >
              <div className="mb-4 overflow-hidden">
                {advantage.iconUrl ? (
                  <img
                    src={advantage.iconUrl}
                    alt=""
                    className="w-16 h-16 object-contain"
                  />
                ) : (
                  <div className="w-16 h-16 bg-[#e8f4fc] rounded-full flex items-center justify-center">
                    <span className="text-[#4fa3e8] font-bold text-xl">{advantage.key.slice(-1)}</span>
                  </div>
                )}
              </div>

              <h3 className="text-lg font-bold text-black">
                {advantage.title}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
