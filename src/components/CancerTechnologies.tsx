'use client'

import { useParams } from 'next/navigation'
import { useCMS, getContentByKey, getImageByKey } from '@/components/CMSProvider'
import { cmsFieldToHtmlFragment } from '@/lib/cms-html'

export default function CancerTechnologies() {
  const params = useParams()
  const locale = (params.locale as string) || 'en'
  const cmsData = useCMS()

  const technologies = []
  for (let i = 1; i <= 6; i++) {
    const title = getContentByKey(cmsData, `cancer_technology_${i}_title`, locale)
    const desc = getContentByKey(cmsData, `cancer_technology_${i}_desc`, locale)
    const imageUrl = getImageByKey(cmsData, `cancer_technology_${i}_image`)

    if (title || desc) {
      technologies.push({
        key: `cancer_technology_${i}`,
        title: title || '',
        desc: desc || '',
        imageUrl
      })
    }
  }

  const sectionTitle = getContentByKey(cmsData, 'cancer_technologies_title', locale)

  if (technologies.length === 0 && !sectionTitle) {
    return null
  }

  return (
    <section id="technologies" className="py-8 md:py-12 bg-white scroll-mt-28">
      <div className="mx-auto w-full max-w-site px-4 lg:px-8">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1861D7]">
            {sectionTitle || 'Advanced Cancer Treatment Technologies'}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 max-w-6xl mx-auto">
          {technologies.map((tech) => (
            <div
              key={tech.key}
              className="p-6 bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.18)] transition-shadow duration-300"
            >
              {tech.imageUrl && (
                <div className="mb-4">
                  <img
                    src={tech.imageUrl}
                    alt={tech.title}
                    className="w-full h-40 object-cover rounded-lg"
                  />
                </div>
              )}

              <h3 className="text-lg font-bold mb-3 text-black">
                {tech.title}
              </h3>

              <div
                className="text-gray-600 text-sm leading-relaxed rich-text-content"
                dangerouslySetInnerHTML={{ __html: cmsFieldToHtmlFragment(tech.desc) }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
