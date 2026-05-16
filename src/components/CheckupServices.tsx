'use client'

import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import { Clock, Languages, Camera, UserCheck, FileText, CreditCard } from 'lucide-react'
import { useCMS, getContentByKey, getImageByKey } from '@/components/CMSProvider'
import { cmsFieldToHtmlFragment } from '@/lib/cms-html'

const iconMap: Record<string, React.ElementType> = {
  Clock,
  Languages,
  Camera,
  UserCheck,
  FileText,
  CreditCard
}

export default function CheckupServices() {
  const t = useTranslations('checkup')
  const params = useParams()
  const locale = (params.locale as string) || 'en'
  const cmsData = useCMS()

  const services = [
    {
      iconKey: 'checkup_service_1_icon',
      iconName: 'Clock',
      desc: getContentByKey(cmsData, 'checkup_service_1_desc', locale) || t('service1Desc')
    },
    {
      iconKey: 'checkup_service_2_icon',
      iconName: 'Languages',
      desc: getContentByKey(cmsData, 'checkup_service_2_desc', locale) || t('service2Desc')
    },
    {
      iconKey: 'checkup_service_3_icon',
      iconName: 'Camera',
      desc: getContentByKey(cmsData, 'checkup_service_3_desc', locale) || t('service3Desc')
    },
    {
      iconKey: 'checkup_service_4_icon',
      iconName: 'UserCheck',
      desc: getContentByKey(cmsData, 'checkup_service_4_desc', locale) || t('service4Desc')
    },
    {
      iconKey: 'checkup_service_5_icon',
      iconName: 'FileText',
      desc: getContentByKey(cmsData, 'checkup_service_5_desc', locale) || t('service5Desc')
    },
    {
      iconKey: 'checkup_service_6_icon',
      iconName: 'CreditCard',
      desc: getContentByKey(cmsData, 'checkup_service_6_desc', locale) || t('service6Desc')
    }
  ]

  return (
    <section id="services" className="py-8 md:py-12 bg-white scroll-mt-28">
      <div className="mx-auto w-full max-w-site px-4 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1861D7]">
            {t('trustedServices')}
          </h2>
        </div>

        {/* Services Grid - 2 rows x 3 columns */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 max-w-6xl mx-auto">
          {services.map((service, index) => {
            const IconComponent = iconMap[service.iconName] || Clock
            const customIconUrl = getImageByKey(cmsData, service.iconKey)

            return (
              <div
                key={index}
                className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.18)] transition-shadow duration-300"
              >
                {/* Icon */}
                <div className="mb-4 overflow-hidden">
                  {customIconUrl ? (
                    <img
                      src={customIconUrl}
                      alt=""
                      className="w-16 h-16 object-contain"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-[#e8f4fc] rounded-full flex items-center justify-center">
                      <IconComponent size={28} className="text-[#4fa3e8]" />
                    </div>
                  )}
                </div>

                {/* CMS: HTML 与换行均可；纯文本里的换行会转为 br（见 cmsFieldToHtmlFragment） */}
                <div
                  className="text-gray-600 text-sm leading-relaxed rich-text-content"
                  dangerouslySetInnerHTML={{ __html: cmsFieldToHtmlFragment(service.desc) }}
                />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
