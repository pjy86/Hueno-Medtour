import type { NextConfig } from 'next'
import createnextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createnextIntlPlugin('./src/i18n/request.ts')

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com'
      },
      {
        protocol: 'https',
        hostname: 'placeholder.com'
      }
    ]
  }
}

export default withNextIntl(nextConfig)
