import { ImageResponse } from 'next/og'
import { readFileSync } from 'fs'
import { join } from 'path'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  const svgContent = readFileSync(join(process.cwd(), 'public/brand/arcanea-logo.svg'), 'utf-8')
  const base64 = Buffer.from(svgContent).toString('base64')

  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0a0e27',
          borderRadius: 40,
        }}
      >
        <img src={`data:image/svg+xml;base64,${base64}`} width={140} height={140} />
      </div>
    ),
    { ...size }
  )
}
