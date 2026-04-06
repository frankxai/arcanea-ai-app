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
  Heart,
  Package,
  Cube,
  Sparkle,
  ShieldCheck,
  Infinity as InfinityIcon,
  MusicNote,
  Wallet,
  CurrencyEth,
  Trophy,
  CircleWavyCheck,
} from "@phosphor-icons/react/dist/ssr";

export const metadata: Metadata = {
  title: "Pricing — Create with Credits or Go Unlimited | Arcanea",
  description:
    "Open-core creative infrastructure. Chat free, create with credits, or go unlimited. Founding Passes available as limited NFT memberships on-chain.",
  openGraph: {
    title: "Pricing — Create with Credits or Go Unlimited | Arcanea",
    description:
      "Free to chat. Credits for creation. Unlimited for builders. Founding Pass NFT for legends.",
    type: "website",
    images: [
      {
        url: "/guardians/v3/alera-hero-v3.webp",
        width: 1024,
        height: 1024,
        alt: "Alera — Guardian of the Voice Gate",
      },
    ],
  },
};

// ─── Data ────────────────────────────────────────────────────────────────────

interface PricingTier {
  name: string;
  tagline: string;
  price: string;
  priceNote: string;
  badge?: string;
  badgeColor?: string;
  features: string[];
  cta: string;
  ctaHref: string;
  highlight?: boolean;
  nft?: boolean;
}

const TIERS: PricingTier[] = [
  {
    name: "Open",
    tagline: "Explore the multiverse",
    price: "Free",
    priceNote: "forever",
    features: [
      "Unlimited AI chat with Lumina",
      "Full Library access — 486K+ words",
      "World browsing & community gallery",
      "10 Guardians & 7 Wisdoms",
      "All open-source tools & SDKs",
      "Basic creation (3/day)",
    ],
    cta: "Start Creating",
    ctaHref: "/chat",
  },
  {
    name: "Creator",
    tagline: "Pay for what you create",
    price: "Credits",
    priceNote: "from $5 / 50 credits",
    badge: "MOST FLEXIBLE",
    badgeColor: "teal",
    features: [
      "Everything in Open",
      "Image generation — 1 credit",
      "Story & chapter writing — 1 credit",
      "World building — 1 credit",
      "Music composition — 2 credits",
      "Code generation — 1 credit",
      "Credits never expire",
      "Priority generation queue",
    ],
    cta: "Buy Credits",
    ctaHref: "/dashboard/credits",
  },
  {
    name: "Forge Unlimited",
    tagline: "For serious builders",
    price: "$29",
    priceNote: "/month · $249/year",
    badge: "BEST VALUE",
    badgeColor: "gold",
    highlight: true,
    features: [
      "Everything in Creator",
      "Unlimited image generation",
      "Unlimited story & world building",
      "Unlimited music composition",
      "Unlimited code generation",
      "Custom Guardian personalities",
      "Priority GPU queue",
      "Creator Marketplace access (sell your work)",
      "Advanced agent deployment",
    ],
    cta: "Go Unlimited",
    ctaHref: "/auth/signup?plan=forge",
  },
  {
    name: "Founding Pass",
    tagline: "1,000 total · on-chain",
    price: "0.1 ETH",
    priceNote: "or equivalent · lifetime",
    badge: "LIMITED — NFT",
    badgeColor: "purple",
    nft: true,
    features: [
      "Everything in Forge Unlimited — forever",
      "Permanent Founding Member status",
      "On-chain membership NFT",
      "Lifetime access — no recurring fees",
      "Governance votes on roadmap",
      "Revenue share from Creator Marketplace",
      "Custom Luminor agent deployment",
      "Private founder channel",
      "Early access to all future features",
      "Transferable & tradeable",
    ],
    cta: "Mint Your Pass",
    ctaHref: "/founding",
  },
];

