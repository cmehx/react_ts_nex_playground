import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Enable standalone output for Docker
  output: 'standalone',

  // Optimize images for production
  images: {
    unoptimized: process.env.NODE_ENV === 'development',
  },

  // Add experimental features if needed
  experimental: {
    // Enable server components by default
  },
}

export default nextConfig
