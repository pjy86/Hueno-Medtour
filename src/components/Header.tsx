'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Menu, X } from 'lucide-react'
import { useCMS, getImageByKey } from '@/components/CMSProvider'

const NAV_IDS = ['top', 'checkup', 'stem-cell', 'cancer-oncology', 'about-us'] as const

type NavKey = 'home' | 'checkup' | 'stemCell' | 'cancerOncology' | 'aboutUs'

const navKeyForId = (id: (typeof NAV_IDS)[number]): NavKey => {
  const map: Record<(typeof NAV_IDS)[number], NavKey> = {
    top: 'home',
    checkup: 'checkup',
    'stem-cell': 'stemCell',
    'cancer-oncology': 'cancerOncology',
    'about-us': 'aboutUs'
  }
  return map[id]
}

export default function Header() {
  const t = useTranslations('nav')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const cmsData = useCMS()

  const logoUrl = getImageByKey(cmsData, 'logo_header')

  const scrollToSection = (e: React.MouseEvent, targetId: string) => {
    e.preventDefault()
    if (targetId === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      const element = document.getElementById(targetId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
    setMobileMenuOpen(false)
  }

  const linkClass =
    'text-sm font-normal text-gray-900 hover:text-[#1861D7] transition-colors cursor-pointer'
  const mobileLinkClass = `${linkClass} px-4 py-2 rounded-lg hover:bg-gray-100`

  return (
    <header className="fixed top-10 left-0 right-0 z-50 border-b border-gray-200/80 bg-white text-gray-900 shadow-sm">
      <nav className="container mx-auto px-4 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-3 lg:gap-6 lg:h-20">
          <a
            href="#top"
            onClick={e => scrollToSection(e, 'top')}
            className="shrink-0 cursor-pointer"
          >
            {logoUrl && (
              <Image
                src={logoUrl}
                alt="Logo"
                width={56}
                height={56}
                className="h-10 w-auto object-contain lg:h-12"
              />
            )}
          </a>

          <div className="hidden min-w-0 flex-1 items-center justify-center lg:flex">
            <div className="flex max-w-3xl flex-wrap items-center justify-center gap-x-3 gap-y-1 xl:gap-x-5">
              {NAV_IDS.map(id => {
                const href = id === 'top' ? '#top' : `#${id}`
                return (
                  <a
                    key={id}
                    href={href}
                    onClick={e => scrollToSection(e, id)}
                    className={linkClass}
                  >
                    {t(navKeyForId(id))}
                  </a>
                )
              })}
            </div>
          </div>

          <div className="flex items-center gap-1">
            <a
              href="#contact"
              onClick={e => scrollToSection(e, 'contact')}
              className="hidden shrink-0 rounded-lg bg-[#1861D7] px-3 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 sm:px-4 lg:inline-flex"
            >
              {t('freeConsultation')}
            </a>
            <button
              type="button"
              className="p-2 text-gray-900 lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-gray-100 pb-4 pt-2 lg:hidden">
            <div className="flex flex-col gap-1">
              {NAV_IDS.map(id => {
                const href = id === 'top' ? '#top' : `#${id}`
                return (
                  <a
                    key={id}
                    href={href}
                    onClick={e => scrollToSection(e, id)}
                    className={mobileLinkClass}
                  >
                    {t(navKeyForId(id))}
                  </a>
                )
              })}
              <a
                href="#contact"
                onClick={e => scrollToSection(e, 'contact')}
                className="mt-2 rounded-lg bg-[#1861D7] px-4 py-3 text-center text-sm font-medium text-white"
              >
                {t('freeConsultation')}
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
