"use client";

import { m } from "framer-motion";

// ---------------------------------------------------------------------------
// IntegrationGrid — Logo grid of all Arcanea integrations.
// Shows the breadth of the stack: coding CLIs, creative tools, social
// platforms, game engines, blockchain, etc.
// ---------------------------------------------------------------------------

export type IntegrationCategory =
  | "coding"
  | "creative"
  | "social"
  | "community"
  | "game"
  | "chain"
  | "infra"
  | "ai";

export interface Integration {
  name: string;
  category: IntegrationCategory;
  logo?: string;
  glyph?: string;
  color: string;
  status?: "live" | "beta" | "soon";
  url?: string;
  note?: string;
}

// Integration status reflects what's actually wired in arcanea-ai-app.
// "live" = working end-to-end today. "beta" = partial/opt-in. "soon" = planned.
// Audit done 2026-04-17 against CURRENT_BACKLOG_2026-04-13.md — most surface-level
// marketing claims were downgraded to honest status.
export const INTEGRATIONS: Integration[] = [
  // Coding & Dev — the IDE/CLI layer
  { name: "Claude Code", category: "coding", glyph: "✶", color: "#f97316", status: "live", note: "MCP server + 80 skills" },
  { name: "Cursor", category: "coding", glyph: "⎈", color: "#ffffff", status: "beta", note: "MCP via .cursor/mcp.json" },
  { name: "VS Code", category: "coding", glyph: "◧", color: "#007acc", status: "beta", note: "MCP-ready, no extension yet" },
  { name: "Windsurf", category: "coding", glyph: "⎔", color: "#00bcd4", status: "beta", note: "MCP + rules bridge" },
  { name: "Antigravity", category: "coding", glyph: "↟", color: "#a855f7", status: "soon", note: "Browser-native IDE" },
  { name: "GitHub", category: "coding", glyph: "◉", color: "#ffffff", status: "live", note: "27 public repos" },

  // Creative AI — inline generation
  { name: "Nano Banana 2", category: "ai", glyph: "◈", color: "#fbbf24", status: "live", note: "/imagine uses it today" },
  { name: "Anthropic Claude", category: "ai", glyph: "✶", color: "#f97316", status: "live", note: "Default chat provider" },
  { name: "Google Gemini", category: "ai", glyph: "◎", color: "#4285f4", status: "live", note: "Chat + imagine routing" },
  { name: "Suno", category: "ai", glyph: "♪", color: "#f472b6", status: "soon", note: "Music gen — API planned" },
  { name: "ElevenLabs", category: "ai", glyph: "▶", color: "#a855f7", status: "soon", note: "Voice — Presence Layer" },
  { name: "Runway", category: "ai", glyph: "▸", color: "#00ff88", status: "soon", note: "Video — researched" },
  { name: "Midjourney", category: "ai", glyph: "✦", color: "#ffffff", status: "soon", note: "Style reference" },
  { name: "Hedra", category: "ai", glyph: "◐", color: "#7fffd4", status: "soon", note: "Avatar — Presence Layer" },

  // Distribution / Social — publishing
  { name: "Blotato", category: "social", glyph: "◬", color: "#ef4444", status: "soon", note: "Multi-channel posting" },
  { name: "Postiz", category: "social", glyph: "◱", color: "#3b82f6", status: "soon", note: "Scheduling" },
  { name: "n8n", category: "social", glyph: "⏚", color: "#ea580c", status: "soon", note: "Self-host workflows" },
  { name: "Zapier", category: "social", glyph: "⚡", color: "#ff4a00", status: "soon", note: "Trigger automation" },

  // Community — where Arcanea gathers (manual links today, no sync)
  { name: "Discord", category: "community", glyph: "◎", color: "#5865F2", status: "beta", note: "Server open; bot soon" },
  { name: "Reddit", category: "community", glyph: "◐", color: "#ff4500", status: "beta", note: "r/Arcanea live" },
  { name: "Whop", category: "community", glyph: "⎊", color: "#f59e0b", status: "soon", note: "Membership tiers" },
  { name: "Telegram", category: "community", glyph: "✈", color: "#0088cc", status: "soon", note: "Creator bots" },

  // Game Engines — no exporters shipped yet
  { name: "Unreal Engine", category: "game", glyph: "⧉", color: "#313131", status: "soon", note: "World export spec" },
  { name: "Unity", category: "game", glyph: "◇", color: "#ffffff", status: "soon", note: "Prefab pipeline spec" },
  { name: "Godot", category: "game", glyph: "◈", color: "#3d8fcc", status: "soon", note: "Scene bridge" },
  { name: "Roblox Studio", category: "game", glyph: "◼", color: "#ef4444", status: "soon", note: "Experience export" },

  // Blockchain / Web3 — onchain is a separate workstream (non-goal per backlog)
  { name: "Base", category: "chain", glyph: "◉", color: "#0052ff", status: "soon", note: "L2 anchoring planned" },
  { name: "Story Protocol", category: "chain", glyph: "✍", color: "#ffffff", status: "soon", note: "IP licensing P5" },
  { name: "Farcaster", category: "chain", glyph: "△", color: "#855dcd", status: "soon", note: "Agent handles" },
  { name: "Lens", category: "chain", glyph: "❁", color: "#00501e", status: "soon", note: "Social graph" },

  // Platforms & Infra — what the app actually runs on
  { name: "Vercel", category: "infra", glyph: "▲", color: "#ffffff", status: "live", note: "Production hosting" },
  { name: "Supabase", category: "infra", glyph: "◎", color: "#3ecf8e", status: "live", note: "DB + Auth + pgvector" },
  { name: "Vercel AI SDK", category: "infra", glyph: "◱", color: "#ffffff", status: "live", note: "Chat streaming" },
  { name: "Notion", category: "infra", glyph: "◰", color: "#ffffff", status: "soon", note: "Docs sync" },
  { name: "Linear", category: "infra", glyph: "▰", color: "#5e6ad2", status: "soon", note: "ARC project sync" },
  { name: "Google Drive", category: "infra", glyph: "G", color: "#4285f4", status: "soon", note: "Studio ingestion" },
  { name: "Obsidian", category: "infra", glyph: "◰", color: "#7c3aed", status: "soon", note: "Vault sync" },
  { name: "Stripe", category: "infra", glyph: "◱", color: "#635bff", status: "soon", note: "x402 preferred first" },
];

