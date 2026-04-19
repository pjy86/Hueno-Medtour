import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, key, en, zh, id_text, url } = body

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
