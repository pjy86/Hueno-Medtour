'use client'

import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { useCMS, getContentByKey, getImageByKey } from '@/components/CMSProvider'
import { cmsFieldToHtmlFragment } from '@/lib/cms-html'
import BookConsultationModal from './BookConsultationModal'
import { useState } from 'react'

export default function CancerProcess() {
  const t = useTranslations('cancer')
  const params = useParams()
  const locale = (params.locale as string) || 'en'
  const cmsData = useCMS()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const steps = []
  for (let i = 1; i <= 6; i++) {
    const title = getContentByKey(cmsData, `cancer_step_${i}_title`, locale)
    const desc = getContentByKey(cmsData, `cancer_step_${i}_desc`, locale)
    const iconUrl = getImageByKey(cmsData, `cancer_step_${i}_icon`)

    if (title || desc) {
      steps.push({
        key: `cancer_step_${i}`,
        desc: desc || '',
        iconUrl
      })
    }
  }

  const sectionTitle = getContentByKey(cmsData, 'cancer_process_title', locale)

  if (steps.length === 0 && !sectionTitle) {
    return null
  }

  return (
    <>
      <section id="process" className="py-20 bg-white scroll-mt-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1861D7]">
              {sectionTitle || 'Treatment Process'}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {steps.map((step) => (
              <div
                key={step.key}
                className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.18)] transition-shadow duration-300"
              >
                <div className="mb-4 overflow-hidden">
                  {step.iconUrl ? (
                    <img
                      src={step.iconUrl}
                      alt=""
                      className="w-20 h-20 object-contain"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-[#e8f4fc] rounded-full flex items-center justify-center">
                      <span className="text-[#4fa3e8] font-bold text-xl">{step.key.slice(-1)}</span>
                    </div>
                  )}
                </div>

                <div
                  className="text-gray-600 text-sm leading-relaxed rich-text-content"
                  dangerouslySetInnerHTML={{ __html: cmsFieldToHtmlFragment(step.desc) }}
                />
              </div>
            ))}
          </div>

          {/* Disclaimer & CTA */}
          <div className="max-w-4xl mx-auto mt-12 text-center">
            <p className="text-gray-500 text-sm mb-6">
              {t('processDisclaimer')}
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

      <BookConsultationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  )
}
