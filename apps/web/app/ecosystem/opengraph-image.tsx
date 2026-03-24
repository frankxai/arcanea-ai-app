import { createOGImage, OG_SIZE } from '@/lib/og'

export const runtime = 'edge'
export const alt = 'Arcanea Ecosystem — A constellation of intelligence'
export const size = OG_SIZE
export const contentType = 'image/png'

export default function OGImage() {
  return createOGImage({
    title: 'Arcanea Ecosystem',
    subtitle: 'A Constellation of Intelligence',
    stats: ['Agents', 'Skills', 'Worlds', 'Protocols'],
    accentColor: '#78a6ff',
    glowPositions: [
      { top: '10%', right: '20%', color: 'rgba(120,166,255,0.12)', size: 400 },
      { bottom: '20%', left: '15%', color: 'rgba(127,255,212,0.08)', size: 350 },
      { top: '50%', left: '45%', color: 'rgba(255,215,0,0.05)', size: 250 },
    ],
  })
}
