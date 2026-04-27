'use client'

import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import { MessageCircle, Plane, Stethoscope, FileText, Languages, Heart } from 'lucide-react'
import { useCMS, getContentByKey, getImageByKey } from '@/components/CMSProvider'

const defaultIcons = [
  MessageCircle,
  Plane,
  Stethoscope,
  FileText,
  Languages,
  Heart
]

export default function CheckupProcess() {
  const t = useTranslations('checkup')
  const params = useParams()
  const locale = (params.locale as string) || 'en'
  const cmsData = useCMS()

  const steps = [
    {
      iconKey: 'checkup_step_1_icon',
      title: getContentByKey(cmsData, 'checkup_step_1_title', locale) || t('step1Title'),
      desc: getContentByKey(cmsData, 'checkup_step_1_desc', locale) || t('step1Desc')
    },
    {
      iconKey: 'checkup_step_2_icon',
      title: getContentByKey(cmsData, 'checkup_step_2_title', locale) || t('step2Title'),
      desc: getContentByKey(cmsData, 'checkup_step_2_desc', locale) || t('step2Desc')
    },
    {
      iconKey: 'checkup_step_3_icon',
      title: getContentByKey(cmsData, 'checkup_step_3_title', locale) || t('step3Title'),
      desc: getContentByKey(cmsData, 'checkup_step_3_desc', locale) || t('step3Desc')
    },
    {
      iconKey: 'checkup_step_4_icon',
      title: getContentByKey(cmsData, 'checkup_step_4_title', locale) || t('step4Title'),
      desc: getContentByKey(cmsData, 'checkup_step_4_desc', locale) || t('step4Desc')
    },
    {
      iconKey: 'checkup_step_5_icon',
      title: getContentByKey(cmsData, 'checkup_step_5_title', locale) || t('step5Title'),
      desc: getContentByKey(cmsData, 'checkup_step_5_desc', locale) || t('step5Desc')
    },
    {
      iconKey: 'checkup_step_6_icon',
      title: getContentByKey(cmsData, 'checkup_step_6_title', locale) || t('step6Title'),
      desc: getContentByKey(cmsData, 'checkup_step_6_desc', locale) || t('step6Desc')
    }
  ]

  return (
    <section id="process" className="py-20 bg-gray-50 scroll-mt-28">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1861D7]">
            {t('checkupProcess')}
          </h2>
        </div>

        {/* Process Grid - 2 rows x 3 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => {
            const DefaultIcon = defaultIcons[index] || MessageCircle
            const customIconUrl = getImageByKey(cmsData, step.iconKey)

            return (
              <div
                key={index}
                className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                {/* Icon */}
                <div className="mb-4 overflow-hidden">
                  {customIconUrl ? (
                    <img
                      src={customIconUrl}
                      alt=""
                      className="w-20 h-20 object-contain"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-[#e8f4fc] rounded-full flex items-center justify-center">
                      <DefaultIcon size={32} className="text-[#4fa3e8]" />
                    </div>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-[#1a3a5c] mb-2">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-sm leading-relaxed">
                  {step.desc}
                </p>
              </div>
            )
          })}
        </div>

        {/* Disclaimer */}
        <div className="text-center mt-12 max-w-3xl mx-auto">
          <p className="text-xs text-gray-500 leading-relaxed">
            {t('disclaimer')}
          </p>
        </div>
      </div>
    </section>
  )
}
