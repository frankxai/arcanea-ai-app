"use client";

import Image from "next/image";
import { GlassCard, EmptyState } from "./world-shared-components";

// ── Types ───────────────────────────────────────────────────────────

interface LocationRow {
  id: string;
  name: string;
  description: string | null;
  region: string | null;
  significance: string | null;
  image_url: string | null;
}

interface LocationsWorld {
  slug: string;
  locations: LocationRow[];
}

// ── LocationsTab ────────────────────────────────────────────────────

export function LocationsTab({ world }: { world: LocationsWorld }) {
  if (world.locations.length === 0) {
    return (
      <EmptyState
        message="No locations defined yet."
        cta="Add Location"
        href={`/chat?mode=location&world=${world.slug}`}
      />
    );
  }

  return (
    <div className="grid sm:grid-cols-2 gap-5">
      {world.locations.map((loc) => (
        <GlassCard key={loc.id}>
          {/* Image or gradient header */}
          <div className="w-full h-24 rounded-xl mb-4 flex items-end p-3 overflow-hidden relative">
            {loc.image_url ? (
              <Image
                src={loc.image_url}
                alt={loc.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(0,188,212,0.15), rgba(9,9,11,0.9))",
                }}
              />
            )}
            <div className="relative z-10 flex items-center gap-2">
              <svg className="w-4 h-4 text-white/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
              </svg>
              {loc.region && <span className="text-[10px] uppercase tracking-widest text-white/25 font-semibold">{loc.region}</span>}
            </div>
          </div>

          <h4 className="font-display text-base font-bold text-white/80 mb-1">
            {loc.name}
          </h4>

          {loc.description && (
            <p className="text-xs text-white/40 leading-relaxed mb-3">
              {loc.description}
            </p>
          )}

          {loc.significance && (
            <p className="text-xs text-white/30 leading-relaxed italic">
              <span className="text-[#00bcd4]/40 mr-1">Significance:</span>
              {loc.significance}
            </p>
          )}
        </GlassCard>
      ))}
    </div>
  );
}
