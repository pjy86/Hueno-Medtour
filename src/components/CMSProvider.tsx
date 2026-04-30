'use client'

import { createContext, useContext, ReactNode } from 'react'

import type { CMSData } from '@/lib/cms-types'

export type { CMSContent, CMSImage, CMSData } from '@/lib/cms-types'

const CMSContext = createContext<CMSData | null>(null)

export function useCMS() {
  return useContext(CMSContext)
}

export function CMSProvider({
  initialData,
  children
}: {
  initialData: CMSData
  children: ReactNode
}) {
  return (
    <CMSContext.Provider value={initialData}>
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
