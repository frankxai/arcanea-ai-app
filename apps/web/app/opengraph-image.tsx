import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Arcanea — Living Intelligence for Creators'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OGImage() {
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
        {/* Ambient glow */}
        <div
          style={{
            position: 'absolute',
            top: '20%',
            left: '30%',
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '20%',
            right: '25%',
            width: 350,
            height: 350,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(127,255,212,0.1) 0%, transparent 70%)',
          }}
        />

        {/* Brand Mark — Portal A */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 100,
            height: 100,
            borderRadius: 24,
            background: 'linear-gradient(135deg, rgba(127,255,212,0.12), rgba(139,92,246,0.12))',
            border: '1px solid rgba(127,255,212,0.2)',
            marginBottom: 40,
          }}
        >
          <svg
            width="56"
            height="56"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="og" x1="4" y1="4" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#7fffd4" />
                <stop offset="48%" stopColor="#a78bfa" />
                <stop offset="100%" stopColor="#9b59ff" />
              </linearGradient>
            </defs>
            <path
              fillRule="evenodd"
              d="M 4 37 L 4 18 Q 4 4 20 4 Q 36 4 36 18 L 36 37 L 30 37 L 30 19 Q 30 10 20 10 Q 10 10 10 19 L 10 37 Z"
              fill="url(#og)"
            />
            <rect x="4" y="24" width="32" height="4" rx="2" fill="url(#og)" />
            <circle cx="20" cy="4" r="2.5" fill="#ffffff" opacity="0.75" />
          </svg>
        </div>

        {/* Title */}
        <div
          style={{
            display: 'flex',
            fontSize: 64,
            fontWeight: 800,
            letterSpacing: '-0.02em',
            background: 'linear-gradient(90deg, #ffd700, #7fffd4, #8b5cf6)',
            backgroundClip: 'text',
            color: 'transparent',
            marginBottom: 16,
          }}
        >
          Arcanea
        </div>

        {/* Subtitle */}
        <div
          style={{
            display: 'flex',
            fontSize: 28,
            color: '#b0b0d0',
            letterSpacing: '0.05em',
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
            gap: 24,
            fontSize: 16,
            color: '#5a5a7a',
          }}
        >
          <span>arcanea.ai</span>
          <span style={{ color: '#3a3a5a' }}>|</span>
          <span>10 Intelligences</span>
          <span style={{ color: '#3a3a5a' }}>|</span>
          <span>34+ Original Texts</span>
          <span style={{ color: '#3a3a5a' }}>|</span>
          <span>Free to Start</span>
        </div>
      </div>
    ),
    { ...size }
  )
}
