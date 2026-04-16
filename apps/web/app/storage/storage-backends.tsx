"use client";

import { LazyMotion, domAnimation } from "framer-motion";
import { SectionShell, SectionHeader, FeatureCard, FeatureIcon } from "@/components/premium";

const BACKENDS = [
  {
    glyph: "◎",
    color: "#3ecf8e",
    title: "Arcanea Cloud",
    badge: "Default",
    badgeColor: "#7fffd4",
    tagline: "Zero setup. Zero compromise.",
    body:
      "Managed Supabase under the hood. Postgres + pgvector fully configured, backups running, row-level security enforced. BYOK for AI — we never train on your content.",
    bullets: [
      "One-click start, nothing to configure",
      "BYOK for all AI models",
      "Daily automated backups",
      "We never train on your data",
    ],
  },
  {
    glyph: "◉",
    color: "#00bcd4",
    title: "Your Supabase",
    badge: "Self-Hosted",
    badgeColor: "#00bcd4",
    tagline: "Your schema, your instance.",
    body:
      "Clone our open-source schema and run your own Supabase instance. Completely independent. Point Arcanea at your Supabase URL and anon key — everything works.",
    bullets: [
      "Full schema available on GitHub",
      "Migrate data anytime",
      "Your billing, your region",
      "No vendor relationship with us",
    ],
  },
  {
    glyph: "◱",
    color: "#ffd700",
    title: "Local-First",
    badge: "Offline Ready",
    badgeColor: "#ffd700",
    tagline: "Your disk. Your rules.",
    body:
      "Export your entire vault as a folder of Markdown and JSONML files. Sync with Syncthing, iCloud Drive, or just git. Works in Obsidian natively.",
    bullets: [
      "Plain files — any editor reads them",
      "Obsidian compatible out of the box",
      "Syncthing / iCloud / git sync",
      "Full semantic search on reconnect",
    ],
  },
  {
    glyph: "△",
    color: "#c084fc",
    title: "Arweave + IPFS",
    badge: "On-Chain",
    badgeColor: "#c084fc",
    tagline: "Permanent. Verified. Cross-world.",
    body:
      "Publish worlds, characters, or entire vaults to Arweave for permanent storage. IPFS for content-addressed retrieval. Signed with your wallet for cryptographic provenance.",
    bullets: [
      "Content-addressed — tamper-proof",
      "Permanent Arweave storage",
      "Wallet-signed for identity",
      "Cross-verifiable by anyone",
    ],
  },
];

export function StorageBackends() {
  return (
    <LazyMotion features={domAnimation}>
      <SectionShell ambient="gold" id="backends">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            label="Where your data lives"
            title="Four options. One open protocol."
            subtitle="Start with Arcanea Cloud, migrate to self-hosted when you're ready, or go fully on-chain. Your data travels with you."
            accent="gold"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {BACKENDS.map((backend, i) => (
              <FeatureCard key={backend.title} glowColor={backend.color} delay={i * 0.07}>
                <div className="flex items-start justify-between mb-5">
                  <FeatureIcon color={backend.color} size="md">
                    <span className="text-lg font-bold">{backend.glyph}</span>
                  </FeatureIcon>
                  <span
                    className="text-[10px] font-mono tracking-wider uppercase px-2.5 py-1 rounded-full mt-1"
                    style={{
                      background: `${backend.badgeColor}12`,
                      border: `1px solid ${backend.badgeColor}25`,
                      color: `${backend.badgeColor}cc`,
                    }}
                  >
                    {backend.badge}
                  </span>
                </div>

                <h3
                  className="text-xl font-display font-bold mb-1"
                  style={{ color: backend.color }}
                >
                  {backend.title}
                </h3>
                <p className="text-xs font-mono text-white/40 mb-4">
                  {backend.tagline}
                </p>

                <p className="text-sm text-white/50 leading-relaxed mb-5">
                  {backend.body}
                </p>

                <ul className="space-y-2">
                  {backend.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-2.5 text-sm text-white/45">
                      <span
                        className="mt-1.5 w-1 h-1 rounded-full shrink-0"
                        style={{ background: backend.color }}
                      />
                      {bullet}
                    </li>
                  ))}
                </ul>
              </FeatureCard>
            ))}
          </div>
        </div>
      </SectionShell>
    </LazyMotion>
  );
}
