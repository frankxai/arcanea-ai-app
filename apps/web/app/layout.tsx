import type { Metadata } from "next";
import "./globals.css";
import { CosmicBackground } from "@/lib/arcanea-ui";
import { ReactNode } from "react";
import { Playfair_Display, Crimson_Pro, Inter, JetBrains_Mono } from "next/font/google";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/lib/auth/context";
import { Navbar, Footer } from "@/components/navigation";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const crimsonPro = Crimson_Pro({
  subsets: ["latin"],
  variable: "--font-body",
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

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://arcanea.ai"),
  title: {
    default: "Arcanea — Living Intelligence for Creators",
    template: "%s | Arcanea"
  },
  description: "A creative intelligence platform where creators manifest their visions. Ten Guardians, a sacred Library of 34+ texts, and tools that transform imagination into reality.",
  keywords: ["AI", "creativity", "world building", "guardians", "fantasy", "social platform", "creation", "Lumina", "Nero"],
  authors: [{ name: "Arcanea" }],
  creator: "Arcanea",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Arcanea — Living Intelligence for Creators",
    description: "A creative intelligence platform. Ten Guardians, a Library of wisdom, and tools that transform imagination into reality.",
    siteName: "Arcanea",
  },
  twitter: {
    card: "summary_large_image",
    title: "Arcanea — Living Intelligence for Creators",
    description: "A creative intelligence platform. Ten Guardians, a Library of wisdom, and tools that transform imagination into reality.",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={cn(
      playfairDisplay.variable,
      crimsonPro.variable,
      inter.variable,
      jetbrainsMono.variable
    )}>
      <body>
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
            <Navbar />
            <main id="main-content" className="relative pt-16">{children}</main>
            <Footer />
          </div>
          <SpeedInsights />
          <Analytics />
        </AuthProvider>
      </body>
    </html>
  );
}
