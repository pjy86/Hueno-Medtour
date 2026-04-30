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
