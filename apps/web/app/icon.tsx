import { ImageResponse } from 'next/og'
import { readFileSync } from 'fs'
import { join } from 'path'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  const mark = readFileSync(join(process.cwd(), 'assets/brand/arcanea-mark.jpg'))
  const base64 = Buffer.from(mark).toString('base64')

  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#090b14',
          borderRadius: 7,
          border: '1px solid rgba(0,188,212,0.25)',
        }}
      >
        <img src={`data:image/jpeg;base64,${base64}`} width={30} height={30} style={{ borderRadius: 6 }} />
      </div>
    ),
    { ...size }
  )
}
