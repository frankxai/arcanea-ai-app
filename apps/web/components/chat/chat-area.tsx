'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const ChatMarkdown = dynamic(
  () => import('@/components/chat/chat-markdown'),
  {
    ssr: false,
    loading: () => <div className="animate-pulse h-4 bg-white/[0.04] rounded w-3/4" />,
  },
);
const ToolResultBlock = dynamic(
  () => import('@/components/chat/tool-result-block'),
  { ssr: false },
);
import { SaveCreationButton } from '@/components/chat/save-creation-button';
import { getMessageText, parseFollowUps, type ActiveLuminor } from '@/hooks/use-conversation';
import type { SwarmResult } from '@/lib/ai/guardian-swarm';
import { getLuminor } from '@/lib/luminors/config';
import {
  generateFallbackSuggestions,
  detectContentType,
  CONTENT_TYPE_ICONS,
  type ContentType,
} from '@/lib/chat/suggestion-engine';
import {
  PhArrowDown,
  PhArrowClockwise,
  PhCopy,
  PhCheck,
  PhPencilSimple,
  PhSparkle,
  PhGear,
} from '@/lib/phosphor-icons';

// ---------------------------------------------------------------------------
// Constants (ported from page.tsx)
// ---------------------------------------------------------------------------

const ACCENT = '#00bcd4';

const TEAM_COLORS: Record<string, string> = {
  development: '#00bcd4',
  creative: '#e040fb',
  writing: '#ffab40',
  research: '#69f0ae',
};

const DEFAULT_SUGGESTIONS = [
  'Build me a character with one fatal contradiction',
  'Architect a real-time collab canvas \u2014 start with the data model',
  'Write an opening scene where the reader learns the rules by breaking one',
  'I have three ideas and can only ship one \u2014 help me decide',
];

const MORNING_SUGGESTIONS = [
  'Design a progression system for a creative tool',
  'Write a cold open that hooks in the first three lines',
  "Architect the MVP for the idea I can\u2019t stop thinking about",
  'Build me a world where one element is forbidden',
];

const EVENING_SUGGESTIONS = [
  "I wrote 500 words today and hate all of them \u2014 help me salvage",
  "Surprise me with a world I\u2019ve never seen before",
  'Review what I have and tell me the one thing that would double its impact',
  'Write a bedtime parable about a creator who almost quit',
];

const SUBTITLES = [
  "Stories, code, worlds, music \u2014 bring me the problem you can\u2019t solve alone.",
  "I think in systems and ship in specifics. What\u2019s the idea?",
  "Better at the second draft. Show me what you\u2019ve got.",
  "I\u2019d rather ask one sharp question than list five options.",
  'I see game theory in magic systems and contradiction in characters.',
  'Built for makers. Not a general assistant.',
];

const CAPABILITY_DOMAINS = [
  { label: 'World-Building', icon: '\u2726', hint: 'Design a magic system for my novel' },
  { label: 'Code', icon: '\u2318', hint: 'Architect a production-grade TypeScript system' },
  { label: 'Writing', icon: '\u270E', hint: 'Write an opening scene that hooks immediately' },
  { label: 'Music', icon: '\u266B', hint: 'Compose a melody that feels like longing' },
];

// ---------------------------------------------------------------------------
// Time-aware helpers
// ---------------------------------------------------------------------------

function getTimeSuggestions(): string[] {
  if (typeof window === 'undefined') return DEFAULT_SUGGESTIONS;
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return MORNING_SUGGESTIONS;
  if (hour >= 20 || hour < 5) return EVENING_SUGGESTIONS;
  return DEFAULT_SUGGESTIONS;
}

function getTimeGreeting(): string {
  if (typeof window === 'undefined') return 'What are you making?';
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'What are you making today?';
  if (hour >= 20 || hour < 5) return 'Late night creation mode.';
  return 'What are you making?';
}

function getSubtitle(): string {
  if (typeof window === 'undefined') return SUBTITLES[0];
  const idx = (new Date().getHours() * 7 + new Date().getDate()) % SUBTITLES.length;
  return SUBTITLES[idx];
}

