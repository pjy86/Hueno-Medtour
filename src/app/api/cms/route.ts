import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAdmin } from '@/lib/admin-auth'

async function retry<T>(fn: () => Promise<T>, retries = 2, delayMs = 3000): Promise<T> {
  try {
    return await fn()
  } catch (error) {
    if (retries <= 0) throw error
    console.warn(`Retrying after error, ${retries} attempts left:`, error)
    await new Promise(resolve => setTimeout(resolve, delayMs))
    return retry(fn, retries - 1, delayMs)
  }
}

export async function GET(request: NextRequest) {
  const authResult = requireAdmin(request)
  if (authResult instanceof NextResponse) {
    return authResult
  }

  try {
    const [contents, images] = await retry(() =>
      Promise.all([
        prisma.content.findMany({
          orderBy: { key: 'asc' }
        }),
        prisma.image.findMany({
          orderBy: { key: 'asc' }
        })
      ])
    )

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
