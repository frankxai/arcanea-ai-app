'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import ChatMarkdown from './chat-markdown';
import { ToolResultBlock } from './tool-result-block';
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

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface MessagePart {
  type: string;
  text?: string;
  toolCallId?: string;
  toolName?: string;
  result?: unknown;
  output?: unknown;
  state?: string;
  errorText?: string;
}

export interface MessageBubbleProps {
  message: {
    id: string;
    role: 'user' | 'assistant';
    parts?: MessagePart[];
    content?: string;
    createdAt?: Date | string | number;
  };
  isStreaming?: boolean;
  isLast?: boolean;
  luminorName?: string;
  luminorAvatar?: string;
  luminorColor?: string;
  onRegenerate?: () => void;
  onEdit?: (id: string, newContent: string) => void;
  onCopy?: (text: string) => void;
  searchQuery?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getMessageText(msg: { parts?: Array<{ type: string; text?: string }>; content?: string }): string {
  if (msg.parts?.length) {
    return msg.parts.filter((p) => p.type === 'text').map((p) => p.text ?? '').join('');
  }
  return msg.content ?? '';
}

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
  luminorName,
  luminorAvatar,
  luminorColor,
  onRegenerate,
  onEdit,
  onCopy,
  searchQuery,
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
  const text = getMessageText(message);

  // Tool result parts
  const toolParts = (message.parts ?? []).flatMap((part, index) => {
    const isNamedToolPart = part.type.startsWith('tool-');
    const isDynamicToolPart = part.type === 'dynamic-tool';

    if (!isNamedToolPart && !isDynamicToolPart) {
      return [];
    }

    const toolName = isDynamicToolPart
      ? part.toolName || 'tool'
      : part.type.replace(/^tool-/, '');

    if (part.state === 'output-available') {
      return [{
        key: part.toolCallId ?? `${toolName}-${index}`,
        toolName,
        result: part.output,
      }];
    }

    if (part.state === 'output-error') {
      return [{
        key: part.toolCallId ?? `${toolName}-${index}`,
        toolName,
        result: { error: part.errorText || 'Tool execution failed' },
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

  const accentColor = luminorColor || '#00bcd4';

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
              <div className="inline-block px-4 py-3 rounded-2xl rounded-br-sm bg-white/[0.04] backdrop-blur-sm border border-white/[0.06] hover:border-white/[0.08] text-white text-[15px] leading-relaxed whitespace-pre-wrap shadow-sm transition-colors">
                {searchQuery && text.toLowerCase().includes(searchQuery.toLowerCase())
                  ? highlightSearch(text, searchQuery)
                  : text}
              </div>
              {onEdit && (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="absolute -top-1 -right-1 min-h-[36px] min-w-[36px] rounded-md flex items-center justify-center text-white/0 group-hover/user:text-white/30 hover:!text-[#00bcd4] hover:bg-[#00bcd4]/5 transition-all focus-visible:ring-2 focus-visible:ring-[#00bcd4]/30 focus-visible:outline-none"
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
          className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0 mt-0.5 shadow-[0_0_8px_rgba(0,188,212,0.15)]"
          style={{
            background: `linear-gradient(135deg, ${accentColor}, ${accentColor}80)`,
          }}
        >
          {luminorAvatar || 'A'}
        </div>

        <div className="min-w-0 flex-1 border-l-2 border-[#00bcd4]/20 pl-3">
          {/* Header row */}
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-xs font-medium"
              style={{ color: accentColor }}
            >
              {luminorName || 'Arcanea'}
            </span>
            <span className="text-[10px] text-white/20">&middot;</span>
            <span className="text-[10px] text-white/20 font-mono">
              {new Date().toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>

          {/* Tool results */}
          {toolParts.length > 0 && (
            <div className="space-y-2 mb-2">
              {toolParts.map((part, i) => (
                <ToolResultBlock
                  key={part.key ?? i}
                  toolName={part.toolName}
                  result={part.result}
                  isLoading={false}
                />
              ))}
            </div>
          )}

          {/* Message content */}
          {text && (
            <div className="prose prose-invert prose-sm max-w-none text-[15px] leading-[1.75] text-white/85 prose-headings:text-white/90 prose-headings:font-semibold prose-code:text-[#00bcd4]/80 prose-a:text-[#00bcd4] prose-strong:text-white/90">
              {searchQuery && text.toLowerCase().includes(searchQuery.toLowerCase()) ? (
                <div>{highlightSearch(text, searchQuery)}</div>
              ) : (
                <ChatMarkdown content={text} isStreaming={isStreaming && isLast} />
              )}
            </div>
          )}

          {/* Streaming indicator */}
          {isStreaming && isLast && !text && (
            <div className="flex items-center gap-1.5 py-2" role="status" aria-label="Generating response">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00bcd4] animate-pulse shadow-[0_0_6px_rgba(0,188,212,0.4)]" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-[#00bcd4] animate-pulse shadow-[0_0_6px_rgba(0,188,212,0.4)]" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-[#00bcd4] animate-pulse shadow-[0_0_6px_rgba(0,188,212,0.4)]" style={{ animationDelay: '300ms' }} />
            </div>
          )}

          {/* Streaming cursor on text */}
          {isStreaming && isLast && text && (
            <span
              className="inline-block w-2 h-2 rounded-full bg-[#00bcd4] animate-pulse ml-1 align-middle shadow-[0_0_8px_rgba(0,188,212,0.6)]"
              aria-hidden="true"
            />
          )}

          {/* Streaming progress indicator */}
          {isStreaming && isLast && text && (
            <div className="flex items-center gap-2 mt-2">
              <div className="h-0.5 flex-1 bg-white/[0.04] rounded-full overflow-hidden">
                <div className="h-full bg-[#00bcd4]/30 rounded-full animate-pulse" style={{ width: '60%' }} />
              </div>
              <span className="text-[10px] text-white/20 select-none">generating...</span>
            </div>
          )}

          {/* Actions bar (hover) */}
          {!isStreaming && text && (
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

              {text.length >= 10 && (
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
            </div>
          )}

          {/* Timestamp — visible on hover */}
          {!isStreaming && (
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