const CREATION_TYPES = [
  { Icon: Chat, name: "AI Chat", cost: "Free", costColor: "text-emerald-400" },
  { Icon: ImageSquare, name: "Image Generation", cost: "1 credit", costColor: "text-[#00bcd4]" },
  { Icon: PencilSimple, name: "Story Writing", cost: "1 credit", costColor: "text-[#00bcd4]" },
  { Icon: Globe, name: "World Building", cost: "1 credit", costColor: "text-[#00bcd4]" },
  { Icon: MusicNote, name: "Music Composition", cost: "2 credits", costColor: "text-[#00bcd4]" },
  { Icon: Code, name: "Code Generation", cost: "1 credit", costColor: "text-[#00bcd4]" },
];

const PAYMENT_METHODS = [
  { name: "Card", desc: "Visa, Mastercard, Amex via Stripe" },
  { name: "Crypto", desc: "ETH, USDC on Base & Solana" },
  { name: "Apple Pay", desc: "One-tap checkout" },
  { name: "Google Pay", desc: "Seamless mobile" },
];

const FAQS = [
  {
    q: "What can I create for free?",
    a: "Unlimited AI chat, full Library access (486K+ words), world browsing, and 3 creations per day. The core experience is free and always will be.",
  },
  {
    q: "Do credits expire?",
    a: "Never. Buy once, use whenever. Credits work across all creation types — images, stories, worlds, music, code.",
  },
  {
    q: "What is the Founding Pass?",
    a: "A limited-edition on-chain membership NFT (1,000 total). It grants lifetime access to everything — Forge Unlimited forever, governance rights, marketplace revenue share, and permanent Founding Member status. It is transferable and tradeable.",
  },
  {
    q: "How does on-chain membership work?",
    a: "Your Founding Pass is minted as an NFT on Base (Ethereum L2). Connect any wallet to verify ownership. No crypto knowledge needed — we offer a hosted wallet option with email sign-in.",
  },
  {
    q: "Can I sell what I create?",
    a: "Everything you create is yours — full commercial rights. Forge and Founding members get Creator Marketplace access to sell worlds, templates, agents, and content to other creators. You keep 90%.",
  },
  {
    q: "What happens if I cancel Forge Unlimited?",
    a: "You keep everything you created. Your account drops to Creator tier — you can still use credits for individual creations. No lock-in, no data loss.",
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

function TierCard({ tier }: { tier: PricingTier }) {
  const isHighlight = tier.highlight;
  const isNft = tier.nft;

  return (
    <div
      className={`relative flex flex-col rounded-2xl border transition-all duration-300 ${
        isHighlight
          ? "border-[#ffd700]/30 bg-gradient-to-b from-[#ffd700]/[0.04] to-transparent shadow-[0_0_60px_rgba(255,215,0,0.06)]"
          : isNft
            ? "border-[#a855f7]/25 bg-gradient-to-b from-[#a855f7]/[0.03] to-transparent shadow-[0_0_60px_rgba(168,85,247,0.06)]"
            : "border-white/[0.06] bg-white/[0.02]"
      } hover:border-white/[0.12] hover:translate-y-[-2px]`}
    >
      {/* Badge */}
      {tier.badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span
            className={`inline-flex items-center gap-1.5 px-4 py-1 rounded-full text-[10px] font-mono font-bold tracking-widest ${
              tier.badgeColor === "gold"
                ? "bg-[#ffd700]/15 text-[#ffd700] border border-[#ffd700]/25"
                : tier.badgeColor === "purple"
                  ? "bg-[#a855f7]/15 text-[#c084fc] border border-[#a855f7]/25"
                  : "bg-[#00bcd4]/15 text-[#00bcd4] border border-[#00bcd4]/25"
            }`}
          >
            {isNft && <CurrencyEth size={10} weight="bold" />}
            {tier.badge}
          </span>
        </div>
      )}

      <div className="flex flex-col flex-1 p-6 pt-8">
        {/* Header */}
        <div className="mb-6">
          <h3 className="text-xl font-display font-bold mb-1">{tier.name}</h3>
          <p className="text-text-muted text-xs">{tier.tagline}</p>
        </div>

        {/* Price */}
        <div className="mb-6">
          <div className="flex items-baseline gap-2">
            <span
              className={`text-3xl font-display font-bold ${
                isHighlight
                  ? "bg-gradient-to-r from-[#ffd700] to-[#ffaa00] bg-clip-text text-transparent"
                  : isNft
                    ? "bg-gradient-to-r from-[#c084fc] to-[#a855f7] bg-clip-text text-transparent"
                    : tier.price === "Free"
                      ? "text-emerald-400"
                      : "text-[#00bcd4]"
              }`}
            >
              {tier.price}
            </span>
          </div>
          <p className="text-text-muted text-xs mt-1">{tier.priceNote}</p>
        </div>

        {/* Features */}
        <ul className="flex-1 space-y-3 mb-8">
          {tier.features.map((f) => (
            <li key={f} className="flex items-start gap-2.5 text-sm text-text-secondary">
              <CheckIcon
                className={`w-4 h-4 mt-0.5 shrink-0 ${
                  isHighlight ? "text-[#ffd700]/70" : isNft ? "text-[#c084fc]/70" : "text-[#00bcd4]/50"
                }`}
              />
              <span className="leading-snug">{f}</span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <Link
          href={tier.ctaHref}
          className={`flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
            isHighlight
              ? "bg-gradient-to-r from-[#ffd700] to-[#ffaa00] text-[#09090b] hover:shadow-[0_0_40px_rgba(255,215,0,0.3)] hover:scale-[1.02]"
              : isNft
                ? "bg-gradient-to-r from-[#a855f7] to-[#7c3aed] text-white hover:shadow-[0_0_40px_rgba(168,85,247,0.3)] hover:scale-[1.02]"
                : tier.price === "Free"
                  ? "border border-white/[0.12] text-text-primary hover:bg-white/[0.04]"
                  : "bg-[#00bcd4]/10 border border-[#00bcd4]/25 text-[#00bcd4] hover:bg-[#00bcd4]/20"
          }`}
        >
          {isNft && <Wallet size={16} weight="bold" />}
          {tier.cta}
          <ArrowRight size={14} weight="bold" />
        </Link>
      </div>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function PricingPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Arcanea Pricing — Credits, Unlimited, Founding Pass",
    url: "https://arcanea.ai/pricing",
    description:
      "Open-core creative infrastructure. Free chat, credit-based creation, unlimited plans, and limited NFT membership passes.",
  };

  return (
    <div className="relative min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[#09090b]" />
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_top,rgba(13,71,161,0.2),transparent_50%),radial-gradient(ellipse_at_bottom_right,rgba(0,188,212,0.12),transparent_50%)]" />
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_bottom_left,rgba(168,85,247,0.15),transparent_60%)]" />
      </div>

      <main className="max-w-7xl mx-auto px-6">
        {/* ─── Hero ─── */}
        <section className="pt-20 pb-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#00bcd4]/25 bg-[#00bcd4]/8 mb-8">
            <Sparkle size={14} weight="fill" style={{ color: "#00bcd4" }} />
            <span className="text-sm text-[#00bcd4] font-mono tracking-wider">
              PAY FOR WHAT YOU CREATE
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
            Create freely.
            <span className="block bg-gradient-to-r from-[#00bcd4] via-[#78a6ff] to-[#ffd700] bg-clip-text text-transparent">
              Pay fairly.
            </span>
          </h1>

          <p className="text-xl text-text-secondary max-w-2xl mx-auto mb-4 leading-relaxed">
            Start free with the Library. Buy credits when you need them.
            <br className="hidden md:block" />
            Go unlimited when you are ready.
          </p>

          <p className="text-sm text-text-muted max-w-lg mx-auto">
            No credit card required to start. Credits never expire. Cancel anytime.
          </p>
        </section>

        {/* ─── Creation Costs ─── */}
        <section className="pb-12">
          <div className="text-center mb-6">
            <h2 className="text-lg font-display font-semibold mb-1">
              What You Can Create
            </h2>
            <p className="text-xs text-text-muted">
              Every credit unlocks one creation
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
            {CREATION_TYPES.map(({ Icon, name, cost, costColor }) => (
              <div
                key={name}
                className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06]"
              >
                <Icon size={18} weight="duotone" style={{ color: "#00bcd4", flexShrink: 0 }} />
                <span className="text-sm font-medium">{name}</span>
                <span className={`text-xs font-mono ${costColor}`}>{cost}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ─── Pricing Tiers ─── */}
        <section className="pb-20">
          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 items-start">
            {TIERS.map((tier) => (
              <TierCard key={tier.name} tier={tier} />
            ))}
          </div>
        </section>

        {/* ─── Founding Pass Deep-Dive ─── */}
        <section className="py-16 border-t border-white/[0.04]">
          <div className="relative rounded-3xl overflow-hidden">
            {/* Gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#a855f7]/10 via-[#7c3aed]/5 to-[#ffd700]/10" />
            <div className="absolute inset-0 bg-white/[0.015]" />

            <div className="relative p-10 md:p-16">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                {/* Left — Description */}
                <div>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#a855f7]/30 bg-[#a855f7]/10 mb-6">
                    <CurrencyEth size={14} weight="bold" style={{ color: "#c084fc" }} />
                    <span className="text-sm text-[#c084fc] font-mono tracking-wider">
                      ON-CHAIN MEMBERSHIP
                    </span>
                  </div>

                  <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                    The Founding Pass
                  </h2>

                  <p className="text-text-secondary leading-relaxed mb-6">
                    1,000 total. On-chain. Lifetime access to everything Arcanea builds — now
                    and in the future. Not a subscription. An ownership stake in the creative
                    multiverse.
                  </p>

                  <div className="space-y-3">
                    {[
                      { Icon: ShieldCheck, text: "Verified on-chain via Base (Ethereum L2)" },
                      { Icon: CircleWavyCheck, text: "Transferable — sell or gift your membership" },
                      { Icon: Trophy, text: "Governance votes on what gets built next" },
                      { Icon: Cube, text: "Revenue share from Creator Marketplace" },
                    ].map(({ Icon, text }) => (
                      <div key={text} className="flex items-center gap-3 text-sm text-text-secondary">
                        <Icon size={18} weight="duotone" style={{ color: "#c084fc", flexShrink: 0 }} />
                        <span>{text}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 flex flex-wrap gap-3">
                    <Link
                      href="/founding"
                      className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-[#a855f7] to-[#7c3aed] text-white font-semibold hover:shadow-[0_0_40px_rgba(168,85,247,0.4)] transition-all"
                    >
                      <Wallet size={18} weight="bold" />
                      Mint Your Pass
                    </Link>
                    <Link
                      href="/founding#how-it-works"
                      className="inline-flex items-center gap-2 px-6 py-4 rounded-xl border border-[#a855f7]/25 text-[#c084fc] font-medium hover:bg-[#a855f7]/10 transition-all text-sm"
                    >
                      How it works
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>

                {/* Right — NFT Preview Card */}
                <div className="flex justify-center">
                  <div className="relative w-72 h-96 rounded-2xl overflow-hidden border border-[#a855f7]/20 bg-gradient-to-b from-[#a855f7]/[0.06] to-[#09090b] shadow-[0_8px_60px_rgba(168,85,247,0.15)]">
                    {/* Top section */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                      {/* Geometric symbol */}
                      <div className="w-24 h-24 mb-6 rounded-2xl border border-[#a855f7]/20 bg-[#a855f7]/[0.06] flex items-center justify-center">
                        <Crown size={40} weight="duotone" style={{ color: "#ffd700" }} />
                      </div>

                      <div className="text-center">
                        <span className="text-[10px] font-mono text-[#c084fc]/60 tracking-widest block mb-2">
                          ARCANEA FOUNDING PASS
                        </span>
                        <span className="text-2xl font-display font-bold bg-gradient-to-r from-[#ffd700] to-[#c084fc] bg-clip-text text-transparent block mb-1">
                          #0001
                        </span>
                        <span className="text-[11px] text-text-muted block">
                          1 of 1,000 · Lifetime Access
                        </span>
                      </div>

                      {/* Stats */}
                      <div className="mt-8 grid grid-cols-3 gap-3 w-full">
                        {[
                          { label: "Minted", value: "—" },
                          { label: "Supply", value: "1K" },
                          { label: "Chain", value: "Base" },
                        ].map(({ label, value }) => (
                          <div key={label} className="text-center">
                            <div className="text-lg font-display font-bold text-white">{value}</div>
                            <div className="text-[9px] text-text-muted uppercase tracking-wider">{label}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Subtle shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.02] to-transparent pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Payment Methods ─── */}
        <section className="py-12 border-t border-white/[0.04]">
          <div className="text-center mb-8">
            <h2 className="text-lg font-display font-semibold mb-2">
              Pay Your Way
            </h2>
            <p className="text-xs text-text-muted">
              Fiat, crypto, or one-tap mobile — we accept it all
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 max-w-3xl mx-auto">
            {PAYMENT_METHODS.map(({ name, desc }) => (
              <div
                key={name}
                className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06]"
              >
                <span className="text-sm font-semibold">{name}</span>
                <span className="text-xs text-text-muted">{desc}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ─── Open Source Arsenal ─── */}
        <section className="py-16 border-t border-white/[0.04]">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#7fffd4]/25 bg-[#7fffd4]/8 mb-6">
              <GitBranch size={14} weight="bold" style={{ color: "#7fffd4" }} />
              <span className="text-sm text-[#7fffd4] font-mono tracking-wider">
                OPEN CORE
              </span>
            </div>

            <h2 className="text-2xl font-display font-semibold mb-2">
              The foundation is open. Always.
            </h2>
            <p className="text-sm text-text-muted max-w-lg mx-auto">
              27 repos. 35 packages. 486K+ words. The creative engine is MIT-licensed
              and free to fork, extend, and build on.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 max-w-4xl mx-auto mb-8">
            {[
              { num: "27", label: "Repositories", desc: "Fork, extend, or build on the platform" },
              { num: "35", label: "npm Packages", desc: "MCP servers, CLIs, agents, skills" },
              { num: "54", label: "Agent Skills", desc: "Creative and development skills" },
            ].map(({ num, label, desc }) => (
              <div
                key={label}
                className="text-center p-6 rounded-xl bg-white/[0.02] border border-white/[0.06]"
              >
                <div className="text-3xl font-display font-bold text-[#7fffd4] mb-1">{num}</div>
                <div className="text-sm font-semibold mb-1">{label}</div>
                <div className="text-xs text-text-muted">{desc}</div>
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

        {/* ─── FAQ ─── */}
        <section className="py-16 border-t border-white/[0.04]">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-display font-semibold">
                Questions
              </h2>
            </div>

            <div className="space-y-4">
              {FAQS.map(({ q, a }, i) => (
                <div key={i} className="p-6 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <h3 className="font-semibold mb-2">{q}</h3>
                  <p className="text-text-secondary text-sm leading-relaxed">{a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Final CTA ─── */}
        <section className="py-20 border-t border-white/[0.04]">
          <div className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#00bcd4]/12 via-[#78a6ff]/12 to-[#ffd700]/12" />
            <div className="absolute inset-0 bg-white/[0.02]" />

            <div className="relative p-12 md:p-16 text-center">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                Start creating today
              </h2>
              <p className="text-lg text-text-secondary mb-10 max-w-2xl mx-auto">
                486K+ words of living mythology. Intelligent world-building. Sixteen AI
                specialists. Open source. Start free — scale when ready.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/chat"
                  className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#00bcd4] to-[#78a6ff] text-[#09090b] font-semibold text-lg hover:shadow-[0_0_40px_rgba(0,188,212,0.3)] transition-all"
                >
                  Start Creating — Free
                </Link>
                <Link
                  href="/founding"
                  className="px-8 py-4 rounded-xl border border-[#a855f7]/30 text-[#c084fc] font-semibold text-lg hover:bg-[#a855f7]/10 transition-all"
                >
                  Explore Founding Pass
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
