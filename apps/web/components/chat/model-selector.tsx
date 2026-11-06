/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  PhCaretDown,
  PhLightning,
  PhRocket,
  PhBrain,
  PhCheck,
} from "@/lib/phosphor-icons";
import { useProvider, isGatewayModelConfigured } from "@/hooks/use-provider";

// ---------------------------------------------------------------------------
// Model definitions (client-safe subset of gateway/models.ts & gateway/catalog.ts)
// ---------------------------------------------------------------------------

export interface ChatModel {
  id: string;
  name: string;
  shortName: string;
  versionLabel?: string;
  provider: string;
  tier: "frontier" | "performance" | "speed";
  description: string;
  tokensPerSecond?: number;
}

const TIER_LABELS: Record<
  string,
  { label: string; icon: typeof PhBrain; color: string }
> = {
  frontier: {
    label: "Frontier",
    icon: PhBrain,
    color: "var(--arc-brand-atlantean-teal)",
  },
  performance: {
    label: "Performance",
    icon: PhRocket,
    color: "var(--arc-earth)",
  },
  speed: {
    label: "Speed",
    icon: PhLightning,
    color: "var(--arc-brand-arcanean-gold)",
  },
};

// Provider brand colors & initials (LobeChat-inspired)
const PROVIDER_BRAND: Record<
  string,
  { color: string; bg: string; initial: string }
> = {
  arcanea: {
    color: "var(--arc-brand-atlantean-teal)",
    bg: "var(--arc-brand-atlantean-teal)/10",
    initial: "A",
  },
  anthropic: {
    color: "var(--arc-fire)",
    bg: "var(--arc-fire)/15",
    initial: "A",
  },
  openai: {
    color: "var(--arc-brand-atlantean-teal)",
    bg: "var(--arc-brand-atlantean-teal)/15",
    initial: "O",
  },
  google: {
    color: "var(--arc-brand-atlantean-teal)",
    bg: "var(--arc-brand-atlantean-teal)/15",
    initial: "G",
  },
  xai: {
    color: "var(--arc-text-primary)",
    bg: "var(--arc-text-primary)/10",
    initial: "X",
  },
  deepseek: {
    color: "var(--arc-void)",
    bg: "var(--arc-void)/15",
    initial: "D",
  },
  moonshot: {
    color: "var(--arc-fire)",
    bg: "var(--arc-fire)/15",
    initial: "K",
  },
  cerebras: {
    color: "var(--arc-fire)",
    bg: "var(--arc-fire)/15",
    initial: "C",
  },
  groq: { color: "var(--arc-fire)", bg: "var(--arc-fire)/15", initial: "Q" },
  mistral: { color: "var(--arc-fire)", bg: "var(--arc-fire)/15", initial: "M" },
};

export function ProviderLogo({
  provider,
  size = 20,
}: {
  provider: string;
  size?: number;
}) {
  const brand = PROVIDER_BRAND[provider] || {
    color: "var(--arc-earth)",
    bg: "var(--arc-text-muted)/15",
    initial: "?",
  };
  return (
    <div
      className="rounded-md flex items-center justify-center shrink-0 font-bold"
      style={{
        width: size,
        height: size,
        backgroundColor: brand.bg,
        color: brand.color,
        fontSize: size * 0.5,
        border: `1px solid ${brand.color}25`,
      }}
    >
      {brand.initial}
    </div>
  );
}

