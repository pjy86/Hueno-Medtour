'use client'

import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { useCMS, getImageByKey, getContentByKey } from '@/components/CMSProvider'
import BookConsultationModal from './BookConsultationModal'
import { useState } from 'react'
import { cmsFieldToHtmlFragment } from '@/lib/cms-html'

function trimmedNonEmpty(s: string | null | undefined): boolean {
  return (s ?? '').trim().length > 0
}

export default function CheckupPackages() {
  const t = useTranslations('checkup')
  const params = useParams()
  const locale = (params.locale as string) || 'en'
  const cmsData = useCMS()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const packages = [
    {
      cmsIndex: 1,
      titleKey: 'checkup_package_1_name',
      contentKey: 'checkup_package_1_content',
      imageKey: 'checkup_package_1_image'
    },
    {
      cmsIndex: 2,
      titleKey: 'checkup_package_2_name',
      contentKey: 'checkup_package_2_content',
      imageKey: 'checkup_package_2_image'
    },
    {
      cmsIndex: 3,
      titleKey: 'checkup_package_3_name',
      contentKey: 'checkup_package_3_content',
      imageKey: 'checkup_package_3_image'
    },
    {
      cmsIndex: 4,
      titleKey: 'checkup_package_4_name',
      contentKey: 'checkup_package_4_content',
      imageKey: 'checkup_package_4_image'
    }
  ] as const

  const defaults = [
    {
      title: 'Package A | Express Checkup',
      content:
        'Price: $500\nFor: General population, quick health screening\nKey Items: Physical exam, Blood test, Liver & kidney function, Chest X-ray, Abdominal ultrasound, ECG\nHighlight: Fast, basic, cost-effective'
    },
    {
      title: 'Package B | Young Adult Basic Checkup',
      content:
        'Price: $1,000\nFor: Adults 18+, annual routine check\nKey Items: All items in A + Lipid 4 items, Liver function 5 items, Tumor markers (AFP, CEA, EB-VCA-IgA)\nHighlight: Basic cancer screening + full organ assessment'
    },
    {
      title: 'Package C | Adults Standard Checkup',
      content:
        'Price: $2,000 – $2,200\nFor: Adults who want full-body health management\nKey Items: All items in B + Chest CT, Thyroid function, Heart color ultrasound, Carotid ultrasound, Gender-specific tumor markers, Gynecological exam (female)\nHighlight: Deep screening for tumors, heart, cerebrovascular, thyroid'
    },
    {
      title: 'Package D | Adults Comprehensive Checkup',
      content:
        'Price: $3,700 – $3,900\nFor: Adults who want comprehensive disease prevention\nKey Items: All items in C + Brain & cervical MRI, Painless gastrointestinal endoscopy, Coagulation function, Immune function, Hepatitis markers\nHighlight: Top-level screening, early detection of serious diseases'
    }
  ]

  const getPackageImage = (imageKey: string) => getImageByKey(cmsData, imageKey)

  return (
    <>
      <section id="packages" className="py-10 bg-white scroll-mt-28">
        <div className="mx-auto w-full max-w-site px-4 lg:px-8">
          {/* Section Title */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1861D7]">
              {t('selectedPackages')}
            </h2>
          </div>

          {/* Packages List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {packages.map((pkg, index) => {
              const fallback = defaults[index]
              const titleRaw = getContentByKey(cmsData, pkg.titleKey, locale)
              const contentRaw = getContentByKey(cmsData, pkg.contentKey, locale)

              const title = trimmedNonEmpty(titleRaw) ? titleRaw! : fallback.title
              const bodyRaw = trimmedNonEmpty(contentRaw) ? contentRaw! : fallback.content

              const image = getPackageImage(pkg.imageKey)

              return (
                <div
                  key={pkg.cmsIndex}
                  className="grid grid-cols-1 lg:grid-cols-[250px_1fr] bg-white rounded-xl shadow-md overflow-hidden"
                >
                  {/* Image Section */}
                  <div className="relative overflow-hidden h-[350px] lg:w-[250px] lg:h-[260px] lg:flex-shrink-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#e8f4fc] to-[#d0e8f7] flex items-center justify-center h-full">
                      {image ? (
                        <img src={image} alt={title ?? ''} className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-center text-[#4fa3e8]">
                          <div className="text-4xl mb-1">🏥</div>
                          <p className="text-xs">{t('packageImage')}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-4 lg:p-6 flex flex-col justify-between min-h-[260px]">
                    <h3 className="text-lg font-bold text-[#1a3a5c]">{title}</h3>

                    <div className="mt-2 flex-1 min-h-0">
                      <div className="checkup-package-cms text-sm text-gray-600 leading-relaxed">
                        <div
                          dangerouslySetInnerHTML={{
                            __html: cmsFieldToHtmlFragment(bodyRaw)
                          }}
                        />
                      </div>
                    </div>

                    {/* Book Button */}
                    <div className="mt-auto pt-4">
                      <button
                        onClick={() => setIsModalOpen(true)}
                        className="inline-flex items-center gap-2 bg-[#1861D7] hover:bg-[#1250a0] text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer w-fit"
                      >
                        {t('bookNow')}
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Book Consultation Modal */}
      <BookConsultationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
