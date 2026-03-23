'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { PhCaretDown, PhLightning, PhRocket, PhBrain, PhCheck } from '@/lib/phosphor-icons';

// ---------------------------------------------------------------------------
// Model definitions (client-safe subset of gateway/models.ts)
// ---------------------------------------------------------------------------

export interface ChatModel {
  id: string;
  name: string;
  shortName: string;
  provider: string;
  tier: 'frontier' | 'performance' | 'speed';
  description: string;
  tokensPerSecond?: number;
}

const TIER_LABELS: Record<string, { label: string; icon: typeof PhBrain; color: string }> = {
  frontier: { label: 'Frontier', icon: PhBrain, color: '#00bcd4' },
  performance: { label: 'Performance', icon: PhRocket, color: '#66bb6a' },
  speed: { label: 'Speed', icon: PhLightning, color: '#ffd700' },
};

export const CHAT_MODELS: ChatModel[] = [
  // Auto
  { id: 'arcanea-auto', name: 'Arcanea Auto', shortName: 'Auto', provider: 'arcanea', tier: 'frontier', description: 'Smart routing — picks the best model for your task' },
  // Frontier
  { id: 'arcanea-opus', name: 'Arcanea Opus', shortName: 'Opus', provider: 'anthropic', tier: 'frontier', description: '#1 coding & human preference' },
  { id: 'arcanea-sonnet', name: 'Arcanea Sonnet', shortName: 'Sonnet', provider: 'anthropic', tier: 'frontier', description: 'Near-Opus intelligence, 5x lower cost' },
  { id: 'arcanea-gpt5', name: 'Arcanea GPT-5', shortName: 'GPT-5', provider: 'openai', tier: 'frontier', description: '#1 mathematics, 100% AIME' },
  { id: 'arcanea-gemini-pro', name: 'Arcanea Gemini Pro', shortName: 'Gemini Pro', provider: 'google', tier: 'frontier', description: '#1 raw reasoning, 1M context' },
  { id: 'arcanea-grok', name: 'Arcanea Grok', shortName: 'Grok', provider: 'xai', tier: 'frontier', description: '500B params, real-time knowledge' },
  { id: 'arcanea-deepseek-r1', name: 'Arcanea DeepSeek R1', shortName: 'DeepSeek R1', provider: 'deepseek', tier: 'frontier', description: 'Transparent chain-of-thought' },
  { id: 'arcanea-kimi', name: 'Arcanea Kimi', shortName: 'Kimi', provider: 'moonshot', tier: 'frontier', description: '1T MoE, 100 sub-agents' },
  { id: 'arcanea-deepseek', name: 'Arcanea DeepSeek V3', shortName: 'DeepSeek V3', provider: 'deepseek', tier: 'frontier', description: '50-100x cheaper than frontier' },
  // Performance
  { id: 'arcanea-haiku', name: 'Arcanea Haiku', shortName: 'Haiku', provider: 'anthropic', tier: 'performance', description: 'Best speed/intelligence ratio' },
  { id: 'arcanea-gemini-flash', name: 'Arcanea Flash', shortName: 'Flash', provider: 'google', tier: 'performance', description: '1M context at $0.15/M input' },
  { id: 'arcanea-qwen', name: 'Arcanea Qwen', shortName: 'Qwen', provider: 'cerebras', tier: 'performance', description: '235B at 1,400 tok/s', tokensPerSecond: 1400 },
  { id: 'arcanea-maverick', name: 'Arcanea Maverick', shortName: 'Maverick', provider: 'groq', tier: 'performance', description: 'Llama 4, 128 experts', tokensPerSecond: 562 },
  { id: 'arcanea-mistral', name: 'Arcanea Mistral', shortName: 'Mistral', provider: 'mistral', tier: 'performance', description: 'EU sovereignty, multilingual' },
  // Speed
  { id: 'arcanea-bolt', name: 'Arcanea Bolt', shortName: 'Bolt', provider: 'cerebras', tier: 'speed', description: '2,200+ tok/s — fastest alive', tokensPerSecond: 2200 },
  { id: 'arcanea-thunder', name: 'Arcanea Thunder', shortName: 'Thunder', provider: 'cerebras', tier: 'speed', description: '70B brain at 450 tok/s', tokensPerSecond: 450 },
  { id: 'arcanea-lightning', name: 'Arcanea Lightning', shortName: 'Lightning', provider: 'groq', tier: 'speed', description: 'Lowest latency, real-time', tokensPerSecond: 750 },
];

