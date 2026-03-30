'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { PhCaretDown, PhLightning, PhRocket, PhBrain, PhCheck } from '@/lib/phosphor-icons';

// ---------------------------------------------------------------------------
// Image model definitions
// ---------------------------------------------------------------------------

export interface ImageModel {
  id: string;
  name: string;
  shortName: string;
  provider: string;
  tier: 'premium' | 'quality' | 'fast';
  description: string;
}

const TIER_LABELS: Record<string, { label: string; icon: typeof PhBrain; color: string }> = {
  premium: { label: 'Premium', icon: PhBrain, color: '#00bcd4' },
  quality: { label: 'Quality', icon: PhRocket, color: '#66bb6a' },
  fast: { label: 'Fast', icon: PhLightning, color: '#ffd700' },
};

export const IMAGE_MODELS: ImageModel[] = [
  { id: 'auto', name: 'Auto', shortName: 'Auto', provider: 'arcanea', tier: 'quality', description: 'Best available — Grok, then OpenRouter, then Gemini' },
  // Premium
  { id: 'google/gemini-3-pro-image-preview', name: 'Nano Banana Pro', shortName: 'Gemini 3 Pro', provider: 'Google', tier: 'premium', description: 'Most advanced image gen — Gemini 3 Pro' },
  { id: 'black-forest-labs/flux.2-max', name: 'FLUX.2 Max', shortName: 'Flux Max', provider: 'BFL', tier: 'premium', description: 'Maximum quality from Black Forest Labs' },
  { id: 'openai/gpt-5-image', name: 'GPT-5 Image', shortName: 'GPT-5', provider: 'OpenAI', tier: 'premium', description: 'GPT-5 combined with image generation' },
  // Quality
  { id: 'black-forest-labs/flux.2-pro', name: 'FLUX.2 Pro', shortName: 'Flux Pro', provider: 'BFL', tier: 'quality', description: 'High quality, great text rendering' },
  { id: 'google/gemini-3.1-flash-image-preview', name: 'Nano Banana 2', shortName: 'Gemini 3.1', provider: 'Google', tier: 'quality', description: 'Pro quality at Flash speed' },
  // Fast
  { id: 'black-forest-labs/flux.2-flex', name: 'FLUX.2 Flex', shortName: 'Flux Flex', provider: 'BFL', tier: 'fast', description: 'Flexible, great at text and details' },
  { id: 'black-forest-labs/flux.2-klein-4b', name: 'FLUX.2 Klein', shortName: 'Flux Klein', provider: 'BFL', tier: 'fast', description: 'Fastest image gen, lowest cost' },
  { id: 'openai/gpt-5-image-mini', name: 'GPT-5 Image Mini', shortName: 'GPT-5 Mini', provider: 'OpenAI', tier: 'fast', description: 'Faster, cheaper GPT image gen' },
  { id: 'google/gemini-2.5-flash-image-preview', name: 'Nano Banana', shortName: 'Gemini 2.5', provider: 'Google', tier: 'fast', description: 'Budget-friendly image gen' },
];

const SELECTABLE_IDS = IMAGE_MODELS.map((m) => m.id);

export function getImageModelById(id: string): ImageModel | undefined {
  return IMAGE_MODELS.find((m) => m.id === id);
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface ImageModelSelectorProps {
  value: string;
  onChange: (modelId: string) => void;
  className?: string;
}

export const ImageModelSelector = React.memo(function ImageModelSelector({
  value,
  onChange,
  className = '',
}: ImageModelSelectorProps) {
  const [open, setOpen] = useState(false);
  const [focusIndex, setFocusIndex] = useState(-1);
  const [placement, setPlacement] = useState<'top' | 'bottom'>('top');
  const ref = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setPlacement(rect.top > 300 ? 'top' : 'bottom');
  }, [open]);

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

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
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
      }
    },
    [open, value, focusIndex, onChange],
  );

  useEffect(() => {
    if (!open || focusIndex < 0 || !dropdownRef.current) return;
    const items = dropdownRef.current.querySelectorAll('[data-model-item]');
    items[focusIndex]?.scrollIntoView({ block: 'nearest' });
  }, [focusIndex, open]);

  const selected = getImageModelById(value) || IMAGE_MODELS[0];
  const tiers = ['premium', 'quality', 'fast'] as const;

  const renderModelButton = (model: ImageModel, isFocused: boolean, isSelected: boolean) => (
    <button
      key={model.id}
      type="button"
      data-model-item
      onClick={() => {
        onChange(model.id);
        setOpen(false);
      }}
      className={`w-full text-left px-3 py-2.5 flex items-start gap-3 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#00bcd4]/60 ${
        isFocused
          ? 'bg-white/[0.06] ring-1 ring-inset ring-[#00bcd4]/40'
          : isSelected
            ? 'bg-white/[0.04]'
            : 'hover:bg-white/[0.03]'
      }`}
      role="option"
      aria-selected={isSelected}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-medium ${isSelected ? 'text-[#00bcd4]' : 'text-white/80'}`}>
            {model.shortName}
          </span>
          <span className="text-[10px] text-white/25 font-mono">{model.provider}</span>
        </div>
        <p className="text-[10px] text-white/30 mt-0.5 truncate">{model.description}</p>
      </div>
      {isSelected && <PhCheck className="w-3.5 h-3.5 text-[#00bcd4] shrink-0 mt-0.5" />}
    </button>
  );

  return (
    <div ref={ref} className={`relative ${className}`} onKeyDown={handleKeyDown}>
      <button
        type="button"
        onClick={() => {
          setOpen(!open);
          setFocusIndex(SELECTABLE_IDS.indexOf(value));
        }}
        className="flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-medium transition-all
          border border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.03]
          focus:outline-none focus:ring-2 focus:ring-[#00bcd4]/50 text-white/50"
        aria-label={`Image model: ${selected.shortName}`}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span>{selected.shortName}</span>
        <PhCaretDown className={`w-3 h-3 text-white/30 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          ref={dropdownRef}
          role="listbox"
          aria-label="Select image model"
          className={`absolute right-0 w-72 max-h-[60vh] overflow-y-auto rounded-xl border border-white/[0.08] bg-[#111113] shadow-2xl z-50 ${
            placement === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'
          }`}
          style={{ scrollbarWidth: 'thin' }}
        >
          {renderModelButton(IMAGE_MODELS[0], focusIndex === 0, value === 'auto')}
          <div className="border-b border-white/[0.04]" />

          {tiers.map((tier) => {
            const models = IMAGE_MODELS.filter((m) => m.tier === tier && m.id !== 'auto');
            if (models.length === 0) return null;
            const meta = TIER_LABELS[tier];
            const TierIcon = meta.icon;

            return (
              <div key={tier}>
                <div className="sticky top-0 bg-[#111113]/95 backdrop-blur-sm px-3 py-1.5 border-b border-white/[0.04]">
                  <div className="flex items-center gap-1.5">
                    <TierIcon className="w-3 h-3" style={{ color: meta.color }} />
                    <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: meta.color }}>
                      {meta.label}
                    </span>
                  </div>
                </div>
                {models.map((model) => {
                  const idx = SELECTABLE_IDS.indexOf(model.id);
                  return renderModelButton(model, focusIndex === idx, model.id === value);
                })}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
});
