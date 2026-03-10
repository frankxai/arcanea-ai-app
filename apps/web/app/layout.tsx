import type { Metadata } from "next";
import "./globals.css";
import { CosmicBackground } from "@/lib/arcanea-ui";
import { ReactNode } from "react";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/lib/auth/context";
import { Navbar, Footer } from "@/components/navigation";
import { GlobalGlowTracker } from "@/components/ui";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Inter also serves as body font (replaces Crimson Pro)
const interBody = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://arcanea.ai",
  ),
  title: {
    default: "Arcanea — Creative Intelligence Platform",
    template: "%s | Arcanea",
  },
  description:
    "A creative intelligence platform with AI specialists, an original philosophy library, and studio workflows for modern creators.",
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
    title: "Arcanea — Creative Intelligence Platform",
    description:
      "AI specialists, a philosophy library, and creation studio in one platform.",
    siteName: "Arcanea",
  },
  twitter: {
    card: "summary_large_image",
    title: "Arcanea — Creative Intelligence Platform",
    description:
      "AI specialists, a philosophy library, and creation studio in one platform.",
  },
  alternates: {
    canonical: "/",
  },
  manifest: "/site.webmanifest",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: "Arcanea",
      url: "https://arcanea.ai",
      description:
        "A creative intelligence platform with AI specialists, a philosophy library, and studio workflows for modern creators.",
      publisher: { "@type": "Organization", name: "Arcanea" },
      potentialAction: {
        "@type": "SearchAction",
        target: "https://arcanea.ai/discover?q={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "Organization",
      name: "Arcanea",
      url: "https://arcanea.ai",
      sameAs: [],
    },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      style={{ colorScheme: "dark" }}
      className={cn(
        spaceGrotesk.variable,
        inter.variable,
        interBody.variable,
        jetbrainsMono.variable,
      )}
    >
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
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
            <CosmicBackground />
            <GlobalGlowTracker />
            <Navbar />
            <main id="main-content" className="relative pt-16">
              {children}
            </main>
            <Footer />
          </div>
          <SpeedInsights />
          <Analytics />
        </AuthProvider>
      </body>
    </html>
  );
}
