/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
"use client";

import React, { useRef } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import styles from "@arcanea/design-system/companion.module.css";
import { PhCaretDown } from "@/lib/phosphor-icons";
import {
  getModelById,
  CHAT_MODELS,
  ProviderLogo,
} from "@/components/chat/model-selector";
import { FOCUS_MODES, type FocusMode } from "./focus-modes";
import { AiDisclosure } from "./ai-disclosure";

interface AgentHeaderProps {
  activeAgent: {
    type: "auto" | "luminor" | "custom";
    id: string;
    name: string;
    avatar: string;
    specialty: string;
  } | null;
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
  const rootRef = useRef<HTMLDivElement>(null);
  const model = getModelById(currentModel);
  const activeFocus =
    FOCUS_MODES.find((m) => m.id === focusMode) ?? FOCUS_MODES[0];

  const agentDisplay = activeAgent ?? {
    type: "auto" as const,
    id: "arcanea-auto",
    name: "Arcanea",
    avatar: "✦",
    specialty: "Smart Routing — all specialists available",
  };

  return (
    <div
      ref={rootRef}
      data-chat-input-header
      className={`px-4 py-2 space-y-2 ${styles.inputHeader}`}
    >
      {/* Agent + Model row */}
      <div className="flex items-center justify-between">
        {/* Agent selector */}
        <button
          type="button"
          onClick={onOpenAgentPicker}
          className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-white/[0.04] transition-all group"
        >
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[var(--arc-brand-atlantean-teal)]/20 to-[var(--arc-brand-cosmic-blue)]/10 flex items-center justify-center text-sm border border-white/[0.08] group-hover:border-[var(--arc-brand-atlantean-teal)]/30 transition-colors">
            {agentDisplay.avatar}
          </div>
          <div className="text-left">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-medium text-[var(--arc-text-primary)] transition-colors">
                {agentDisplay.name}
              </span>
              <AiDisclosure />
              <PhCaretDown className="w-3 h-3 text-[var(--arc-text-secondary)]" />
            </div>
            <span className="text-xs text-[var(--arc-text-secondary)] leading-none hidden sm:block">
              {agentDisplay.specialty}
            </span>
          </div>
        </button>

        {/* Model pill */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button
              type="button"
              aria-label={`Model: ${model?.shortName ?? currentModel}`}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--arc-cosmic-surface)] border border-[var(--arc-cosmic-border-bright)] text-sm text-[var(--arc-text-secondary)]"
            >
              <ProviderLogo provider={model?.provider ?? "arcanea"} size={16} />
              <span>{model?.shortName ?? currentModel}</span>
              <PhCaretDown className="w-2.5 h-2.5" />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal container={rootRef.current}>
            <DropdownMenu.Content
              align="end"
              side="top"
              sideOffset={8}
              collisionPadding={16}
              className={styles.modelMenu}
              aria-label="Choose a model"
              aria-labelledby={undefined}
            >
              <DropdownMenu.RadioGroup
                value={currentModel}
                onValueChange={onModelChange}
              >
                {CHAT_MODELS.map((m) => (
                  <DropdownMenu.RadioItem
                    key={m.id}
                    value={m.id}
                    className="w-full text-left px-3 py-2 text-sm flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2">
                      <ProviderLogo provider={m.provider} size={18} />
                      <span>{m.shortName ?? m.name}</span>
                    </div>
                    {m.tier && (
                      <span className="text-xs text-[var(--arc-text-secondary)]">
                        {m.tier}
                      </span>
                    )}
                  </DropdownMenu.RadioItem>
                ))}
              </DropdownMenu.RadioGroup>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>

      {/* Focus mode pills — horizontal scroll on all sizes */}
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none -mx-1 px-1">
        {FOCUS_MODES.map((mode) => (
          <button
            type="button"
            key={mode.id}
            aria-pressed={focusMode === mode.id}
            onClick={() => onFocusModeChange(mode.id)}
            className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium border ${
              focusMode === mode.id
                ? "border-[var(--arc-brand-atlantean-teal)] bg-[var(--arc-cosmic-raised)] text-[var(--arc-text-primary)]"
                : "border-[var(--arc-cosmic-border-bright)] bg-[var(--arc-cosmic-surface)] text-[var(--arc-text-secondary)]"
            }`}
          >
            {mode.label}
          </button>
        ))}
      </div>
    </div>
  );
}
