"use client";

import { ConveningFlow } from "@/components/council/ConveningFlow";

export default function ConveningPage() {
  return (
    <div className="relative min-h-screen">
      {/* Full-screen cosmic background */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-0 bg-[hsl(240,6%,4%)]" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 40%, rgba(0,188,212,0.07), transparent 65%), radial-gradient(ellipse at 20% 80%, rgba(13,71,161,0.09), transparent 60%)",
          }}
        />
        {/* Subtle noise grain */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
          }}
        />
      </div>

      <ConveningFlow />
    </div>
  );
}
