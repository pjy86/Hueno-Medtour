import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAdmin } from '@/lib/admin-auth'

export async function PUT(request: NextRequest) {
  const authResult = requireAdmin(request)
  if (authResult instanceof NextResponse) {
    return authResult
  }

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

      const results = await prisma.$transaction(async (tx) => {
        let saved = 0
        for (const item of items as { type: string; key: string; en?: string | null; zh?: string | null; id_text?: string | null; url?: string | null }[]) {
          if (item.type === 'content') {
            await tx.content.upsert({
              where: { key: item.key },
              update: { en: item.en, zh: item.zh, id_text: item.id_text },
              create: { key: item.key, en: item.en, zh: item.zh, id_text: item.id_text }
            })
            saved++
          } else if (item.type === 'image') {
            await tx.image.upsert({
              where: { key: item.key },
              update: { url: item.url },
              create: { key: item.key, url: item.url }
            })
            saved++
          }
        }
        return saved
      })

      return NextResponse.json({ saved: results })
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
