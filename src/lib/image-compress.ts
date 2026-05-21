import sharp from 'sharp'

const WEBP_QUALITY = 80

const RASTER_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
  'image/tiff'
])

export function canCompressToWebp(contentType: string): boolean {
  return RASTER_IMAGE_TYPES.has(contentType.toLowerCase())
}

export async function compressImageToWebp(input: Buffer): Promise<Buffer> {
  return sharp(input, { animated: false })
    .rotate()
    .webp({ quality: WEBP_QUALITY, effort: 4 })
    .toBuffer()
}
