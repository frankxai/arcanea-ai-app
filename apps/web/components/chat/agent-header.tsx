'use client';

import React, { useState } from 'react';
import { PhCaretDown } from '@/lib/phosphor-icons';
import { getModelById, CHAT_MODELS, ProviderLogo } from '@/components/chat/model-selector';
import { FOCUS_MODES, type FocusMode } from './focus-modes';

interface AgentHeaderProps {
  activeAgent: { type: 'auto' | 'luminor' | 'custom'; id: string; name: string; avatar: string; specialty: string } | null;
  currentModel: string;
  onModelChange: (modelId: string) => void;
  focusMode: string;
  onFocusModeChange: (mode: string) => void;
  onOpenAgentPicker: () => void;
}

export function AgentHeader({
  activeAgent,
  currentModel,
  onModelChange,
  focusMode,
  onFocusModeChange,
  onOpenAgentPicker,
}: AgentHeaderProps) {
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const model = getModelById(currentModel);
  const activeFocus = FOCUS_MODES.find((m) => m.id === focusMode) ?? FOCUS_MODES[0];

  const agentDisplay = activeAgent ?? {
    type: 'auto' as const,
    id: 'arcanea-auto',
    name: 'Arcanea',
    avatar: '✦',
    specialty: 'Smart Routing — all specialists available',
  };

  return (
    <div className="px-4 py-2 space-y-2">
      {/* Agent + Model row */}
      <div className="flex items-center justify-between">
        {/* Agent selector */}
        <button
          onClick={onOpenAgentPicker}
          className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-white/[0.04] transition-all group"
        >
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#00bcd4]/20 to-[#00897b]/10 flex items-center justify-center text-sm border border-white/[0.08] group-hover:border-[#00bcd4]/30 transition-colors">
            {agentDisplay.avatar}
          </div>
          <div className="text-left">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-medium text-white/80 group-hover:text-white transition-colors">
                {agentDisplay.name}
              </span>
              <PhCaretDown className="w-3 h-3 text-white/30 group-hover:text-white/50 transition-colors" />
            </div>
            <span className="text-[10px] text-white/30 leading-none hidden sm:block">
              {agentDisplay.specialty}
            </span>
          </div>
        </button>

        {/* Model pill */}
        <div className="relative">
          <button
            onClick={() => setShowModelDropdown(!showModelDropdown)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.05] transition-all text-[11px] text-white/40 hover:text-white/60"
          >
            <ProviderLogo provider={model?.provider ?? 'arcanea'} size={16} />
            <span>{model?.shortName ?? currentModel}</span>
            <PhCaretDown className="w-2.5 h-2.5" />
          </button>

          {showModelDropdown && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowModelDropdown(false)} />
              <div className="absolute right-0 top-full mt-1 w-56 max-h-72 overflow-y-auto rounded-xl bg-[#13131a] border border-white/[0.08] shadow-2xl z-50 py-1">
                {CHAT_MODELS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      onModelChange(m.id);
                      setShowModelDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs hover:bg-white/[0.04] transition-colors flex items-center justify-between ${
                      currentModel === m.id ? 'text-[#00bcd4]' : 'text-white/50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <ProviderLogo provider={m.provider} size={18} />
                      <span>{m.shortName ?? m.name}</span>
                    </div>
                    {m.tier && (
                      <span className="text-[9px] text-white/20">{m.tier}</span>
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Focus mode pills — horizontal scroll on all sizes */}
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none -mx-1 px-1">
        {FOCUS_MODES.map((mode) => (
          <button
            key={mode.id}
            onClick={() => onFocusModeChange(mode.id)}
            className={`shrink-0 px-2.5 py-1 rounded-full text-[10px] font-medium transition-all border ${
              focusMode === mode.id
                ? 'border-current bg-current/10'
                : 'border-white/[0.06] bg-white/[0.02] text-white/25 hover:text-white/40 hover:border-white/[0.10]'
            }`}
            style={focusMode === mode.id ? { color: mode.color, borderColor: `${mode.color}40`, backgroundColor: `${mode.color}12` } : undefined}
          >
            {mode.label}
          </button>
        ))}
      </div>
    </div>
  );
}
