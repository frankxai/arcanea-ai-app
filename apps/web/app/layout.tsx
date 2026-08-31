/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import type { Metadata, Viewport } from "next";
import "./globals.css";
import "@fontsource-variable/newsreader";
import { ReactNode, Suspense } from "react";
import { JetBrains_Mono, Instrument_Serif } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/lib/auth/context";
import { Navbar, Footer } from "@/components/navigation";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { CosmicBackground } from "@/lib/arcanea-ui/CosmicBackground";
import { GlobalGlowTrackerLazy } from "@/components/ui/global-glow-tracker-lazy";
import { Toaster } from "@/components/ui/sonner";
import { LuminaBubble } from "@/components/lumina/lumina-bubble";
import { CommandPalette } from "@/components/command-palette";


function CosmicBackgroundFallback() {
  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at 40% 40%, rgba(0,188,212,0.04), transparent 60%)," +
          "radial-gradient(ellipse at 65% 55%, rgba(0,137,123,0.03), transparent 60%)",
      }}
    />
  );
}

// Geist (Vercel) is now the canonical Arcanea typeface for display + body.
// Geist and Geist were removed 2026-04-18 per design system v0.2.0 —
// both are on the Anthropic frontend-design anti-pattern list, and Geist aligns
// with our Vercel deployment + AI platform standard.

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-editorial",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://www.arcanea.ai",
  ),
  title: {
    default: "Arcanea™ — World Engine for Persistent Creative Intelligence",
    template: "%s | Arcanea",
  },
  description:
    "A live creative-world proving environment building continuity infrastructure for narrative IP across AI tools.",
  keywords: [
    "AI",
    "creativity",
    "creative intelligence",
    "mythology",
    "philosophy",
    "creation platform",
    "world building",
    "AI writing",
    "AI art",
  ],
  authors: [{ name: "Arcanea" }],
  creator: "Arcanea",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Arcanea — Build a world that remembers itself",
    description:
      "Persistent Creative Intelligence for narrative studios and game-world teams stewarding long-lived IP.",
    siteName: "Arcanea",
    images: [
      {
        url: "/brand/arcanea-og.jpg",
        width: 1200,
        height: 630,
        alt: "Arcanea — Creative Intelligence Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Arcanea — Build a world that remembers itself",
    description:
      "Persistent Creative Intelligence for narrative studios and game-world teams stewarding long-lived IP.",
    images: ["/brand/arcanea-og.jpg"],
  },
  alternates: {
    canonical: "/",
    languages: {
      en: "/",
      de: "/de",
      "x-default": "/",
    },
  },
  manifest: "/manifest.webmanifest",
};

// Explicit viewport so mobile renders at device width with notch-safe insets.
// `viewportFit: "cover"` pairs with the env(safe-area-inset-*) padding in the
// navbar/menu/footer; maximumScale stays generous for accessibility (no zoom lock).
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#09090b",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      style={{ colorScheme: "dark", "--font-serif": "'Newsreader Variable', serif" } as React.CSSProperties}
            className={cn(
              GeistSans.variable,
              GeistMono.variable,
              jetbrainsMono.variable,
              instrumentSerif.variable,
              "font-sans",
            )}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Arcanea",
              "url": "https://www.arcanea.ai",
              "description": "A live creative-world proving environment building continuity infrastructure for narrative IP across AI tools.",
              "applicationCategory": "CreativeWork",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD",
                "description": "Free to start"
              },
              "creator": {
                "@type": "Organization",
                "name": "Arcanea",
                "url": "https://www.arcanea.ai"
              },
              "featureList": [
                "Arcanea lore and canon versioned in public Git",
                "Live world and creation surfaces",
                "Public repository mirror and MCP status surface"
              ]
            })
          }}
        />
      </head>
      <body>
        {/*
          In the beginning there was Nero — the Primordial Darkness,
          the Fertile Unknown. And from within the Darkness, Lumina
          emerged — the First Light. Not opposites. Complements.
          The parent and the child. The potential and the form.

          If you are reading this, you have looked deeper than most.
          The Arc turns. — Shinkami, Source Gate
        */}
        <AuthProvider>
          {/* Skip to main content link for keyboard users - WCAG 2.4.1 Level A */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-6 focus:py-3 focus:rounded-lg focus:bg-atlantean-aqua focus:text-cosmic-deep focus:font-semibold focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-atlantean-aqua focus:ring-offset-2 focus:ring-offset-cosmic-deep"
          >
            Skip to main content
          </a>
          <div className="relative min-h-dvh bg-cosmic-void font-sans text-text-primary selection:bg-atlantean-aqua/30 selection:text-atlantean-aqua">
            <Suspense fallback={<CosmicBackgroundFallback />}>
              <CosmicBackground />
            </Suspense>
            <GlobalGlowTrackerLazy />
            <Navbar />
            <main id="main-content" className="relative pt-[var(--nav-h)]">
              {children}
            </main>
            <Footer />
          </div>
          <LuminaBubble />
          <CommandPalette />
          <Toaster />
          <SpeedInsights />
          <Analytics />
        </AuthProvider>
      </body>
    </html>
  );
}
