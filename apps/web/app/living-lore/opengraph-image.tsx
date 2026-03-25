import { createOGImage, OG_SIZE } from '@/lib/og'

export const runtime = 'edge'
export const alt = 'The Living Lore — Seven beings. Ten Gates. One journey.'
export const size = OG_SIZE
export const contentType = 'image/png'

export default function OGImage() {
  return createOGImage({
    title: 'The Living Lore',
    subtitle: 'Seven beings. Ten Gates. One journey.',
    accentColor: '#7fffd4',
    glowPositions: [
      { top: '15%', left: '10%', color: 'rgba(127,255,212,0.14)', size: 420 },
      { bottom: '15%', right: '15%', color: 'rgba(147,112,219,0.10)', size: 350 },
    ],
  })
}
