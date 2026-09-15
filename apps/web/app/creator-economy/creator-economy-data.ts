/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import type { RevenueStream, FlowStep } from "@/components/premium";
import type { PhosphorIcon } from "@/lib/phosphor-icons";
import {
  Coins,
  Diamond,
  Crown,
  Sparkle,
  Lightning,
  Heart,
  Users,
  Cat,
  ArrowRight,
  ArrowSquareOut,
  ListBullets,
  Shield,
  MusicNote,
  PaintBrush,
  Books,
} from "@/lib/phosphor-icons";

// ---------------------------------------------------------------------------
// Revenue streams
// ---------------------------------------------------------------------------

export const REVENUE_STREAMS: RevenueStream[] = [
  {
    title: "Template Marketplace",
    tagline: "Sell what you build",
    body: "Package your worlds, characters, story structures, and music systems as reusable templates. Other creators buy once; you earn every time.",
    icon: Diamond,
    accent: "var(--arc-brand-atlantean-teal)",
    take: "90%",
    fee: "10% platform",
    status: "live",
    bullets: [
      "On-chain royalties whenever your template is forked",
      "Instant Stripe payouts — no 30-day wait",
      "No listing fees or upfront costs",
      "Bundle multiple templates into creator packs",
    ],
    href: "/templates",
    ctaLabel: "Start selling templates",
  },
  {
    title: "Memberships",
    tagline: "Monthly recurring income",
    body: "Run a membership via Whop or Discord with tiered access — early releases, private world-builds, Q&As, monthly story drops. Set your price, keep almost all of it.",
    icon: Crown,
    accent: "var(--arc-brand-arcanean-gold)",
    take: "97%",
    fee: "3% Whop/Discord",
    status: "live",
    bullets: [
      "Up to 5 membership tiers per creator",
      "Gated content auto-syncs with your Arcanea library",
      "Export your full subscriber list any time",
      "No exclusive lock-in — run on multiple platforms",
    ],
    href: "/dashboard/memberships",
    ctaLabel: "Set up a membership",
  },
  {
    title: "NFT Collections",
    tagline: "On-chain creative identity",
    body: "The Arcanea 1,111 Creators Collection gives you an evolving on-chain identity that unlocks revenue tiers, exclusive collabs, and secondary royalties on every resale.",
    icon: Sparkle,
    accent: "var(--arc-void)",
    take: "92.5%",
    fee: "5% platform + 2.5% royalty pool",
    status: "beta",
    bullets: [
      "Mint price currently in early-access waitlist",
      "2.5% secondary royalty paid automatically on every resale",
      "NFT metadata evolves as your creator stats grow",
      "Grants access to co-creation collabs and revenue splits",
    ],
    href: "/nft",
    ctaLabel: "Join the waitlist",
  },
  {
    title: "Smart Contract Royalties",
    tagline: "Earn from every fork",
    body: "When another creator forks your world, remixes your characters, or builds on your lore, a smart contract deposits a royalty directly to your wallet. No chasing payments.",
    icon: Coins,
    accent: "var(--arc-brand-cosmic-blue)",
    take: "Variable",
    fee: "You set the rate (0.5–10%)",
    status: "beta",
    bullets: [
      "Set your royalty rate per world or asset",
      "Payouts happen on-chain — no approval queue",
      "Audit trail: see every fork and what it earned",
      "Compatible with existing Ethereum wallets",
    ],
    href: "/worlds",
    ctaLabel: "Enable royalties on your worlds",
  },
  {
    title: "Token-Gated Content",
    tagline: "Exclusive drops for holders",
    body: "Release chapters, art, music, or full world expansions exclusively to your NFT or token holders. No code needed — connect your collection, set the gate, publish.",
    icon: Lightning,
    accent: "var(--arc-fire)",
    take: "100%",
    fee: "Stripe processing only (~3%)",
    status: "beta",
    bullets: [
      "Gate by NFT collection, token balance, or holder tier",
      "Works with ERC-721 and ERC-1155 collections",
      "Scheduled drops with countdown timers",
      "Fallback paid access for non-holders at your price",
    ],
    href: "/dashboard/drops",
    ctaLabel: "Create a gated drop",
  },
  {
    title: "Commissions Market",
    tagline: "Paid work, your terms",
    body: "Accept commissions for custom worlds, character designs, story outlines, or music compositions. You set your rate, scope, and delivery timeline. Arcanea handles contracts.",
    icon: Heart,
    accent: "var(--arc-fire)",
    take: "88%",
    fee: "12% platform (includes escrow)",
    status: "live",
    bullets: [
      "Escrow holds payment until delivery — protects both sides",
      "Commission scope template for clean agreements",
      "Star ratings build your reputation over time",
      "Set max open commissions to protect your calendar",
    ],
    href: "/commissions",
    ctaLabel: "Open your commission queue",
  },
  {
    title: "Direct Storefront",
    tagline: "Books, courses, asset packs",
    body: "Sell your finished work directly — ebooks, short story collections, worldbuilding courses, music sample packs, prompt libraries. No revenue share on direct sales.",
    icon: Users,
    accent: "var(--arc-brand-atlantean-teal)",
    take: "100%",
    fee: "Stripe processing (~3%) only",
    status: "live",
    bullets: [
      "Connect your existing Gumroad or Stripe account",
      "Arcanea drives traffic; you keep the list and the revenue",
      "Digital delivery handled automatically post-purchase",
      "Bundle products for higher average order value",
    ],
    href: "/dashboard/store",
    ctaLabel: "Open your store",
  },
  {
    title: "Companion Licensing",
    tagline: "License your custom AI",
    body: "Built a custom Luminor or Guardian personality? License it to other creators or studios. Your training, your character, your ongoing royalty stream.",
    icon: Cat,
    accent: "var(--arc-void)",
    take: "Variable",
    fee: "Negotiated per license",
    status: "soon",
    bullets: [
      "License for one-time fee or recurring royalty",
      "Retain ownership — licenses are time-limited",
      "Usage analytics show engagement across licensees",
      "Enterprise licensing available for studios and teams",
    ],
    href: "/dashboard/companions",
    ctaLabel: "Join the waitlist",
  },
];

