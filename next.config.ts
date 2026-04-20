import type { NextConfig } from 'next'
import createnextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createnextIntlPlugin('./src/i18n/request.ts')

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com'
      },
      {
        protocol: 'https',
        hostname: 'placeholder.com'
      },
      {
        protocol: 'https',
        hostname: 'aikang-medtour.onrender.com'
      },
      {
        protocol: 'https',
        hostname: '**.render.com'
      },
      {
        protocol: 'https',
        hostname: '**.aliyuncs.com'
      }
    ]
  }
}

export default withNextIntl(nextConfig)
