/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.arcanea.ai';

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
          '/profile/edit/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
