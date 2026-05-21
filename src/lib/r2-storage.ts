import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'

interface R2Config {
  accountId: string
  accessKeyId: string
  secretAccessKey: string
  bucketName: string
  publicUrl: string
}

function getR2Config(): R2Config | null {
  const accountId = process.env.R2_ACCOUNT_ID
  const accessKeyId = process.env.R2_ACCESS_KEY_ID
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY
  const bucketName = process.env.R2_BUCKET_NAME
  const publicUrl = process.env.R2_PUBLIC_URL

  if (!accountId || !accessKeyId || !secretAccessKey || !bucketName || !publicUrl) {
    return null
  }

  return { accountId, accessKeyId, secretAccessKey, bucketName, publicUrl }
}

export function isR2Configured(): boolean {
  return getR2Config() !== null
}

let client: S3Client | null = null

function getR2Client(config: R2Config): S3Client {
  if (!client) {
    client = new S3Client({
      region: 'auto',
      endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey
      }
    })
  }
  return client
}

function sanitizePathSegment(value: string): string {
  return value.replace(/[^a-zA-Z0-9._-]/g, '_')
}

export function buildR2ObjectKey(
  cmsKey: string,
  originalName: string,
  options?: { extension?: string }
): string {
  const ext =
    options?.extension ??
    (originalName.includes('.')
      ? originalName.slice(originalName.lastIndexOf('.')).toLowerCase()
      : '')
  const safeKey = sanitizePathSegment(cmsKey)
  const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
  return `cms/${safeKey}/${uniqueSuffix}${ext}`
}

export async function uploadToR2(
  buffer: Buffer,
  objectKey: string,
  contentType: string
): Promise<string> {
  const config = getR2Config()
  if (!config) {
    throw new Error('R2 is not configured')
  }

  await getR2Client(config).send(
    new PutObjectCommand({
      Bucket: config.bucketName,
      Key: objectKey,
      Body: buffer,
      ContentType: contentType
    })
  )

  const base = config.publicUrl.replace(/\/$/, '')
  return `${base}/${objectKey}`
}
