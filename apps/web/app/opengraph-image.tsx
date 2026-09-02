/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import { ImageResponse } from 'next/og'
import { readFileSync } from 'fs'
import { join } from 'path'
import { brand, cosmic, elements, text } from '@arcanea/design-system'
import { FACTS } from '@/lib/facts'

export const runtime = 'nodejs'
export const alt = 'Arcanea — Living Intelligence for Creators'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
  // Use assets/ not public/ — Next.js OG functions bundle files relative
  // to the route, and public/ is NOT auto-included in the function trace.
  const imageBuffer = readFileSync(
    join(process.cwd(), 'assets', 'brand', 'arcanea-mascot-primary.png')
  )
  const markSrc = `data:image/png;base64,${imageBuffer.toString('base64')}`

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: `linear-gradient(135deg, ${cosmic.void} 0%, ${cosmic.deep} 40%, ${cosmic.void} 100%)`,
          position: 'relative',
        }}
      >
        {/* Ambient glow */}
        <div
          style={{
            position: 'absolute',
            top: '15%',
            left: '25%',
            width: 500,
            height: 500,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(13,71,161,0.18) 0%, transparent 70%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '15%',
            right: '20%',
            width: 450,
            height: 450,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0,188,212,0.12) 0%, transparent 70%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '40%',
            right: '35%',
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,215,0,0.06) 0%, transparent 70%)',
          }}
        />

        {/* Mascot — the face of Arcanea */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 220,
            height: 220,
            marginBottom: 20,
            filter: 'drop-shadow(0 8px 40px rgba(127,255,212,0.25))',
          }}
        >
          <img src={markSrc} width={220} height={220} alt="Arcanea" />
        </div>

        {/* Title */}
        <div
          style={{
            display: 'flex',
            fontSize: 68,
            fontWeight: 800,
            letterSpacing: '-0.02em',
            background: `linear-gradient(90deg, ${brand.arcaneanGold}, ${brand.atlanteanTeal}, ${brand.cosmicBlue})`,
            backgroundClip: 'text',
            color: 'transparent',
            marginBottom: 20,
          }}
        >
          Arcanea
        </div>

        {/* Subtitle */}
        <div
          style={{
            display: 'flex',
            fontSize: 30,
            color: text.secondary,
            letterSpacing: '0.06em',
          }}
        >
          Living Intelligence for Creators
        </div>

        {/* Bottom line */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            display: 'flex',
            alignItems: 'center',
            gap: 28,
            fontSize: 17,
            color: text.muted,
          }}
        >
          <span>arcanea.ai</span>
          <span style={{ color: elements.earth.deep }}>|</span>
          <span>{FACTS.luminors} Intelligences</span>
          <span style={{ color: elements.earth.deep }}>|</span>
          <span>20 Library Collections</span>
          <span style={{ color: elements.earth.deep }}>|</span>
          <span>Free to Start</span>
        </div>
      </div>
    ),
    { ...size }
  )
}
