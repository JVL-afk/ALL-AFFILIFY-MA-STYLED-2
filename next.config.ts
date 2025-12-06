import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Remove eslint configuration (no longer supported in next.config)
  // eslint: {
  //   ignoreDuringBuilds: true,
  // },
  
  typescript: {
    // Optionally ignore build errors during development
    ignoreBuildErrors: false,
  },

  // Turbopack configuration for Next.js 16+
  experimental: {
    // Enable Turbopack in development
    turbo: {
      // Add any Turbopack-specific configuration here
    },
  },

  // Image optimization
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  // Environment variables
  env: {
    GOOGLE_AI_API_KEY: process.env.GOOGLE_AI_API_KEY,
    MONGODB_URI: process.env.MONGODB_URI,
  },
}

export default nextConfig

