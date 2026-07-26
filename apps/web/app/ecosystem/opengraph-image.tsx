/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import { createOGImage, OG_SIZE } from '@/lib/og'
import { brand } from '@arcanea/design-system'

export const runtime = 'edge'
export const alt = 'Arcanea Ecosystem — A constellation of intelligence'
export const size = OG_SIZE
export const contentType = 'image/png'

export default function OGImage() {
  return createOGImage({
    title: 'Arcanea Ecosystem',
    subtitle: 'A Constellation of Intelligence',
    stats: ['Agents', 'Skills', 'Worlds', 'Protocols'],
    accentColor: brand.cosmicBlue,
    glowPositions: [
      { top: '10%', right: '20%', color: 'rgba(120,166,255,0.12)', size: 400 },
      { bottom: '20%', left: '15%', color: 'rgba(127,255,212,0.08)', size: 350 },
      { top: '50%', left: '45%', color: 'rgba(255,215,0,0.05)', size: 250 },
    ],
  })
}
