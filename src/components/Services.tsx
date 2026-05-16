'use client'

import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { useCMS, getContentByKey, getImageByKey } from '@/components/CMSProvider'
import BookConsultationModal from './BookConsultationModal'

export default function Services() {
  const t = useTranslations('services')
  const params = useParams()
  const locale = (params.locale as string) || 'en'
  const cmsData = useCMS()
  const [isModalOpen, setIsModalOpen] = useState(false)

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
    <section id="cancer-oncology" className="py-20 bg-white scroll-mt-28">
      <div className="mx-auto w-full max-w-site px-4 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1861D7]">
            {t('title')}
          </h2>
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
          <div
            className={`grid gap-6 items-start ${
              services.length === 1 ? 'grid-cols-1 max-w-xs mx-auto' :
              services.length === 2 ? 'grid-cols-2 max-w-2xl mx-auto' :
              services.length === 3 ? 'grid-cols-3 max-w-4xl mx-auto' :
              services.length === 4 ? 'grid-cols-2 sm:grid-cols-4' :
              services.length >= 5 ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4' :
              'grid-cols-1'
            }`}
          >
            {services.map((service) => (
              <div
                key={service.key}
                className="flex flex-col items-center text-center p-4"
              >
                {/* Light blue disk; inner rectangle uses rounded-xl (not circular clip) so image corners stay visible */}
                <div className="relative mb-4 shrink-0 self-center aspect-square w-[5.5rem] sm:w-24 md:w-[6.5rem] lg:w-28 rounded-full bg-[#E1EDF8] flex items-center justify-center p-[1.15rem] sm:p-[1.4rem] md:p-[1.45rem] lg:p-6">
                  <div className="relative min-h-0 min-w-0 h-full w-full max-h-full rounded-xl bg-[#E1EDF8] overflow-hidden">
                    {service.image ? (
                      <img
                        src={service.image}
                        alt=""
                        className="block h-full w-full object-contain object-center"
                      />
                    ) : (
                      <div className="flex h-full min-h-[2.5rem] w-full items-center justify-center bg-gray-200">
                        <span className="text-gray-400 text-[10px] leading-tight px-1">
                          No image
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Service Content - desc only */}
                <p className="text-gray-600 text-sm leading-relaxed">
                  {service.desc}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Between service cards and CTA */}
        <p className="text-center text-sm text-gray-500 max-w-2xl mx-auto mt-10 md:mt-12 leading-relaxed px-2">
          {t('disclaimer')}
        </p>

        {/* Book consultation */}
        <div className="text-center mt-8">
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 bg-[#1861D7] hover:bg-[#1250a0] text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl"
          >
            {t('bookNow')}
            <ArrowRight size={20} />
          </button>
        </div>
      </div>

      {/* Book Consultation Modal */}
      <BookConsultationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  )
}
