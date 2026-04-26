'use client'

import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { useCMS, getImageByKey } from '@/components/CMSProvider'

export default function Testimonials() {
  const t = useTranslations('testimonials')
  const cmsData = useCMS()

  // Support up to 8 testimonial images
  const maxImages = 8
  const images = []

  for (let i = 1; i <= maxImages; i++) {
    const url = getImageByKey(cmsData, `testimonial_${i}`)
    if (url) {
      images.push({
        key: `testimonial_${i}`,
        url
      })
    }
  }

  if (images.length === 0) {
    return <div id="about-us" className="scroll-mt-28" aria-hidden="true" />
  }

  // Determine grid columns based on number of images
  const getGridClass = () => {
    switch (images.length) {
      case 1:
        return 'grid-cols-1 max-w-md mx-auto'
      case 2:
        return 'grid-cols-2 max-w-2xl mx-auto'
      case 3:
        return 'grid-cols-3 max-w-4xl mx-auto'
      case 4:
        return 'grid-cols-4'
      case 5:
      case 6:
        return 'grid-cols-3'
      case 7:
      case 8:
        return 'grid-cols-4'
      default:
        return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5'
    }
  }

  return (
    <section id="about-us" className="py-20 bg-white scroll-mt-28">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1a3a5c] mb-4">
            {t('title')}
          </h2>
          <div className="w-20 h-1 bg-[#4fa3e8] mx-auto rounded-full" />
        </div>

        {/* Images Grid */}
        <div className={`grid ${getGridClass()} gap-4`}>
          {images.map((img, index) => (
            <div
              key={img.key}
              className="aspect-square rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow relative"
            >
              <Image
                src={img.url}
                alt={`Success story ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
