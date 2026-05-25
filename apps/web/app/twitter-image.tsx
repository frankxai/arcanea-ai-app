/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Arcanea — Build Your Universe'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function TwitterImage() {
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
          background: 'linear-gradient(135deg, var(--arc-cosmic-void) 0%, var(--arc-cosmic-void) 40%, var(--arc-cosmic-void) 100%)',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '25%',
            left: '35%',
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(13,71,161,0.12) 0%, transparent 70%)',
          }}
        />
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 72,
            height: 72,
            borderRadius: 18,
            background: 'linear-gradient(135deg, rgba(255,215,0,0.2), rgba(0,188,212,0.2))',
            border: '1px solid rgba(255,215,0,0.3)',
            marginBottom: 28,
            fontSize: 36,
          }}
        >
          &#10024;
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 56,
            fontWeight: 800,
            letterSpacing: '-0.02em',
            background: 'linear-gradient(90deg, var(--arc-brand-arcanean-gold), var(--arc-brand-atlantean-teal), var(--arc-brand-cosmic-blue))',
            backgroundClip: 'text',
            color: 'transparent',
            marginBottom: 14,
          }}
        >
          Arcanea
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 24,
            color: 'var(--arc-void)',
            letterSpacing: '0.05em',
          }}
        >
          Build Your Universe
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: 36,
            display: 'flex',
            fontSize: 14,
            color: 'var(--arc-earth)',
          }}
        >
          arcanea.ai
        </div>
      </div>
    ),
    { ...size }
  )
}
