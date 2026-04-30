'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

export interface CMSContent {
  key: string
  en: string | null
  zh: string | null
  id_text: string | null
}

export interface CMSImage {
  key: string
  url: string | null
}

export interface CMSData {
  contents: CMSContent[]
  images: CMSImage[]
}

const CMSContext = createContext<CMSData | null>(null)

export function useCMS() {
  return useContext(CMSContext)
}

function isValidCMSPayload(json: unknown): json is CMSData {
  if (!json || typeof json !== 'object') return false
  const o = json as Record<string, unknown>
  return Array.isArray(o.contents) && Array.isArray(o.images)
}

export function CMSProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<CMSData | null>(null)

  useEffect(() => {
    let cancelled = false

    async function fetchWithRetry(attempts = 3, delay = 5000) {
      for (let i = 0; i < attempts; i++) {
        if (cancelled) return
        try {
          const res = await fetch('/api/cms')
          const json: unknown = await res.json()
          if (res.ok && isValidCMSPayload(json)) {
            setData(json)
            return
          }
          const isRetryable = res.status === 503 || res.status >= 500
          if (!isRetryable || i === attempts - 1) {
            console.error('CMS fetch failed or invalid response', res.status, json)
            return
          }
        } catch (err) {
          if (i === attempts - 1) {
            console.error('CMS fetch error:', err)
            return
          }
        }
        await new Promise(r => setTimeout(r, delay * (i + 1)))
      }
    }

    fetchWithRetry()
    return () => { cancelled = true }
  }, [])

  return (
    <CMSContext.Provider value={data}>
      {children}
    </CMSContext.Provider>
  )
}

export function getContentByKey(data: CMSData | null, key: string, locale: string): string | null {
  if (!data || !Array.isArray(data.contents)) return null

  const content = data.contents.find(c => c.key === key)
  if (!content) return null

  switch (locale) {
    case 'zh':
      return content.zh
    case 'id':
      return content.id_text
    default:
      return content.en
  }
}

export function getImageByKey(data: CMSData | null, key: string): string | null {
  if (!data || !Array.isArray(data.images)) return null
  const image = data.images.find(img => img.key === key)
  return image?.url || null
}
