'use client'

import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { useCMS, getContentByKey, getImageByKey } from '@/components/CMSProvider'

export default function Services() {
  const t = useTranslations('services')
  const params = useParams()
  const locale = (params.locale as string) || 'en'
  const cmsData = useCMS()

  // Support up to 8 services
  const maxServices = 8
  const services = []

  for (let i = 1; i <= maxServices; i++) {
    const desc = getContentByKey(cmsData, `service_${i}_desc`, locale)
    const image = getImageByKey(cmsData, `service_image_${i}`)

    // Only add service if it has content or image
    if (desc || image) {
      services.push({
        key: `service${i}`,
        desc: desc || '',
        image: image
      })
    }
  }

  // Get services description (rich text)
  const servicesDescription = getContentByKey(cmsData, 'services_description', locale)

  if (services.length === 0 && !servicesDescription) {
    return null
  }

  return (
    <section id="our-services" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1a3a5c] mb-4">
            {t('title')}
          </h2>
          <div className="w-20 h-1 bg-[#4fa3e8] mx-auto rounded-full" />
        </div>

        {/* Services Description - Rich Text */}
        {servicesDescription && (
          <div
            className="text-center mb-12 max-w-3xl mx-auto rich-text-content"
            dangerouslySetInnerHTML={{ __html: servicesDescription }}
          />
        )}

        {/* Services Grid */}
        {services.length > 0 && (
          <div className={`grid gap-6 ${
            services.length === 1 ? 'grid-cols-1 max-w-xs mx-auto' :
            services.length === 2 ? 'grid-cols-2 max-w-2xl mx-auto' :
            services.length === 3 ? 'grid-cols-3 max-w-4xl mx-auto' :
            services.length === 4 ? 'grid-cols-2 sm:grid-cols-4' :
            services.length >= 5 ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4' :
            'grid-cols-1'
          }`}>
            {services.map((service) => (
              <div
                key={service.key}
                className="flex flex-col items-center text-center p-4"
              >
                {/* Square Image - Responsive */}
                <div className="w-16 sm:w-20 md:w-24 lg:w-28 h-16 sm:h-20 md:h-24 lg:h-28 overflow-hidden mb-4 flex-shrink-0 relative">
                  {service.image ? (
                    <Image
                      src={service.image}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 64px, (max-width: 768px) 80px, (max-width: 1024px) 96px, 112px"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400 text-xs">No image</span>
                    </div>
                  )}
                </div>

                {/* Service Content - desc only */}
                <p className="text-gray-600 text-sm leading-relaxed">
                  {service.desc}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
