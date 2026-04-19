'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Menu, X } from 'lucide-react'
import { useCMS, getImageByKey } from '@/components/CMSProvider'

const locales = [
  { code: 'en', label: 'EN' },
  { code: 'zh', label: '中文' },
  { code: 'id', label: 'ID' }
]

export default function Header() {
  const t = useTranslations('nav')
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const cmsData = useCMS()

  const logoUrl = getImageByKey(cmsData, 'logo_header')

  const getLocalePath = (locale: string) => {
    const segments = pathname.split('/')
    segments[1] = locale
    return segments.join('/') || `/${locale}`
  }

  const currentLocale = pathname.split('/')[1] || 'en'

  const handleNavClick = (e: React.MouseEvent, targetId: string) => {
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

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#1a3a5c] text-white">
      <nav className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <a
            href="#top"
            onClick={(e) => handleNavClick(e, 'top')}
            className="cursor-pointer"
          >
            {logoUrl && (
              <img src={logoUrl} alt="Logo" className="h-12 lg:h-14 w-auto object-contain" />
            )}
          </a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            <a
              href="#top"
              onClick={(e) => handleNavClick(e, 'top')}
              className="text-sm font-medium hover:text-[#5cb3f0] transition-colors cursor-pointer"
            >
              {t('home')}
            </a>
            <a
              href="#why-choose-hueno"
              onClick={(e) => handleNavClick(e, 'why-choose-hueno')}
              className="text-sm font-medium hover:text-[#5cb3f0] transition-colors cursor-pointer"
            >
              {t('about')}
            </a>
            <a
              href="#our-services"
              onClick={(e) => handleNavClick(e, 'our-services')}
              className="text-sm font-medium hover:text-[#5cb3f0] transition-colors cursor-pointer"
            >
              {t('services')}
            </a>
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, 'contact')}
              className="text-sm font-medium hover:text-[#5cb3f0] transition-colors cursor-pointer"
            >
              {t('contact')}
            </a>
          </div>

          {/* Language Switcher - Hidden for now */}
          {/* <div className="hidden lg:flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              {locales.map(locale => (
                <Link
                  key={locale.code}
                  href={getLocalePath(locale.code)}
                  className={`px-2 py-1 rounded transition-colors ${
                    currentLocale === locale.code
                      ? 'bg-[#5cb3f0] text-white'
                      : 'hover:bg-white/10'
                  }`}
                >
                  {locale.label}
                </Link>
              ))}
            </div>
          </div> */}

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden pb-4">
            <div className="flex flex-col gap-2">
              <a
                href="#top"
                onClick={(e) => handleNavClick(e, 'top')}
                className="px-4 py-2 text-sm font-medium hover:bg-white/10 rounded transition-colors cursor-pointer"
              >
                {t('home')}
              </a>
              <a
                href="#why-choose-hueno"
                onClick={(e) => handleNavClick(e, 'why-choose-hueno')}
                className="px-4 py-2 text-sm font-medium hover:bg-white/10 rounded transition-colors cursor-pointer"
              >
                {t('about')}
              </a>
              <a
                href="#our-services"
                onClick={(e) => handleNavClick(e, 'our-services')}
                className="px-4 py-2 text-sm font-medium hover:bg-white/10 rounded transition-colors cursor-pointer"
              >
                {t('services')}
              </a>
              <a
                href="#contact"
                onClick={(e) => handleNavClick(e, 'contact')}
                className="px-4 py-2 text-sm font-medium hover:bg-white/10 rounded transition-colors cursor-pointer"
              >
                {t('contact')}
              </a>
            </div>
            {/* Mobile Language Switcher - Hidden for now */}
            {/* <div className="flex items-center gap-2 mt-4 px-4">
              {locales.map(locale => (
                <Link
                  key={locale.code}
                  href={getLocalePath(locale.code)}
                  className={`px-3 py-1 text-sm rounded transition-colors ${
                    currentLocale === locale.code
                      ? 'bg-[#5cb3f0] text-white'
                      : 'hover:bg-white/10'
                  }`}
                >
                  {locale.label}
                </Link>
              ))}
            </div> */}
          </div>
        )}
      </nav>
    </header>
  )
}
