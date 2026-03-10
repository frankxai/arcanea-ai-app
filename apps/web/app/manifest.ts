import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Arcanea',
    short_name: 'Arcanea',
    description:
      'Creative intelligence platform — 16 Luminors, a philosophy library, and studio tools for modern creators.',
    start_url: '/',
    display: 'standalone',
    background_color: '#09090b',
    theme_color: '#00bcd4',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
