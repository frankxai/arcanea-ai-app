/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
"use client";

import { m } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

// ---------------------------------------------------------------------------
// IdentityCard — Creator profile with linked external identities.
// Like Linktree meets Agent Card. Shows the creator's Arcanea world +
// their Custom GPTs, Suno profile, websites, agents, social channels.
// ---------------------------------------------------------------------------

export interface LinkedIdentity {
  platform: string;
  label: string;
  url?: string;
  glyph: string;
  color: string;
  badge?: string;
}

export interface IdentityCardProps {
  creator: {
    username: string;
    displayName: string;
    tagline: string;
    avatar?: string;
    bio: string;
    gate?: string;
    rank?: string;
    worldsBuilt?: number;
    followers?: number;
    verified?: boolean;
  };
  identities: LinkedIdentity[];
  onChainAddress?: string;
  ensName?: string;
}

export function IdentityCard({
  creator,
  identities,
  onChainAddress,
  ensName,
}: IdentityCardProps) {
  return (
    <div className="relative rounded-3xl overflow-hidden bg-white/[0.025] border border-white/[0.06] backdrop-blur-sm">
      {/* Aurora backdrop */}
      <m.div
        className="absolute inset-x-0 top-0 h-48 pointer-events-none"
        animate={{
          background: [
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(127,255,212,0.16), transparent 70%)",
            "radial-gradient(ellipse 80% 60% at 30% 0%, rgba(0,188,212,0.14), transparent 70%)",
            "radial-gradient(ellipse 80% 60% at 70% 0%, rgba(255,215,0,0.12), transparent 70%)",
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(127,255,212,0.16), transparent 70%)",
          ],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative p-8 md:p-10">
        {/* Header row */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="relative">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-[var(--arc-brand-atlantean-teal)] via-[var(--arc-brand-atlantean-teal)] to-[var(--arc-brand-arcanean-gold)] opacity-40 blur-sm" />
              <div className="relative w-20 h-20 rounded-full overflow-hidden ring-2 ring-black bg-[var(--arc-cosmic-void)]">
                {creator.avatar ? (
                  <Image
                    src={creator.avatar}
                    alt={creator.displayName}
                    width={80}
                    height={80}
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[var(--arc-brand-cosmic-blue)]/40 to-[var(--arc-brand-cosmic-blue)]/40 text-2xl font-display font-bold text-white/70">
                    {creator.displayName.charAt(0)}
                  </div>
                )}
              </div>
              {creator.verified && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[var(--arc-brand-atlantean-teal)] flex items-center justify-center text-[var(--arc-cosmic-void)] text-[11px] font-bold">
                  ✓
                </div>
              )}
            </div>

            {/* Name + meta */}
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl md:text-3xl font-display font-bold tracking-[-0.02em] text-white">
                {creator.displayName}
              </h2>
              <p className="text-sm text-white/50 font-mono mb-2">
                @{creator.username}
              </p>
              <p className="text-sm text-white/70 mb-3 max-w-md leading-relaxed">
                {creator.tagline}
              </p>
              <div className="flex flex-wrap gap-2">
                {creator.rank && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--arc-brand-arcanean-gold)]/10 border border-[var(--arc-brand-arcanean-gold)]/25 text-[11px] text-[var(--arc-brand-arcanean-gold)] font-mono">
                    <span className="w-1 h-1 rounded-full bg-[var(--arc-brand-arcanean-gold)]" />
                    {creator.rank}
                  </span>
                )}
                {creator.gate && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--arc-brand-atlantean-teal)]/10 border border-[var(--arc-brand-atlantean-teal)]/25 text-[11px] text-[var(--arc-brand-atlantean-teal)] font-mono">
                    Gate: {creator.gate}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6">
            {typeof creator.worldsBuilt === "number" && (
              <div className="text-center">
                <p className="text-2xl font-display font-bold bg-gradient-to-b from-[var(--arc-brand-atlantean-teal)] to-[var(--arc-brand-atlantean-teal)] bg-clip-text text-transparent">
                  {creator.worldsBuilt}
                </p>
                <p className="text-[10px] font-mono tracking-wider uppercase text-white/30 mt-0.5">
                  worlds
                </p>
              </div>
            )}
            {typeof creator.followers === "number" && (
              <div className="text-center">
                <p className="text-2xl font-display font-bold bg-gradient-to-b from-[var(--arc-brand-arcanean-gold)] to-[var(--arc-brand-arcanean-gold)] bg-clip-text text-transparent">
                  {creator.followers.toLocaleString()}
                </p>
                <p className="text-[10px] font-mono tracking-wider uppercase text-white/30 mt-0.5">
                  followers
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Bio */}
        {creator.bio && (
          <p className="text-[15px] text-white/55 leading-relaxed mb-6 max-w-2xl">
            {creator.bio}
          </p>
        )}

        {/* On-chain identity */}
        {(onChainAddress || ensName) && (
          <div className="flex items-center gap-3 mb-6 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <div className="w-8 h-8 rounded-lg bg-[var(--arc-brand-cosmic-blue)]/15 border border-[var(--arc-brand-cosmic-blue)]/30 flex items-center justify-center text-[var(--arc-brand-cosmic-blue)] text-sm font-bold">
              ◉
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-mono tracking-wider uppercase text-white/30">
                On-chain identity
              </p>
              <p className="text-sm font-mono text-white/70 truncate">
                {ensName || onChainAddress}
              </p>
            </div>
          </div>
        )}

        {/* Linked identities grid */}
        <div>
          <p className="text-[10px] font-mono tracking-[0.25em] uppercase text-white/25 mb-3">
            Linked identities &amp; creations
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {identities.map((identity, i) => {
              const Comp = identity.url ? "a" : "div";
              return (
                <m.div
                  key={identity.platform + identity.label}
                  initial={{ opacity: 0, y: 6 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.03 }}
                >
                  <Comp
                    {...(identity.url
                      ? {
                          href: identity.url,
                          target: "_blank",
                          rel: "noopener noreferrer",
                        }
                      : {})}
                    className="group flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white/[0.025] border border-white/[0.06] hover:border-white/[0.14] hover:bg-white/[0.04] transition-all"
                  >
                    <span
                      className="w-7 h-7 rounded-md flex items-center justify-center text-sm font-bold shrink-0"
                      style={{
                        background: `${identity.color}15`,
                        border: `1px solid ${identity.color}30`,
                        color: identity.color,
                      }}
                    >
                      {identity.glyph}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-white/40 leading-tight font-mono truncate">
                        {identity.platform}
                      </p>
                      <p className="text-[13px] font-medium text-white/80 truncate group-hover:text-white transition-colors">
                        {identity.label}
                      </p>
                    </div>
                    {identity.badge && (
                      <span
                        className="text-[9px] font-mono tracking-wider uppercase px-1.5 py-0.5 rounded shrink-0"
                        style={{
                          background: `${identity.color}15`,
                          color: `${identity.color}dd`,
                        }}
                      >
                        {identity.badge}
                      </span>
                    )}
                    {identity.url && (
                      <span className="text-xs text-white/20 group-hover:text-white/50 group-hover:translate-x-0.5 transition-all">
                        &rarr;
                      </span>
                    )}
                  </Comp>
                </m.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
