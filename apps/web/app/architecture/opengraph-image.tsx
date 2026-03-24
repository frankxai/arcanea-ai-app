import { createOGImage, OG_SIZE } from '@/lib/og'

export const runtime = 'edge'
export const alt = 'Arcanea System Architecture — 6 interactive views'
export const size = OG_SIZE
export const contentType = 'image/png'

export default function OGImage() {
  return createOGImage({
    title: 'System Architecture',
    subtitle: '6 Interactive Views',
    stats: ['Layers', 'Data Flow', 'Agent Mesh', 'Security'],
    accentColor: '#7fffd4',
    glowPositions: [
      { top: '15%', right: '15%', color: 'rgba(127,255,212,0.10)', size: 420 },
      { bottom: '20%', left: '20%', color: 'rgba(120,166,255,0.08)', size: 360 },
    ],
  })
}
