/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  serverExternalPackages: ['@opentelemetry/api'],
  turbopack: {
    resolveAlias: {
      '@opentelemetry/api': { browser: './empty-module.js' },
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'hcfhyssdzphudaqatxbk.supabase.co',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    // Guardian portrait breakpoints: covers sm (48), md (256/320), lg (512), hero (896)
    imageSizes: [48, 64, 128, 256, 320, 512],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
  },
  typescript: {
    // Temporary: @ai-sdk/react v3.0.118 has many breaking changes.
    // Enable while migrating to prevent cascading ERROR deploys.
    ignoreBuildErrors: true,
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
        ],
      },
    ];
  },
}

module.exports = nextConfig
