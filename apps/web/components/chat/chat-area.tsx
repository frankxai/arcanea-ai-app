/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
"use client";
import * as Dialog from "@radix-ui/react-dialog";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { MessageBubble } from "@/components/chat/message-bubble";
import { ChatWelcome } from "@/components/chat/chat-welcome";
import type { ActiveLuminor } from "@/hooks/use-conversation";
import type { SwarmResult } from "@/lib/ai/guardian-swarm";
import { getLuminor } from "@/lib/luminors/config";
import { PhArrowDown } from "@/lib/phosphor-icons";
import {
  ArcaneanMarkGlow,
  ArcaneanMarkSmall,
} from "@/components/brand/arcanea-mark";

// ---------------------------------------------------------------------------
// Constants (ported from page.tsx)
// ---------------------------------------------------------------------------

const ACCENT = "var(--arc-brand-atlantean-teal)";

// ---------------------------------------------------------------------------
// Error message helper — maps raw errors to user-friendly messages
// ---------------------------------------------------------------------------

export { getErrorMessage } from "@/lib/chat/error-message";

// ---------------------------------------------------------------------------
// Keyboard shortcuts config
// ---------------------------------------------------------------------------

const KEYBOARD_SHORTCUTS = [
  ["Enter", "Send message"],
  ["Shift + Enter", "New line"],
  ["Cmd/Ctrl + N", "New chat"],
  ["Cmd/Ctrl + Shift + S", "Toggle sidebar"],
  ["Cmd/Ctrl + F", "Search messages"],
  ["?", "Show shortcuts"],
  ["Esc", "Close dialog"],
] as const;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Minimal message shape — matches AI SDK UIMessage */
interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content?: string;
  parts?: Array<Record<string, unknown> & { type: string; text?: string }>;
  createdAt?: Date | string;
}

interface AutoSaveState {
  lastDetection: { type: string } | null;
  notification: string | null;
}

interface ChatAreaProps {
  /** All messages in the conversation */
  messages: ChatMessage[];
  /** Whether the AI is currently streaming a response */
  isStreaming: boolean;
  /** Whether the AI is loading (waiting for first token or processing) */
  isLoading: boolean;
  /** Whether the AI is in its thinking phase (before any tokens) */
  isThinking: boolean;
  /** Whether there are no messages */
  isEmpty: boolean;
  /** Currently active luminor (AI persona), if any */
  activeLuminor: ActiveLuminor | null;
  /** Swarm routing result */
  swarmResult: SwarmResult | null;
  /** Provider label for display */
  providerLabel: string;
  /** Runtime provider/context summary parsed from server headers */
  runtimeSummary?: string | null;
  /** Send a new message */
  onSendMessage: (opts: { text: string }) => void;
  /** Set input field value (for capability chip hints) */
  onSetInput: (value: string) => void;
  /** Focus the textarea */
  onFocusInput: () => void;
  /** Select a luminor */
  onSelectLuminor: (config: ActiveLuminor) => void;
  /** Copy message content */
  onCopy: (id: string, text: string) => void;
  /** Currently copied message id */
  copiedId: string | null;
  /** Edit a message */
  editingMessageId: string | null;
  onSetEditingMessageId: (id: string | null) => void;
  onEditMessage: (id: string, text: string) => void;
  /** Regenerate from a specific message */
  onRegenerateFrom: (id: string) => void;
  /** Branch navigation */
  branches: Map<string, unknown[]>;
  onLoadBranch: (messageId: string, branchIndex: number) => void;
  /** Last message reference (for streaming indicator placement) */
  lastMsg: ChatMessage | null;
  /** Auto-save state for creation detection */
  autoSave: AutoSaveState;
  /** Search query for in-conversation search */
  searchQuery: string;
  /** Whether user has a configured API key */
  clientApiKey: string | null;
  /** Whether server has API keys configured */
  serverHasKeys: boolean;
  /** Continue-last-session data */
  lastSessionTitle: string | null;
  onContinueLastSession: (() => void) | null;
  /** Optional search overlay rendered at top of chat area */
  searchOverlay?: React.ReactNode;
  /** Children slot — renders at the bottom for the input bar */
  children: React.ReactNode;
}

