import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0a0e27, #1a1040)',
          borderRadius: 40,
          fontSize: 90,
        }}
      >
        &#10024;
      </div>
    ),
    { ...size }
  )
}
