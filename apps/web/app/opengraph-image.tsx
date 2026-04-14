import { ImageResponse } from 'next/og'
import { readFileSync } from 'fs'
import { join } from 'path'

export const runtime = 'nodejs'
export const alt = 'Arcanea — Living Intelligence for Creators'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
  // readFileSync works in Node.js runtime (not edge). Public dir is served
  // from process.cwd()/public at build + runtime on Vercel.
  const imageBuffer = readFileSync(
    join(process.cwd(), 'public', 'images', 'mascot', 'arcanea-primary.png')
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
          background: 'linear-gradient(135deg, #0a0e27 0%, #1a1040 40%, #0a0e27 100%)',
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
            background: 'linear-gradient(90deg, #ffd700, #00bcd4, #0d47a1)',
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
            color: '#b0b0d0',
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
            color: '#6a6a8a',
          }}
        >
          <span>arcanea.ai</span>
          <span style={{ color: '#3a3a5a' }}>|</span>
          <span>16 Intelligences</span>
          <span style={{ color: '#3a3a5a' }}>|</span>
          <span>34+ Original Texts</span>
          <span style={{ color: '#3a3a5a' }}>|</span>
          <span>Free to Start</span>
        </div>
      </div>
