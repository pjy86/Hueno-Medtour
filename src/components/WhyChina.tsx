'use client'

import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import { useCMS, getContentByKey, getImageByKey } from '@/components/CMSProvider'

export default function WhyChina() {
  const params = useParams()
  const locale = (params.locale as string) || 'en'
  const cmsData = useCMS()

  // Support 4 items
  const items = []

  for (let i = 1; i <= 4; i++) {
    const title = getContentByKey(cmsData, `why_china_${i}_title`, locale)
    const desc = getContentByKey(cmsData, `why_china_${i}_desc`, locale)
    const image = getImageByKey(cmsData, `why_china_${i}_image`)

    if (title || desc || image) {
      items.push({
        key: `why_china_${i}`,
        title: title || '',
        desc: desc || '',
        image: image
      })
    }
  }

  // Get section title
  const sectionTitle = getContentByKey(cmsData, 'why_china_title', locale)

  if (items.length === 0 && !sectionTitle) {
    return null
  }

  return (
    <section id="checkup" className="py-20 bg-white scroll-mt-28">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1a3a5c]">
            {sectionTitle || 'Why Choose China'}
          </h2>
        </div>

        {/* Items Grid */}
        {items.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map((item) => (
              <div
                key={item.key}
                className="flex flex-col items-center text-center"
              >
                {/* 16:9 Image */}
                <div className="w-full aspect-video bg-gray-100 rounded-lg overflow-hidden mb-4 relative">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <span className="text-gray-400 text-sm">No image</span>
                    </div>
                  )}
                </div>

                {/* Title - Centered */}
                <h3 className="text-lg font-bold mb-2 text-center" style={{ color: '#4fa3eb' }}>
                  {item.title}
                </h3>

                {/* Description - Centered */}
                <p className="text-gray-600 text-sm leading-relaxed text-center">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
