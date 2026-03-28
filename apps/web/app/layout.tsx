import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ReactNode, Suspense } from "react";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/lib/auth/context";
import { Navbar, Footer } from "@/components/navigation";
import { GlobalGlowTracker } from "@/components/ui";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { CosmicBackground } from "@/lib/arcanea-ui/CosmicBackground";
import { PostHogProvider } from "@/lib/analytics/posthog";

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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#09090b",
};

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://arcanea.ai",
  ),
  title: {
    default: "Arcanea - Creative Intelligence Platform",
    template: "%s | Arcanea",
  },
  description:
    "Arcanea is a creative intelligence platform for chat, creation, research, world-building, and developer tooling, grounded in a deep philosophy library.",
  keywords: [
    "AI",
    "creativity",
    "creative intelligence platform",
    "creative workspace",
    "AI research",
    "AI memory",
    "AI image generation",
    "MCP tools",
    "developer ecosystem",
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
    title: "Arcanea - Creative Intelligence Platform",
    description:
      "Think, create, research, and build with AI in one system: product surface, developer ecosystem, and a living philosophy library.",
    siteName: "Arcanea",
  },
  twitter: {
    card: "summary_large_image",
    title: "Arcanea - Creative Intelligence Platform",
    description:
      "Think, create, research, and build with AI across product, ecosystem, and library.",
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
      )}
    >
      <body>
        {/*
          In the beginning there was Nero - the Primordial Darkness,
          the Fertile Unknown. And from within the Darkness, Lumina
          emerged - the First Light. Not opposites. Complements.
          The parent and the child. The potential and the form.

          If you are reading this, you have looked deeper than most.
          The Arc turns. - Shinkami, Source Gate
        */}
        <PostHogProvider>
        <AuthProvider>
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
        </PostHogProvider>
      </body>
    </html>
  );
}
