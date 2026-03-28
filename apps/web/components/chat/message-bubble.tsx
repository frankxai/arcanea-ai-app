'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import ChatMarkdown from './chat-markdown';
import { ToolResultBlock } from './tool-result-block';
import { SaveCreationButton } from './save-creation-button';
import {
  Copy,
  Check,
  PencilSimple,
  ArrowsClockwise,
  ThumbsUp,
  ThumbsDown,
  PhSpeakerHigh,
  PhStop,
} from '@/lib/phosphor-icons';
import { getMessageText, parseFollowUps } from '@/hooks/use-conversation';
import {
  generateFallbackSuggestions,
  type ContentType,
} from '@/lib/chat/suggestion-engine';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SwarmLuminor {
  id: string;
  team: string;
  hint: string;
}

interface AutoSaveState {
  lastDetection: { type: string } | null;
  notification: string | null;
}

export interface MessageBubbleProps {
  message: {
    id: string;
    role: 'user' | 'assistant' | 'system';
    parts?: Array<Record<string, unknown> & { type: string; text?: string }>;
    content?: string;
    createdAt?: Date | string | number;
  };
  isStreaming?: boolean;
  isLast?: boolean;
  /** Whether the AI is still loading (waiting for completion) */
  isLoading?: boolean;
  luminorName?: string;
  luminorAvatar?: string;
  luminorColor?: string;
  /** Luminor title (e.g. "Guardian of Fire") */
  luminorTitle?: string;
  /** Provider label (e.g. "gemini-2.5-flash") */
  providerLabel?: string;
  onRegenerate?: () => void;
  onEdit?: (id: string, newContent: string) => void;
  onCopy?: (text: string) => void;
  searchQuery?: string;
  /** Follow-up suggestion handler — fills input instead of auto-sending */
  onSendMessage?: (opts: { text: string }) => void;
  /** Set the input field value (for follow-up chips) */
  onSetInput?: (value: string) => void;
  /** Focus the input textarea */
  onFocusInput?: () => void;
  /** Auto-save state for creation detection */
  autoSave?: AutoSaveState;
  /** Swarm luminor suggestions */
  swarmLuminors?: SwarmLuminor[];
  /** Handler for selecting a luminor */
  onSelectLuminor?: (id: string) => void;
  /** Branch navigation */
  branches?: unknown[];
  onLoadBranch?: (branchIndex: number) => void;
  /** Luminor ID for fallback suggestion generation */
  luminorId?: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const ACCENT = '#00bcd4';

const TEAM_COLORS: Record<string, string> = {
  development: '#00bcd4',
  creative: '#e040fb',
  writing: '#ffab40',
  research: '#69f0ae',
};

// ---------------------------------------------------------------------------
// Helpers
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

function highlightSearch(text: string, query: string): React.ReactNode {
  if (!query) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const parts = text.split(new RegExp(`(${escaped})`, 'gi'));
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <mark key={i} className="bg-amber-400/30 text-white rounded-sm px-0.5">
        {part}
      </mark>
    ) : (
      part
    ),
  );
}

// ---------------------------------------------------------------------------
// EditForm — inline textarea for editing user messages
// ---------------------------------------------------------------------------

function EditForm({
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (text.trim()) onSave(text.trim());
    }
    if (e.key === 'Escape') onCancel();
  };

  return (
    <div className="w-full">
      <textarea
        ref={ref}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        aria-label="Edit message text"
        className="w-full px-4 py-3 rounded-2xl bg-[#1a1a1f] border border-[#00bcd4]/30 text-white/90 text-[15px] leading-relaxed resize-none focus:outline-none focus:border-[#00bcd4]/50 focus:shadow-[0_0_8px_rgba(0,188,212,0.15)]"
        rows={Math.min(text.split('\n').length + 1, 8)}
      />
      <div className="flex justify-end gap-2 mt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-1.5 text-xs text-white/40 hover:text-white/60 rounded-lg hover:bg-white/[0.04] transition-colors focus-visible:ring-2 focus-visible:ring-[#00bcd4]/30 focus-visible:outline-none"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => {
            if (text.trim()) onSave(text.trim());
          }}
          className="px-3 py-1.5 text-xs text-white bg-[#00bcd4] rounded-lg hover:bg-[#00acc1] transition-colors focus-visible:ring-2 focus-visible:ring-[#00bcd4]/30 focus-visible:outline-none"
        >
          Save &amp; Resend
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// MessageBubble — main component
// ---------------------------------------------------------------------------

