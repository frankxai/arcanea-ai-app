import { ImageResponse } from 'next/og'
import { readFileSync } from 'fs'
import { join } from 'path'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  const imageBuffer = readFileSync(join(process.cwd(), 'assets/brand/arcanea-mark.jpg'))
  const base64 = imageBuffer.toString('base64')

  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          display: 'flex',
          borderRadius: 6,
          overflow: 'hidden',
        }}
      >
        <img src={`data:image/jpeg;base64,${base64}`} width={32} height={32} />
      </div>
    ),
    { ...size }
  )
}
