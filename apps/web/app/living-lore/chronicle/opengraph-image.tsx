import { createOGImage, OG_SIZE } from '@/lib/og'

export const runtime = 'edge'
export const alt = 'The Chronicle — Ten Acts through the Ten Gates'
export const size = OG_SIZE
export const contentType = 'image/png'

export default function OGImage() {
  return createOGImage({
    title: 'The Chronicle',
    subtitle: 'Ten Acts through the Ten Gates',
    accentColor: '#7fffd4',
  })
}