// ---------------------------------------------------------------------------
// Error message helper — maps raw errors to user-friendly messages
// ---------------------------------------------------------------------------

export function getErrorMessage(error: string | Error): { title: string; action: string } {
  const msg = typeof error === 'string' ? error : error.message;

  if (msg.includes('API key') || msg.includes('401') || msg.includes('403')) {
    return { title: 'Invalid API key', action: 'Check your key in Settings \u2192 Providers' };
  }
  if (msg.includes('rate') || msg.includes('429')) {
    return { title: 'Rate limit reached', action: 'Wait a moment and try again' };
  }
  if (msg.includes('network') || msg.includes('fetch') || msg.includes('Failed to fetch')) {
    return { title: 'Connection lost', action: 'Check your internet connection' };
  }
  if (msg.includes('token') || msg.includes('length') || msg.includes('too long')) {
    return { title: 'Message too long', action: 'Try a shorter message or start a new chat' };
  }
  if (msg.includes('timeout') || msg.includes('ETIMEDOUT')) {
    return { title: 'Request timed out', action: 'Try again — the server may be busy' };
  }
  return { title: 'Something went wrong', action: 'Try again or start a new conversation' };
}

// ---------------------------------------------------------------------------
// Keyboard shortcuts config
// ---------------------------------------------------------------------------

const KEYBOARD_SHORTCUTS = [
  ['Enter', 'Send message'],
  ['Shift + Enter', 'New line'],
  ['Cmd/Ctrl + N', 'New chat'],
  ['Cmd/Ctrl + Shift + S', 'Toggle sidebar'],
  ['?', 'Show shortcuts'],
  ['Esc', 'Close dialog'],
] as const;

// ---------------------------------------------------------------------------
// Inline edit form for user messages
// ---------------------------------------------------------------------------

function EditMessageForm({
  initialText,
  onSave,
  onCancel,
}: {
  initialText: string;
  onSave: (text: string) => void;
  onCancel: () => void;
}) {
  const [text, setText] = useState(initialText);
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    ref.current?.focus();
    ref.current?.select();
  }, []);

  return (
    <div className="w-full">
      <textarea
        ref={ref}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (text.trim()) onSave(text.trim());
          }
          if (e.key === 'Escape') onCancel();
        }}
        aria-label="Edit message text"
        className="w-full px-4 py-3 rounded-2xl bg-[#1a1a1f] border border-[#00bcd4]/30 text-white/90 text-[15px] leading-relaxed resize-none focus:outline-none focus:border-[#00bcd4]/50"
        rows={Math.min(text.split('\n').length + 1, 8)}
      />
      <div className="flex justify-end gap-2 mt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-1.5 text-xs text-white/40 hover:text-white/60 rounded-lg hover:bg-white/[0.04] transition-colors focus-visible:ring-2 focus-visible:ring-[#00bcd4]/40 focus-visible:outline-none"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => {
            if (text.trim()) onSave(text.trim());
          }}
          className="px-3 py-1.5 text-xs text-white bg-[#00bcd4] rounded-lg hover:bg-[#00bcd4]/80 transition-colors focus-visible:ring-2 focus-visible:ring-[#00bcd4]/40 focus-visible:outline-none"
        >
          Save &amp; Resend
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Search highlight helper
// ---------------------------------------------------------------------------

function formatRelativeTime(date?: Date | string | number): string {
  if (!date) return '';
  const now = Date.now();
  const then = new Date(date).getTime();
  if (Number.isNaN(then)) return '';
  const diff = now - then;

  if (diff < 60_000) return 'just now';
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  if (diff < 604_800_000) return `${Math.floor(diff / 86_400_000)}d ago`;
  return new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function highlightText(text: string, query: string): React.ReactNode {
  if (!query) return text;
  const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <mark key={i} className="bg-[#00bcd4]/30 text-white rounded-sm px-0.5">
        {part}
      </mark>
    ) : (
      part
    ),
  );
}

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

interface RenderableToolPart {
  key: string;
  toolName: string;
  result: unknown;
  isLoading: boolean;
}

