import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, key, en, zh, id_text, url, items } = body

    // Batch save
    if (type === 'batch') {
      if (!Array.isArray(items) || items.length === 0) {
        return NextResponse.json(
          { error: 'Items array is required for batch update' },
          { status: 400 }
        )
      }

      const operations = items.flatMap((item: { type: string; key: string; en?: string | null; zh?: string | null; id_text?: string | null; url?: string | null }) => {
        if (item.type === 'content') {
          return [prisma.content.upsert({
            where: { key: item.key },
            update: { en: item.en, zh: item.zh, id_text: item.id_text },
            create: { key: item.key, en: item.en, zh: item.zh, id_text: item.id_text }
          })]
        }
        if (item.type === 'image') {
          return [prisma.image.upsert({
            where: { key: item.key },
            update: { url: item.url },
            create: { key: item.key, url: item.url }
          })]
        }
        return []
      })
      const results = await prisma.$transaction(operations)

      return NextResponse.json({ saved: results.length })
    }

    // Single save
    if (!type || !key) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (type === 'content') {
      const content = await prisma.content.upsert({
        where: { key },
        update: { en, zh, id_text },
        create: { key, en, zh, id_text }
      })
      return NextResponse.json(content)
    }

    if (type === 'image') {
      const image = await prisma.image.upsert({
        where: { key },
        update: { url },
        create: { key, url }
      })
      return NextResponse.json(image)
    }

    return NextResponse.json(
      { error: 'Invalid type' },
      { status: 400 }
    )
  } catch (error) {
    console.error('CMS UPDATE Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
