'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { MessageBubble } from '@/components/chat/message-bubble';
import type { ActiveLuminor } from '@/hooks/use-conversation';
import type { SwarmResult } from '@/lib/ai/guardian-swarm';
import { getLuminor } from '@/lib/luminors/config';
import {
  PhArrowDown,
  PhArrowClockwise,
} from '@/lib/phosphor-icons';
import { ArcaneanMarkGlow, ArcaneanMarkSmall } from '@/components/brand/arcanea-mark';

// ---------------------------------------------------------------------------
// Constants (ported from page.tsx)
// ---------------------------------------------------------------------------

const ACCENT = '#00bcd4';

const CREATIVE_STARTERS = [
  { icon: '\u2726', text: 'Design a magic system', hint: 'Elements, costs, limits, factions' },
  { icon: '\u25C6', text: 'Create a character', hint: 'Name, backstory, portrait, motivation' },
  { icon: '\u2756', text: 'Write an opening scene', hint: 'Hook, conflict, voice — page one' },
  { icon: '\u2666', text: 'Build a world', hint: 'One sentence to a full universe' },
];

/** Alias for backward compat — some parts of the file reference this name */
const CAPABILITY_DOMAINS = CREATIVE_STARTERS;

const SUBTITLES = [
  "Stories, code, worlds, music \u2014 type a prompt or pick a starter below.",
  "16 specialist minds. Pick one or let Auto route your message.",
  "Better at the second draft. Paste what you\u2019ve got so far.",
  "Images take ~10s. Stories are instant. Worlds take a conversation.",
  "Attach images, use @mentions for agents, or just type.",
  "Built for makers. Not a general assistant.",
];

function getSubtitle(): string {
  if (typeof window === 'undefined') return SUBTITLES[0];
  const idx = (new Date().getHours() * 7 + new Date().getDate()) % SUBTITLES.length;
  return SUBTITLES[idx];
}

function getTimeSuggestions(): string[] {
  return CREATIVE_STARTERS.map((s) => s.text);
}

// ---------------------------------------------------------------------------
// Time-aware helpers
// ---------------------------------------------------------------------------

function getTimeGreeting(): string {
  if (typeof window === 'undefined') return 'What are you creating?';
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'Good morning \u2014 what are you building?';
  if (hour >= 12 && hour < 17) return 'What are you creating?';
  if (hour >= 17 && hour < 21) return 'What are you creating tonight?';
  return 'What are you creating tonight?';
}

// ---------------------------------------------------------------------------
// Error message helper — maps raw errors to user-friendly messages
// ---------------------------------------------------------------------------

export function getErrorMessage(error: string | Error): { title: string; action: string } {
  const msg = typeof error === 'string' ? error : error.message;

  // No API key configured (server returns 503 with "No API key" text)
  if (msg.includes('No API key') || msg.includes('503')) {
    return {
      title: 'No AI key configured',
      action: 'Add your own AI key in Settings to get started, or ask the admin to configure server keys.',
    };
  }
  if (msg.includes('API key') || msg.includes('Invalid') || msg.includes('401') || msg.includes('403')) {
    return { title: 'Invalid API key', action: 'Check your key in Settings \u2192 Providers and make sure it is correct.' };
  }
  if (msg.includes('rate') || msg.includes('429')) {
    return { title: 'Creating too fast', action: "You\u2019re creating too fast. Take a breath and try again in a moment." };
  }
  if (msg.includes('network') || msg.includes('fetch') || msg.includes('Failed to fetch')) {
    return { title: 'Connection lost', action: 'Check your internet and try again.' };
  }
  if (msg.includes('token') || msg.includes('length') || msg.includes('too long')) {
    return { title: 'Message too long', action: 'Try a shorter message or start a new chat.' };
  }
  if (msg.includes('timeout') || msg.includes('ETIMEDOUT')) {
    return { title: 'Request timed out', action: 'Try again \u2014 the server may be busy.' };
  }
  return { title: 'Something went wrong', action: 'Try again or start a new conversation.' };
}

