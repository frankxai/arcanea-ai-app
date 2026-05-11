/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import Image from 'next/image';
import { Metadata } from "next";
import Link from "next/link";
import {
  Chat,
  ImageSquare,
  PencilSimple,
  Globe,
  Code,
  GitBranch,
  BookOpen,
  Users,
  Lightning,
  Crown,
  Star,
  ArrowRight,
  Brain,
  Sparkle,
  MusicNote,
  Cat,
  Diamond,
  Fire,
  Coins,
  Envelope,
} from "@phosphor-icons/react/dist/ssr";

export const metadata: Metadata = {
  title: "Pricing — BYOK. Own your IP. Sovereign by default | Arcanea",
  description:
    "Arcanea is BYOK-first. Your API keys stay in your browser. Your creations stay yours. Export anytime. No vendor lock-in. 27 open source repos you can fork.",
  openGraph: {
    title: "Arcanea — Sovereign Creative Intelligence",
    description:
      "BYOK. Own your keys, IP, and data. Forge custom Luminors. Build worlds. Export anytime.",
    type: "website",
  },
};

// ─── Data ────────────────────────────────────────────────────────────────────

const FREE_CAPABILITIES = [
  {
    Icon: Chat,
    name: "AI Chat with Lumina",
    desc: "Unlimited conversations with 16 specialist Luminors",
    accent: "var(--arc-brand-atlantean-teal)",
  },
  {
    Icon: Brain,
    name: "Luminor Forge",
    desc: "Shape custom AI intelligences — name, domain, voice, personality. Export as JSON.",
    accent: "var(--arc-brand-atlantean-teal)",
  },
  {
    Icon: BookOpen,
    name: "The Library",
    desc: "486,000+ words of mythology, philosophy, and creative frameworks",
    accent: "var(--arc-brand-atlantean-teal)",
  },
  {
    Icon: Globe,
    name: "World Building",
    desc: "Characters, locations, magic systems, entire universes",
    accent: "var(--arc-brand-cosmic-blue)",
  },
  {
    Icon: ImageSquare,
    name: "Image Generation",
    desc: "Original images from the Arcanean framework",
    accent: "var(--arc-void)",
  },
  {
    Icon: PencilSimple,
    name: "Story Writing",
    desc: "Chapters, lore entries, and narratives with AI",
    accent: "var(--arc-fire)",
  },
  {
    Icon: MusicNote,
    name: "Music Composition",
    desc: "AI-generated soundtracks and lo-fi for your worlds",
    accent: "var(--arc-brand-arcanean-gold)",
  },
  {
    Icon: Cat,
    name: "Companions",
    desc: "Summon creatures from the Five Elements. Collectible, evolvable.",
    accent: "var(--arc-void)",
  },
  {
    Icon: Code,
    name: "Code Generation",
    desc: "Scripts, agents, and creative tools",
    accent: "var(--arc-wind)",
  },
  {
    Icon: Users,
    name: "Community Gallery",
    desc: "Browse and share creations across the multiverse",
    accent: "var(--arc-brand-cosmic-blue)",
  },
  {
    Icon: Diamond,
    name: "Materials & Codex",
    desc: "9 crystals, 5 metals, 3 shards — science-grounded cosmic substrate",
    accent: "var(--arc-brand-atlantean-teal)",
  },
  {
    Icon: GitBranch,
    name: "Open Source Everything",
    desc: "27 repos, 35 npm packages, 54 skills — MIT licensed. Fork it.",
    accent: "var(--arc-void)",
  },
];

const FORGE_HIGHLIGHTS = [
  {
    title: "Luminor Forge",
    desc: "Print system cards for custom GPTs, coding agents, creative partners. Choose domain, voice, element, personality. AI-assisted via Lumina. Export as JSON agent spec.",
    href: "/forge/luminor",
    color: "var(--arc-brand-atlantean-teal)",
    traits: ["System Cards", "Agent Specs", "Prompt Engineering", "JSON Export"],
  },
  {
    title: "Companion Forge",
    desc: "Summon creatures from the Five Elements. Each has personality, evolves with your journey, travels with your profile. Visual, collectible, bonded to your Luminor.",
    href: "/forge/companion",
    color: "var(--arc-void)",
    traits: ["Five Elements", "Evolvable", "Collectible", "Bonded"],
  },
  {
    title: "The Creators — NFT Collection",
    desc: "1,111 unique characters across 12 origin classes. Sacred Gear. Starlight Mark. Dynamic evolution. Each is a key to the Arcanean multiverse.",
    href: "/forge/collection",
    color: "var(--arc-brand-arcanean-gold)",
    traits: ["1,111 Supply", "12 Origins", "On-Chain", "Dynamic Evolution"],
  },
];