export const CHAT_MODELS: ChatModel[] = [
  // Auto
  {
    id: "arcanea-auto",
    name: "Arcanea Auto",
    shortName: "Auto",
    versionLabel: "Smart Route",
    provider: "arcanea",
    tier: "frontier",
    description:
      "Adaptive routing across your configured providers and task intent",
  },
  // Frontier
  {
    id: "arcanea-opus",
    name: "Arcanea Opus",
    shortName: "Opus",
    versionLabel: "Claude Opus 5.5",
    provider: "anthropic",
    tier: "frontier",
    description:
      "Anthropic Claude Opus 5.5 — deep reasoning, long-form writing and code",
  },
  {
    id: "arcanea-sonnet",
    name: "Arcanea Sonnet",
    shortName: "Sonnet",
    versionLabel: "Claude Sonnet 5.5",
    provider: "anthropic",
    tier: "frontier",
    description:
      "Anthropic Claude Sonnet 5.5 — balanced reasoning, writing and code",
  },
  {
    id: "arcanea-gpt5",
    name: "Arcanea GPT-5",
    shortName: "GPT-5",
    versionLabel: "GPT-5.2 Pro",
    provider: "openai",
    tier: "frontier",
    description:
      "OpenAI GPT-5.2 Pro — mathematics, structured reasoning and code",
  },
  {
    id: "arcanea-gemini-pro",
    name: "Arcanea Gemini Pro",
    shortName: "Gemini Pro",
    versionLabel: "Gemini 3.1 Pro",
    provider: "google",
    tier: "frontier",
    description:
      "Google Gemini 3.1 Pro — 1M context window and multimodal analysis",
  },
  {
    id: "arcanea-grok",
    name: "Arcanea Grok",
    shortName: "Grok",
    versionLabel: "Grok 4.2",
    provider: "xai",
    tier: "frontier",
    description: "xAI Grok 4.2 — 2M context window, research and synthesis",
  },
  {
    id: "arcanea-deepseek-r1",
    name: "Arcanea DeepSeek R1",
    shortName: "DeepSeek R1",
    versionLabel: "DeepSeek R1",
    provider: "deepseek",
    tier: "frontier",
    description:
      "DeepSeek Reasoner — explicit chain-of-thought step verification",
  },
  {
    id: "arcanea-kimi",
    name: "Arcanea Kimi",
    shortName: "Kimi",
    versionLabel: "Kimi K2.5",
    provider: "moonshot",
    tier: "frontier",
    description:
      "Moonshot Kimi K2.5 — long-document synthesis and multi-step tool use",
  },
  {
    id: "arcanea-deepseek",
    name: "Arcanea DeepSeek V3",
    shortName: "DeepSeek V3",
    versionLabel: "DeepSeek V3.2",
    provider: "deepseek",
    tier: "frontier",
    description: "DeepSeek Chat — low-cost general purpose drafting and code",
  },
  // Performance
  {
    id: "arcanea-haiku",
    name: "Arcanea Haiku",
    shortName: "Haiku",
    versionLabel: "Claude Haiku 5.5",
    provider: "anthropic",
    tier: "performance",
    description:
      "Anthropic Claude Haiku 5.5 — responsive everyday drafting and edits",
  },
  {
    id: "arcanea-gemini-flash",
    name: "Arcanea Flash",
    shortName: "Flash",
    versionLabel: "Gemini 2.5 Flash",
    provider: "google",
    tier: "performance",
    description:
      "Google Gemini 2.5 Flash — 1M context window for high-throughput tasks",
  },
  {
    id: "arcanea-qwen",
    name: "Arcanea Qwen",
    shortName: "Qwen",
    versionLabel: "Qwen 3 235B",
    provider: "cerebras",
    tier: "performance",
    description:
      "Qwen 3 235B on Cerebras — multilingual coding and structured output",
  },
  {
    id: "arcanea-maverick",
    name: "Arcanea Maverick",
    shortName: "Maverick",
    versionLabel: "GPT-OSS 120B",
    provider: "groq",
    tier: "performance",
    description:
      "Open-weight 120B MoE on Groq — general reasoning and instruction following",
  },
  {
    id: "arcanea-mistral",
    name: "Arcanea Mistral",
    shortName: "Mistral",
    versionLabel: "Mistral Large",
    provider: "mistral",
    tier: "performance",
    description:
      "Mistral Large — European hosting, multilingual writing and code",
  },
  // Speed
  {
    id: "arcanea-bolt",
    name: "Arcanea Bolt",
    shortName: "Bolt",
    versionLabel: "Llama 3.1 8B",
    provider: "cerebras",
    tier: "speed",
    description:
      "Llama 3.1 8B on Cerebras wafer-scale hardware for instant turns",
  },
  {
    id: "arcanea-thunder",
    name: "Arcanea Thunder",
    shortName: "Thunder",
    versionLabel: "Llama 3.3 70B",
    provider: "cerebras",
    tier: "speed",
    description:
      "Llama 3.3 70B on Cerebras — 70B parameter depth at low latency",
  },
  {
    id: "arcanea-lightning",
    name: "Arcanea Lightning",
    shortName: "Lightning",
    versionLabel: "GPT-OSS 20B",
    provider: "groq",
    tier: "speed",
    description:
      "Compact open-weight model on Groq LPU for rapid interactive loops",
  },
];

// ---------------------------------------------------------------------------
// Model capability badges
// ---------------------------------------------------------------------------

const MODEL_CAPABILITIES: Record<string, string[]> = {
  "arcanea-auto": ["text", "vision", "code"],
  "arcanea-opus": ["text", "vision", "code"],
  "arcanea-sonnet": ["text", "vision", "code"],
  "arcanea-gpt5": ["text", "vision", "code"],
  "arcanea-gemini-pro": ["text", "vision", "code"],
  "arcanea-grok": ["text", "vision", "image-gen"],
  "arcanea-deepseek-r1": ["text", "reasoning"],
  "arcanea-kimi": ["text", "vision", "code"],
  "arcanea-deepseek": ["text", "code"],
  "arcanea-gemini-flash": ["text", "vision", "fast"],
  "arcanea-haiku": ["text", "fast"],
  "arcanea-qwen": ["text", "fast"],
  "arcanea-maverick": ["text", "code"],
  "arcanea-mistral": ["text", "code"],
  "arcanea-bolt": ["text", "ultra-fast"],
  "arcanea-thunder": ["text", "fast"],
  "arcanea-lightning": ["text", "ultra-fast"],
};

