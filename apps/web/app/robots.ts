import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://arcanea.ai';

  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/api/health'],
        disallow: [
          '/private/',
          '/api/',
          '/_next/',
          '/auth/',
          '/dashboard/',
          '/settings/',
          '/onboarding/',
          '/command/',
          '/command-center/',
          '/sanctum/',
          '/profile/edit/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
