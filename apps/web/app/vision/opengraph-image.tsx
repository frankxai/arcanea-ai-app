import { createOGImage, OG_SIZE } from '@/lib/og'

export const runtime = 'edge'
export const alt = 'Arcanea - Creator Operating System'
export const size = OG_SIZE
export const contentType = 'image/png'

export default function OGImage() {
  return createOGImage({
    title: 'Build Your Universe',
    subtitle: 'Chat, research, memory, image creation, and library context in one workspace',
    accentColor: '#ffd700',
    glowPositions: [
      { top: '20%', left: '25%', color: 'rgba(255,215,0,0.10)', size: 450 },
      { bottom: '15%', right: '20%', color: 'rgba(127,255,212,0.08)', size: 380 },
    ],
  })
}
