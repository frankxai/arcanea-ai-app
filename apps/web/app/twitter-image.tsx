import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Arcanea — Living Intelligence for Creators'
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
          background: 'linear-gradient(135deg, #0a0e27 0%, #1a1040 40%, #0a0e27 100%)',
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
            background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)',
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
            background: 'linear-gradient(135deg, rgba(255,215,0,0.2), rgba(127,255,212,0.2))',
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
            background: 'linear-gradient(90deg, #ffd700, #7fffd4, #8b5cf6)',
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
            color: '#b0b0d0',
            letterSpacing: '0.05em',
          }}
        >
          Living Intelligence for Creators
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: 36,
            display: 'flex',
            fontSize: 14,
            color: '#5a5a7a',
          }}
        >
          arcanea.ai
        </div>
      </div>
    ),
    { ...size }
  )
}
