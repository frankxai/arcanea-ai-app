import { ImageResponse } from 'next/og'
import { readFileSync } from 'fs'
import { join } from 'path'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  const imageBuffer = readFileSync(join(process.cwd(), 'assets/brand/arcanea-mark.jpg'))
  const base64 = imageBuffer.toString('base64')

  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          display: 'flex',
          borderRadius: 40,
          overflow: 'hidden',
        }}
      >
        <img src={`data:image/jpeg;base64,${base64}`} width={180} height={180} />
      </div>
    ),
    { ...size }
  )
}
