import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { canCompressToWebp, compressImageToWebp } from '@/lib/image-compress'
import { buildR2ObjectKey, isR2Configured, uploadToR2 } from '@/lib/r2-storage'

const MAX_FILE_SIZE = 10 * 1024 * 1024

export async function POST(request: NextRequest) {
  const authResult = requireAdmin(request)
  if (authResult instanceof NextResponse) {
    return authResult
  }

  if (!isR2Configured()) {
    return NextResponse.json(
      {
        error:
          'Cloudflare R2 is not configured. Set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME, and R2_PUBLIC_URL.'
      },
      { status: 503 }
    )
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file')
    const cmsKey = formData.get('key')

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (typeof cmsKey !== 'string' || !cmsKey.trim()) {
      return NextResponse.json({ error: 'Missing CMS image key' }, { status: 400 })
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 })
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File size exceeds 10MB limit' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const inputBuffer = Buffer.from(bytes)
    const trimmedKey = cmsKey.trim()

    let uploadBuffer = inputBuffer
    let contentType = file.type
    let objectKey: string

    if (canCompressToWebp(file.type)) {
      const webpBuffer = await compressImageToWebp(inputBuffer)
      uploadBuffer = Buffer.from(webpBuffer)
      contentType = 'image/webp'
      objectKey = buildR2ObjectKey(trimmedKey, file.name, { extension: '.webp' })
    } else {
      objectKey = buildR2ObjectKey(trimmedKey, file.name)
    }

    const url = await uploadToR2(uploadBuffer, objectKey, contentType)

    return NextResponse.json({
      url,
      key: objectKey,
      compressed: canCompressToWebp(file.type),
      originalSize: inputBuffer.length,
      uploadedSize: uploadBuffer.length
    })
  } catch (error) {
    console.error('R2 upload error:', error)
    return NextResponse.json({ error: 'Failed to upload file to Cloudflare R2' }, { status: 500 })
  }
}
