/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
"use client";

import Link from "next/link";
import { LazyMotion, domAnimation, m } from "framer-motion";
import {
  IdentityCard,
  type LinkedIdentity,
} from "@/components/premium/identity-card";
import { FloatingOrbs } from "@/components/premium/animated-background";
import { TemplateCard } from "@/components/premium/template-card";
import { StatusNotice } from "@/components/premium/status-badge";
import { ProfileWorlds } from "./profile-worlds";
import { ProfileAgents } from "./profile-agents";
import { ProfileCollections } from "./profile-collections";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const IDENTITIES: LinkedIdentity[] = [
  {
    platform: "Custom GPT",
    label: "Kael Detective",
    glyph: "✶",
    color: "var(--arc-brand-atlantean-teal)",
    url: "https://chatgpt.com/g/",
    badge: "AGENT",
  },
  {
    platform: "Suno",
    label: "@frankx_sound",
    glyph: "♪",
    color: "var(--arc-void)",
    url: "https://suno.com/",
    badge: "MUSIC",
  },
  {
    platform: "Website",
    label: "frankx.ai",
    glyph: "⎆",
    color: "var(--arc-brand-atlantean-teal)",
    url: "https://frankx.ai",
  },
  {
    platform: "X",
    label: "@frankxai",
    glyph: "𝕏",
    color: "var(--arc-text-primary)",
    url: "https://x.com/frankxai",
  },
  {
    platform: "Farcaster",
    label: "@frank",
    glyph: "△",
    color: "var(--arc-void)",
    url: "https://warpcast.com/frank",
  },
  {
    platform: "GitHub",
    label: "frankxai",
    glyph: "◉",
    color: "var(--arc-text-primary)",
    url: "https://github.com/frankxai",
  },
];

const CREATOR = {
  username: "frankxai",
  displayName: "Frank",
  tagline: "Building sovereign creative intelligence",
  bio: "Creator of Arcanea. 13 configured Luminors. 6 public open-source repos. Believer in BYOK, open protocols, and world-building as a craft.",
  gate: "Source",
  rank: "Luminor",
  worldsBuilt: 12,
  followers: 3421,
  verified: true,
  avatar: "/guardians/v3/shinkami-hero-v3.webp",
};

export function ProfileShowcase() {
  return (
    <LazyMotion features={domAnimation}>
      <div className="relative min-h-screen bg-[var(--arc-cosmic-void)] text-white">
        <FloatingOrbs preset="aurora" />

        {/* Dot grid */}
        <div
          className="pointer-events-none fixed inset-0 -z-10 opacity-[0.02]"
          aria-hidden
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        <main className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          {/* ── Example-profile notice ─────────────────────────────── */}
          <m.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="mb-8"
          >
            <StatusNotice
              level="preview"
              title="This is Frank's example profile"
              body="You're viewing a logged-out preview. Sign in to claim your own profile and link your Custom GPTs, Suno account, websites, and on-chain identity."
              linkHref="/auth/signup"
              linkLabel="Sign up"
            />
          </m.div>

          {/* ── Identity Card ──────────────────────────────────────── */}
          <m.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="mb-16"
          >
            <IdentityCard
              creator={CREATOR}
              identities={IDENTITIES}
              ensName="frankx.eth"
            />
          </m.div>

          {/* ── Worlds ─────────────────────────────────────────────── */}
          <ProfileWorlds />

          {/* ── Agents ─────────────────────────────────────────────── */}
          <ProfileAgents />

          {/* ── Collections ────────────────────────────────────────── */}
          <ProfileCollections />

          {/* ── Sign-in CTA ─────────────────────────────────────────── */}
          <m.div
            className="mt-20 p-10 md:p-14 rounded-3xl bg-white/[0.02] border border-white/[0.06] text-center relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[var(--arc-brand-atlantean-teal)]/08 via-transparent to-[var(--arc-brand-atlantean-teal)]/05" />
            <div className="relative">
              <p className="text-[10px] font-mono tracking-[0.3em] uppercase text-white/25 mb-4">
                Your profile
              </p>
              <h2 className="text-2xl md:text-3xl font-display font-bold tracking-[-0.02em] text-white mb-3">
                Claim your creator identity
              </h2>
              <p className="text-sm text-white/40 max-w-md mx-auto leading-relaxed mb-8 font-body">
                Sign in to build your profile, link your creations, publish
                worlds, and join the creator network.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/auth/login?next=/profile"
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--arc-brand-atlantean-teal)] to-[var(--arc-brand-atlantean-teal)] px-7 py-3 text-sm font-semibold text-[var(--arc-cosmic-void)] transition hover:shadow-[0_0_30px_rgba(127,255,212,0.2)] hover:scale-[1.02] active:scale-[0.98]"
                >
                  Sign in
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-7 py-3 text-sm font-medium text-white/60 backdrop-blur-sm transition hover:border-white/20 hover:text-white"
                >
                  Back to home
                </Link>
              </div>
            </div>
          </m.div>
        </main>
      </div>
    </LazyMotion>
  );
}
