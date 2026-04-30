'use client'

import { useTranslations } from 'next-intl'
import { Phone, MessageCircle, Mail } from 'lucide-react'
import { useCMS, getImageByKey } from '@/components/CMSProvider'

export default function Footer() {
  const t = useTranslations('footer')
  const cmsData = useCMS()

  const logoUrl = getImageByKey(cmsData, 'logo_footer')

  return (
    <footer className="bg-[#1a3a5c] text-white py-12">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Part 1: Logo */}
          {logoUrl && (
            <img src={logoUrl} alt="Logo" className="w-[110px] h-auto object-contain" />
          )}

          {/* Part 2: About Us */}
          <div>
            <h4 className="font-semibold text-lg mb-4">About Us</h4>
            <p className="text-white/70 text-sm leading-relaxed">
              Hueno Medtour China is a One-stop, seamlessly connected international medical tourism service platform dedicated to delivering customized, world-class and affordable medical tourism solutions centered on China&apos;s premium healthcare resources.
            </p>
          </div>

          {/* Part 3: Address */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Address</h4>
            <p className="text-white/70 text-sm leading-relaxed whitespace-pre-line">
              Building 10, Minjie Shangcheng International{'\n'}
              Wanbo Business District, Nancun Town{'\n'}
              Panyu District, Guangzhou{'\n'}
              Guangdong Province, P.R.China
            </p>
          </div>

          {/* Part 4: Contact Us */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-white/70 text-sm">
                <Phone size={16} />
                <span>+86 13244819680</span>
              </div>
              <div className="flex items-center gap-3 text-white/70 text-sm">
                <MessageCircle size={16} />
                <span>+86 13244819680</span>
              </div>
              <div className="flex items-center gap-3 text-white/70 text-sm">
                <Mail size={16} />
                <span>huenomedtour@163.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 pt-8 text-center">
          <p className="text-white/50 text-sm">{t('copyright')}</p>
        </div>
      </div>
    </footer>
  )
}
