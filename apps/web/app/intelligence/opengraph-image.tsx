import { createOGImage, OG_SIZE } from '@/lib/og';

export const runtime = 'edge';
export const alt = 'The Lumina Constellation — Arcanea Intelligence';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default function OGImage() {
  return createOGImage({
    title: 'The Lumina Constellation',
    subtitle:
      '22 intelligences · one map · speak with any of them',
    accentColor: '#ffd700',
    glowPositions: [
      { top: '20%', left: '50%', color: 'rgba(255,215,0,0.18)', size: 480 },
      { bottom: '20%', left: '20%', color: 'rgba(0,188,212,0.10)', size: 360 },
      { bottom: '15%', right: '15%', color: 'rgba(167,139,250,0.10)', size: 340 },
    ],
  });
}
