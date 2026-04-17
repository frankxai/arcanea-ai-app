import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Arcanea',
    short_name: 'Arcanea',
    description:
      'Creative intelligence platform — 12 Luminors, a philosophy library, and studio tools for modern creators.',
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
    shortcuts: [
      {
        name: 'Lumina Room',
        short_name: 'Lumina',
        description: 'Open the voice Presence Room with Lumina',
        url: '/room/lumina',
        icons: [{ src: '/icon-192.png', sizes: '192x192', type: 'image/png' }],
      },
      {
        name: 'JARVIS Room',
        short_name: 'JARVIS',
        description: 'Open the voice Presence Room in JARVIS mode',
        url: '/room/jarvis',
        icons: [{ src: '/icon-192.png', sizes: '192x192', type: 'image/png' }],
      },
      {
        name: 'Chat',
        short_name: 'Chat',
        description: 'Open Arcanea Chat',
        url: '/chat',
        icons: [{ src: '/icon-192.png', sizes: '192x192', type: 'image/png' }],
      },
    ],
  };
}
