'use client'

import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { useCMS, getImageByKey, getContentByKey } from '@/components/CMSProvider'
import { CMSContent, CMSImage } from '@/lib/cms'

export default function Hero() {
  const t = useTranslations('hero')
  const params = useParams()
  const locale = (params.locale as string) || 'en'
  const cmsData = useCMS()

  const bgImage = getImageByKey(cmsData as { images: CMSImage[] } | null, 'hero_bg') || 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1920&q=80'
  const title = getContentByKey(cmsData as { contents: CMSContent[] } | null, 'hero_title', locale) || ''
  const subtitle = getContentByKey(cmsData as { contents: CMSContent[] } | null, 'hero_subtitle', locale) || ''
  const ctaText = getContentByKey(cmsData as { contents: CMSContent[] } | null, 'hero_cta_text', locale) || t('cta')

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${bgImage})`
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a3a5c]/90 to-[#2d5a87]/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full px-4 lg:px-8 py-32">
        <div className="max-w-3xl mx-auto">
          {/* Main Title - Rich Text */}
          {title && (
            <h1
              className="font-bold text-white mb-6 leading-tight"
              style={{ fontSize: 'clamp(2rem, 5vw, 4rem)' }}
              dangerouslySetInnerHTML={{ __html: title }}
            />
          )}

          {/* Subtitle - Rich Text */}
          {subtitle && (
            <div
              className="text-xl md:text-2xl text-white/90 mb-8"
              dangerouslySetInnerHTML={{ __html: subtitle }}
            />
          )}

          {/* CTA Button */}
          <button
            onClick={() => {
              const element = document.getElementById('contact')
              if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }
            }}
            className="inline-flex items-center gap-2 bg-[#4fa3e8] hover:bg-[#3d8fd4] text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors cursor-pointer"
          >
            {ctaText}
            <ArrowRight size={20} />
          </button>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-8 right-8 hidden lg:block">
          <div className="flex gap-4">
            <div className="w-2 h-2 bg-[#4fa3e8] rounded-full" />
            <div className="w-2 h-2 bg-white/50 rounded-full" />
            <div className="w-2 h-2 bg-white/50 rounded-full" />
            <div className="w-2 h-2 bg-white/50 rounded-full" />
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 lg:hidden">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-white rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  )
}
