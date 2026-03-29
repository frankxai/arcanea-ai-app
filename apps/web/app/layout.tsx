import type { Metadata } from "next";
import "./globals.css";
import { ReactNode, Suspense } from "react";
import dynamic from "next/dynamic";
import { Space_Grotesk, Inter, JetBrains_Mono, Newsreader } from "next/font/google";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/lib/auth/context";
import { Navbar, Footer } from "@/components/navigation";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { CosmicBackground } from "@/lib/arcanea-ui/CosmicBackground";

// GlobalGlowTracker follows the mouse with framer-motion springs — purely
// cosmetic and not needed for first paint. Lazy-load to trim initial JS.
const GlobalGlowTracker = dynamic(
  () => import("@/components/ui/global-glow-tracker").then((m) => m.GlobalGlowTracker),
  { ssr: false },
);

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


const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-serif",
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
    "A creative multiverse: chat with AI, build fantasy worlds, share what you make, and turn imagination into products. 190K+ words of creative philosophy. Free to start.",
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
      "Creative AI partners, a philosophy library, and creation studio in one platform.",
    siteName: "Arcanea",
  },
  twitter: {
    card: "summary_large_image",
    title: "Arcanea — Creative Intelligence Platform",
    description:
      "Creative AI partners, a philosophy library, and creation studio in one platform.",
  },
  alternates: {
    canonical: "/",
  },
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      style={{ colorScheme: "dark" }}
      className={cn(
        spaceGrotesk.variable,
        inter.variable,
        jetbrainsMono.variable,
        newsreader.variable,
      )}
    >
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