function getRenderableToolParts(message: ChatMessage): RenderableToolPart[] {
  const parts = message.parts ?? [];

  return parts.flatMap<RenderableToolPart>((part, index) => {
    const isNamedToolPart = part.type.startsWith('tool-');
    const isDynamicToolPart = part.type === 'dynamic-tool';

    if (!isNamedToolPart && !isDynamicToolPart) {
      return [];
    }

    const toolName = isDynamicToolPart
      ? typeof part.toolName === 'string'
        ? part.toolName
        : 'tool'
      : part.type.replace(/^tool-/, '');

    const state = typeof part.state === 'string' ? part.state : '';

    if (state === 'output-available') {
      return [{
        key: typeof part.toolCallId === 'string' ? part.toolCallId : `${toolName}-${index}`,
        toolName,
        result: part.output,
        isLoading: false,
      }];
    }

    if (state === 'output-error') {
      return [{
        key: typeof part.toolCallId === 'string' ? part.toolCallId : `${toolName}-${index}`,
        toolName,
        result: { error: part.errorText || 'Tool execution failed' },
        isLoading: false,
      }];
    }

    if (state === 'input-streaming' || state === 'input-available' || state === 'approval-requested') {
      return [{
        key: typeof part.toolCallId === 'string' ? part.toolCallId : `${toolName}-${index}`,
        toolName,
        result: null,
        isLoading: true,
      }];
    }

    return [];
  });
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
  children,
}: ChatAreaProps) {
  // -------------------------------------------------------------------------
  // Scroll management
  // -------------------------------------------------------------------------

  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [copyToastId, setCopyToastId] = useState<string | null>(null);
  const [showShortcuts, setShowShortcuts] = useState(false);

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
          /* Empty state — greeting, capability chips, suggestions          */
          /* ============================================================= */
          <div className="flex flex-col items-center justify-center h-full px-4 animate-empty-fade-in">
            <div className="max-w-[540px] w-full text-center">
              {/* Arcanea logo */}
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#00bcd4]/20 to-[#0d47a1]/20 border border-[#00bcd4]/10 flex items-center justify-center mb-5 mx-auto shadow-[0_0_24px_rgba(0,188,212,0.15)]">
                <span className="text-2xl">{'\u2726'}</span>
              </div>

              {/* Time-aware greeting */}
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight bg-gradient-to-b from-white via-white/90 to-white/50 bg-clip-text text-transparent">
                {activeLuminor ? activeLuminor.name : getTimeGreeting()}
              </h1>
              <p className="text-sm text-white/40 mb-6 max-w-sm mx-auto leading-relaxed">
                {activeLuminor ? activeLuminor.title || activeLuminor.tagline : getSubtitle()}
              </p>

              {/* Capability domain chips */}
              {!activeLuminor && (
                <div className="flex flex-wrap justify-center gap-2 mb-6">
                  {CAPABILITY_DOMAINS.map((d) => (
                    <button
                      key={d.label}
                      type="button"
                      onClick={() => {
                        onSetInput(d.hint);
                        onFocusInput();
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] text-white/35 bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] hover:border-[#00bcd4]/20 hover:text-white/55 hover:bg-white/[0.05] transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#00bcd4]/40 focus-visible:outline-none"
                    >
                      <span className="text-sm" aria-hidden="true">
                        {d.icon}
                      </span>
                      {d.label}
                    </button>
                  ))}
                  <Link
                    href="/gallery"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] text-white/35 bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] hover:border-[#00bcd4]/20 hover:text-white/55 hover:bg-white/[0.05] transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#00bcd4]/40 focus-visible:outline-none"
                  >
                    <span className="text-sm" aria-hidden="true">{'\u2726'}</span>
                    Browse Gallery
                  </Link>
                </div>
              )}

              {/* Onboarding banner — first-run when no API key is configured */}
              {!clientApiKey && !serverHasKeys && (
                <div className="max-w-md mx-auto mb-6 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 backdrop-blur-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#00bcd4]/20 flex items-center justify-center shrink-0 mt-0.5">
                      <PhSparkle className="w-4 h-4 text-[#00bcd4]" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-white/80 mb-1">
                        Set up your AI provider
                      </h3>
                      <p className="text-xs text-white/40 mb-3 leading-relaxed">
                        Add an API key to start chatting. Google Gemini offers a free tier — perfect
                        for getting started.
                      </p>
                      <Link
                        href="/settings/providers"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#00bcd4] text-white hover:bg-[#00bcd4]/80 transition-colors"
                      >
                        <PhGear className="w-3.5 h-3.5" />
                        Configure Providers
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* Suggested prompts grid */}
              <div
                className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-lg mx-auto"
                role="list"
                aria-label="Suggested prompts"
              >
                {/* Continue last session chip */}
                {lastSessionTitle && onContinueLastSession && (
                  <button
                    onClick={onContinueLastSession}
                    className="sm:col-span-2 flex items-center gap-3 px-4 py-3 rounded-xl text-left text-[13px] border border-[#00bcd4]/15 bg-[#00bcd4]/[0.03] text-[#00bcd4]/70 hover:border-[#00bcd4]/30 hover:text-[#00bcd4] hover:bg-[#00bcd4]/[0.06] transition-all duration-200"
                  >
                    <PhArrowClockwise className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">Continue: {lastSessionTitle}</span>
                  </button>
                )}
                {getTimeSuggestions().map((s, i) => (
                  <button
                    key={s}
                    onClick={() => { onSetInput(s); onFocusInput(); }}
                    className="flex items-start gap-3 px-4 py-3 rounded-xl text-left text-[13px] text-white/50 bg-white/[0.02] border border-white/[0.05] backdrop-blur-sm hover:border-[#00bcd4]/15 hover:text-white/75 hover:bg-white/[0.04] hover:shadow-[0_0_20px_rgba(0,188,212,0.06)] transition-all duration-200 group animate-empty-fade-in"
                    style={{ animationDelay: `${i * 80}ms` }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* ============================================================= */
          /* Messages list                                                  */
          /* ============================================================= */
          <div className="max-w-[720px] mx-auto w-full px-4 py-6" aria-live="polite">
            {messages.map((msg) => (
              <div
                key={msg.id}
                role="article"
                aria-label={msg.role === 'user' ? 'Your message' : `Message from ${activeLuminor?.name || 'Arcanea'}`}
                className={`mb-6 animate-msg-slide-in ${msg.role === 'user' ? 'flex justify-end' : ''}`}
              >
                {msg.role === 'user' ? (
                  /* ------- User message ------- */
                  <div className="max-w-[90%] sm:max-w-[85%] group/user">
                    {editingMessageId === msg.id ? (
                      <EditMessageForm
                        initialText={getMessageText(msg)}
                        onSave={(text) => {
                          onEditMessage(msg.id, text);
                          onSetEditingMessageId(null);
                        }}
                        onCancel={() => onSetEditingMessageId(null)}
                      />
                    ) : (
                      <div className="relative">
                        <div className="inline-block px-4 py-3 rounded-2xl rounded-br-md bg-gradient-to-br from-[#1a1a1f] to-[#141418] text-white/90 text-[15px] leading-relaxed whitespace-pre-wrap shadow-sm">
                          {searchQuery &&
                          getMessageText(msg).toLowerCase().includes(searchQuery.toLowerCase())
                            ? highlightText(getMessageText(msg), searchQuery)
                            : getMessageText(msg)}
                        </div>
                        <button
                          type="button"
                          onClick={() => onSetEditingMessageId(msg.id)}
                          className="absolute -left-8 top-1/2 -translate-y-1/2 w-6 h-6 rounded-md flex items-center justify-center text-white/0 group-hover/user:text-white/30 hover:!text-white/60 hover:bg-white/[0.04] transition-all focus-visible:ring-2 focus-visible:ring-[#00bcd4]/40 focus-visible:outline-none"
                          aria-label="Edit message"
                        >
                          <PhPencilSimple className="w-3.5 h-3.5" />
                        </button>
                        {/* Timestamp — visible on hover */}
                        <span className="block text-right text-[10px] text-white/20 opacity-0 group-hover/user:opacity-100 transition-opacity select-none mt-1">
                          {formatRelativeTime(msg.createdAt)}
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  /* ------- Assistant message ------- */
                  (() => {
                    const rawText = getMessageText(msg);
                    const toolParts = getRenderableToolParts(msg);
                    const isComplete = !isLoading || msg.id !== lastMsg?.id;
                    const { clean, followUps } = isComplete
                      ? parseFollowUps(rawText)
                      : { clean: rawText, followUps: [] };

                    return (
                      <div className="group flex gap-3">
                        {/* Avatar */}
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5"
                          style={{
                            background: activeLuminor
                              ? `linear-gradient(135deg, ${activeLuminor.color || ACCENT}, ${activeLuminor.color || ACCENT}80)`
                              : `linear-gradient(135deg, ${ACCENT}, #0d47a1)`,
                          }}
                        >
                          {activeLuminor?.avatar || 'A'}
                        </div>

                        <div className="min-w-0 flex-1">
                          {/* Name line */}
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className="text-xs font-medium"
                              style={{ color: activeLuminor?.color || ACCENT }}
                            >
                              {activeLuminor?.name || 'Arcanea'}
                            </span>
                            {activeLuminor?.title && (
                              <span className="text-[10px] text-white/25">
                                {activeLuminor.title}
                              </span>
                            )}
                            <span className="text-[10px] text-white/20 font-mono">
                              {providerLabel}
                            </span>
                          </div>

                          {/* Tool results */}
                          {toolParts.length > 0 && (
                            <div className="space-y-2 mb-3">
                              {toolParts.map((toolPart) => (
                                <ToolResultBlock
                                  key={toolPart.key}
                                  toolName={toolPart.toolName}
                                  result={toolPart.result}
                                  isLoading={toolPart.isLoading}
                                />
                              ))}
                            </div>
                          )}

                          {/* Message content */}
                          <div className="prose prose-invert prose-sm max-w-none text-[15px] leading-[1.75] text-white/85 prose-headings:text-white/90 prose-headings:font-semibold prose-code:text-[#00bcd4]/80 prose-a:text-[#00bcd4] prose-strong:text-white/90 overflow-hidden">
                            <ChatMarkdown
                              content={searchQuery && rawText.toLowerCase().includes(searchQuery.toLowerCase()) ? clean : clean}
                              isStreaming={isStreaming && msg.id === lastMsg?.id}
                            />
                            {isStreaming && msg.id === lastMsg?.id && (
                              <span
                                className="inline-block w-2 h-2 rounded-full bg-[#00bcd4] animate-pulse ml-1 align-middle shadow-[0_0_8px_rgba(0,188,212,0.6)]"
                                aria-hidden="true"
                              />
                            )}
                          </div>

                          {/* Streaming progress indicator */}
                          {isStreaming && msg.id === lastMsg?.id && clean && (
                            <div className="flex items-center gap-2 mt-2">
                              <div className="h-0.5 flex-1 bg-white/[0.04] rounded-full overflow-hidden">
                                <div className="h-full bg-[#00bcd4]/30 rounded-full animate-pulse" style={{ width: '60%' }} />
                              </div>
                              <span className="text-[10px] text-white/20 select-none">generating...</span>
                            </div>
                          )}

                          {/* Creation detected — inline card with save action */}
                          {!isLoading &&
                            msg.id === lastMsg?.id &&
                            autoSave.lastDetection && (
                              <div className="flex items-center justify-between gap-3 mt-3 px-3 py-2.5 rounded-lg bg-[#00bcd4]/5 border border-[#00bcd4]/15 text-sm animate-in fade-in slide-in-from-bottom-1 duration-300">
                                <div className="flex items-center gap-2 min-w-0">
                                  <span
                                    className="w-2 h-2 rounded-full bg-[#00bcd4] shrink-0 shadow-[0_0_6px_rgba(0,188,212,0.4)]"
                                    aria-hidden="true"
                                  />
                                  <span className="text-[#00bcd4]/80 text-xs truncate">
                                    {autoSave.notification ||
                                      `${autoSave.lastDetection.type} detected`}
                                  </span>
                                </div>
                                <SaveCreationButton content={clean} />
                              </div>
                            )}

                          {/* Follow-up suggestions — model-generated or fallback */}
                          {(() => {
                            if (isLoading) return null;
                            // Use model follow-ups if available, otherwise generate fallback
                            const suggestions = followUps.length > 0
                              ? followUps
                              : generateFallbackSuggestions(
                                  clean,
                                  activeLuminor?.id,
                                  autoSave.lastDetection?.type as ContentType | undefined,
                                );
                            if (suggestions.length === 0) return null;
                            const contentType = detectContentType(clean);
                            const icon = CONTENT_TYPE_ICONS[contentType] || '\u2192';
                            return (
                              <nav aria-label="Suggested follow-ups" className="flex flex-wrap gap-2 mt-3">
                                {suggestions.map((suggestion, i) => (
                                  <button
                                    key={i}
                                    type="button"
                                    onClick={() => onSendMessage({ text: suggestion })}
                                    className="group/fu flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] hover:border-teal-400/20 text-white/60 hover:text-white text-[12px] transition-all duration-200 animate-luminor-fade-in focus-visible:ring-2 focus-visible:ring-[#00bcd4]/40 focus-visible:outline-none"
                                    style={{ animationDelay: `${i * 80}ms` }}
                                  >
                                    <span className="text-teal-400/50 group-hover/fu:text-teal-400 text-[11px] shrink-0">{icon}</span>
                                    <span>{suggestion}</span>
                                  </button>
                                ))}
                              </nav>
                            );
                          })()}

                          {/* Luminor suggestions — when swarm is active */}
                          {!isLoading &&
                            msg.id === lastMsg?.id &&
                            swarmResult &&
                            swarmResult.coordinationMode !== 'convergence' &&
                            swarmResult.activeLuminors.length > 0 &&
                            !activeLuminor && (
                              <div className="flex flex-wrap gap-1.5 mt-2">
                                {swarmResult.activeLuminors.slice(0, 3).map((l, idx) => {
                                  const teamColor = TEAM_COLORS[l.team] || ACCENT;
                                  const displayName =
                                    l.id.charAt(0).toUpperCase() + l.id.slice(1);
                                  return (
                                    <button
                                      key={l.id}
                                      type="button"
                                      onClick={() => {
                                        const cfg = getLuminor(l.id);
                                        if (cfg) onSelectLuminor(cfg as ActiveLuminor);
                                      }}
                                      aria-label={`Ask ${displayName}`}
                                      className="group/lum flex items-center gap-2 pl-1 pr-3 py-1 rounded-full text-[11px] border border-white/[0.06] text-white/35 hover:text-white/65 hover:bg-white/[0.03] transition-all duration-200 animate-luminor-fade-in"
                                      style={{
                                        borderLeftWidth: '2px',
                                        borderLeftColor: `${teamColor}50`,
                                        animationDelay: `${idx * 50}ms`,
                                      }}
                                      onMouseEnter={(e) => {
                                        const el = e.currentTarget as HTMLElement;
                                        el.style.boxShadow = `0 0 12px ${teamColor}15, inset 0 0 12px ${teamColor}08`;
                                        el.style.borderLeftColor = teamColor;
                                      }}
                                      onMouseLeave={(e) => {
                                        const el = e.currentTarget as HTMLElement;
                                        el.style.boxShadow = 'none';
                                        el.style.borderLeftColor = `${teamColor}50`;
                                      }}
                                      title={l.hint}
                                    >
                                      <span
                                        className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0"
                                        style={{
                                          background: `${teamColor}20`,
                                          color: teamColor,
                                        }}
                                      >
                                        {displayName.charAt(0)}
                                      </span>
                                      <span>
                                        <span
                                          className="font-medium"
                                          style={{ color: `${teamColor}cc` }}
                                        >
                                          {displayName}
                                        </span>
                                        <span className="text-white/20 mx-1">{'\u00B7'}</span>
                                        <span className="text-white/30">{l.hint}</span>
                                      </span>
                                    </button>
                                  );
                                })}
                              </div>
                            )}

                          {/* Message actions — visible on hover */}
                          {!isLoading && rawText && (
                            <div className="relative flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">
                              {/* Copy toast */}
                              {copyToastId === msg.id && (
                                <div className="absolute -top-7 left-0 px-2.5 py-1 rounded-full bg-emerald-500/90 text-white text-[10px] font-medium shadow-lg z-10 animate-in fade-in slide-in-from-bottom-2 duration-200 pointer-events-none">
                                  Copied to clipboard
                                </div>
                              )}
                              <button
                                type="button"
                                onClick={() => {
                                  onCopy(msg.id, clean);
                                  setCopyToastId(msg.id);
                                  setTimeout(() => setCopyToastId(null), 2000);
                                }}
                                className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] text-white/30 hover:text-white/60 hover:bg-white/[0.04] transition-colors focus-visible:ring-2 focus-visible:ring-[#00bcd4]/40 focus-visible:outline-none"
                                aria-label="Copy response"
                              >
                                {copiedId === msg.id ? (
                                  <>
                                    <PhCheck className="w-3.5 h-3.5 text-emerald-400" />
                                    <span className="text-emerald-400">Copied</span>
                                  </>
                                ) : (
                                  <>
                                    <PhCopy className="w-3.5 h-3.5" />
                                    <span>Copy</span>
                                  </>
                                )}
                              </button>
                              <button
                                type="button"
                                onClick={() => onRegenerateFrom(msg.id)}
                                className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] text-white/30 hover:text-white/60 hover:bg-white/[0.04] transition-colors focus-visible:ring-2 focus-visible:ring-[#00bcd4]/40 focus-visible:outline-none"
                                aria-label="Regenerate response"
                              >
                                <PhArrowClockwise className="w-3.5 h-3.5" />
                                <span>Regenerate</span>
                              </button>
                              <SaveCreationButton content={clean} />
                              {branches.has(msg.id) && (
                                <div className="flex items-center gap-1 ml-2">
                                  <span className="text-[10px] text-white/25">|</span>
                                  {branches.get(msg.id)!.map((_: unknown, i: number) => (
                                    <button
                                      key={i}
                                      type="button"
                                      onClick={() => onLoadBranch(msg.id, i)}
                                      className="px-1.5 py-0.5 rounded text-[10px] text-white/30 hover:text-white/60 hover:bg-white/[0.04] transition-colors font-mono"
                                      title={`Load branch ${i + 1}`}
                                    >
                                      v{i + 1}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}

                          {/* Timestamp — visible on hover */}
                          {!isLoading && (
                            <span className="text-[10px] text-white/20 opacity-0 group-hover:opacity-100 transition-opacity select-none mt-1 block">
                              {formatRelativeTime(msg.createdAt)}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })()
                )}
              </div>
            ))}

            {/* Thinking indicator */}
            {isThinking && (
              <div className="mb-6" role="status" aria-label="Arcanea is composing a response">
                <div className="flex gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                    style={{
                      background: activeLuminor
                        ? `linear-gradient(135deg, ${activeLuminor.color || ACCENT}, ${activeLuminor.color || ACCENT}80)`
                        : `linear-gradient(135deg, ${ACCENT}, #0d47a1)`,
                    }}
                  >
                    {activeLuminor?.avatar || '\u2726'}
                  </div>
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
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.02] border border-white/[0.04] shadow-[0_0_12px_rgba(0,188,212,0.08)]" aria-live="assertive">
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
            className="w-9 h-9 rounded-full bg-[#1a1a1f] border border-white/[0.1] shadow-lg flex items-center justify-center text-white/50 hover:text-white/80 transition-colors focus-visible:ring-2 focus-visible:ring-[#00bcd4]/40 focus-visible:outline-none"
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
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center"
          onClick={() => setShowShortcuts(false)}
        >
          <div
            className="bg-[#12121a] rounded-2xl border border-white/[0.06] p-6 max-w-sm w-full mx-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-sm font-semibold text-white mb-4">
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
