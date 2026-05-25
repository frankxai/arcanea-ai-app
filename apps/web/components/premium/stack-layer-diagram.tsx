/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
"use client";

import { m } from "framer-motion";
import {
  brand,
  ambient,
  guardianAccents,
  semantic,
} from "@arcanea/design-system";

// ---------------------------------------------------------------------------
// StackLayerDiagram — Visual representation of the full Arcanea stack.
// From IDE/CLI at the bottom to distribution channels at the top.
// Shows creators exactly where Arcanea fits in their workflow.
// ---------------------------------------------------------------------------

interface Layer {
  label: string;
  tagline: string;
  items: { name: string; accent?: string }[];
  accent: string;
}

const LAYERS: Layer[] = [
  {
    label: "Distribution",
    tagline: "Where your creations reach audiences",
    accent: brand.arcaneanGold,
    items: [
      { name: "Discord" },
      { name: "Reddit" },
      { name: "X / Twitter" },
      { name: "YouTube" },
      { name: "Instagram" },
      { name: "Whop" },
      { name: "Farcaster" },
      { name: "Gumroad" },
    ],
  },
  {
    label: "Automation",
    tagline: "How work moves between tools",
    accent: ambient.lavender,
    items: [
      { name: "Blotato" },
      { name: "Postiz" },
      { name: "n8n" },
      { name: "Zapier" },
      { name: "Make" },
    ],
  },
  {
    label: "Creative AI",
    tagline: "Specialist models for each craft",
    accent: guardianAccents.lyria,
    items: [
      { name: "Suno" },
      { name: "Nano Banana 2" },
      { name: "ElevenLabs" },
      { name: "Runway" },
      { name: "Hedra" },
      { name: "Simli" },
    ],
  },
  {
    label: "Arcanea Core",
    tagline: "The world graph + 16 specialists",
    accent: brand.aquamarine,
    items: [
      { name: "Luminors", accent: brand.aquamarine },
      { name: "World Engine", accent: brand.aquamarine },
      { name: "Library", accent: brand.aquamarine },
      { name: "Academy", accent: brand.aquamarine },
      { name: "Forge", accent: brand.aquamarine },
      { name: "Registry", accent: brand.aquamarine },
    ],
  },
  {
    label: "Foundation Models",
    tagline: "BYOK — your keys, no markup",
    accent: brand.atlanteanTeal,
    items: [
      { name: "Claude" },
      { name: "GPT" },
      { name: "Gemini" },
      { name: "Grok" },
      { name: "OpenRouter" },
      { name: "Local (Ollama)" },
    ],
  },
  {
    label: "IDE & Developer Tools",
    tagline: "Where creators write and ship",
    accent: brand.cosmicBlue,
    items: [
      { name: "VS Code" },
      { name: "Cursor" },
      { name: "Claude Code" },
      { name: "Antigravity" },
      { name: "Windsurf" },
      { name: "GitHub" },
    ],
  },
  {
    label: "Game Engines & Platforms",
    tagline: "Where your worlds become playable",
    accent: semantic.error,
    items: [
      { name: "Unreal Engine" },
      { name: "Unity" },
      { name: "Godot" },
      { name: "Roblox Studio" },
      { name: "Three.js" },
    ],
  },
  {
    label: "Web3 & Chain",
    tagline: "Sovereign identity + monetization",
    accent: guardianAccents.leyla,
    items: [
      { name: "Base" },
      { name: "Story Protocol" },
      { name: "Lens" },
      { name: "Farcaster" },
      { name: "Arweave" },
    ],
  },
];

export function StackLayerDiagram() {
  return (
    <div className="relative max-w-4xl mx-auto">
      {/* Vertical axis line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/[0.08] to-transparent -translate-x-1/2 hidden md:block" />

      <div className="space-y-3">
        {LAYERS.map((layer, i) => (
          <m.div
            key={layer.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
            className="group relative"
          >
            <div
              className="relative rounded-2xl border bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-500 p-5 md:p-6"
              style={{
                borderColor:
                  layer.label === "Arcanea Core"
                    ? `${layer.accent}40`
                    : "rgba(255,255,255,0.06)",
                boxShadow:
                  layer.label === "Arcanea Core"
                    ? `0 0 30px ${layer.accent}18, 0 0 0 1px ${layer.accent}30 inset`
                    : "none",
              }}
            >
              {/* Highlight glow for Arcanea Core */}
              {layer.label === "Arcanea Core" && (
                <div
                  className="pointer-events-none absolute inset-0 rounded-2xl"
                  style={{
                    background: `radial-gradient(400px circle at 50% 50%, ${layer.accent}08, transparent 70%)`,
                  }}
                />
              )}

              <div className="relative flex flex-col md:flex-row md:items-center gap-4">
                {/* Layer header */}
                <div className="md:w-48 shrink-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{
                        background: layer.accent,
                        boxShadow: `0 0 8px ${layer.accent}60`,
                      }}
                    />
                    <h3
                      className="text-sm font-display font-bold"
                      style={{ color: layer.accent }}
                    >
                      {layer.label}
                    </h3>
                  </div>
                  <p className="text-[11px] text-white/30 font-mono tracking-wider leading-tight">
                    {layer.tagline}
                  </p>
                </div>

                {/* Items */}
                <div className="flex flex-wrap gap-1.5 flex-1">
                  {layer.items.map((item) => (
                    <span
                      key={item.name}
                      className="inline-flex items-center px-2.5 py-1 rounded-full bg-white/[0.03] border border-white/[0.06] text-[11px] font-mono text-white/55 hover:border-white/[0.14] transition-colors"
                      style={{
                        borderColor: item.accent
                          ? `${item.accent}30`
                          : undefined,
                        color: item.accent ? `${item.accent}cc` : undefined,
                      }}
                    >
                      {item.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </m.div>
        ))}
      </div>

      {/* Legend */}
      <m.p
        className="text-center mt-8 text-[11px] font-mono tracking-wider text-white/25"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
      >
        Top to bottom: from where your work reaches audiences, down to the tools you build with.
      </m.p>
    </div>
  );
}