export function MessageBubble({
  message,
  isStreaming = false,
  isLast = false,
  isLoading = false,
  luminorName,
  luminorAvatar,
  luminorColor,
  luminorTitle,
  providerLabel,
  onRegenerate,
  onEdit,
  onCopy,
  searchQuery,
  onSendMessage,
  onSetInput,
  onFocusInput,
  autoSave,
  swarmLuminors,
  onSelectLuminor,
  branches,
  onLoadBranch,
  luminorId,
}: MessageBubbleProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showCopyToast, setShowCopyToast] = useState(false);
  const [liked, setLiked] = useState<'up' | 'down' | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Persist reaction to backend (fire-and-forget)
  const handleReaction = useCallback(
    (type: 'up' | 'down') => {
      const newReaction = liked === type ? null : type;
      setLiked(newReaction);

      if (newReaction) {
        fetch('/api/feedback/reactions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messageId: message.id, reaction: newReaction }),
        }).catch(() => {});
      } else {
        fetch(`/api/feedback/reactions?messageId=${encodeURIComponent(message.id)}`, {
          method: 'DELETE',
        }).catch(() => {});
      }
    },
    [liked, message.id],
  );
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Clean up audio on unmount to prevent setState on unmounted component
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.onended = null;
        audioRef.current.onerror = null;
        audioRef.current = null;
      }
    };
  }, []);

  const text = getMessageText(message);

  // Tool result parts
  const toolParts = (message.parts ?? []).flatMap((part, index) => {
    const isNamedToolPart = part.type.startsWith('tool-');
    const isDynamicToolPart = part.type === 'dynamic-tool';

    if (!isNamedToolPart && !isDynamicToolPart) {
      return [];
    }

    const toolName = isDynamicToolPart
      ? (typeof part.toolName === 'string' ? part.toolName : 'tool')
      : part.type.replace(/^tool-/, '');

    const state = typeof part.state === 'string' ? part.state : '';
    const toolCallId = typeof part.toolCallId === 'string' ? part.toolCallId : `${toolName}-${index}`;

    if (state === 'output-available') {
      return [{
        key: toolCallId,
        toolName,
        result: part.output,
      }];
    }

    if (state === 'output-error') {
      return [{
        key: toolCallId,
        toolName,
        result: { error: (typeof part.errorText === 'string' ? part.errorText : '') || 'Tool execution failed' },
      }];
    }

    return [];
  });

  // Copy handler
  const handleCopy = useCallback(async () => {
    const content = getMessageText(message);
    if (!content) return;
    try {
      await navigator.clipboard.writeText(content);
    } catch {
      // fallback — onCopy may handle differently
    }
    setCopied(true);
    setShowCopyToast(true);
    setTimeout(() => setCopied(false), 2000);
    setTimeout(() => setShowCopyToast(false), 2000);
    onCopy?.(content);
  }, [message, onCopy]);

  // TTS handler
  const handleSpeak = useCallback(async () => {
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setIsPlaying(false);
      return;
    }

    if (!text || text.length < 10) return;

    setIsPlaying(true);
    try {
      const res = await fetch('/api/ai/speak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text.slice(0, 4000), voice: 'nova' }),
      });

      if (!res.ok) throw new Error('TTS failed');

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioRef.current = audio;

      audio.onended = () => {
        setIsPlaying(false);
        audioRef.current = null;
        URL.revokeObjectURL(url);
      };
      audio.onerror = () => {
        setIsPlaying(false);
        audioRef.current = null;
        URL.revokeObjectURL(url);
      };

      await audio.play();
    } catch {
      setIsPlaying(false);
    }
  }, [isPlaying, text]);

  // Save edit handler
  const handleSaveEdit = useCallback(
    (newContent: string) => {
      setIsEditing(false);
      onEdit?.(message.id, newContent);
    },
    [message.id, onEdit],
  );

  const accentColor = luminorColor || ACCENT;
  const isComplete = !isLoading;
  const { clean, followUps } = isComplete
    ? parseFollowUps(text)
    : { clean: text, followUps: [] as string[] };

  // -------------------------------------------------------------------------
  // User message
  // -------------------------------------------------------------------------

  if (message.role === 'user') {
    return (
      <div className="mb-6 flex justify-end">
        <div className="ml-auto max-w-[90%] sm:max-w-[85%] group/user">
          {isEditing ? (
            <EditForm
              initialText={text}
              onSave={handleSaveEdit}
              onCancel={() => setIsEditing(false)}
            />
          ) : (
            <div className="relative">
              <div className="inline-block px-4 py-3 rounded-2xl rounded-br-md bg-gradient-to-br from-[#1a1a1f] to-[#141418] text-white/90 text-[15px] leading-relaxed whitespace-pre-wrap shadow-sm">
                {searchQuery && text.toLowerCase().includes(searchQuery.toLowerCase())
                  ? highlightSearch(text, searchQuery)
                  : text}
              </div>
              {onEdit && (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="absolute -left-8 top-1/2 -translate-y-1/2 w-6 h-6 rounded-md flex items-center justify-center text-white/0 group-hover/user:text-white/30 hover:!text-white/60 hover:bg-white/[0.04] transition-all focus-visible:ring-2 focus-visible:ring-[#00bcd4]/40 focus-visible:outline-none"
                  aria-label="Edit message"
                >
                  <PencilSimple className="w-3.5 h-3.5" />
                </button>
              )}
              {/* Timestamp — visible on hover */}
              <span className="block text-right text-[10px] text-white/20 opacity-0 group-hover/user:opacity-100 transition-opacity select-none mt-1">
                {formatRelativeTime(message.createdAt)}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // Assistant message
  // -------------------------------------------------------------------------

  return (
    <div className="mb-6 group">
      <div className="mr-auto max-w-[85%] flex gap-3">
        {/* Avatar */}
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5"
          style={{
            background: `linear-gradient(135deg, ${accentColor}, ${accentColor}80)`,
          }}
        >
          {luminorAvatar || 'A'}
        </div>

        <div className="min-w-0 flex-1">
          {/* Header row */}
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-xs font-medium"
              style={{ color: accentColor }}
            >
              {luminorName || 'Arcanea'}
            </span>
            {luminorTitle && (
              <span className="text-[10px] text-white/25">
                {luminorTitle}
              </span>
            )}
            {providerLabel && (
              <span className="text-[10px] text-white/20 font-mono">
                {providerLabel}
              </span>
            )}
          </div>

          {/* Tool results */}
          {toolParts.length > 0 && (
            <div className="space-y-2 mb-3">
              {toolParts.map((part, i) => (
                <ToolResultBlock
                  key={String(part.key ?? i)}
                  toolName={part.toolName}
                  result={part.result}
                  isLoading={false}
                />
              ))}
            </div>
          )}

          {/* Message content */}
          {clean && (
            <div className="prose prose-invert prose-sm max-w-none text-[15px] leading-[1.75] text-white/85 prose-headings:text-white/90 prose-headings:font-semibold prose-code:text-[#00bcd4]/80 prose-a:text-[#00bcd4] prose-strong:text-white/90 overflow-hidden">
              <ChatMarkdown content={clean} isStreaming={isStreaming && isLast} />
              {isStreaming && isLast && (
                <span
                  className="inline-block w-2 h-2 rounded-full bg-[#00bcd4] animate-pulse ml-1 align-middle shadow-[0_0_8px_rgba(0,188,212,0.6)]"
                  aria-hidden="true"
                />
              )}
            </div>
          )}

          {/* Streaming indicator — no text yet */}
          {isStreaming && isLast && !clean && (
            <div className="flex items-center gap-1.5 py-2" role="status" aria-label="Generating response">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00bcd4] animate-pulse shadow-[0_0_6px_rgba(0,188,212,0.4)]" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-[#00bcd4] animate-pulse shadow-[0_0_6px_rgba(0,188,212,0.4)]" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-[#00bcd4] animate-pulse shadow-[0_0_6px_rgba(0,188,212,0.4)]" style={{ animationDelay: '300ms' }} />
            </div>
          )}

          {/* Indeterminate streaming progress */}
          {isStreaming && isLast && clean && (
            <div className="flex items-center gap-2 mt-2">
              <div className="h-0.5 flex-1 bg-white/[0.04] rounded-full overflow-hidden">
                <div
                  className="h-full w-1/3 bg-[#00bcd4]/20 rounded-full"
                  style={{
                    animation: 'slide 1.5s ease-in-out infinite',
                  }}
                />
              </div>
              <span className="text-[10px] text-white/20 select-none">generating...</span>
            </div>
          )}

          {/* Creation detected — inline card with save action */}
          {isComplete &&
            isLast &&
            autoSave?.lastDetection && (
              <div className="flex items-center justify-between gap-3 mt-3 px-3 py-2.5 rounded-lg bg-[#00bcd4]/5 border border-[#00bcd4]/15 text-sm animate-in fade-in slide-in-from-bottom-1 duration-300">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-2 h-2 rounded-full bg-[#00bcd4] shrink-0 shadow-[0_0_6px_rgba(0,188,212,0.4)]"
                    aria-hidden="true"
                  />
                  <span className="text-[#00bcd4]/80 text-xs truncate">
                    {autoSave.notification || `${autoSave.lastDetection.type} detected`}
                  </span>
                </div>
                <SaveCreationButton content={clean} />
              </div>
            )}

          {/* Follow-up suggestions — fill input on click, never auto-send */}
          {isComplete && (onSetInput || onSendMessage) && (() => {
            const allSuggestions = followUps.length > 0
              ? followUps
              : generateFallbackSuggestions(
                  clean,
                  luminorId,
                  autoSave?.lastDetection?.type as ContentType | undefined,
                );
            // Cap at 3 chips max
            const suggestions = allSuggestions.slice(0, 3);
            if (suggestions.length === 0) return null;
            return (
              <nav aria-label="Suggested follow-ups" className="flex flex-wrap gap-2 mt-3">
                {suggestions.map((suggestion, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      if (onSetInput) {
                        onSetInput(suggestion);
                        onFocusInput?.();
                      } else {
                        onSendMessage?.({ text: suggestion });
                      }
                    }}
                    className="group/fu flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] hover:border-[#00bcd4]/20 hover:bg-white/[0.05] text-white/50 hover:text-white/80 text-[12px] transition-all duration-200 animate-luminor-fade-in focus-visible:ring-2 focus-visible:ring-[#00bcd4]/40 focus-visible:outline-none"
                    style={{ animationDelay: `${i * 80}ms` }}
                  >
                    <span className="text-[#00bcd4]/50 group-hover/fu:text-[#00bcd4] text-[11px] shrink-0">{'\u2192'}</span>
                    <span>{suggestion}</span>
                  </button>
                ))}
              </nav>
            );
          })()}

          {/* Swarm luminor suggestions */}
          {isComplete &&
            isLast &&
            swarmLuminors &&
            swarmLuminors.length > 0 &&
            onSelectLuminor && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {swarmLuminors.slice(0, 3).map((l, idx) => {
                  const teamColor = TEAM_COLORS[l.team] || ACCENT;
                  const displayName = l.id.charAt(0).toUpperCase() + l.id.slice(1);
                  return (
                    <button
                      key={l.id}
                      type="button"
                      onClick={() => onSelectLuminor(l.id)}
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
                        <span className="font-medium" style={{ color: `${teamColor}cc` }}>
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

          {/* Actions bar (hover) */}
          {isComplete && clean && (
            <div className="relative flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">
              {/* Copy toast */}
              {showCopyToast && (
                <div className="absolute -top-7 left-0 px-2.5 py-1 rounded-full bg-emerald-500/90 text-white text-[10px] font-medium shadow-lg z-10 animate-in fade-in slide-in-from-bottom-2 duration-200 pointer-events-none">
                  Copied to clipboard
                </div>
              )}
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1 px-2 py-1 min-h-[36px] min-w-[36px] rounded-md text-[11px] text-white/30 hover:text-[#00bcd4] hover:bg-[#00bcd4]/5 transition-colors focus-visible:ring-2 focus-visible:ring-[#00bcd4]/30 focus-visible:outline-none"
                aria-label="Copy response"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>

              {clean.length >= 10 && (
                <button
                  type="button"
                  onClick={handleSpeak}
                  className="flex items-center gap-1 px-2 py-1 min-h-[36px] min-w-[36px] rounded-md text-[11px] text-white/30 hover:text-[#00bcd4] hover:bg-[#00bcd4]/5 transition-colors focus-visible:ring-2 focus-visible:ring-[#00bcd4]/30 focus-visible:outline-none"
                  aria-label={isPlaying ? 'Stop reading' : 'Read aloud'}
                >
                  {isPlaying ? (
                    <>
                      <PhStop className="w-3.5 h-3.5" />
                      <span>Stop</span>
                    </>
                  ) : (
                    <>
                      <PhSpeakerHigh className="w-3.5 h-3.5" />
                      <span>Read</span>
                    </>
                  )}
                </button>
              )}

              {onRegenerate && (
                <button
                  type="button"
                  onClick={onRegenerate}
                  className="flex items-center gap-1 px-2 py-1 min-h-[36px] min-w-[36px] rounded-md text-[11px] text-white/30 hover:text-[#00bcd4] hover:bg-[#00bcd4]/5 transition-colors focus-visible:ring-2 focus-visible:ring-[#00bcd4]/30 focus-visible:outline-none"
                  aria-label="Regenerate response"
                >
                  <ArrowsClockwise className="w-3.5 h-3.5" />
                  <span>Regenerate</span>
                </button>
              )}

              <SaveCreationButton content={clean} />

              <button
                type="button"
                onClick={() => handleReaction('up')}
                className={`min-w-[36px] min-h-[36px] rounded-md flex items-center justify-center transition-colors focus-visible:ring-2 focus-visible:ring-[#00bcd4]/30 focus-visible:outline-none ${
                  liked === 'up'
                    ? 'text-emerald-400 bg-emerald-400/10'
                    : 'text-white/30 hover:text-[#00bcd4] hover:bg-[#00bcd4]/5'
                }`}
                aria-label="Good response"
                aria-pressed={liked === 'up'}
              >
                <ThumbsUp className="w-3.5 h-3.5" weight={liked === 'up' ? 'fill' : 'regular'} />
              </button>

              <button
                type="button"
                onClick={() => handleReaction('down')}
                className={`min-w-[36px] min-h-[36px] rounded-md flex items-center justify-center transition-colors focus-visible:ring-2 focus-visible:ring-[#00bcd4]/30 focus-visible:outline-none ${
                  liked === 'down'
                    ? 'text-red-400 bg-red-400/10'
                    : 'text-white/30 hover:text-[#00bcd4] hover:bg-[#00bcd4]/5'
                }`}
                aria-label="Bad response"
                aria-pressed={liked === 'down'}
              >
                <ThumbsDown className="w-3.5 h-3.5" weight={liked === 'down' ? 'fill' : 'regular'} />
              </button>

              {/* Branch navigation */}
              {branches && branches.length > 0 && onLoadBranch && (
                <div className="flex items-center gap-1 ml-2">
                  <span className="text-[10px] text-white/25">|</span>
                  {branches.map((_: unknown, i: number) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => onLoadBranch(i)}
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
          {isComplete && (
            <span className="text-[10px] text-white/20 opacity-0 group-hover:opacity-100 transition-opacity select-none mt-1 block">
              {formatRelativeTime(message.createdAt)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default MessageBubble;