// ---------------------------------------------------------------------------
// ChatArea — main centered chat container
// ---------------------------------------------------------------------------

export function ChatArea({
  messages,
  isStreaming,
  isLoading,
  isThinking,
  isEmpty,
  activeLuminor,
  swarmResult,
  providerLabel,
  runtimeSummary,
  onSendMessage,
  onSetInput,
  onFocusInput,
  onSelectLuminor,
  onCopy,
  copiedId,
  editingMessageId,
  onSetEditingMessageId,
  onEditMessage,
  onRegenerateFrom,
  branches,
  onLoadBranch,
  lastMsg,
  autoSave,
  searchQuery,
  clientApiKey,
  serverHasKeys,
  lastSessionTitle,
  onContinueLastSession,
  searchOverlay,
  children,
}: ChatAreaProps) {
  // -------------------------------------------------------------------------
  // Scroll management
  // -------------------------------------------------------------------------

  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);

  // -------------------------------------------------------------------------
  const shortcutsReturnFocusRef = useRef<HTMLElement | null>(null);
  const shortcutsPortalRef = useRef<HTMLDivElement>(null);

  // Keyboard shortcuts overlay toggle
  // -------------------------------------------------------------------------

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (
        e.key === "?" &&
        !e.ctrlKey &&
        !e.metaKey &&
        document.activeElement?.tagName !== "TEXTAREA" &&
        document.activeElement?.tagName !== "INPUT"
      ) {
        if (!showShortcuts)
          shortcutsReturnFocusRef.current =
            document.activeElement as HTMLElement;
        setShowShortcuts((v) => !v);
      }
      if (e.key === "Escape") setShowShortcuts(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [showShortcuts]);

  // Auto-scroll on new content
  useEffect(() => {
    if (autoScroll && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, autoScroll]);

  // Scroll detection
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const dist = scrollHeight - scrollTop - clientHeight;
    setShowScrollBtn(dist > 200);
    setAutoScroll(dist <= 100);
  }, []);

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    setAutoScroll(true);
  }, []);

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  return (
    <div
      ref={shortcutsPortalRef}
      className="relative flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden"
    >
      {/* Search overlay */}
      {searchOverlay}

      {/* Messages area */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        role="log"
        aria-label="Chat messages"
        className="relative flex-1 min-h-0 overflow-y-auto"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor:
            "color-mix(in srgb, var(--arc-text-primary) 8%, transparent) transparent",
        }}
      >
        {isEmpty ? (
          /* ============================================================= */
          /* Empty state — clean, centered, inviting                        */
          /* ============================================================= */
          <ChatWelcome
            activeLuminor={activeLuminor}
            onSetInput={onSetInput}
            onFocusInput={onFocusInput}
            onSelectLuminor={onSelectLuminor}
            clientApiKey={clientApiKey}
            serverHasKeys={serverHasKeys}
            lastSessionTitle={lastSessionTitle}
            onContinueLastSession={onContinueLastSession}
          />
        ) : (
          /* ============================================================= */
          /* Messages list                                                  */
          /* ============================================================= */
          <div
            className="max-w-[720px] mx-auto w-full px-4 py-6"
            aria-live="polite"
          >
            {messages.map((msg, idx) => {
              const isLastMsg = msg.id === lastMsg?.id;
              const msgIsLast = idx === messages.length - 1;

              // Compute swarm luminors for the last assistant message only
              const swarmLuminors =
                isLastMsg &&
                !activeLuminor &&
                swarmResult &&
                swarmResult.coordinationMode !== "convergence" &&
                swarmResult.activeLuminors.length > 0
                  ? swarmResult.activeLuminors.slice(0, 3)
                  : undefined;

              return (
                <div
                  key={msg.id}
                  role="article"
                  aria-label={
                    msg.role === "user"
                      ? "Your message"
                      : `Message from ${activeLuminor?.name || "Arcanea"}`
                  }
                  className="animate-msg-slide-in"
                >
                  <MessageBubble
                    message={msg}
                    isStreaming={isStreaming && isLastMsg}
                    isLast={msgIsLast}
                    isLoading={isLoading && isLastMsg}
                    luminorName={activeLuminor?.name}
                    luminorAvatar={activeLuminor?.avatar}
                    luminorColor={activeLuminor?.color}
                    luminorTitle={activeLuminor?.title}
                    luminorId={activeLuminor?.id}
                    providerLabel={providerLabel}
                    runtimeSummary={isLastMsg ? runtimeSummary : undefined}
                    onRegenerate={() => onRegenerateFrom(msg.id)}
                    onEdit={(id, text) => {
                      onEditMessage(id, text);
                      onSetEditingMessageId(null);
                    }}
                    onCopy={(text) => onCopy(msg.id, text)}
                    searchQuery={searchQuery}
                    onSendMessage={onSendMessage}
                    onSetInput={onSetInput}
                    onFocusInput={onFocusInput}
                    autoSave={isLastMsg ? autoSave : undefined}
                    swarmLuminors={swarmLuminors}
                    onSelectLuminor={
                      swarmLuminors
                        ? (id) => {
                            const cfg = getLuminor(id);
                            if (cfg) onSelectLuminor(cfg as ActiveLuminor);
                          }
                        : undefined
                    }
                    branches={
                      branches.has(msg.id)
                        ? (branches.get(msg.id) as unknown[])
                        : undefined
                    }
                    onLoadBranch={
                      branches.has(msg.id)
                        ? (branchIndex) => onLoadBranch(msg.id, branchIndex)
                        : undefined
                    }
                  />
                </div>
              );
            })}

            {/* Thinking indicator */}
            {isThinking && (
              <div
                className="mb-6"
                role="status"
                aria-label="Arcanea is composing a response"
              >
                <div className="flex gap-3">
                  {activeLuminor?.avatar ? (
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--arc-text-primary)] text-xs font-bold shrink-0"
                      style={{
                        background: `linear-gradient(135deg, ${activeLuminor.color || ACCENT}, ${activeLuminor.color || ACCENT}80)`,
                      }}
                    >
                      {activeLuminor.avatar}
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[var(--arc-brand-atlantean-teal)]/5 flex items-center justify-center shrink-0 shadow-[0_0_8px_color-mix(in_srgb,var(--arc-brand-atlantean-teal)_12%,transparent)]">
                      <ArcaneanMarkSmall className="animate-[breathe_2s_ease-in-out_infinite]" />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span
                        className="text-xs font-medium"
                        style={{ color: activeLuminor?.color || ACCENT }}
                      >
                        {activeLuminor?.name || "Arcanea"}
                      </span>
                      <span className="text-[10px] text-[var(--arc-text-secondary)] font-mono">
                        {providerLabel}
                      </span>
                    </div>
                    {runtimeSummary && (
                      <div className="mb-2 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-[11px] text-[var(--arc-text-secondary)]">
                        {runtimeSummary}
                      </div>
                    )}
                    <div
                      className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-[var(--arc-brand-atlantean-teal)]/[0.04] via-white/[0.02] to-[var(--arc-brand-cosmic-blue)]/[0.03] border border-[var(--arc-brand-atlantean-teal)]/[0.08] shadow-[0_0_16px_color-mix(in_srgb,var(--arc-brand-atlantean-teal)_10%,transparent)]"
                      aria-live="assertive"
                    >
                      <div className="relative w-5 h-5">
                        <div className="absolute inset-0 rounded-full border-2 border-[var(--arc-brand-atlantean-teal)]/20" />
                        <div
                          className="absolute inset-0 rounded-full border-2 border-[var(--arc-brand-atlantean-teal)] border-t-transparent animate-spin"
                          style={{ animationDuration: "0.8s" }}
                        />
                        <div className="absolute inset-[3px] rounded-full bg-[var(--arc-brand-atlantean-teal)]/10 animate-pulse" />
                      </div>
                      <span className="text-xs text-[var(--arc-text-secondary)] font-medium flex items-center gap-1">
                        Composing
                        <span className="flex gap-0.5">
                          <span
                            className="w-1 h-1 rounded-full bg-[var(--arc-brand-atlantean-teal)] animate-pulse"
                            style={{ animationDelay: "0ms" }}
                          />
                          <span
                            className="w-1 h-1 rounded-full bg-[var(--arc-brand-atlantean-teal)] animate-pulse"
                            style={{ animationDelay: "150ms" }}
                          />
                          <span
                            className="w-1 h-1 rounded-full bg-[var(--arc-brand-atlantean-teal)] animate-pulse"
                            style={{ animationDelay: "300ms" }}
                          />
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={bottomRef} className="h-4" />
          </div>
        )}
      </div>

      {/* Scroll to bottom button */}
      {showScrollBtn && (
        <div className="absolute bottom-36 sm:bottom-32 left-1/2 -translate-x-1/2 z-10">
          <button
            onClick={scrollToBottom}
            aria-label="Scroll to latest message"
            className="w-9 h-9 rounded-full bg-gradient-to-b from-[var(--arc-cosmic-void)] to-[var(--arc-cosmic-void)] border border-white/[0.1] shadow-[0_4px_16px_color-mix(in_srgb,var(--arc-cosmic-void)_70%,transparent),0_0_1px_color-mix(in_srgb,var(--arc-text-primary)_8%,transparent)] flex items-center justify-center text-[var(--arc-text-secondary)] hover:text-[var(--arc-brand-atlantean-teal)] hover:border-[var(--arc-brand-atlantean-teal)]/20 hover:shadow-[0_4px_16px_color-mix(in_srgb,var(--arc-brand-atlantean-teal)_15%,transparent)] transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[var(--arc-brand-atlantean-teal)]/40 focus-visible:outline-none"
          >
            <PhArrowDown className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Children slot — input bar */}
      {children}

      {/* Keyboard shortcuts overlay */}
      <Dialog.Root open={showShortcuts} onOpenChange={setShowShortcuts}>
        <Dialog.Portal container={shortcutsPortalRef.current}>
          <Dialog.Overlay className="fixed inset-0 bg-[var(--arc-cosmic-void)]/70 backdrop-blur-md z-50" />
          <Dialog.Content
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 bg-[var(--arc-cosmic-void)] rounded-2xl border border-white/[0.08] p-6 max-w-sm mx-auto max-h-full overflow-y-auto shadow-[0_24px_80px_color-mix(in_srgb,var(--arc-cosmic-void)_82%,transparent),0_0_1px_color-mix(in_srgb,var(--arc-text-primary)_8%,transparent)]"
            onCloseAutoFocus={(event) => {
              event.preventDefault();
              if (shortcutsReturnFocusRef.current?.isConnected)
                shortcutsReturnFocusRef.current.focus();
              else onFocusInput();
            }}
          >
            <Dialog.Title className="text-sm font-semibold text-[var(--arc-text-primary)] mb-4">
              Keyboard shortcuts
            </Dialog.Title>
            <div className="space-y-2 text-xs">
              {KEYBOARD_SHORTCUTS.map(([key, desc]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-[var(--arc-text-secondary)]">
                    {desc}
                  </span>
                  <kbd className="px-1.5 py-0.5 rounded bg-white/[0.06] text-[var(--arc-text-primary)] font-mono text-[10px] border border-white/[0.08]">
                    {key}
                  </kbd>
                </div>
              ))}
            </div>
            <Dialog.Description className="text-xs text-[var(--arc-text-secondary)] mt-4 text-center">
              Press ? or Esc to close
            </Dialog.Description>
            <Dialog.Close className="mt-4 min-h-11 w-full rounded-lg border border-white/[0.15] px-4 py-3 text-sm text-[var(--arc-text-primary)] hover:bg-white/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--arc-brand-atlantean-teal)]">
              Close
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
