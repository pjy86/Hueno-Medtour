'use client'

import { useParams } from 'next/navigation'
import { Mail, Phone, Facebook, Instagram } from 'lucide-react'
import { useCMS, getContentByKey, getImageByKey, type CMSData } from '@/components/CMSProvider'

const DEFAULT_EMAIL = 'huenomedtour@163.com'
const DEFAULT_PHONE = '+86 13244819680'

function iconUrl(s: string | null): string | null {
  if (s == null || typeof s !== 'string') return null
  const t = s.trim()
  if (!t) return null
  if (t.startsWith('https://') || t.startsWith('http://') || t.startsWith('/')) return t
  return null
}

function TopBarIcon({
  src,
  alt,
  className
}: {
  src: string | null
  alt: string
  className?: string
}) {
  const safe = iconUrl(src)
  if (!safe) return null
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={safe}
      alt={alt}
      className={className ?? 'h-4 w-4 shrink-0 object-contain'}
      referrerPolicy="no-referrer"
    />
  )
}

function TiktokGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className ?? 'h-4 w-4'} fill="currentColor" aria-hidden>
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48.04 2.96.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  )
}

function buildTelHref(phone: string) {
  const digits = phone.replace(/[^\d+]/g, '')
  return digits.startsWith('+') ? `tel:${digits}` : `tel:${digits.replace(/^\+?/, '+')}`
}

function SocialLink({
  href,
  label,
  imgKey,
  cmsData,
  Fallback
}: {
  href: string | null
  label: string
  imgKey: string
  cmsData: CMSData | null
  Fallback: React.ComponentType<{ className?: string }>
}) {
  const src = getImageByKey(cmsData, imgKey)
  const hasIcon = iconUrl(src)
  const isActive = href && href !== '#' && href.trim() !== ''
  const content = hasIcon ? (
    <TopBarIcon src={src} alt={label} className="h-5 w-5 object-contain" />
  ) : (
    <Fallback className="h-5 w-5" />
  )
  if (isActive) {
    return (
      <a
        href={href!.trim()}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center text-white/95 hover:opacity-80 transition-opacity"
        aria-label={label}
      >
        {content}
      </a>
    )
  }
  return (
    <span className="inline-flex items-center justify-center text-white/95" aria-label={label} title={label}>
      {content}
    </span>
  )
}

export default function TopBar() {
  const params = useParams()
  const locale = (params?.locale as string) || 'en'
  const cmsData = useCMS()
  const email = getContentByKey(cmsData, 'topbar_email', locale)?.trim() || DEFAULT_EMAIL
  const phone = getContentByKey(cmsData, 'topbar_phone', locale)?.trim() || DEFAULT_PHONE
  const urlTiktok = (getContentByKey(cmsData, 'topbar_social_tiktok_url', locale) || '').trim() || null
  const urlIns = (getContentByKey(cmsData, 'topbar_social_ins_url', locale) || '').trim() || null
  const urlFb = (getContentByKey(cmsData, 'topbar_social_facebook_url', locale) || '').trim() || null
  const emailIcon = getImageByKey(cmsData, 'topbar_email_icon')
  const phoneIcon = getImageByKey(cmsData, 'topbar_phone_icon')

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[60] h-10 text-white text-xs sm:text-sm"
      style={{ backgroundColor: '#1861D7' }}
    >
      <div className="h-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 min-w-0">
          <a
            href={`mailto:${email}`}
            className="inline-flex items-center gap-1.5 min-w-0 text-white/95 hover:opacity-90"
          >
            {iconUrl(emailIcon) ? (
              <TopBarIcon src={emailIcon} alt="" />
            ) : (
              <Mail className="h-4 w-4 shrink-0" strokeWidth={2} />
            )}
            <span className="truncate">{email}</span>
          </a>
          <a
            href={buildTelHref(phone)}
            className="inline-flex items-center gap-1.5 min-w-0 text-white/95 hover:opacity-90"
          >
            {iconUrl(phoneIcon) ? (
              <TopBarIcon src={phoneIcon} alt="" />
            ) : (
              <Phone className="h-4 w-4 shrink-0" strokeWidth={2} />
            )}
            <span className="truncate">{phone}</span>
          </a>
        </div>
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          <SocialLink
            href={urlTiktok}
            label="TikTok"
            imgKey="topbar_tiktok"
            cmsData={cmsData}
            Fallback={TiktokGlyph}
          />
          <SocialLink
            href={urlIns}
            label="Instagram"
            imgKey="topbar_ins"
            cmsData={cmsData}
            Fallback={p => <Instagram {...p} strokeWidth={2} />}
          />
          <SocialLink
            href={urlFb}
            label="Facebook"
            imgKey="topbar_facebook"
            cmsData={cmsData}
            Fallback={p => <Facebook {...p} strokeWidth={2} />}
          />
        </div>
      </div>
    </div>
  )
}
