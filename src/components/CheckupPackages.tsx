'use client'

import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { useCMS, getImageByKey, getContentByKey } from '@/components/CMSProvider'
import BookConsultationModal from './BookConsultationModal'
import { useState } from 'react'

export default function CheckupPackages() {
  const t = useTranslations('checkup')
  const params = useParams()
  const locale = (params.locale as string) || 'en'
  const cmsData = useCMS()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const packages = [
    { titleKey: 'package_1_name', contentKey: 'package_1_content', imageKey: 'checkup_package_1_image' },
    { titleKey: 'package_2_name', contentKey: 'package_2_content', imageKey: 'checkup_package_2_image' },
    { titleKey: 'package_3_name', contentKey: 'package_3_content', imageKey: 'checkup_package_3_image' },
    { titleKey: 'package_4_name', contentKey: 'package_4_content', imageKey: 'checkup_package_4_image' }
  ]

  const defaults = [
    {
      title: 'Package A | Express Checkup',
      content: 'Price: $500\nFor: General population, quick health screening\nKey Items: Physical exam, Blood test, Liver & kidney function, Chest X-ray, Abdominal ultrasound, ECG\nHighlight: Fast, basic, cost-effective'
    },
    {
      title: 'Package B | Young Adult Basic Checkup',
      content: 'Price: $1,000\nFor: Adults 18+, annual routine check\nKey Items: All items in A + Lipid 4 items, Liver function 5 items, Tumor markers (AFP, CEA, EB-VCA-IgA)\nHighlight: Basic cancer screening + full organ assessment'
    },
    {
      title: 'Package C | Adults Standard Checkup',
      content: 'Price: $2,000 – $2,200\nFor: Adults who want full-body health management\nKey Items: All items in B + Chest CT, Thyroid function, Heart color ultrasound, Carotid ultrasound, Gender-specific tumor markers, Gynecological exam (female)\nHighlight: Deep screening for tumors, heart, cerebrovascular, thyroid'
    },
    {
      title: 'Package D | Adults Comprehensive Checkup',
      content: 'Price: $3,700 – $3,900\nFor: Adults who want comprehensive disease prevention\nKey Items: All items in C + Brain & cervical MRI, Painless gastrointestinal endoscopy, Coagulation function, Immune function, Hepatitis markers\nHighlight: Top-level screening, early detection of serious diseases'
    }
  ]

  const getPackageImage = (imageKey: string) => {
    return getImageByKey(cmsData, imageKey)
  }

  return (
    <>
      <section id="packages" className="py-10 bg-white scroll-mt-28">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Section Title */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1861D7]">
              {t('selectedPackages')}
            </h2>
          </div>

          {/* Packages List */}
          <div className="space-y-8 max-w-5xl mx-auto">
            {packages.map((pkg, index) => {
              const title = getContentByKey(cmsData, `checkup_${pkg.contentKey}`, locale)
                ? getContentByKey(cmsData, `checkup_${pkg.titleKey}`, locale)
                : defaults[index].title
              const content = getContentByKey(cmsData, `checkup_${pkg.contentKey}`, locale) || defaults[index].content
              const image = getPackageImage(pkg.imageKey)

              return (
                <div
                  key={index}
                  className="grid grid-cols-1 lg:grid-cols-[250px_1fr] bg-white rounded-xl shadow-md overflow-hidden"
                >
                  {/* Image Section */}
                  <div className="relative overflow-hidden h-[350px] lg:w-[250px] lg:h-[260px] lg:flex-shrink-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#e8f4fc] to-[#d0e8f7] flex items-center justify-center h-full">
                      {image ? (
                        <img
                          src={image}
                          alt={title ?? ''}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center text-[#4fa3e8]">
                          <div className="text-4xl mb-1">🏥</div>
                          <p className="text-xs">{t('packageImage')}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-4 lg:p-6 flex flex-col justify-between h-[260px] lg:h-[260px]">
                    {/* Package Title */}
                    <h3 className="text-lg font-bold text-[#1a3a5c]">
                      {title}
                    </h3>

                    {/* Content */}
                    <p className="text-sm text-gray-600 whitespace-pre-line leading-relaxed overflow-hidden">
                      {content}
                    </p>

                    {/* Book Button */}
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="inline-flex items-center gap-2 bg-[#1861D7] hover:bg-[#1250a0] text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer w-fit"
                    >
                      {t('bookNow')}
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              )
            })}
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
