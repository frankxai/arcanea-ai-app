import type { Metadata, Viewport } from 'next'
import { Cinzel, Crimson_Pro, Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-cinzel',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800', '900'],
})

const crimsonPro = Crimson_Pro({
  subsets: ['latin'],
  variable: '--font-crimson-pro',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

export const viewport: Viewport = {
  themeColor: '#0b0e14',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export const metadata: Metadata = {
  metadataBase: new URL('https://arcanea.ai'),
  title: {
    default: 'Arcanea.ai — Where AI Becomes Creative Intelligence',
    template: '%s | Arcanea.ai'
  },
  description: 'The premium AI creation platform. Multi-LLM superagent, multi-modal generation, and Guardian AI companions unified in one intelligent spatial experience.',
  keywords: ['AI worldbuilding', 'spatial computing', '3D creation', 'fantasy worlds', 'creative AI', 'Guardian AI', 'immersive storytelling', 'AI platform', 'creative intelligence'],
  authors: [{ name: 'Arcanea' }],
  creator: 'Arcanea',
  openGraph: {
    title: 'Arcanea.ai — Where AI Becomes Creative Intelligence',
    description: 'The premium AI creation platform with Guardian AI companions in immersive 3D spaces',
    url: 'https://arcanea.ai',
    siteName: 'Arcanea.ai',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Arcanea — Premium AI Creative Intelligence',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Arcanea.ai — Where AI Becomes Creative Intelligence',
    description: 'The premium AI creation platform with Guardian AI companions',
    images: ['/og-image.jpg'],
    creator: '@arcanea_ai',
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`dark ${cinzel.variable} ${crimsonPro.variable} ${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="font-body antialiased">
        {children}
      </body>
    </html>
  )
}
