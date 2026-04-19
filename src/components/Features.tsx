'use client'

import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import { Shield, Award, Wallet, Heart } from 'lucide-react'
import { useCMS, getContentByKey } from '@/components/CMSProvider'
import { CMSContent } from '@/lib/cms'

const icons = {
  professional: Award,
  safe: Shield,
  costEffective: Wallet,
  caring: Heart
}

export default function Features() {
  const t = useTranslations('features')
  const params = useParams()
  const locale = (params.locale as string) || 'en'
  const cmsData = useCMS()

  const features = [
    { 
      key: 'professional', 
      icon: icons.professional,
      title: getContentByKey(cmsData as { contents: CMSContent[] } | null, 'feature_1_title', locale) || t('professional.title'),
      desc: getContentByKey(cmsData as { contents: CMSContent[] } | null, 'feature_1_desc', locale) || t('professional.desc')
    },
    { 
      key: 'safe', 
      icon: icons.safe,
      title: getContentByKey(cmsData as { contents: CMSContent[] } | null, 'feature_2_title', locale) || t('safe.title'),
      desc: getContentByKey(cmsData as { contents: CMSContent[] } | null, 'feature_2_desc', locale) || t('safe.desc')
    },
    { 
      key: 'costEffective', 
      icon: icons.costEffective,
      title: getContentByKey(cmsData as { contents: CMSContent[] } | null, 'feature_3_title', locale) || t('costEffective.title'),
      desc: getContentByKey(cmsData as { contents: CMSContent[] } | null, 'feature_3_desc', locale) || t('costEffective.desc')
    },
    { 
      key: 'caring', 
      icon: icons.caring,
      title: getContentByKey(cmsData as { contents: CMSContent[] } | null, 'feature_4_title', locale) || t('caring.title'),
      desc: getContentByKey(cmsData as { contents: CMSContent[] } | null, 'feature_4_desc', locale) || t('caring.desc')
    }
  ]

  return (
    <section id="why-choose-hueno" className="py-20 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1a3a5c] mb-4">
            Why Choose Hueno Medtour China
          </h2>
          <div className="w-20 h-1 bg-[#4fa3e8] mx-auto rounded-full" />
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map(({ key, icon: Icon, title, desc }) => (
            <div
              key={key}
              className="flex flex-col items-center text-center p-6 rounded-xl hover:shadow-lg transition-shadow"
            >
              {/* Icon Circle */}
              <div className="w-20 h-20 bg-[#e8f4fc] rounded-full flex items-center justify-center mb-6">
                <Icon size={36} className="text-[#4fa3e8]" />
              </div>

              {/* Title */}
              <h3 className="text-xl font-semibold text-[#1a3a5c] mb-2">
                {title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 text-sm leading-relaxed">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
