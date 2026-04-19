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

export function CMSProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<CMSData | null>(null)

  useEffect(() => {
    fetch('/api/cms')
      .then(res => res.json())
      .then(setData)
      .catch(console.error)
  }, [])

  return (
    <CMSContext.Provider value={data}>
      {children}
    </CMSContext.Provider>
  )
}

export function getContentByKey(data: CMSData | null, key: string, locale: string): string | null {
  if (!data) return null
  
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
  if (!data) return null
  const image = data.images.find(img => img.key === key)
  return image?.url || null
}