// ---------------------------------------------------------------------------
// Model capability badges
// ---------------------------------------------------------------------------

const MODEL_CAPABILITIES: Record<string, string[]> = {
  'arcanea-auto': ['text', 'vision', 'code'],
  'arcanea-opus': ['text', 'vision', 'code'],
  'arcanea-sonnet': ['text', 'vision', 'code'],
  'arcanea-gpt5': ['text', 'vision', 'code'],
  'arcanea-gemini-pro': ['text', 'vision', 'code'],
  'arcanea-grok': ['text', 'vision', 'image-gen'],
  'arcanea-deepseek-r1': ['text', 'reasoning'],
  'arcanea-kimi': ['text', 'vision', 'code'],
  'arcanea-deepseek': ['text', 'code'],
  'arcanea-gemini-flash': ['text', 'vision', 'fast'],
  'arcanea-haiku': ['text', 'fast'],
  'arcanea-qwen': ['text', 'fast'],
  'arcanea-maverick': ['text', 'code'],
  'arcanea-mistral': ['text', 'code'],
  'arcanea-bolt': ['text', 'ultra-fast'],
  'arcanea-thunder': ['text', 'fast'],
  'arcanea-lightning': ['text', 'ultra-fast'],
};

const CAPABILITY_BADGE: Record<string, { label: string; bg: string; text: string }> = {
  vision: { label: 'vision', bg: 'bg-purple-500/10', text: 'text-purple-400' },
  code: { label: 'code', bg: 'bg-blue-500/10', text: 'text-blue-400' },
  reasoning: { label: 'reasoning', bg: 'bg-orange-500/10', text: 'text-orange-400' },
  'image-gen': { label: 'image-gen', bg: 'bg-pink-500/10', text: 'text-pink-400' },
  fast: { label: 'fast', bg: 'bg-emerald-500/10', text: 'text-emerald-400' },
  'ultra-fast': { label: 'ultra-fast', bg: 'bg-yellow-500/10', text: 'text-yellow-400' },
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

export const ModelSelector = React.memo(function ModelSelector({ value, onChange, className = '' }: ModelSelectorProps) {
  const [open, setOpen] = useState(false);
  const [focusIndex, setFocusIndex] = useState(-1);
  const [placement, setPlacement] = useState<'top' | 'bottom'>('top');
  const ref = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Compute dropdown placement based on available viewport space
  useEffect(() => {
    if (!open || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const spaceAbove = rect.top;
    const spaceBelow = window.innerHeight - rect.bottom;
    // Prefer opening upward (like Claude/ChatGPT), fall back to downward
    setPlacement(spaceAbove > 300 ? 'top' : 'bottom');
  }, [open]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!open) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setOpen(true);
        setFocusIndex(SELECTABLE_IDS.indexOf(value));
      }
      return;
    }

    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        setOpen(false);
        break;
      case 'ArrowDown':
        e.preventDefault();
        setFocusIndex((i) => Math.min(i + 1, SELECTABLE_IDS.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusIndex((i) => Math.max(i - 1, 0));
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (focusIndex >= 0 && focusIndex < SELECTABLE_IDS.length) {
          onChange(SELECTABLE_IDS[focusIndex]);
          setOpen(false);
        }
        break;
      case 'Home':
        e.preventDefault();
        setFocusIndex(0);
        break;
      case 'End':
        e.preventDefault();
        setFocusIndex(SELECTABLE_IDS.length - 1);
        break;
    }
  }, [open, value, focusIndex, onChange]);

  // Scroll focused item into view
  useEffect(() => {
    if (!open || focusIndex < 0 || !dropdownRef.current) return;
    const items = dropdownRef.current.querySelectorAll('[data-model-item]');
    items[focusIndex]?.scrollIntoView({ block: 'nearest' });
  }, [focusIndex, open]);

  const selected = getModelById(value) || CHAT_MODELS[0];
  const tierMeta = TIER_LABELS[selected.tier];
  const tiers = ['frontier', 'performance', 'speed'] as const;
  const autoModel = CHAT_MODELS[0]; // arcanea-auto is always first

  // Track global index for keyboard focus
  let globalIndex = -1;

  const renderModelButton = (model: ChatModel, isFocused: boolean, isSelected: boolean) => (
    <button
      key={model.id}
      type="button"
      data-model-item
      onClick={() => { onChange(model.id); setOpen(false); }}
      className={`w-full text-left px-3 py-3 flex items-start gap-3 transition-colors outline-none ${
        isFocused ? 'bg-white/[0.06] ring-1 ring-inset ring-[#00bcd4]/40' :
        isSelected ? 'bg-white/[0.04]' : 'hover:bg-white/[0.03]'
      }`}
      role="option"
      aria-selected={isSelected}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={`text-sm font-medium ${isSelected ? 'text-[#00bcd4]' : 'text-white/80'}`}>
            {model.shortName}
          </span>
          <span className="text-[10px] text-white/25 font-mono">{model.provider}</span>
          {model.tokensPerSecond && (
            <span className="text-[10px] text-yellow-400/50 font-mono">
              {model.tokensPerSecond.toLocaleString()} tok/s
            </span>
          )}
          {(MODEL_CAPABILITIES[model.id] || [])
            .filter((cap) => cap !== 'text' && CAPABILITY_BADGE[cap])
            .map((cap) => {
              const badge = CAPABILITY_BADGE[cap];
              return (
                <span key={cap} className={`text-[9px] px-1 py-0.5 rounded ${badge.bg} ${badge.text}`}>
                  {badge.label}
                </span>
              );
            })}
        </div>
        <p className="text-[11px] text-white/30 mt-0.5 truncate">{model.description}</p>
      </div>
      {isSelected && <PhCheck className="w-4 h-4 text-[#00bcd4] shrink-0 mt-0.5" />}
    </button>
  );

  return (
    <div ref={ref} className={`relative ${className}`} onKeyDown={handleKeyDown}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => { setOpen(!open); setFocusIndex(SELECTABLE_IDS.indexOf(value)); }}
        className="flex items-center gap-1.5 px-2.5 py-2 sm:py-1.5 rounded-lg text-[11px] font-medium transition-all min-h-[44px] sm:min-h-0
          border border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.03]
          focus:outline-none focus:ring-2 focus:ring-[#00bcd4]/50"
        style={{ color: tierMeta?.color || '#fff' }}
        aria-label={`AI model: ${selected.shortName}. Press Enter to change.`}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span className="text-white/60">{selected.shortName}</span>
        <PhCaretDown className={`w-3 h-3 text-white/30 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          ref={dropdownRef}
          role="listbox"
          aria-label="Select AI model"
          className={`absolute left-0 w-[calc(100vw-2rem)] sm:w-80 max-h-[70vh] sm:max-h-[min(420px,70vh)] overflow-y-auto rounded-xl border border-white/[0.08] bg-[#111113] shadow-2xl z-50 ${
            placement === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'
          }`}
          style={{ scrollbarWidth: 'thin' }}
        >
          {/* Auto — always at top */}
          {(() => { globalIndex++; return null; })()}
          {renderModelButton(autoModel, focusIndex === 0, value === 'arcanea-auto')}

          <div className="border-b border-white/[0.04]" />

          {tiers.map((tier) => {
            const models = CHAT_MODELS.filter((m) => m.tier === tier && m.id !== 'arcanea-auto');
            if (models.length === 0) return null;
            const meta = TIER_LABELS[tier];
            const TierIcon = meta.icon;

            return (
              <div key={tier}>
                <div className="sticky top-0 bg-[#111113]/95 backdrop-blur-sm px-3 py-2 border-b border-white/[0.04]">
                  <div className="flex items-center gap-1.5">
                    <TierIcon className="w-3 h-3" style={{ color: meta.color }} />
                    <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: meta.color }}>
                      {meta.label}
                    </span>
                  </div>
                </div>
                {models.map((model) => {
                  globalIndex++;
                  const idx = SELECTABLE_IDS.indexOf(model.id);
                  return renderModelButton(model, focusIndex === idx, model.id === value);
                })}
              </div>
            );
          })}

          <div className="px-3 py-2 border-t border-white/[0.04]">
            <a
              href="/settings/providers"
              className="text-[10px] text-white/20 hover:text-[#00bcd4]/60 transition-colors"
            >
              Configure API keys
            </a>
          </div>
        </div>
      )}
    </div>
  );
});
