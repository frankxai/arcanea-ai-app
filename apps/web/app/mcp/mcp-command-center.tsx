"use client";

import { LazyMotion, domAnimation, m } from "framer-motion";
import React, { useState } from "react";
import { Terminal, Copy, Check } from "@/lib/phosphor-icons";

const PLATFORMS = [
  {
    name: "Claude Code",
    command: "claude mcp add arcanea -- npx -y @arcanea/mcp-server",
    description: "Install command (being repaired — workspace dependency issue in 0.7.0).",
    status: "repair" as const,
  },
  {
    name: "Claude Desktop",
    configFile: "~/Library/Application Support/Claude/claude_desktop_config.json",
    configSnippet: `{
  "mcpServers": {
    "arcanea": {
      "command": "npx",
      "args": ["-y", "@arcanea/mcp-server"]
    }
  }
}`,
    description: "Stdio config for Claude Desktop (once the repair publishes).",
    status: "repair" as const,
  },
  {
    name: "Cursor",
    configFile: "~/.cursor/mcp.json",
    configSnippet: `{
  "arcanea": {
    "command": "npx",
    "args": ["-y", "@arcanea/mcp-server"]
  }
}`,
    description: "MCP config for Cursor Composer and Chat (once the repair publishes).",
    status: "repair" as const,
  },
];

export function McpCommandCenter() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <LazyMotion features={domAnimation}>
      <section className="relative overflow-hidden bg-[var(--arc-cosmic-void)] px-4 pb-24 pt-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-display font-semibold tracking-[-0.03em] text-white md:text-5xl mb-4">
              Install Arcanea MCP
            </h2>
            <p className="text-lg text-white/55 max-w-2xl mx-auto leading-relaxed mb-3">
              31 worldbuilding tools for Claude, ChatGPT, and Cursor.
            </p>
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--arc-brand-arcanean-gold)]/20 bg-[var(--arc-brand-arcanean-gold)]/8 px-4 py-2 text-sm text-[var(--arc-brand-arcanean-gold)]">
              <span className="inline-block w-2 h-2 rounded-full bg-[var(--arc-brand-arcanean-gold)] animate-pulse" />
              Install being repaired (workspace dependency in v0.7.0)
            </div>
          </div>

          {/* Three-step install cards */}
          <div className="grid gap-6 mb-16">
            {PLATFORMS.map((platform, index) => (
              <m.article
                key={platform.name}
                className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-display font-semibold text-white/90">
                        {platform.name}
                      </h3>
                      {platform.status === "repair" && (
                        <span className="text-[10px] uppercase tracking-[0.15em] text-[var(--arc-brand-arcanean-gold)]/70 px-2 py-0.5 rounded border border-[var(--arc-brand-arcanean-gold)]/20 bg-[var(--arc-brand-arcanean-gold)]/5">
                          Repair
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-white/50 leading-relaxed">
                      {platform.description}
                    </p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(platform.command || platform.configSnippet || "", index)}
                    className="shrink-0 p-2 rounded-lg border border-white/[0.08] bg-white/[0.03] text-white/70 hover:bg-white/[0.06] hover:text-white transition-colors"
                    aria-label={`Copy ${platform.name} command`}
                  >
                    {copiedIndex === index ? (
                      <Check size={16} weight="bold" />
                    ) : (
                      <Copy size={16} weight="duotone" />
                    )}
                  </button>
                </div>

                {platform.command ? (
                  <pre className="overflow-x-auto rounded-xl border border-white/[0.06] bg-black/35 p-4 text-xs leading-relaxed text-white/70">
                    <code>{platform.command}</code>
                  </pre>
                ) : (
                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/30 mb-2">
                      {platform.configFile}
                    </p>
                    <pre className="overflow-x-auto rounded-xl border border-white/[0.06] bg-black/35 p-4 text-xs leading-relaxed text-white/70">
                      <code>{platform.configSnippet}</code>
                    </pre>
                  </div>
                )}
              </m.article>
            ))}
          </div>

          {/* What you get */}
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6">
            <h3 className="text-xl font-display font-semibold text-white/90 mb-4">
              What's in v0.7.0 (published)
            </h3>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="flex items-start gap-3">
                <div className="shrink-0 w-6 h-6 rounded-lg bg-[var(--arc-brand-atlantean-teal)]/10 border border-[var(--arc-brand-atlantean-teal)]/30 flex items-center justify-center">
                  <span className="text-xs font-display font-bold text-[var(--arc-brand-atlantean-teal)]">31</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-white/80">Worldbuilding tools</p>
                  <p className="text-xs text-white/40">Characters, locations, creatures, artifacts, magic</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="shrink-0 w-6 h-6 rounded-lg bg-white/[0.08] border border-white/[0.12] flex items-center justify-center">
                  <Terminal size={12} weight="duotone" className="text-white/60" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white/80">Local MCP server</p>
                  <p className="text-xs text-white/40">Your data stays on your machine, MIT licensed</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="shrink-0 w-6 h-6 rounded-lg bg-white/[0.08] border border-white/[0.12] flex items-center justify-center">
                  <span className="text-xs text-white/60">→</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-white/80">Next: Install skills</p>
                  <p className="text-xs text-white/40">20 bundled skills via <code className="text-[var(--arc-brand-atlantean-teal)]">npx @arcanea/skills</code></p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="shrink-0 w-6 h-6 rounded-lg bg-[var(--arc-brand-arcanean-gold)]/10 border border-[var(--arc-brand-arcanean-gold)]/30 flex items-center justify-center">
                  <span className="text-xs font-display font-bold text-[var(--arc-brand-arcanean-gold)]">!</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-white/80">Known issue</p>
                  <p className="text-xs text-white/40">v0.7.0 has workspace:* dependency — repair in progress</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </LazyMotion>
  );
}
