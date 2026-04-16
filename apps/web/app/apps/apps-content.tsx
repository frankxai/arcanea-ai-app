"use client";

import { useState } from "react";
import { LazyMotion, domAnimation, m } from "framer-motion";
import Link from "next/link";
import {
  FloatingOrbs,
  AppTile,
  type AppTileProps,
  FeatureCard,
  StatCard,
} from "@/components/premium";

// ---------------------------------------------------------------------------
// App catalogue data
// ---------------------------------------------------------------------------

type Category =
  | "All"
  | "Featured"
  | "Creative AI"
  | "Coding"
  | "Distribution"
  | "Community"
  | "Game Engines"
  | "Storage"
  | "Web3";

interface AppEntry extends Omit<AppTileProps, "index"> {
  featured?: boolean;
  filterCategory: Category;
}

const APPS: AppEntry[] = [
  // Coding
  {
    name: "Claude Code",
    tagline: "Agents in your IDE via MCP. Luminor rules, hooks, and skills.",
    category: "Coding",
    filterCategory: "Coding",
    glyph: "✶",
    color: "#f97316",
    status: "live",
    installed: true,
    featured: true,
    capabilities: ["MCP Server", "Agent Hooks", "Skill Packs"],
    href: "/apps/claude-code",
  },
  {
    name: "VS Code",
    tagline: "Arcanea agents extension with in-editor Luminor sidebar.",
    category: "Coding",
    filterCategory: "Coding",
    glyph: "◧",
    color: "#007acc",
    status: "live",
    capabilities: ["Agents Extension", "Inline Chat", "File Context"],
    href: "/apps/vscode",
  },
  {
    name: "Cursor",
    tagline: "Native MCP integration — rules, context, and agent routing.",
    category: "Coding",
    filterCategory: "Coding",
    glyph: "⎈",
    color: "#ffffff",
    status: "live",
    capabilities: ["MCP Native", "Rules Sync", "Context Injection"],
    href: "/apps/cursor",
  },
  {
    name: "Windsurf",
    tagline: "Rules and context files for Windsurf's Cascade engine.",
    category: "Coding",
    filterCategory: "Coding",
    glyph: "⎔",
    color: "#00bcd4",
    status: "beta",
    capabilities: ["Rules Sync", "Context Files", "Cascade Hooks"],
    href: "/apps/windsurf",
  },
  {
    name: "Antigravity",
    tagline: "Browser-native IDE with Luminor agents running in-tab.",
    category: "Coding",
    filterCategory: "Coding",
    glyph: "↟",
    color: "#a855f7",
    status: "soon",
    capabilities: ["In-Browser Agents", "Realtime Collab", "MCP Bridge"],
    href: "/apps/antigravity",
  },
  {
    name: "GitHub",
    tagline: "27 open repos, PR reviews, and automated releases via Lumina.",
    category: "Coding",
    filterCategory: "Coding",
    glyph: "◉",
    color: "#ffffff",
    status: "live",
    installed: true,
    capabilities: ["PR Automation", "Release Manager", "Code Review"],
    href: "/apps/github",
  },

  // Creative AI
  {
    name: "Suno",
    tagline: "AI music generation — tracks, albums, world soundtracks.",
    category: "Creative AI",
    filterCategory: "Creative AI",
    glyph: "♪",
    color: "#f472b6",
    status: "live",
    featured: true,
    capabilities: ["Generation", "Licensing", "World Sync"],
    href: "/apps/suno",
  },
  {
    name: "Nano Banana 2",
    tagline: "Premium image generation with Guardian style presets.",
    category: "Creative AI",
    filterCategory: "Creative AI",
    glyph: "◈",
    color: "#fbbf24",
    status: "live",
    featured: true,
    capabilities: ["Image Gen", "Style Presets", "Batch Export"],
    href: "/apps/nano-banana-2",
  },
  {
    name: "ElevenLabs",
    tagline: "Voice synthesis — Luminor voices, audiobooks, narration.",
    category: "Creative AI",
    filterCategory: "Creative AI",
    glyph: "▶",
    color: "#a855f7",
    status: "live",
    capabilities: ["Voice Cloning", "Audiobook Gen", "Luminor Voices"],
    href: "/apps/elevenlabs",
  },
  {
    name: "Runway",
    tagline: "Video generation for cinematic world intros and trailers.",
    category: "Creative AI",
    filterCategory: "Creative AI",
    glyph: "▸",
    color: "#00ff88",
    status: "beta",
    capabilities: ["Video Gen", "Trailer Engine", "Scene Bridge"],
    href: "/apps/runway",
  },
  {
    name: "Hedra",
    tagline: "Avatar animation — bring Guardian characters to life.",
    category: "Creative AI",
    filterCategory: "Creative AI",
    glyph: "◐",
    color: "#7fffd4",
    status: "beta",
    capabilities: ["Avatar Animation", "Lip Sync", "Guardian Skins"],
    href: "/apps/hedra",
  },
  {
    name: "Midjourney",
    tagline: "Style reference and concept art for worlds and characters.",
    category: "Creative AI",
    filterCategory: "Creative AI",
    glyph: "✦",
    color: "#e2e8f0",
    status: "soon",
    capabilities: ["Style Refs", "Character Art", "World Concepts"],
    href: "/apps/midjourney",
  },

  // Distribution
  {
    name: "Blotato",
    tagline: "Multi-channel social posting — one creation, everywhere.",
    category: "Distribution",
    filterCategory: "Distribution",
    glyph: "◬",
    color: "#ef4444",
    status: "live",
    capabilities: ["Multi-Post", "Thread Engine", "Analytics"],
    href: "/apps/blotato",
  },
  {
    name: "Postiz",
    tagline: "Scheduling pipeline — drop your creation, Postiz handles the rest.",
    category: "Distribution",
    filterCategory: "Distribution",
    glyph: "◱",
    color: "#3b82f6",
    status: "live",
    capabilities: ["Scheduling", "Calendar", "Repurpose"],
    href: "/apps/postiz",
  },
  {
    name: "n8n",
    tagline: "Workflow automation — Arcanea events trigger any action.",
    category: "Distribution",
    filterCategory: "Distribution",
    glyph: "⏚",
    color: "#ea580c",
    status: "live",
    capabilities: ["Webhooks", "Node Engine", "Multi-Step Flows"],
    href: "/apps/n8n",
  },
  {
    name: "Zapier",
    tagline: "Trigger automation — connect Arcanea to 6,000+ apps.",
    category: "Distribution",
    filterCategory: "Distribution",
    glyph: "⚡",
    color: "#ff4a00",
    status: "soon",
    capabilities: ["Triggers", "Actions", "Multi-Step Zaps"],
    href: "/apps/zapier",
  },

  // Community
  {
    name: "Discord",
    tagline: "Creator community — lore, contests, and live Luminor sessions.",
    category: "Community",
    filterCategory: "Community",
    glyph: "◎",
    color: "#5865F2",
    status: "live",
    installed: true,
    featured: true,
    capabilities: ["Server Bots", "Role Sync", "Live Sessions"],
    href: "/apps/discord",
  },
  {
    name: "Reddit",
    tagline: "r/Arcanea — community hub, AMA, feedback threads.",
    category: "Community",
    filterCategory: "Community",
    glyph: "◐",
    color: "#ff4500",
    status: "live",
    capabilities: ["Post Sync", "Flair System", "AMA Engine"],
    href: "/apps/reddit",
  },
  {
    name: "Whop",
    tagline: "Membership tiers — Founding Circle access and premium channels.",
    category: "Community",
    filterCategory: "Community",
    glyph: "⎊",
    color: "#f59e0b",
    status: "live",
    capabilities: ["Tier Access", "Gated Content", "Stripe Sync"],
    href: "/apps/whop",
  },
  {
    name: "Telegram",
    tagline: "Creator bots — Luminor Q&A and world-update notifications.",
    category: "Community",
    filterCategory: "Community",
    glyph: "✈",
    color: "#0088cc",
    status: "beta",
    capabilities: ["Bot Framework", "World Alerts", "Group Sync"],
    href: "/apps/telegram",
  },

  // Game Engines
  {
    name: "Unreal Engine",
    tagline: "Export world data to Unreal scenes — characters, locations, lore.",
    category: "Game Engines",
    filterCategory: "Game Engines",
    glyph: "⧉",
    color: "#a0a0a0",
    status: "beta",
    capabilities: ["World Export", "Asset Pipeline", "Level Builder"],
    href: "/apps/unreal",
  },
  {
    name: "Unity",
    tagline: "Prefab pipeline — Arcanea assets drop into Unity projects.",
    category: "Game Engines",
    filterCategory: "Game Engines",
    glyph: "◇",
    color: "#e2e8f0",
    status: "beta",
    capabilities: ["Prefab Export", "Scene Bridge", "C# SDK"],
    href: "/apps/unity",
  },
  {
    name: "Godot",
    tagline: "Scene bridge — import worlds directly as Godot scene trees.",
    category: "Game Engines",
    filterCategory: "Game Engines",
    glyph: "◈",
    color: "#3d8fcc",
    status: "soon",
    capabilities: ["Scene Import", "GDScript Bindings", "Asset Sync"],
    href: "/apps/godot",
  },
  {
    name: "Roblox Studio",
    tagline: "Experience export — Arcanea worlds as Roblox experiences.",
    category: "Game Engines",
    filterCategory: "Game Engines",
    glyph: "◼",
    color: "#ef4444",
    status: "soon",
    capabilities: ["Experience Export", "Lua Scripts", "Asset Pack"],
    href: "/apps/roblox",
  },

  // Storage
  {
    name: "Google Drive",
    tagline: "Vault sync — export all creations to Drive automatically.",
    category: "Storage",
    filterCategory: "Storage",
    glyph: "G",
    color: "#4285f4",
    status: "live",
    capabilities: ["Auto Sync", "Folder Structure", "Shared Drives"],
    href: "/apps/google-drive",
  },
  {
    name: "Notion",
    tagline: "Docs sync — Arcanea lore and world notes in your workspace.",
    category: "Storage",
    filterCategory: "Storage",
    glyph: "◰",
    color: "#e2e8f0",
    status: "live",
    capabilities: ["Page Sync", "Database Blocks", "Template Export"],
    href: "/apps/notion",
  },
  {
    name: "Obsidian",
    tagline: "Personal vault — world graphs as linked Obsidian notes.",
    category: "Storage",
    filterCategory: "Storage",
    glyph: "⬡",
    color: "#7c3aed",
    status: "beta",
    capabilities: ["Graph Export", "Markdown Sync", "Dataview Queries"],
    href: "/apps/obsidian",
  },
  {
    name: "Arweave",
    tagline: "Permanent storage — on-chain archival for your creations.",
    category: "Storage",
    filterCategory: "Storage",
    glyph: "∞",
    color: "#9ca3af",
    status: "beta",
    capabilities: ["Permanent Archive", "Content Hash", "IPFS Bridge"],
    href: "/apps/arweave",
  },
  {
    name: "Syncthing",
    tagline: "P2P device sync — offline-first creative vault across devices.",
    category: "Storage",
    filterCategory: "Storage",
    glyph: "⟳",
    color: "#22c55e",
    status: "soon",
    capabilities: ["P2P Sync", "Offline First", "Conflict Resolve"],
    href: "/apps/syncthing",
  },

  // Web3
  {
    name: "Base",
    tagline: "L2 deployments — mint, transfer, and royalties on Base.",
    category: "Web3",
    filterCategory: "Web3",
    glyph: "◉",
    color: "#0052ff",
    status: "live",
    capabilities: ["Mint Engine", "Royalties", "x402 Payments"],
    href: "/apps/base",
  },
  {
    name: "Story Protocol",
    tagline: "IP licensing — register your creations as programmable IP.",
    category: "Web3",
    filterCategory: "Web3",
    glyph: "✍",
    color: "#e2e8f0",
    status: "beta",
    capabilities: ["IP Registration", "License Terms", "Revenue Split"],
    href: "/apps/story-protocol",
  },
  {
    name: "Lens",
    tagline: "Social graph — creators as first-class on-chain identities.",
    category: "Web3",
    filterCategory: "Web3",
    glyph: "❁",
    color: "#22c55e",
    status: "soon",
    capabilities: ["Social Graph", "Profile NFT", "Follow API"],
    href: "/apps/lens",
  },
  {
    name: "Farcaster",
    tagline: "Decentralized feed — publish directly to the Farcaster protocol.",
    category: "Web3",
    filterCategory: "Web3",
    glyph: "△",
    color: "#855dcd",
    status: "beta",
    capabilities: ["Cast Engine", "Frame Builder", "Channel Sync"],
    href: "/apps/farcaster",
  },
  {
    name: "Linear",
    tagline: "Project sync — Arcanea AIPs and tasks become Linear issues.",
    category: "Distribution",
    filterCategory: "Distribution",
    glyph: "▰",
    color: "#5e6ad2",
    status: "live",
    capabilities: ["Issue Sync", "AIP Tracker", "Sprint Board"],
    href: "/apps/linear",
  },
  {
    name: "Vercel",
    tagline: "Preview deployments — every world fork gets a live URL.",
    category: "Coding",
    filterCategory: "Coding",
    glyph: "▲",
    color: "#e2e8f0",
    status: "live",
    capabilities: ["Preview URLs", "Edge Config", "CI Hooks"],
    href: "/apps/vercel",
  },
  {
    name: "Supabase",
    tagline: "Database and auth — all world data lives in Supabase.",
    category: "Storage",
    filterCategory: "Storage",
    glyph: "◎",
    color: "#3ecf8e",
    status: "live",
    installed: true,
    capabilities: ["DB + Auth", "Realtime", "pgvector Search"],
    href: "/apps/supabase",
  },
  {
    name: "Stripe",
    tagline: "Payments — Founding Circle subscriptions and creator royalties.",
    category: "Distribution",
    filterCategory: "Distribution",
    glyph: "◱",
    color: "#635bff",
    status: "live",
    capabilities: ["Subscriptions", "Creator Payouts", "Webhook Engine"],
    href: "/apps/stripe",
  },
];

