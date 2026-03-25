import { createOGImage, OG_SIZE } from '@/lib/og'

export const runtime = 'edge'
export const alt = 'Your Journey — Gates. Bonds. Progress.'
export const size = OG_SIZE
export const contentType = 'image/png'

export default function OGImage() {
  return createOGImage({
    title: 'Your Journey',
    subtitle: 'Gates. Bonds. Progress.',
    accentColor: '#ffd700',
  })
}