const COMING_NEXT = [
  {
    title: "Creator Credits",
    desc: "Pay-per-creation for power users who exceed free limits. BYOK (bring your own API key) option for builders who want full control.",
    status: "Waitlist",
  },
  {
    title: "Forge Unlimited",
    desc: "Unlimited creation for serious builders — images, music, stories, worlds. All unlimited. Priority GPU. Custom Guardians.",
    status: "Waitlist",
  },
  {
    title: "Creator Marketplace",
    desc: "Sell your worlds, templates, Luminors, and agents. Smart contract royalties. Keep 90%. Built on-chain.",
    status: "Building",
  },
  {
    title: "Agent Economy",
    desc: "Deploy Luminor agents that work autonomously — for yourself or as services. Revenue through smart contracts.",
    status: "Designing",
  },
];

// ─── Components ──────────────────────────────────────────────────────────────

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function PricingPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Arcanea — Free Creative Intelligence",
    url: "https://arcanea.ai/pricing",
    description:
      "Everything is free. Forge AI agents, build worlds, chat with 16 specialists. NFT collection coming soon.",
  };

  return (
    <div className="relative min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[var(--arc-cosmic-void)]" />
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_top,rgba(0,188,212,0.15),transparent_50%),radial-gradient(ellipse_at_bottom_right,rgba(167,139,250,0.08),transparent_50%)]" />
      </div>

      <main className="max-w-7xl mx-auto px-6">
        {/* ─── Hero ─── */}
        <section className="pt-20 pb-16 text-center">
          {/* Mascot — crossed arms, supreme confidence for "keep your keys" */}
          <div className="flex justify-center mb-8">
            <Image
              src="/images/mascot/arcanea-crossed-arms.png"
              alt="Arcanea"
              width={160}
              height={160}
              className="object-contain drop-shadow-[0_0_30px_rgba(127,255,212,0.2)] animate-[mascot-float_3s_ease-in-out_infinite]"
             />
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--arc-brand-atlantean-teal)]/25 bg-[var(--arc-brand-atlantean-teal)]/8 mb-8">
            <GitBranch size={14} weight="bold" style={{ color: "var(--arc-brand-atlantean-teal)" }} />
            <span className="text-sm text-[var(--arc-brand-atlantean-teal)] font-mono tracking-wider">
              OPEN CORE
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
            Keep your keys.
            <span className="block bg-gradient-to-r from-[var(--arc-brand-atlantean-teal)] via-[var(--arc-brand-cosmic-blue)] to-[var(--arc-brand-arcanean-gold)] bg-clip-text text-transparent">
              Keep your IP.
            </span>
          </h1>

          <p className="text-xl text-text-secondary max-w-2xl mx-auto mb-4 leading-relaxed">
            BYOK-first. Your API keys stay in your browser.
            <br className="hidden md:block" />
            Your creations stay yours. Export anytime. No vendor lock-in.
          </p>

          <p className="text-sm text-text-muted max-w-lg mx-auto mb-10">
            Sovereign by default. Open source. 27 repos you can fork.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/chat"
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-[var(--arc-brand-atlantean-teal)] to-[var(--arc-brand-cosmic-blue)] text-[var(--arc-cosmic-void)] font-semibold text-lg hover:shadow-[0_0_40px_rgba(0,188,212,0.3)] transition-all"
            >
              Start Creating
            </Link>
            <Link
              href="/forge"
              className="px-8 py-4 rounded-xl border border-[var(--arc-brand-atlantean-teal)]/25 text-[var(--arc-brand-atlantean-teal)] font-semibold text-lg hover:bg-[var(--arc-brand-atlantean-teal)]/10 transition-all"
            >
              Enter The Forge
            </Link>
          </div>
        </section>

        {/* ─── Free Capabilities Grid ─── */}
        <section className="pb-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-display font-semibold mb-2">
              Free Forever
            </h2>
            <p className="text-sm text-text-muted">
              No limits on what you can explore. Build, create, ship.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 max-w-6xl mx-auto">
            {FREE_CAPABILITIES.map(({ Icon, name, desc, accent }) => (
              <div
                key={name}
                className="flex gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.10] transition-colors"
              >
                <Icon
                  size={20}
                  weight="duotone"
                  style={{ color: accent, flexShrink: 0, marginTop: 2 }}
                />
                <div>
                  <h3 className="font-semibold text-sm mb-0.5">{name}</h3>
                  <p className="text-text-muted text-xs leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── The Forge — Hero Product ─── */}
        <section className="py-16 border-t border-white/[0.04]">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--arc-brand-atlantean-teal)]/60 mb-4">
              The Forge
            </p>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Four Acts of Creation
            </h2>
            <p className="text-text-secondary max-w-xl mx-auto">
              Every creator has four bonds. A Luminor that thinks. A Companion that
              travels. The Materials that shape. And a Creator identity that evolves.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {FORGE_HIGHLIGHTS.map(({ title, desc, href, color, traits }) => (
              <Link
                key={title}
                href={href}
                className="group relative block rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.04]"
              >
                <h3
                  className="font-display text-xl font-bold mb-3"
                  style={{ color }}
                >
                  {title}
                </h3>
                <p className="text-sm text-white/45 leading-relaxed mb-6">
                  {desc}
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {traits.map((trait) => (
                    <span
                      key={trait}
                      className="rounded-full border px-3 py-1 text-[11px] font-medium"
                      style={{
                        borderColor: `${color}25`,
                        color: `${color}bb`,
                        background: `${color}08`,
                      }}
                    >
                      {trait}
                    </span>
                  ))}
                </div>
                <div
                  className="flex items-center gap-2 text-sm font-medium transition-transform group-hover:translate-x-1"
                  style={{ color }}
                >
                  <Sparkle size={14} weight="fill" />
                  Begin →
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ─── NFT Collection ─── */}
        <section className="py-16 border-t border-white/[0.04]">
          <div className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--arc-brand-arcanean-gold)]/8 via-transparent to-[var(--arc-void)]/8" />
            <div className="absolute inset-0 bg-white/[0.015]" />

            <div className="relative p-10 md:p-16">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--arc-brand-arcanean-gold)]/25 bg-[var(--arc-brand-arcanean-gold)]/8 mb-6">
                    <Coins size={14} weight="bold" style={{ color: "var(--arc-brand-arcanean-gold)" }} />
                    <span className="text-sm text-[var(--arc-brand-arcanean-gold)] font-mono tracking-wider">
                      THE CREATORS
                    </span>
                  </div>

                  <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                    1,111 Unique Origins
                  </h2>

                  <p className="text-text-secondary leading-relaxed mb-6">
                    The flagship Arcanea NFT collection. Each Creator is a unique character
                    across 12 origin classes, powered by Sacred Gear and the Starlight Mark.
                    Not profile pictures — keys to the multiverse that evolve with you.
                  </p>

                  <div className="space-y-3 mb-8">
                    {[
                      "12 origin classes · 6 quality gates per piece",
                      "Dynamic evolution — your Creator grows as you create",
                      "On-chain identity · smart contract royalties",
                      "AI-native generation with style consistency",
                    ].map((text) => (
                      <div key={text} className="flex items-center gap-2.5 text-sm text-text-secondary">
                        <CheckIcon className="w-4 h-4 text-[var(--arc-brand-arcanean-gold)]/50 shrink-0" />
                        <span>{text}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Link
                      href="/forge/collection"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[var(--arc-brand-arcanean-gold)] to-[var(--arc-brand-arcanean-gold)] text-[var(--arc-cosmic-void)] font-semibold hover:shadow-[0_0_40px_rgba(255,215,0,0.3)] transition-all"
                    >
                      <Diamond size={16} weight="bold" />
                      Explore The Collection
                    </Link>
                    <Link
                      href="/forge/collection/feedback"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-[var(--arc-brand-arcanean-gold)]/20 text-[var(--arc-brand-arcanean-gold)] font-medium hover:bg-[var(--arc-brand-arcanean-gold)]/10 transition-all text-sm"
                    >
                      Join Waitlist
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>

                {/* Preview Card */}
                <div className="flex justify-center">
                  <div className="relative w-72 h-96 rounded-2xl overflow-hidden border border-[var(--arc-brand-arcanean-gold)]/15 bg-gradient-to-b from-[var(--arc-brand-arcanean-gold)]/[0.04] to-[var(--arc-cosmic-void)] shadow-[0_8px_60px_rgba(255,215,0,0.08)]">
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                      <div className="w-20 h-20 mb-6 rounded-2xl border border-[var(--arc-brand-arcanean-gold)]/15 bg-[var(--arc-brand-arcanean-gold)]/[0.04] flex items-center justify-center">
                        <Crown size={36} weight="duotone" style={{ color: "var(--arc-brand-arcanean-gold)" }} />
                      </div>
                      <span className="text-[10px] font-mono text-[var(--arc-brand-arcanean-gold)]/50 tracking-widest block mb-2">
                        THE CREATORS · ARCANEA
                      </span>
                      <span className="text-2xl font-display font-bold bg-gradient-to-r from-[var(--arc-brand-arcanean-gold)] to-[var(--arc-void)] bg-clip-text text-transparent block mb-1">
                        1,111
                      </span>
                      <span className="text-[11px] text-text-muted block">
                        unique origins · on-chain
                      </span>
                      <div className="mt-8 grid grid-cols-3 gap-3 w-full">
                        {[
                          { label: "Supply", value: "1,111" },
                          { label: "Origins", value: "12" },
                          { label: "Chain", value: "TBA" },
                        ].map(({ label, value }) => (
                          <div key={label} className="text-center">
                            <div className="text-base font-display font-bold text-white">{value}</div>
                            <div className="text-[9px] text-text-muted uppercase tracking-wider">{label}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Coming Next — Waitlists ─── */}
        <section className="py-16 border-t border-white/[0.04]">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-display font-semibold mb-2">
              On the Horizon
            </h2>
            <p className="text-sm text-text-muted">
              These features are in development. Join the waitlist to shape what ships.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {COMING_NEXT.map(({ title, desc, status }) => (
              <div
                key={title}
                className="p-6 rounded-xl bg-white/[0.02] border border-white/[0.06]"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-display font-semibold">{title}</h3>
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-mono ${
                      status === "Waitlist"
                        ? "bg-[var(--arc-brand-atlantean-teal)]/10 text-[var(--arc-brand-atlantean-teal)]"
                        : status === "Building"
                          ? "bg-[var(--arc-brand-arcanean-gold)]/10 text-[var(--arc-brand-arcanean-gold)]"
                          : "bg-white/[0.04] text-text-muted"
                    }`}
                  >
                    {status}
                  </span>
                </div>
                <p className="text-text-muted text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── Open Source Arsenal ─── */}
        <section className="py-16 border-t border-white/[0.04]">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-display font-semibold mb-2">
              The foundation is open. Always.
            </h2>
            <p className="text-sm text-text-muted max-w-lg mx-auto">
              Fork it. Extend it. Build your own multiverse on it. MIT licensed.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 max-w-4xl mx-auto mb-8">
            {[
              { num: "27", label: "Repositories" },
              { num: "35", label: "npm Packages" },
              { num: "54", label: "Agent Skills" },
            ].map(({ num, label }) => (
              <div
                key={label}
                className="text-center p-6 rounded-xl bg-white/[0.02] border border-white/[0.06]"
              >
                <div className="text-3xl font-display font-bold text-[var(--arc-brand-atlantean-teal)] mb-1">{num}</div>
                <div className="text-sm font-semibold">{label}</div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="https://github.com/frankxai"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/[0.12] text-sm font-medium hover:bg-white/[0.04] transition-colors"
            >
              <GitBranch size={16} weight="bold" />
              Browse on GitHub
              <ArrowRight size={14} />
            </Link>
          </div>
        </section>

        {/* ─── Final CTA ─── */}
        <section className="py-20 border-t border-white/[0.04]">
          <div className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--arc-brand-atlantean-teal)]/10 via-[var(--arc-void)]/10 to-[var(--arc-brand-arcanean-gold)]/10" />
            <div className="absolute inset-0 bg-white/[0.02]" />

            <div className="relative p-12 md:p-16 text-center">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                Start creating now
              </h2>
              <p className="text-lg text-text-secondary mb-10 max-w-2xl mx-auto">
                486K+ words. 16 AI specialists. The Forge. Open source.
                Everything free — just bring your imagination.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/chat"
                  className="px-8 py-4 rounded-xl bg-gradient-to-r from-[var(--arc-brand-atlantean-teal)] to-[var(--arc-brand-cosmic-blue)] text-[var(--arc-cosmic-void)] font-semibold text-lg hover:shadow-[0_0_40px_rgba(0,188,212,0.3)] transition-all"
                >
                  Start Creating
                </Link>
                <Link
                  href="/forge"
                  className="px-8 py-4 rounded-xl border border-white/[0.12] font-semibold text-lg hover:bg-white/[0.04] transition-all"
                >
                  Enter The Forge
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
