import { createOGImage, OG_SIZE } from '@/lib/og'

export const runtime = 'edge'
export const alt = 'Arcanea Research — 27 repos, 35 packages, 54 skills'
export const size = OG_SIZE
export const contentType = 'image/png'

export default function OGImage() {
  return createOGImage({
    title: 'Arcanea Research',
    subtitle: '27 repos \u00b7 35 packages \u00b7 54 skills',
    stats: ['Open Source', 'TypeScript', 'Multi-Agent'],
    accentColor: '#7fffd4',
    glowPositions: [
      { top: '15%', left: '10%', color: 'rgba(127,255,212,0.10)', size: 450 },
      { bottom: '15%', right: '15%', color: 'rgba(120,166,255,0.08)', size: 380 },
    ],
  })
}
