/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
const path = require('node:path')
const createNextIntlPlugin = require('next-intl/plugin')

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  serverExternalPackages: ['@opentelemetry/api'],
  // Workspace packages with subpath exports — let Next.js/Turbopack compile from
  // source rather than relying on prebuilt dist/. Avoids `Module not found` in
  // CI when the workspace dep hasn't been built before `next build` runs.
  transpilePackages: ['@arcanea/publishing-house', '@arcanea/world-engine', '@starlight/multilingual'],
  // Strip console.log/warn in production builds — keeps bundles lean & avoids
  // leaking debug info. console.error is preserved for runtime diagnostics.
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
      ? { exclude: ['error'] }
      : false,
  },
  turbopack: {
    root: path.resolve(__dirname, '../..'),
    resolveAlias: {
      '@opentelemetry/api': { browser: './empty-module.js' },
    },
  },
  experimental: {
    // Tree-shake barrel exports from large packages — reduces client JS significantly
    optimizePackageImports: [
      '@phosphor-icons/react',
      '@radix-ui/react-accordion',
      '@radix-ui/react-alert-dialog',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-popover',
      '@radix-ui/react-select',
      '@radix-ui/react-tabs',
      '@radix-ui/react-toast',
      '@radix-ui/react-tooltip',
      'framer-motion',
      'react-syntax-highlighter',
    ],
    // Allow build to continue when individual pages crash during prerendering.
    // Several pages trigger workStore invariant errors due to require() in
    // transitive dependencies. They serve fine at runtime with force-dynamic.
    prerenderEarlyExit: false,
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
    ignoreBuildErrors: true,
  },
  // eslint config moved to eslint.config.js (Next.js 16+)
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
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(self), geolocation=(), interest-cohort=()' },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com https://vercel.live",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https://*.supabase.co https://avatars.githubusercontent.com https://lh3.googleusercontent.com",
              "font-src 'self' data:",
              "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://generativelanguage.googleapis.com https://openrouter.ai https://api.anthropic.com https://va.vercel-scripts.com https://vercel.live",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
          },
        ],
      },
    ];
  },
}

module.exports = withNextIntl(nextConfig)