// ---------------------------------------------------------------------------
// How it works flow
// ---------------------------------------------------------------------------

export const HOW_IT_WORKS: FlowStep[] = [
  {
    number: "01",
    icon: PaintBrush,
    title: "Create",
    body: "Build worlds, characters, music, and stories inside Arcanea. Everything you make is yours — stored in your vault, exportable any time.",
    accent: "var(--arc-brand-atlantean-teal)",
  },
  {
    number: "02",
    icon: Books,
    title: "Package",
    body: "One-click packaging into a template, membership drop, or NFT. Add pricing, access rules, and royalty settings from your dashboard.",
    accent: "var(--arc-brand-atlantean-teal)",
  },
  {
    number: "03",
    icon: MusicNote,
    title: "Monetize",
    body: "Publish to the marketplace, your storefront, or direct to your audience. Payouts via Stripe. On-chain royalties where relevant.",
    accent: "var(--arc-brand-arcanean-gold)",
  },
];

// ---------------------------------------------------------------------------
// Creator case studies (hypothetical — not real users)
// ---------------------------------------------------------------------------

export interface CaseStudy {
  name: string;
  type: string;
  headline: string;
  story: string;
  accent: string;
  stats: { label: string; value: string }[];
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    name: "Elena",
    type: "World Builder",
    headline: "$4,200/mo from one world",
    story: "Elena built The Shardlands over three months. She sells the template pack, runs a 340-member Whop, and earns royalties every time someone forks her magic system.",
    accent: "var(--arc-brand-atlantean-teal)",
    stats: [
      { label: "Monthly revenue", value: "$4,200" },
      { label: "Whop members", value: "340" },
      { label: "Worlds built", value: "12" },
      { label: "Genre", value: "Epic Fantasy" },
    ],
  },
  {
    name: "Marcus",
    type: "Music Composer",
    headline: "$2,800/mo from soundtracks",
    story: "Marcus composes atmospheric world soundtracks, sells bundle packs on his direct storefront, and gates extended cuts behind a Patreon-style membership tier.",
    accent: "var(--arc-brand-arcanean-gold)",
    stats: [
      { label: "Monthly revenue", value: "$2,800" },
      { label: "Track packs sold", value: "89" },
      { label: "Subscribers", value: "210" },
      { label: "Genre", value: "Ambient / Cinematic" },
    ],
  },
  {
    name: "Priya",
    type: "Narrative Designer",
    headline: "$6,500/mo across three streams",
    story: "Priya runs commissions for studios, drops NFT story chapters to holders, and licenses two custom Luminor personalities. Three streams, one dashboard.",
    accent: "var(--arc-void)",
    stats: [
      { label: "Monthly revenue", value: "$6,500" },
      { label: "Active commissions", value: "8" },
      { label: "NFT holders", value: "420" },
      { label: "Genre", value: "Sci-Fi / Noir" },
    ],
  },
];

// ---------------------------------------------------------------------------
// Sovereignty pillars
// ---------------------------------------------------------------------------

interface Pillar {
  icon: PhosphorIcon;
  title: string;
  body: string;
  accent: string;
}

export const SOVEREIGNTY_PILLARS: Pillar[] = [
  {
    icon: ListBullets,
    title: "Own your audience",
    body: "Export your subscriber list, commission history, and customer data at any time. CSV or JSON. No permission needed.",
    accent: "var(--arc-brand-atlantean-teal)",
  },
  {
    icon: ArrowSquareOut,
    title: "Export everything",
    body: "All your worlds, characters, and content export as portable Markdown and JSON. They run anywhere — not just Arcanea.",
    accent: "var(--arc-brand-atlantean-teal)",
  },
  {
    icon: ArrowRight,
    title: "No forced branding",
    body: "Your storefront, your identity. No Arcanea watermarks on sold content. Your name on your work.",
    accent: "var(--arc-brand-arcanean-gold)",
  },
  {
    icon: Shield,
    title: "Fork anywhere",
    body: "Arcanea is MIT licensed. If we ever change direction, take your data and run the whole stack yourself. No vendor lock.",
    accent: "var(--arc-void)",
  },
];
