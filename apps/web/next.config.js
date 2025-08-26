/** @type {import('next').NextConfig} */
// @author: fatima bashir
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: [
      'localhost',
      'mentorly-files.s3.amazonaws.com',
      'images.clerk.dev',
    ],
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  transpilePackages: ['@mentorly/database'],
}

module.exports = nextConfig