const CAPABILITY_BADGE: Record<
  string,
  { label: string; bg: string; text: string }
> = {
  vision: { label: "vision", bg: "bg-purple-500/10", text: "text-purple-400" },
  code: { label: "code", bg: "bg-blue-500/10", text: "text-blue-400" },
  reasoning: {
    label: "reasoning",
    bg: "bg-orange-500/10",
    text: "text-orange-400",
  },
  "image-gen": {
    label: "image-gen",
    bg: "bg-pink-500/10",
    text: "text-pink-400",
  },
  fast: { label: "fast", bg: "bg-emerald-500/10", text: "text-emerald-400" },
  "ultra-fast": {
    label: "ultra-fast",
    bg: "bg-yellow-500/10",
    text: "text-yellow-400",
  },
};

// Flat list of selectable models (for keyboard nav)
const SELECTABLE_IDS = CHAT_MODELS.map((m) => m.id);

export function getModelById(id: string): ChatModel | undefined {
  return CHAT_MODELS.find((m) => m.id === id);
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface ModelSelectorProps {
  value: string;
  onChange: (modelId: string) => void;
  className?: string;
}

export const ModelSelector = React.memo(function ModelSelector({
  value,
  onChange,
  className = "",
}: ModelSelectorProps) {
  const [open, setOpen] = useState(false);
  const [focusIndex, setFocusIndex] = useState(-1);
  const [placement, setPlacement] = useState<"top" | "bottom">("top");
  const ref = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const providerState = useProvider();
  const keyMap = providerState.keys || {};
  const configuredCount = providerState.configuredProviders?.length ?? 0;

  // Compute dropdown placement based on available viewport space
  useEffect(() => {
    if (!open || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const spaceAbove = rect.top;
    const spaceBelow = window.innerHeight - rect.bottom;
    // Prefer opening upward (like Claude/ChatGPT), fall back to downward
    setPlacement(spaceAbove > 300 ? "top" : "bottom");
  }, [open]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!open) {
        if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
          e.preventDefault();
          setOpen(true);
          setFocusIndex(SELECTABLE_IDS.indexOf(value));
        }
        return;
      }

      switch (e.key) {
        case "Escape":
          e.preventDefault();
          setOpen(false);
          break;
        case "ArrowDown":
          e.preventDefault();
          setFocusIndex((i) => Math.min(i + 1, SELECTABLE_IDS.length - 1));
          break;
        case "ArrowUp":
          e.preventDefault();
          setFocusIndex((i) => Math.max(i - 1, 0));
          break;
        case "Enter":
        case " ":
          e.preventDefault();
          if (focusIndex >= 0 && focusIndex < SELECTABLE_IDS.length) {
            onChange(SELECTABLE_IDS[focusIndex]);
            setOpen(false);
          }
          break;
        case "Home":
          e.preventDefault();
          setFocusIndex(0);
          break;
        case "End":
          e.preventDefault();
          setFocusIndex(SELECTABLE_IDS.length - 1);
          break;
      }
    },
    [open, value, focusIndex, onChange],
  );

  // Scroll focused item into view
  useEffect(() => {
    if (!open || focusIndex < 0 || !dropdownRef.current) return;
    const items = dropdownRef.current.querySelectorAll("[data-model-item]");
    items[focusIndex]?.scrollIntoView({ block: "nearest" });
  }, [focusIndex, open]);

  const selected = getModelById(value) || CHAT_MODELS[0];
  const tierMeta = TIER_LABELS[selected.tier];
  const tiers = ["frontier", "performance", "speed"] as const;
  const autoModel = CHAT_MODELS[0]; // arcanea-auto is always first

  // Track global index for keyboard focus
  let globalIndex = -1;

  const renderModelButton = (
    model: ChatModel,
    isFocused: boolean,
    isSelected: boolean,
  ) => {
    const isConfigured = isGatewayModelConfigured(
      model.id,
      keyMap,
      providerState.provider,
    );
    return (
      <button
        key={model.id}
        type="button"
        data-model-item
        onClick={() => {
          onChange(model.id);
          setOpen(false);
        }}
        className={`w-full text-left px-3 py-2.5 flex items-center gap-3 transition-colors outline-none ${
          isFocused
            ? "bg-white/[0.06] ring-1 ring-inset ring-[var(--arc-brand-atlantean-teal)]/40"
            : isSelected
              ? "bg-white/[0.04]"
              : "hover:bg-white/[0.03]"
        }`}
        role="option"
        aria-selected={isSelected}
      >
        <ProviderLogo provider={model.provider} size={28} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`text-sm font-medium ${isSelected ? "text-[var(--arc-brand-atlantean-teal)]" : "text-white/80"}`}
            >
              {model.shortName}
            </span>
            {model.versionLabel && (
              <span className="text-[10px] text-white/35 font-mono">
                {model.versionLabel}
              </span>
            )}
            {isConfigured && (
              <span
                className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-mono"
                title="API key configured in this browser"
              >
                key ready
              </span>
            )}
            {(MODEL_CAPABILITIES[model.id] || [])
              .filter((cap) => cap !== "text" && CAPABILITY_BADGE[cap])
              .map((cap) => {
                const badge = CAPABILITY_BADGE[cap];
                return (
                  <span
                    key={cap}
                    className={`text-[9px] px-1 py-0.5 rounded ${badge.bg} ${badge.text}`}
                  >
                    {badge.label}
                  </span>
                );
              })}
          </div>
          <p className="text-[11px] text-white/30 mt-0.5 truncate">
            {model.description}
          </p>
        </div>
        {isSelected && (
          <PhCheck className="w-4 h-4 text-[var(--arc-brand-atlantean-teal)] shrink-0" />
        )}
      </button>
    );
  };

  return (
    <div
      ref={ref}
      className={`relative ${className}`}
      onKeyDown={handleKeyDown}
    >
      {/* Trigger */}
      <button
        type="button"
        onClick={() => {
          setOpen(!open);
          setFocusIndex(SELECTABLE_IDS.indexOf(value));
        }}
        className="flex items-center gap-2 px-2.5 py-2 sm:py-1.5 rounded-lg text-[11px] font-medium transition-all min-h-[44px] sm:min-h-0
          border border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.03]
          focus:outline-none focus:ring-2 focus:ring-[var(--arc-brand-atlantean-teal)]/50"
        style={{ color: tierMeta?.color || "var(--arc-text-primary)" }}
        aria-label={`AI model: ${selected.shortName}. Press Enter to change.`}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <ProviderLogo provider={selected.provider} size={18} />
        <span className="text-white/60">{selected.shortName}</span>
        <PhCaretDown
          className={`w-3 h-3 text-white/30 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          ref={dropdownRef}
          role="listbox"
          aria-label="Select AI model"
          className={`absolute left-0 w-[calc(100vw-2rem)] sm:w-80 max-h-[70vh] sm:max-h-[min(420px,70vh)] overflow-y-auto rounded-xl border border-white/[0.08] bg-[var(--arc-cosmic-void)] shadow-2xl z-50 ${
            placement === "top" ? "bottom-full mb-2" : "top-full mt-2"
          }`}
          style={{ scrollbarWidth: "thin" }}
        >
          {/* Auto — always at top */}
          {(() => {
            globalIndex++;
            return null;
          })()}
          {renderModelButton(
            autoModel,
            focusIndex === 0,
            value === "arcanea-auto",
          )}

          <div className="border-b border-white/[0.04]" />

          {tiers.map((tier) => {
            const models = CHAT_MODELS.filter(
              (m) => m.tier === tier && m.id !== "arcanea-auto",
            );
            if (models.length === 0) return null;
            const meta = TIER_LABELS[tier];
            const TierIcon = meta.icon;

            return (
              <div key={tier}>
                <div className="sticky top-0 bg-[var(--arc-cosmic-void)]/95 backdrop-blur-sm px-3 py-2 border-b border-white/[0.04]">
                  <div className="flex items-center gap-1.5">
                    <TierIcon
                      className="w-3 h-3"
                      style={{ color: meta.color }}
                    />
                    <span
                      className="text-[10px] font-semibold uppercase tracking-wider"
                      style={{ color: meta.color }}
                    >
                      {meta.label}
                    </span>
                  </div>
                </div>
                {models.map((model) => {
                  globalIndex++;
                  const idx = SELECTABLE_IDS.indexOf(model.id);
                  return renderModelButton(
                    model,
                    focusIndex === idx,
                    model.id === value,
                  );
                })}
              </div>
            );
          })}

          <div className="px-3 py-2 border-t border-white/[0.04] flex items-center justify-between gap-2">
            <a
              href="/settings/providers"
              className="text-[10px] text-white/30 hover:text-[var(--arc-brand-atlantean-teal)] transition-colors"
            >
              Configure API keys
            </a>
            <span className="text-[10px] font-mono text-white/25">
              {configuredCount > 0
                ? `${configuredCount} provider${configuredCount === 1 ? "" : "s"} ready`
                : "BYOK — €0 chat"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
});
