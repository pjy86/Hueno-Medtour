'use client'

import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Phone, MapPin, Facebook, Instagram, MessageCircle, Mail } from 'lucide-react'
import { useCMS, getContentByKey, getImageByKey } from '@/components/CMSProvider'

export default function Footer() {
  const t = useTranslations('footer')
  const params = useParams()
  const locale = (params.locale as string) || 'en'
  const cmsData = useCMS()

  const logoUrl = getImageByKey(cmsData, 'logo_header')
  const phone = getContentByKey(cmsData, 'footer_phone', locale) || t('phone')

  const staticAddress = 'Building 10, Minjie Shangcheng International\nWanbo Business District, Nancun Town\nPanyu District, Guangzhou\nGuangdong Province, P.R.China'

  return (
    <footer className="bg-[#1a3a5c] text-white py-12">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Logo & Description */}
          <div>
            {logoUrl && (
              <img src={logoUrl} alt="Logo" className="h-14 w-auto object-contain" />
            )}
          </div>

          {/* Address */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Address</h4>
            <p className="text-white/70 text-sm leading-relaxed whitespace-pre-line">
              {staticAddress}
            </p>
          </div>

          {/* Contact Info */}
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

            {/* Social Icons */}
            <div className="flex items-center gap-4 mt-6">
              <a
                href="#"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <Facebook size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <Instagram size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <MessageCircle size={18} />
              </a>
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
