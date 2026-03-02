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
          background: 'linear-gradient(135deg, #0a0e27 0%, #1a1040 100%)',
          borderRadius: 40,
        }}
      >
        <svg
          width="110"
          height="110"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="ai" x1="4" y1="4" x2="36" y2="36" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#7fffd4" />
              <stop offset="48%" stopColor="#a78bfa" />
              <stop offset="100%" stopColor="#9b59ff" />
            </linearGradient>
          </defs>
          <path
            fillRule="evenodd"
            d="M 4 37 L 4 18 Q 4 4 20 4 Q 36 4 36 18 L 36 37 L 30 37 L 30 19 Q 30 10 20 10 Q 10 10 10 19 L 10 37 Z"
            fill="url(#ai)"
          />
          <rect x="4" y="24" width="32" height="4" rx="2" fill="url(#ai)" />
          <circle cx="20" cy="4" r="2.5" fill="#ffffff" opacity="0.75" />
        </svg>
      </div>
    ),
    { ...size }
  )
}