const STATUS_LABEL: Record<NonNullable<Integration["status"]>, string> = {
  live: "LIVE",
  beta: "BETA",
  soon: "SOON",
};

const STATUS_COLOR: Record<NonNullable<Integration["status"]>, string> = {
  live: "#7fffd4",
  beta: "#ffd700",
  soon: "#94a3b8",
};

export function IntegrationGrid({
  filter,
  limit,
}: {
  filter?: IntegrationCategory;
  limit?: number;
}) {
  const filtered = filter
    ? INTEGRATIONS.filter((i) => i.category === filter)
    : INTEGRATIONS;
  const displayed = limit ? filtered.slice(0, limit) : filtered;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
      {displayed.map((intg, i) => (
        <m.div
          key={intg.name}
          initial={{ opacity: 0, y: 12, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.4, delay: i * 0.03, ease: [0.22, 1, 0.36, 1] }}
          className="group relative p-4 rounded-xl bg-white/[0.025] border border-white/[0.06] hover:border-white/[0.15] hover:bg-white/[0.04] transition-all duration-300"
        >
          {/* Status dot */}
          {intg.status && (
            <div className="absolute top-2 right-2 flex items-center gap-1">
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  background: STATUS_COLOR[intg.status],
                  boxShadow: intg.status === "live" ? `0 0 6px ${STATUS_COLOR[intg.status]}` : "none",
                }}
              />
              <span
                className="text-[8px] font-mono tracking-wider"
                style={{ color: `${STATUS_COLOR[intg.status]}aa` }}
              >
                {STATUS_LABEL[intg.status]}
              </span>
            </div>
          )}

          {/* Monogram */}
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110"
            style={{
              background: `linear-gradient(135deg, ${intg.color}1a, ${intg.color}08)`,
              border: `1px solid ${intg.color}30`,
              color: intg.color,
              boxShadow: `inset 0 1px 0 ${intg.color}18`,
            }}
            aria-hidden="true"
          >
            <span
              className="font-display font-semibold leading-none tracking-tight"
              style={{
                fontSize: "0.95rem",
                letterSpacing: "-0.01em",
                textShadow: `0 0 12px ${intg.color}55`,
              }}
            >
              {intg.name.replace(/^The\s+/i, "").slice(0, 2)}
            </span>
          </div>

          {/* Name */}
          <p className="text-sm font-display font-semibold text-white/85 leading-tight truncate">
            {intg.name}
          </p>

          {/* Note */}
          {intg.note && (
            <p className="text-[10px] text-white/35 mt-0.5 font-body truncate">
              {intg.note}
            </p>
          )}
        </m.div>
      ))}
    </div>
  );
}