const CATEGORIES: Category[] = [
  "All",
  "Featured",
  "Creative AI",
  "Coding",
  "Distribution",
  "Community",
  "Game Engines",
  "Storage",
  "Web3",
];

const HERO_STATS = [
  { value: "37+", label: "apps", color: "#7fffd4" },
  { value: "8", label: "categories", color: "#00bcd4" },
  { value: "MIT", label: "license", color: "#c084fc" },
  { value: "BYOK", label: "model agnostic", color: "#ffd700" },
];

// Featured apps shown in the hero row
const FEATURED_NAMES = ["Claude Code", "Suno", "Nano Banana 2", "Discord"];

// ---------------------------------------------------------------------------
// Category filter pill component
// ---------------------------------------------------------------------------

function CategoryPill({
  category,
  active,
  onClick,
}: {
  category: Category;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-mono tracking-wider uppercase border transition-all duration-200 ${
        active
          ? "bg-[#00bcd4]/15 border-[#00bcd4]/40 text-[#7fffd4]"
          : "bg-white/[0.03] border-white/[0.06] text-white/40 hover:border-white/[0.15] hover:text-white/60"
      }`}
    >
      {category}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Main content component
// ---------------------------------------------------------------------------

export function AppsContent() {
  const [activeCategory, setActiveCategory] = useState<Category>("All");

  const featuredApps = APPS.filter((a) => FEATURED_NAMES.includes(a.name));

  const filteredApps = APPS.filter((app) => {
    if (activeCategory === "All") return true;
    if (activeCategory === "Featured") return Boolean(app.featured);
    return app.filterCategory === activeCategory;
  });

  return (
    <LazyMotion features={domAnimation}>
      <div className="relative min-h-screen bg-[#09090b] text-white">
        {/* ── Hero ──────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden pt-28 pb-20">
          <FloatingOrbs preset="aurora" />

          {/* Dot grid */}
          <div
            className="pointer-events-none absolute inset-0 -z-10 opacity-[0.022]"
            aria-hidden
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />

          {/* Top rule glow */}
          <div
            className="pointer-events-none absolute top-0 left-0 right-0 h-px -z-10"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(127,255,212,0.20) 40%, rgba(0,188,212,0.30) 50%, rgba(127,255,212,0.20) 60%, transparent 100%)",
            }}
            aria-hidden
          />

          <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
            {/* Eyebrow */}
            <m.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-3 mb-8"
            >
              <div className="h-px w-8 bg-gradient-to-r from-transparent to-[#7fffd4]/50" />
              <span className="font-mono text-[10px] tracking-[0.35em] uppercase text-[#7fffd4]/70">
                Apps
              </span>
              <div className="h-px w-8 bg-gradient-to-l from-transparent to-[#7fffd4]/50" />
            </m.div>

            {/* Headline */}
            <m.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.05 }}
              className="text-5xl md:text-7xl font-display font-bold tracking-[-0.03em] leading-[1.04] mb-6"
            >
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, #7fffd4 0%, #00bcd4 40%, #c084fc 80%)",
                }}
              >
                Install once.
              </span>
              <br />
              <span className="text-white/80">Create forever.</span>
            </m.h1>

            {/* Subtitle */}
            <m.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.12 }}
              className="text-base md:text-xl text-white/45 max-w-2xl mx-auto leading-relaxed mb-12 font-body"
            >
              One-click connectors to the tools you already use. AI models, game
              engines, social channels, storage — your creative stack, wired
              together.
            </m.p>

            {/* Stats */}
            <m.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-2xl mx-auto"
            >
              {HERO_STATS.map(({ value, label, color }, i) => (
                <StatCard
                  key={label}
                  value={value}
                  label={label}
                  color={color}
                  delay={0.24 + i * 0.06}
                />
              ))}
            </m.div>
          </div>
        </section>

        {/* ── Featured Row ───────────────────────────────────────────────── */}
        <section className="relative pb-16">
          <div className="max-w-6xl mx-auto px-6">
            <m.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <p className="font-mono text-[10px] tracking-[0.35em] uppercase text-white/25 mb-1">
                Featured
              </p>
              <h2 className="text-xl font-display font-semibold text-white/70">
                Most-installed connectors
              </h2>
            </m.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {featuredApps.map((app, i) => (
                <AppTile key={app.name} {...app} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* ── Divider ───────────────────────────────────────────────────── */}
        <div className="max-w-6xl mx-auto px-6 mb-10" aria-hidden>
          <div
            className="h-px w-full"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.05) 40%, rgba(0,188,212,0.12) 50%, rgba(255,255,255,0.05) 60%, transparent 100%)",
            }}
          />
        </div>

        {/* ── All Apps ──────────────────────────────────────────────────── */}
        <section className="relative pb-24">
          <div className="max-w-6xl mx-auto px-6">
            {/* Category filter */}
            <m.div
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5 }}
              className="flex flex-wrap gap-2 mb-10"
            >
              {CATEGORIES.map((cat) => (
                <CategoryPill
                  key={cat}
                  category={cat}
                  active={activeCategory === cat}
                  onClick={() => setActiveCategory(cat)}
                />
              ))}
            </m.div>

            {/* Apps grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredApps.map((app, i) => (
                <AppTile key={`${app.name}-${activeCategory}`} {...app} index={i} />
              ))}
            </div>

            {filteredApps.length === 0 && (
              <div className="text-center py-20 text-white/30 font-body">
                No apps in this category yet.
              </div>
            )}
          </div>
        </section>

        {/* ── Build your own section ────────────────────────────────────── */}
        <section className="relative pb-24">
          <div className="max-w-6xl mx-auto px-6">
            <m.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <p className="font-mono text-[10px] tracking-[0.35em] uppercase text-white/25 mb-1">
                For developers
              </p>
              <h2 className="text-xl font-display font-semibold text-white/70">
                Build your own connector
              </h2>
            </m.div>

            <FeatureCard glowColor="#7fffd4" delay={0.1}>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
                <div className="flex-1">
                  <div
                    className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-5 text-xl"
                    style={{
                      background: "#7fffd412",
                      border: "1px solid #7fffd420",
                      color: "#7fffd4",
                    }}
                  >
                    {"</>"}
                  </div>
                  <h3 className="text-2xl font-display font-semibold text-white/90 mb-3">
                    Ship your own connector
                  </h3>
                  <p className="text-sm text-white/45 leading-relaxed max-w-lg font-body">
                    Arcanea Apps is an open spec. Any tool can publish a connector
                    to our marketplace. Earn revenue share when creators install —
                    70% to you, 30% to the protocol. MIT licensed, BYOK by design.
                  </p>
                  <ul className="mt-5 flex flex-col gap-2">
                    {[
                      "Open connector spec — implement in any language",
                      "Revenue share when creators install your connector",
                      "Automated review — ships in 24 hours",
                    ].map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 text-sm text-white/40 font-body"
                      >
                        <span className="mt-1.5 w-1 h-1 rounded-full bg-[#7fffd4]/50 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex-shrink-0">
                  <Link
                    href="/developers"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#7fffd4]/10 border border-[#7fffd4]/20 text-sm font-semibold text-[#7fffd4] hover:bg-[#7fffd4]/15 hover:border-[#7fffd4]/35 transition-all duration-200"
                  >
                    Read developer docs
                    <span className="text-xs">→</span>
                  </Link>
                </div>
              </div>
            </FeatureCard>
          </div>
        </section>

        {/* ── Final CTA ─────────────────────────────────────────────────── */}
        <section className="relative pb-32">
          <div className="max-w-4xl mx-auto px-6">
            <m.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="relative overflow-hidden rounded-3xl"
            >
              {/* Gradient background */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#7fffd4]/[0.07] via-[#00bcd4]/[0.05] to-[#a855f7]/[0.07]" />
              <div className="absolute inset-0 bg-white/[0.02]" />

              {/* Top accent line */}
              <div
                className="absolute top-0 left-12 right-12 h-px"
                style={{
                  background:
                    "linear-gradient(to right, transparent, rgba(127,255,212,0.4), transparent)",
                }}
              />

              <div className="relative p-10 md:p-16 text-center">
                <p className="font-mono text-[10px] tracking-[0.35em] uppercase text-white/25 mb-4">
                  Marketplace
                </p>
                <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4 tracking-[-0.02em]">
                  Your entire creative stack,
                  <br />
                  <span
                    className="bg-clip-text text-transparent"
                    style={{
                      backgroundImage:
                        "linear-gradient(to right, #7fffd4, #00bcd4)",
                    }}
                  >
                    in one place.
                  </span>
                </h2>
                <p className="text-base text-white/40 mb-10 max-w-lg mx-auto font-body">
                  Connect your tools, automate your workflow, and create without
                  switching tabs.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link
                    href="/apps"
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#7fffd4] to-[#00bcd4] text-sm font-semibold text-[#09090b] hover:shadow-[0_0_40px_rgba(127,255,212,0.25)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                  >
                    Explore all apps
                    <span className="text-xs">→</span>
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border border-white/[0.08] bg-white/[0.03] text-sm font-medium text-white/60 hover:border-white/[0.15] hover:text-white/80 transition-all duration-200"
                  >
                    Request an integration
                  </Link>
                </div>
                <p className="mt-8 text-[11px] font-mono text-white/20 tracking-wider">
                  MIT licensed. BYOK. 70/30 revenue share for connector developers.
                </p>
              </div>
            </m.div>
          </div>
        </section>
      </div>
    </LazyMotion>
  );
}
