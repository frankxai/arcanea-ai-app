import { createOGImage, OG_SIZE } from '@/lib/og'

export const runtime = 'edge'
export const alt = 'Arcanea Community — Join the Creative Civilization'
export const size = OG_SIZE
export const contentType = 'image/png'

export default function OGImage() {
  return createOGImage({
    title: 'Join the Creative Civilization',
    subtitle: '27 repos \u00b7 35 packages \u00b7 54 skills \u00b7 200K+ words',
    accentColor: '#ffd700',
    glowPositions: [
      { top: '15%', left: '20%', color: 'rgba(255,215,0,0.12)', size: 400 },
      { bottom: '15%', right: '15%', color: 'rgba(255,215,0,0.08)', size: 350 },
      { top: '40%', right: '30%', color: 'rgba(127,255,212,0.06)', size: 300 },
    ],
  })
}
