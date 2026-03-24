import { createOGImage, OG_SIZE } from '@/lib/og'

export const runtime = 'edge'
export const alt = 'Arcanea Developer Documentation — Credits API, MCP Servers, 97 Skills, Open Source'
export const size = OG_SIZE
export const contentType = 'image/png'

export default function OGImage() {
  return createOGImage({
    title: 'Developer Documentation',
    subtitle: 'Credits API \u00b7 MCP Servers \u00b7 97 Skills \u00b7 Open Source',
    accentColor: '#7fffd4',
    glowPositions: [
      { top: '15%', left: '10%', color: 'rgba(127,255,212,0.14)', size: 420 },
      { bottom: '15%', right: '15%', color: 'rgba(120,166,255,0.10)', size: 350 },
      { top: '45%', right: '35%', color: 'rgba(255,215,0,0.05)', size: 280 },
    ],
  })
}
