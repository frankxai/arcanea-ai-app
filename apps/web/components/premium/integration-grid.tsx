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

export const INTEGRATIONS: Integration[] = [
  // Coding & Dev
  { name: "VS Code", category: "coding", glyph: "◧", color: "#007acc", status: "live", note: "Agents extension" },
  { name: "Cursor", category: "coding", glyph: "⎈", color: "#ffffff", status: "live", note: "Native MCP" },
  { name: "Claude Code", category: "coding", glyph: "✶", color: "#f97316", status: "live", note: "Plugins + hooks" },
  { name: "Antigravity", category: "coding", glyph: "↟", color: "#a855f7", status: "soon", note: "Browser-native IDE" },
  { name: "Windsurf", category: "coding", glyph: "⎔", color: "#00bcd4", status: "beta", note: "Rules + context" },
  { name: "GitHub", category: "coding", glyph: "◉", color: "#ffffff", status: "live", note: "27 open repos" },

  // Creative AI
  { name: "Suno", category: "ai", glyph: "♪", color: "#f472b6", status: "live", note: "Music generation" },
  { name: "Nano Banana 2", category: "ai", glyph: "◈", color: "#fbbf24", status: "live", note: "Premium imagery" },
  { name: "ElevenLabs", category: "ai", glyph: "▶", color: "#a855f7", status: "live", note: "Voice synthesis" },
  { name: "Runway", category: "ai", glyph: "▸", color: "#00ff88", status: "beta", note: "Video generation" },
  { name: "Midjourney", category: "ai", glyph: "✦", color: "#ffffff", status: "soon", note: "Style reference" },
  { name: "Hedra", category: "ai", glyph: "◐", color: "#7fffd4", status: "beta", note: "Avatar animation" },

  // Distribution / Social
  { name: "Blotato", category: "social", glyph: "◬", color: "#ef4444", status: "live", note: "Multi-channel posting" },
  { name: "Postiz", category: "social", glyph: "◱", color: "#3b82f6", status: "live", note: "Scheduling pipeline" },
  { name: "n8n", category: "social", glyph: "⏚", color: "#ea580c", status: "live", note: "Workflow automation" },
  { name: "Zapier", category: "social", glyph: "⚡", color: "#ff4a00", status: "soon", note: "Trigger automation" },

  // Community
  { name: "Discord", category: "community", glyph: "◎", color: "#5865F2", status: "live", note: "Creator server" },
  { name: "Reddit", category: "community", glyph: "◐", color: "#ff4500", status: "live", note: "r/Arcanea" },
  { name: "Whop", category: "community", glyph: "⎊", color: "#f59e0b", status: "live", note: "Membership tiers" },
  { name: "Telegram", category: "community", glyph: "✈", color: "#0088cc", status: "beta", note: "Creator bots" },

  // Game Engines
  { name: "Unreal Engine", category: "game", glyph: "⧉", color: "#313131", status: "beta", note: "World export" },
  { name: "Unity", category: "game", glyph: "◇", color: "#ffffff", status: "beta", note: "Prefab pipeline" },
  { name: "Godot", category: "game", glyph: "◈", color: "#3d8fcc", status: "soon", note: "Scene bridge" },
  { name: "Roblox Studio", category: "game", glyph: "◼", color: "#ef4444", status: "soon", note: "Experience export" },

  // Blockchain / Web3
  { name: "Base", category: "chain", glyph: "◉", color: "#0052ff", status: "live", note: "L2 deployments" },
  { name: "Story Protocol", category: "chain", glyph: "✍", color: "#ffffff", status: "beta", note: "IP licensing" },
  { name: "Lens", category: "chain", glyph: "❁", color: "#00501e", status: "soon", note: "Social graph" },
  { name: "Farcaster", category: "chain", glyph: "△", color: "#855dcd", status: "beta", note: "Decentralized feed" },

  // Platforms
  { name: "Google", category: "infra", glyph: "G", color: "#4285f4", status: "live", note: "Drive + Calendar" },
  { name: "X", category: "infra", glyph: "𝕏", color: "#ffffff", status: "live", note: "Post + DM sync" },
  { name: "Meta", category: "infra", glyph: "∞", color: "#0668E1", status: "beta", note: "IG + FB + Threads" },
  { name: "Notion", category: "infra", glyph: "◰", color: "#ffffff", status: "live", note: "Docs sync" },
  { name: "Linear", category: "infra", glyph: "▰", color: "#5e6ad2", status: "live", note: "Project sync" },
  { name: "Vercel", category: "infra", glyph: "▲", color: "#ffffff", status: "live", note: "Deployment" },
  { name: "Supabase", category: "infra", glyph: "◎", color: "#3ecf8e", status: "live", note: "DB + Auth" },
  { name: "Stripe", category: "infra", glyph: "◱", color: "#635bff", status: "live", note: "Payments" },
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

          {/* Glyph */}
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center mb-3 text-lg font-bold transition-transform duration-300 group-hover:scale-110"
            style={{
              background: `${intg.color}12`,
              border: `1px solid ${intg.color}25`,
              color: intg.color,
            }}
          >
            {intg.glyph}
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
