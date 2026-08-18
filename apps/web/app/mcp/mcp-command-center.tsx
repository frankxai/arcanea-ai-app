"use client";

import { LazyMotion, domAnimation, m } from "framer-motion";
import React from "react";
import { Terminal } from "@/lib/phosphor-icons";

const PLATFORMS = [
  {
    name: "Claude Code",
    description: "Worldbuilding tools will install via MCP protocol once the workspace dependency is resolved.",
    status: "coming" as const,
  },
  {
    name: "Claude Desktop",
    description: "Stdio MCP config will enable Arcanea tools in every chat once the package publishes.",
    status: "coming" as const,
  },
  {
    name: "Cursor",
    description: "MCP config will add worldbuilding tools to Composer and Chat once the repair lands.",
    status: "coming" as const,
  },
];

export function McpCommandCenter() {
  return (
    <LazyMotion features={domAnimation}>
      <section className="relative overflow-hidden bg-[var(--arc-cosmic-void)] px-4 pb-24 pt-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-display font-semibold tracking-[-0.03em] text-white md:text-5xl mb-4">
              Arcanea MCP Server
            </h2>
            <p className="text-lg text-white/55 max-w-2xl mx-auto leading-relaxed mb-3">
              Worldbuilding tools for Claude, ChatGPT, and Cursor.
            </p>
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--arc-brand-arcanean-gold)]/20 bg-[var(--arc-brand-arcanean-gold)]/8 px-4 py-2 text-sm text-[var(--arc-brand-arcanean-gold)]">
              <span className="inline-block w-2 h-2 rounded-full bg-[var(--arc-brand-arcanean-gold)] animate-pulse" aria-hidden="true" />
              Being repaired (workspace dependency)
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
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-white/40 font-display font-bold text-lg">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-display font-semibold text-white/90">
                        {platform.name}
                      </h3>
                      <span className="text-[11px] tracking-tight text-[var(--arc-brand-arcanean-gold)]/70 px-2 py-0.5 rounded border border-[var(--arc-brand-arcanean-gold)]/20 bg-[var(--arc-brand-arcanean-gold)]/5">
                        Soon
                      </span>
                    </div>
                    <p className="text-sm text-white/50 leading-relaxed">
                      {platform.description}
                    </p>
                  </div>
                </div>
              </m.article>
            ))}
          </div>

          {/* What's available */}
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6">
            <h3 className="text-xl font-display font-semibold text-white/90 mb-4">
              Available now
            </h3>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="flex items-start gap-3">
                <div className="shrink-0 w-6 h-6 rounded-lg bg-white/[0.08] border border-white/[0.12] flex items-center justify-center">
                  <span className="text-xs text-white/60">→</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-white/80">Skills</p>
                  <p className="text-xs text-white/40">
                    <code className="text-[var(--arc-brand-atlantean-teal)]">npx @arcanea/skills</code>
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="shrink-0 w-6 h-6 rounded-lg bg-white/[0.08] border border-white/[0.12] flex items-center justify-center">
                  <Terminal size={12} weight="duotone" className="text-white/60" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white/80">Local runtime</p>
                  <p className="text-xs text-white/40">Your data stays on your machine, MIT licensed</p>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-white/[0.06]">
              <div className="flex items-start gap-3">
                <div className="shrink-0 w-6 h-6 rounded-lg bg-[var(--arc-brand-arcanean-gold)]/10 border border-[var(--arc-brand-arcanean-gold)]/30 flex items-center justify-center">
                  <span className="text-xs font-display font-bold text-[var(--arc-brand-arcanean-gold)]">v0.7.0</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-white/80">MCP server on npm</p>
                  <p className="text-xs text-white/40">workspace:* dependency being repaired</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </LazyMotion>
  );
}
