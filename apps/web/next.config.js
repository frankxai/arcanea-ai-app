/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable Turbopack to avoid WSL2 I/O issues
  experimental: {
    // turbo key is invalid in recent Next.js versions if experimental
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
}

module.exports = nextConfig
