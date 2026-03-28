import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Arcanea',
    short_name: 'Arcanea',
    description:
      'Creator operating system for AI-native work: chat, research, memory, image creation, and a living library in one workspace.',
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
