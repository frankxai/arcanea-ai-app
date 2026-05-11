/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
"use client";

import { LazyMotion, domAnimation, m } from "framer-motion";
import { SectionShell, SectionHeader, IntegrationGrid } from "@/components/premium";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// Additional storage-specific integrations not in the main INTEGRATIONS list
const EXTRA_INTEGRATIONS = [
  { name: "Obsidian", glyph: "◈", color: "var(--arc-void)", status: "live" as const, note: "Vault + plugin" },
  { name: "Syncthing", glyph: "⇄", color: "var(--arc-brand-atlantean-teal)", status: "live" as const, note: "P2P sync" },
  { name: "Logseq", glyph: "◰", color: "var(--arc-wind)", status: "beta" as const, note: "Graph import" },
  { name: "Arweave", glyph: "△", color: "var(--arc-void)", status: "beta" as const, note: "Permanent store" },
];

export function StorageIntegrations() {
  return (
    <LazyMotion features={domAnimation}>
      <SectionShell ambient="purple" id="integrations">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            label="Integrations"
            title="Connects to your stack"
            subtitle="Arcanea storage works with the tools you already use. Supabase, Notion, Google Drive, Obsidian, git — all first-class."
            accent="teal"
          />

          {/* Featured storage integrations */}
          <m.div
            className="mb-8"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <p className="text-[10px] font-mono tracking-[0.25em] uppercase text-white/25 mb-4">
              Storage + sync tools
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
              {EXTRA_INTEGRATIONS.map((intg, i) => (
                <m.div
                  key={intg.name}
                  initial={{ opacity: 0, y: 12, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.4, delay: i * 0.04, ease: EASE }}
                  className="group relative p-4 rounded-xl bg-white/[0.025] border border-white/[0.08] hover:border-white/[0.18] hover:bg-white/[0.04] transition-all duration-300"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center text-base font-bold shrink-0 transition-transform duration-300 group-hover:scale-110"
                      style={{
                        background: `${intg.color}12`,
                        border: `1px solid ${intg.color}25`,
                        color: intg.color,
                      }}
                    >
                      {intg.glyph}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-display font-semibold text-white/85 truncate">
                        {intg.name}
                      </p>
                      <p className="text-[10px] text-white/35 font-body truncate">
                        {intg.note}
                      </p>
                    </div>
                  </div>
                </m.div>
              ))}
            </div>
          </m.div>

          {/* Infrastructure integrations */}
          <div>
            <p className="text-[10px] font-mono tracking-[0.25em] uppercase text-white/25 mb-4">
              Infrastructure
            </p>
            <IntegrationGrid filter="infra" />
          </div>
        </div>
      </SectionShell>
    </LazyMotion>
  );
}
