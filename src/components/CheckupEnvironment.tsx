'use client'

import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { useCMS, getImageByKey } from '@/components/CMSProvider'

export default function CheckupEnvironment() {
  const t = useTranslations('checkup')
  const params = useParams()
  const locale = (params.locale as string) || 'en'
  const cmsData = useCMS()

  const images = [
    getImageByKey(cmsData, 'checkup_env_1') || '',
    getImageByKey(cmsData, 'checkup_env_2') || '',
    getImageByKey(cmsData, 'checkup_env_3') || '',
    getImageByKey(cmsData, 'checkup_env_4') || ''
  ]

  const handleBookNow = () => {
    const element = document.getElementById('contact')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <section id="environment" className="py-20 bg-white scroll-mt-28">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1a3a5c] mb-4">
            {t('hospitalEnvironment')}
          </h2>
          <div className="w-20 h-1 bg-[#4fa3e8] mx-auto rounded-full" />
        </div>

        {/* Image Grid - 2 rows x 2 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6 max-w-5xl mx-auto">
          {images.map((img, index) => (
            <div
              key={index}
              className="aspect-[4/3] rounded-xl overflow-hidden bg-gradient-to-br from-[#e8f4fc] to-[#d0e8f7] shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              {img ? (
                <img
                  src={img}
                  alt={`Hospital environment ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#4fa3e8]">
                  <div className="text-center">
                    <div className="text-4xl mb-2">🏨</div>
                    <p className="text-sm">{t('environmentImage')} {index + 1}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center mt-12">
          <button
            onClick={handleBookNow}
            className="inline-flex items-center gap-2 bg-[#4fa3e8] hover:bg-[#3d8fd4] text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl"
          >
            {t('bookNow')}
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </section>
  )
}
