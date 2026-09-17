import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://agenthub.arcanea.ai"),
  title: {
    default: "Arcanea AgentHub — Sovereign Agent Orchestration",
    template: "%s | Arcanea AgentHub",
  },
  description: "Deploy, monitor, and orchestrate autonomous AI agent workflows and tool integrations.",
  openGraph: {
    title: "Arcanea AgentHub — Sovereign Agent Orchestration",
    description: "Deploy, monitor, and orchestrate autonomous AI agent workflows.",
    url: "https://agenthub.arcanea.ai",
    siteName: "Arcanea AgentHub",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Arcanea AgentHub — Sovereign Agent Orchestration",
    description: "Deploy, monitor, and orchestrate autonomous AI agent workflows.",
  },
  alternates: {
    canonical: "https://agenthub.arcanea.ai",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
