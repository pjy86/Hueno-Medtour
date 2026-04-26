'use client'

import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import { Clock, Languages, Camera, UserCheck, FileText, CreditCard } from 'lucide-react'
import { useCMS, getContentByKey } from '@/components/CMSProvider'

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
      icon: 'Clock',
      title: getContentByKey(cmsData, 'checkup_service_1_title', locale) || t('service1Title'),
      desc: getContentByKey(cmsData, 'checkup_service_1_desc', locale) || t('service1Desc')
    },
    {
      icon: 'Languages',
      title: getContentByKey(cmsData, 'checkup_service_2_title', locale) || t('service2Title'),
      desc: getContentByKey(cmsData, 'checkup_service_2_desc', locale) || t('service2Desc')
    },
    {
      icon: 'Camera',
      title: getContentByKey(cmsData, 'checkup_service_3_title', locale) || t('service3Title'),
      desc: getContentByKey(cmsData, 'checkup_service_3_desc', locale) || t('service3Desc')
    },
    {
      icon: 'UserCheck',
      title: getContentByKey(cmsData, 'checkup_service_4_title', locale) || t('service4Title'),
      desc: getContentByKey(cmsData, 'checkup_service_4_desc', locale) || t('service4Desc')
    },
    {
      icon: 'FileText',
      title: getContentByKey(cmsData, 'checkup_service_5_title', locale) || t('service5Title'),
      desc: getContentByKey(cmsData, 'checkup_service_5_desc', locale) || t('service5Desc')
    },
    {
      icon: 'CreditCard',
      title: getContentByKey(cmsData, 'checkup_service_6_title', locale) || t('service6Title'),
      desc: getContentByKey(cmsData, 'checkup_service_6_desc', locale) || t('service6Desc')
    }
  ]

  return (
    <section id="services" className="py-20 bg-gray-50 scroll-mt-28">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1a3a5c] mb-4">
            {t('trustedServices')}
          </h2>
          <div className="w-20 h-1 bg-[#4fa3e8] mx-auto rounded-full" />
        </div>

        {/* Services Grid - 2 rows x 3 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {services.map((service, index) => {
            const IconComponent = iconMap[service.icon] || Clock
            return (
              <div
                key={index}
                className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                {/* Icon Circle */}
                <div className="w-16 h-16 bg-[#e8f4fc] rounded-full flex items-center justify-center mb-4">
                  <IconComponent size={28} className="text-[#4fa3e8]" />
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-[#1a3a5c] mb-2">
                  {service.title}
                </h3>

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
