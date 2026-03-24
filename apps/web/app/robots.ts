import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://arcanea.ai';

  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/api/health'],
        disallow: ['/private/', '/api/', '/auth/', '/dashboard/', '/settings/', '/onboarding/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
