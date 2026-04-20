import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const [contents, images] = await Promise.all([
      prisma.content.findMany({
        orderBy: { key: 'asc' }
      }),
      prisma.image.findMany({
        orderBy: { key: 'asc' }
      })
    ])

    return NextResponse.json(
      { contents, images },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
        }
      }
    )
  } catch (error) {
    console.error('CMS GET Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
