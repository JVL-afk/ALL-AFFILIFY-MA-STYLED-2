import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },

  // Remove experimental.turbo as it's not needed in Next.js 16
  // Turbopack is now the default and doesn't need configuration

  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  env: {
    GOOGLE_AI_API_KEY: process.env.GOOGLE_AI_API_KEY,
    MONGODB_URI: process.env.MONGODB_URI,
  },
}

export default nextConfig