// ---------------------------------------------------------------------------
// Keyboard shortcuts config
// ---------------------------------------------------------------------------

const KEYBOARD_SHORTCUTS = [
  ['Enter', 'Send message'],
  ['Shift + Enter', 'New line'],
  ['Cmd/Ctrl + N', 'New chat'],
  ['Cmd/Ctrl + Shift + S', 'Toggle sidebar'],
  ['Cmd/Ctrl + F', 'Search messages'],
  ['?', 'Show shortcuts'],
  ['Esc', 'Close dialog'],
] as const;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Minimal message shape — matches AI SDK UIMessage */
interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
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
  const [emptyGreeting, setEmptyGreeting] = useState('What are you creating?');
  const [emptySubtitle, setEmptySubtitle] = useState(SUBTITLES[0]);
  const [hasMounted, setHasMounted] = useState(false);

  // -------------------------------------------------------------------------
  // Keyboard shortcuts overlay toggle
  // -------------------------------------------------------------------------

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (
        e.key === '?' &&
        !e.ctrlKey &&
        !e.metaKey &&
        document.activeElement?.tagName !== 'TEXTAREA' &&
        document.activeElement?.tagName !== 'INPUT'
      ) {
        setShowShortcuts((v) => !v);
      }
      if (e.key === 'Escape') setShowShortcuts(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    setHasMounted(true);
    setEmptyGreeting(getTimeGreeting());
    setEmptySubtitle(getSubtitle());
  }, []);

  // Auto-scroll on new content
  useEffect(() => {
    if (autoScroll && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
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
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    setAutoScroll(true);
  }, []);

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  return (
    <div className="relative flex-1 flex flex-col min-w-0 overflow-hidden">
      {/* Search overlay */}
      {searchOverlay}

      {/* Messages area */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        role="log"
        aria-label="Chat messages"
        className="relative flex-1 overflow-y-auto"
        style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.08) transparent' }}
      >
        {isEmpty ? (
          /* ============================================================= */
          /* Empty state — clean, centered, inviting                        */
          /* ============================================================= */
          <div className="relative flex flex-col items-center justify-center h-full px-4">
            {/* Subtle aurora gradient behind empty state */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-[radial-gradient(ellipse,rgba(0,188,212,0.04)_0%,rgba(13,71,161,0.03)_40%,transparent_70%)] blur-2xl" />
              <div className="absolute bottom-1/3 left-1/3 w-[300px] h-[300px] rounded-full bg-[radial-gradient(circle,rgba(0,137,123,0.03)_0%,transparent_60%)] blur-xl" />
            </div>

            <div className="relative max-w-[480px] w-full text-center">
              {/* Arcanea icon */}
              <div className="mb-6 mx-auto animate-empty-fade-in">
                <ArcaneanMarkGlow animate="breathe" />
              </div>

              {/* Time-aware greeting — gradient text */}
              <h1 className="text-2xl sm:text-3xl font-semibold mb-3 tracking-tight animate-empty-fade-in bg-gradient-to-r from-white via-white/95 to-[#00bcd4]/80 bg-clip-text text-transparent" style={{ animationDelay: '60ms' }}>
                {activeLuminor ? activeLuminor.name : emptyGreeting}
              </h1>

              {/* Rotating subtitle */}
              <p className="text-sm text-white/30 mb-8 animate-empty-fade-in font-light" style={{ animationDelay: '100ms' }}>
                {emptySubtitle}
              </p>

              {/* 4 creative starter chips in a 2x2 grid */}
              <div
                className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-6"
                role="list"
                aria-label="Creative starters"
              >
                {CREATIVE_STARTERS.map((starter, i) => (
                  <button
                    key={starter.text}
                    type="button"
                    onClick={() => {
                      onSetInput(starter.text);
                      onFocusInput();
                    }}
                    className="relative flex flex-col items-start gap-1.5 px-4 py-3.5 rounded-xl text-left bg-gradient-to-br from-white/[0.04] to-white/[0.02] border border-white/[0.07] backdrop-blur-sm hover:border-[#00bcd4]/25 hover:bg-gradient-to-br hover:from-[#00bcd4]/[0.06] hover:to-transparent hover:shadow-[0_0_24px_rgba(0,188,212,0.08)] transition-all duration-300 group focus-visible:ring-2 focus-visible:ring-[#00bcd4]/40 focus-visible:outline-none"
                    style={{
                      animation: `fadeInUp 400ms cubic-bezier(0.22, 1, 0.36, 1) ${150 + i * 60}ms both`,
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-white/25 group-hover:text-[#00bcd4]/60 transition-colors duration-300" aria-hidden="true">
                        {starter.icon}
                      </span>
                      <span className="text-[13px] text-white/60 group-hover:text-white/85 transition-colors duration-300 font-medium">
                        {starter.text}
                      </span>
                    </div>
                    <span className="text-[11px] text-white/25 group-hover:text-white/40 transition-colors duration-300 leading-snug pl-6">
                      {starter.hint}
                    </span>
                  </button>
                ))}
              </div>

              {/* Continue last session — subtle, not prominent */}
              {hasMounted && lastSessionTitle && onContinueLastSession && (
                <button
                  onClick={onContinueLastSession}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs text-white/35 hover:text-white/60 border border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.04] transition-all duration-200 mx-auto animate-empty-fade-in"
                  style={{ animationDelay: '450ms' }}
                >
                  <PhArrowClockwise className="w-3 h-3 shrink-0" />
                  <span className="truncate max-w-[200px]">Continue: {lastSessionTitle}</span>
                </button>
              )}

              {/* Subtle API key hint — only when no keys at all */}
              {hasMounted && !clientApiKey && !serverHasKeys && (
                <p className="text-[11px] text-white/15 mt-4 animate-empty-fade-in" style={{ animationDelay: '500ms' }}>
                  Tip: <Link href="/settings/providers" className="underline decoration-white/10 hover:text-white/30 transition-colors">Add your own AI keys</Link> in Settings for unlimited access
                </p>
              )}
            </div>
          </div>
        ) : (
          /* ============================================================= */
          /* Messages list                                                  */
          /* ============================================================= */
          <div className="max-w-[720px] mx-auto w-full px-4 py-6" aria-live="polite">
            {messages.map((msg, idx) => {
              const isLastMsg = msg.id === lastMsg?.id;
              const msgIsLast = idx === messages.length - 1;

              // Compute swarm luminors for the last assistant message only
              const swarmLuminors =
                isLastMsg &&
                !activeLuminor &&
                swarmResult &&
                swarmResult.coordinationMode !== 'convergence' &&
                swarmResult.activeLuminors.length > 0
                  ? swarmResult.activeLuminors.slice(0, 3)
                  : undefined;

              return (
                <div
                  key={msg.id}
                  role="article"
                  aria-label={msg.role === 'user' ? 'Your message' : `Message from ${activeLuminor?.name || 'Arcanea'}`}
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
                    onSelectLuminor={swarmLuminors ? (id) => {
                      const cfg = getLuminor(id);
                      if (cfg) onSelectLuminor(cfg as ActiveLuminor);
                    } : undefined}
                    branches={branches.has(msg.id) ? (branches.get(msg.id) as unknown[]) : undefined}
                    onLoadBranch={branches.has(msg.id) ? (branchIndex) => onLoadBranch(msg.id, branchIndex) : undefined}
                  />
                </div>
              );
            })}

            {/* Thinking indicator */}
            {isThinking && (
              <div className="mb-6" role="status" aria-label="Arcanea is composing a response">
                <div className="flex gap-3">
                  {activeLuminor?.avatar ? (
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                      style={{
                        background: `linear-gradient(135deg, ${activeLuminor.color || ACCENT}, ${activeLuminor.color || ACCENT}80)`,
                      }}
                    >
                      {activeLuminor.avatar}
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#00bcd4]/5 flex items-center justify-center shrink-0 shadow-[0_0_8px_rgba(0,188,212,0.12)]">
                      <ArcaneanMarkSmall className="animate-[breathe_2s_ease-in-out_infinite]" />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span
                        className="text-xs font-medium"
                        style={{ color: activeLuminor?.color || ACCENT }}
                      >
                        {activeLuminor?.name || 'Arcanea'}
                      </span>
                      <span className="text-[10px] text-white/20 font-mono">{providerLabel}</span>
                    </div>
                    {runtimeSummary && (
                      <div className="mb-2 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-[11px] text-white/35">
                        {runtimeSummary}
                      </div>
                    )}
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-[#00bcd4]/[0.04] via-white/[0.02] to-[#00897b]/[0.03] border border-[#00bcd4]/[0.08] shadow-[0_0_16px_rgba(0,188,212,0.1)]" aria-live="assertive">
                      <div className="relative w-5 h-5">
                        <div className="absolute inset-0 rounded-full border-2 border-[#00bcd4]/20" />
                        <div
                          className="absolute inset-0 rounded-full border-2 border-[#00bcd4] border-t-transparent animate-spin"
                          style={{ animationDuration: '0.8s' }}
                        />
                        <div className="absolute inset-[3px] rounded-full bg-[#00bcd4]/10 animate-pulse" />
                      </div>
                      <span className="text-xs text-white/40 font-medium flex items-center gap-1">
                        Composing
                        <span className="flex gap-0.5">
                          <span className="w-1 h-1 rounded-full bg-[#00bcd4] animate-pulse" style={{ animationDelay: '0ms' }} />
                          <span className="w-1 h-1 rounded-full bg-[#00bcd4] animate-pulse" style={{ animationDelay: '150ms' }} />
                          <span className="w-1 h-1 rounded-full bg-[#00bcd4] animate-pulse" style={{ animationDelay: '300ms' }} />
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
            className="w-9 h-9 rounded-full bg-gradient-to-b from-[#1e1e28] to-[#14141c] border border-white/[0.1] shadow-[0_4px_16px_rgba(0,0,0,0.4),0_0_1px_rgba(255,255,255,0.06)] flex items-center justify-center text-white/50 hover:text-[#00bcd4] hover:border-[#00bcd4]/20 hover:shadow-[0_4px_16px_rgba(0,188,212,0.15)] transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#00bcd4]/40 focus-visible:outline-none"
          >
            <PhArrowDown className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Children slot — input bar */}
      {children}

      {/* Keyboard shortcuts overlay */}
      {showShortcuts && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center"
          onClick={() => setShowShortcuts(false)}
        >
          <div
            className="bg-gradient-to-b from-[#14141e] to-[#0e0e16] rounded-2xl border border-white/[0.08] p-6 max-w-sm w-full mx-4 shadow-[0_24px_80px_rgba(0,0,0,0.6),0_0_1px_rgba(255,255,255,0.06)]"
            onClick={(e) => e.stopPropagation()}
            style={{ animation: 'fadeInUp 200ms cubic-bezier(0.22, 1, 0.36, 1)' }}
          >
            <h2 className="text-sm font-semibold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent mb-4">
              Keyboard Shortcuts
            </h2>
            <div className="space-y-2 text-xs">
              {KEYBOARD_SHORTCUTS.map(([key, desc]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-white/40">{desc}</span>
                  <kbd className="px-1.5 py-0.5 rounded bg-white/[0.06] text-white/60 font-mono text-[10px] border border-white/[0.08]">
                    {key}
                  </kbd>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-white/20 mt-4 text-center">
              Press ? or Esc to close
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
