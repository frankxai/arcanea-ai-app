import { createOGImage, OG_SIZE } from '@/lib/og'

export const runtime = 'edge'
export const alt = 'Meet the Crew — Seven perspectives on one journey'
export const size = OG_SIZE
export const contentType = 'image/png'

export default function OGImage() {
  return createOGImage({
    title: 'Meet the Crew',
    subtitle: 'Seven perspectives on one journey',
    accentColor: '#9370DB',
  })
}
