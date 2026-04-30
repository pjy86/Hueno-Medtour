import { prisma } from '@/lib/db'
import type { CMSData } from '@/lib/cms-types'

async function retry<T>(fn: () => Promise<T>, retries = 2, delayMs = 3000): Promise<T> {
  try {
    return await fn()
  } catch (error) {
    if (retries <= 0) throw error
    console.warn(`getCmsData: retry after error, ${retries} attempts left:`, error)
    await new Promise(resolve => setTimeout(resolve, delayMs))
    return retry(fn, retries - 1, delayMs)
  }
}

export async function getCmsData(): Promise<CMSData> {
  const [contents, images] = await retry(() =>
    Promise.all([
      prisma.content.findMany({
        orderBy: { key: 'asc' },
        select: { key: true, en: true, zh: true, id_text: true }
      }),
      prisma.image.findMany({
        orderBy: { key: 'asc' },
        select: { key: true, url: true }
      })
    ])
  )

  return { contents, images }
}
