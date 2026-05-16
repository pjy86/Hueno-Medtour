'use client'

import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import { useCMS, getContentByKey } from '@/components/CMSProvider'
import { cmsFieldToHtmlFragment } from '@/lib/cms-html'

export default function StemCellPrograms() {
  const t = useTranslations('stemcell')
  const params = useParams()
  const locale = (params.locale as string) || 'en'
  const cmsData = useCMS()

  const programs = []
  for (let i = 1; i <= 6; i++) {
    const title = getContentByKey(cmsData, `stemcell_program_${i}_title`, locale)
    const desc = getContentByKey(cmsData, `stemcell_program_${i}_desc`, locale)

    if (title || desc) {
      programs.push({
        key: `stemcell_program_${i}`,
        title: title || '',
        desc: desc || ''
      })
    }
  }

  const sectionTitle = getContentByKey(cmsData, 'stemcell_programs_title', locale)

  if (programs.length === 0 && !sectionTitle) {
    return null
  }

  return (
    <section id="programs" className="py-20 bg-white scroll-mt-28">
      <div className="mx-auto w-full max-w-site px-4 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1861D7]">
            {sectionTitle || 'Stem Cell Therapy Programs in China'}
          </h2>
        </div>

        {/* Programs Grid - 2 rows x 3 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {programs.map((program) => (
            <div
              key={program.key}
              className="p-6 bg-[#E1EDF8] rounded-xl"
            >
              {/* Title */}
              <h3 className="text-lg font-bold mb-3 text-black">
                {program.title}
              </h3>

              {/* CMS: HTML 与换行；纯文本换行会转为 br（cmsFieldToHtmlFragment） */}
              {program.desc.trim() !== '' && (
                <div
                  className="text-gray-600 text-sm leading-relaxed rich-text-content"
                  dangerouslySetInnerHTML={{
                    __html: cmsFieldToHtmlFragment(program.desc)
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
