'use client'

import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { useCMS, getContentByKey, getImageByKey } from '@/components/CMSProvider'
import BookConsultationModal from './BookConsultationModal'
import { useState } from 'react'

export default function StemCellBoaoZone() {
  const t = useTranslations('stemcell')
  const params = useParams()
  const locale = (params.locale as string) || 'en'
  const cmsData = useCMS()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const sectionTitle = getContentByKey(cmsData, 'stemcell_boao_title', locale)
  const imageUrl = getImageByKey(cmsData, 'stemcell_boao_image')
  const description = getContentByKey(cmsData, 'stemcell_boao_desc', locale)

  if (!sectionTitle && !imageUrl && !description) {
    return null
  }

  return (
    <>
      <section id="boao-zone" className="py-20 bg-gray-50 scroll-mt-28">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Section Title */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1861D7]">
              {sectionTitle || 'About Boao Lecheng International Medical Tourism Pilot Zone'}
            </h2>
          </div>

          {/* Content with border - vertical layout */}
          <div className="max-w-4xl mx-auto border-2 border-[#1861D7] rounded-2xl p-8">
            <div className="flex flex-col gap-8">
              {/* Image */}
              {imageUrl && (
                <div className="w-full">
                  <img
                    src={imageUrl}
                    alt={sectionTitle ?? ''}
                    className="w-full h-auto rounded-lg object-cover"
                  />
                </div>
              )}

              {/* Description */}
              {description && (
                <div className="w-full">
                  <div
                    className="text-gray-600 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: description }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Copyright & CTA */}
          <div className="max-w-4xl mx-auto mt-12 text-center">
            <p className="text-gray-500 text-sm mb-6">
              All We Care About Is Your Health.©2026 HuenoMedtourChina. All Rights Reserved
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 bg-[#1861D7] hover:bg-[#1250a0] text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl"
            >
              {t('freeConsultation')}
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* Book Consultation Modal */}
      <BookConsultationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  )
}
