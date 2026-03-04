import type { Metadata } from "next";
import { Outfit, Space_Mono, Inter } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const spaceMono = Space_Mono({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-space-mono",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FrankX.ai | The Architect of Intelligence",
  description: "FrankX designs autonomous systems that extend human capability. Arcanea Creative Companion and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${spaceMono.variable} ${inter.variable}`}>
      <body className="antialiased font-sans bg-void text-text-primary min-h-screen selection:bg-arcane selection:text-white">
        {children}
      </body>
    </html>
  );
}
