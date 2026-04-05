"use client";

import Link from "next/link";
import { SectionLabel, GLASS_STYLE } from "./world-shared-components";

// ── Types ───────────────────────────────────────────────────────────

interface CreationsWorld {
  slug: string;
}

// ── CreationsTab ────────────────────────────────────────────────────

export function CreationsTab({ world }: { world: CreationsWorld }) {
  return (
    <div className="space-y-8">
      {/* Ghost card placeholders */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="aspect-[4/3] rounded-2xl animate-pulse"
            style={{
              background: "linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)",
              border: "1px solid rgba(255,255,255,0.04)",
            }}
          />
        ))}
      </div>

      {/* Action cards */}
      <div>
        <SectionLabel>Start Creating</SectionLabel>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <CreationActionCard
            href={`/chat?mode=story&world=${world.slug}`}
            label="Write a Story"
            description="Craft a narrative set in this world"
            icon={
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                <path d="m15 5 4 4" />
              </svg>
            }
          />
          <CreationActionCard
            href={`/chat?mode=imagine&world=${world.slug}`}
            label="Generate an Image"
            description="Visualize scenes, characters, or places"
            icon={
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                <circle cx="9" cy="9" r="2" />
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
              </svg>
            }
          />
          <CreationActionCard
            href={`/chat?mode=music&world=${world.slug}`}
            label="Compose Music"
            description="Create a soundtrack for your world"
            icon={
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M9 18V5l12-2v13" />
                <circle cx="6" cy="18" r="3" />
                <circle cx="18" cy="16" r="3" />
              </svg>
            }
          />
        </div>
      </div>

      <p className="text-center text-white/25 text-xs">
        Creations will appear here as you build inside this world.
      </p>
    </div>
  );
}

function CreationActionCard({ href, label, description, icon }: { href: string; label: string; description: string; icon: React.ReactNode }) {
  return (
    <Link href={href} className="group flex flex-col items-center text-center gap-3 p-6 rounded-2xl transition-all hover:scale-[1.02]" style={GLASS_STYLE}>
      <div className="w-12 h-12 rounded-xl bg-[#00bcd4]/10 border border-[#00bcd4]/20 flex items-center justify-center text-[#00bcd4]/60 group-hover:text-[#00bcd4] group-hover:bg-[#00bcd4]/15 transition-all">
        {icon}
      </div>
      <div>
        <p className="text-sm font-semibold text-white/70 group-hover:text-white/90 transition-colors mb-1">{label}</p>
        <p className="text-xs text-white/30 leading-relaxed">{description}</p>
      </div>
    </Link>
  );
}
