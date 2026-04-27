'use client'

import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import { Clock, Languages, Camera, UserCheck, FileText, CreditCard } from 'lucide-react'
import { useCMS, getContentByKey, getImageByKey } from '@/components/CMSProvider'

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
    <section id="services" className="py-20 bg-gray-50 scroll-mt-28">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1861D7]">
            {t('trustedServices')}
          </h2>
        </div>

        {/* Services Grid - 2 rows x 3 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {services.map((service, index) => {
            const IconComponent = iconMap[service.iconName] || Clock
            const customIconUrl = getImageByKey(cmsData, service.iconKey)

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
                      className="w-16 h-16 object-contain"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-[#e8f4fc] rounded-full flex items-center justify-center">
                      <IconComponent size={28} className="text-[#4fa3e8]" />
                    </div>
                  )}
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm leading-relaxed">
                  {service.desc}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
