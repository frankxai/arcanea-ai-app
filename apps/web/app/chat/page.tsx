'use client';

import React, { useRef, useEffect, useCallback, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useChat } from '@ai-sdk/react';
import { TextStreamChatTransport } from 'ai';
import Link from 'next/link';
import ChatMarkdown from '@/components/chat/chat-markdown';
import { useModelSelection } from '@/hooks/use-provider';
import { classifyIntent } from '@/lib/ai/router';
import { ModelSelector, CHAT_MODELS } from '@/components/chat/model-selector';
import { FocusModeSelector, getFocusModeById } from '@/components/chat/focus-modes';
import { BeamMode } from '@/components/chat/beam-mode';
import {
  PhPaperPlane,
  PhPlus,
  PhCircleNotch,
  PhArrowDown,
  PhWarningCircle,
  PhArrowClockwise,
  PhX,
  PhCopy,
  PhCheck,
} from '@/lib/phosphor-icons';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getMessageText(msg: { parts?: Array<{ type: string; text?: string }> }): string {
  if (!msg.parts) return '';
  return msg.parts.filter((p) => p.type === 'text').map((p) => p.text ?? '').join('');
}

/** Extract [FOLLOW_UP] suggestions from response text and return clean text + suggestions */
function parseFollowUps(text: string): { clean: string; followUps: string[] } {
  const lines = text.split('\n');
  const followUps: string[] = [];
  const cleanLines: string[] = [];

  for (const line of lines) {
    const match = line.match(/^\[FOLLOW_UP\]\s*(.+)/);
    if (match) {
      followUps.push(match[1].trim());
    } else {
      cleanLines.push(line);
    }
  }

  // Remove trailing empty lines from clean text
  while (cleanLines.length > 0 && cleanLines[cleanLines.length - 1].trim() === '') {
    cleanLines.pop();
  }

  return { clean: cleanLines.join('\n'), followUps };
}

// ---------------------------------------------------------------------------
// Gate metadata for the frequency indicator
// ---------------------------------------------------------------------------

const GATE_META: Record<string, { label: string; hz: string; color: string }> = {
  lyssandria: { label: 'Foundation', hz: '174', color: '#6b8e23' },
  leyla:      { label: 'Flow',       hz: '285', color: '#4fc3f7' },
  draconia:   { label: 'Fire',       hz: '396', color: '#ff6b35' },
  maylinn:    { label: 'Heart',      hz: '417', color: '#e91e63' },
  alera:      { label: 'Voice',      hz: '528', color: '#ab47bc' },
  lyria:      { label: 'Sight',      hz: '639', color: '#7e57c2' },
  aiyami:     { label: 'Crown',      hz: '741', color: '#ffd700' },
  elara:      { label: 'Starweave',  hz: '852', color: '#26c6da' },
  ino:        { label: 'Unity',      hz: '963', color: '#66bb6a' },
  shinkami:   { label: 'Source',      hz: '1111', color: '#ffffff' },
};

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const ACCENT = '#00bcd4';

const SUGGESTIONS = [
  'Help me build a magic system for my world',
  'Design the architecture for a real-time app',
  'Write a melody that feels like coming home',
  'I feel stuck — help me find direction',
];

// ---------------------------------------------------------------------------
// Chat Page
// ---------------------------------------------------------------------------

export default function ChatPage() {
  const searchParams = useSearchParams();
  const initialPrompt = searchParams.get('prompt');
  const luminorId = searchParams.get('luminor');
  const { provider, clientApiKey, label: providerLabel, modelId, setModelId } = useModelSelection();

  const [input, setInput] = useState('');
  const [activeGates, setActiveGates] = useState<string[]>([]);
  const [focusMode, setFocusMode] = useState('auto');
  const [beamPrompt, setBeamPrompt] = useState<string | null>(null);

  // Active Luminor from Sanctum ("Use in Chat")
  const [activeLuminor, setActiveLuminor] = useState<{
    id: string; name: string; title: string; tagline?: string;
    systemPrompt: string; preferredModel?: string; color?: string; avatar?: string;
  } | null>(null);

  // Fetch Luminor spec when ?luminor=ID is present
  useEffect(() => {
    if (!luminorId) return;
    fetch(`/api/luminors/${luminorId}`)
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data) {
          setActiveLuminor({
            id: data.id,
            name: data.name,
            title: data.title,
            tagline: data.tagline,
            systemPrompt: data.system_prompt,
            preferredModel: data.preferred_model,
            color: data.color,
            avatar: data.avatar,
          });
          // Apply the Luminor's preferred model
          if (data.preferred_model && data.preferred_model !== 'arcanea-auto') {
            setModelId(data.preferred_model);
          }
        }
      })
      .catch(() => { /* Luminor not found — use default chat */ });
  }, [luminorId, setModelId]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  }, []);

  const [chatError, setChatError] = useState<string | null>(null);

  // Get focus mode prompt hint for the API
  const focusHint = getFocusModeById(focusMode).promptHint;

  // Memoize transport — includes Luminor system prompt when active
  const transport = useMemo(
    () => new TextStreamChatTransport({
      api: '/api/ai/chat',
      body: {
        provider, clientApiKey, gatewayModel: modelId, focusHint,
        ...(activeLuminor ? { systemPrompt: activeLuminor.systemPrompt } : {}),
      },
      headers: { 'Content-Type': 'application/json' },
    }),
    [provider, clientApiKey, modelId, focusHint, activeLuminor]
  );

  const {
    messages,
    status,
    error,
    sendMessage,
    setMessages,
  } = useChat({
    transport,
    onError: (err) => {
      setChatError(err.message || 'Something went wrong. Check Settings → Providers.');
    },
  });

  // Sync SDK error state into our local error state
  useEffect(() => {
    if (error) {
      setChatError(error.message || 'Connection failed');
    }
  }, [error]);

  const isLoading = status === 'submitted' || status === 'streaming';

  // Run client-side router for frequency indicator (mirrors server-side routing)
  useEffect(() => {
    const lastUser = [...messages].reverse().find((m) => m.role === 'user');
    if (lastUser) {
      const text = getMessageText(lastUser);
      if (text) {
        const result = classifyIntent(text);
        setActiveGates(result.activeGates);
      }
    }
  }, [messages]);

  // Parse @ commands: @opus, @gemini, @grok etc. switch model for that message
  const parseAtCommand = useCallback((text: string): { cleanText: string; overrideModel: string | null } => {
    const match = text.match(/^@(\w+)\s+/);
    if (!match) return { cleanText: text, overrideModel: null };

    const alias = match[1].toLowerCase();
    // Match against model shortNames (case-insensitive)
    const model = CHAT_MODELS.find((m) =>
      m.shortName.toLowerCase() === alias ||
      m.id === `arcanea-${alias}` ||
      m.provider === alias
    );

    if (model) {
      return { cleanText: text.slice(match[0].length), overrideModel: model.id };
    }
    return { cleanText: text, overrideModel: null };
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      const trimmed = input.trim();

      // /beam command — launch beam mode
      if (trimmed.startsWith('/beam ')) {
        setBeamPrompt(trimmed.slice(6));
        setInput('');
        return;
      }

      const { cleanText, overrideModel } = parseAtCommand(trimmed);

      // If @ command detected, temporarily switch model for this message
      if (overrideModel) {
        setModelId(overrideModel);
      }

      sendMessage({ text: cleanText });
      setInput('');
    }
  }, [input, isLoading, sendMessage, parseAtCommand, setModelId]);

  // Retry last message on error
  const handleRetry = useCallback(() => {
    if (messages.length === 0) return;
    // Find the last user message
    const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user');
    if (!lastUserMsg) return;
    const text = getMessageText(lastUserMsg);
    if (!text) return;
    // Remove the failed assistant message if present
    const lastMsg = messages[messages.length - 1];
    if (lastMsg?.role === 'assistant') {
      setMessages(messages.slice(0, -1));
    }
    sendMessage({ text });
  }, [messages, setMessages, sendMessage]);

  // Regenerate: re-send last user message for a fresh response
  const handleRegenerate = useCallback(() => {
    if (messages.length < 2) return;
    const lastUserIdx = [...messages].reverse().findIndex((m) => m.role === 'user');
    if (lastUserIdx < 0) return;
    const actualIdx = messages.length - 1 - lastUserIdx;
    const userText = getMessageText(messages[actualIdx]);
    if (!userText) return;
    // Remove assistant messages after the last user message
    setMessages(messages.slice(0, actualIdx + 1));
    sendMessage({ text: userText });
  }, [messages, setMessages, sendMessage]);

  // Copy message text to clipboard
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const handleCopy = useCallback(async (msgId: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(msgId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Fallback for older browsers
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopiedId(msgId);
      setTimeout(() => setCopiedId(null), 2000);
    }
  }, []);

  // UI state
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [autoScroll, setAutoScroll] = useState(true);
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-send initial prompt
  const [initialSent, setInitialSent] = useState(false);
  useEffect(() => {
    if (initialPrompt && !initialSent && messages.length === 0) {
      sendMessage({ text: initialPrompt });
      setInitialSent(true);
    }
  }, [initialPrompt, initialSent, messages.length, sendMessage]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

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

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    setAutoScroll(true);
  };

  const startNewChat = () => {
    setMessages([]);
    setInput('');
    setActiveGates([]);
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !isLoading) {
        e.currentTarget.form?.requestSubmit();
      }
    }
  };

  // Detect streaming state
  const lastMsg = messages[messages.length - 1];
  const isStreaming = isLoading && lastMsg?.role === 'assistant';
  const isThinking = isLoading && (!lastMsg || lastMsg.role === 'user');
  const isEmpty = messages.length === 0 && !isLoading;

  return (
    <div className="flex h-screen bg-[#09090b]">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-0'
        } transition-all duration-200 overflow-hidden border-r border-white/[0.06] bg-[#09090b] flex-shrink-0 hidden md:flex flex-col`}
      >
        <div className="p-3 border-b border-white/[0.06]">
          <button
            onClick={startNewChat}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium
              border border-white/[0.08] text-white/70
              hover:border-white/[0.15] hover:text-white hover:bg-white/[0.04] transition-all duration-150"
          >
            <PhPlus className="w-4 h-4" />
            New chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2" style={{ scrollbarWidth: 'thin' }}>
          <p className="px-3 py-6 text-xs text-white/30 text-center leading-relaxed">
            Chat history coming soon
          </p>
        </div>
      </aside>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden md:flex w-8 h-8 items-center justify-center rounded-lg text-white/40 hover:text-white/70 hover:bg-white/[0.04] transition-colors"
              aria-label="Toggle sidebar"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
            <Link
              href="/"
              className="text-sm font-medium text-white/90 hover:text-[#00bcd4] transition-colors"
            >
              Arcanea
            </Link>
            {/* Model selector + Gate frequency indicator */}
            <ModelSelector value={modelId} onChange={setModelId} />
            {activeGates.length > 0 && messages.length > 0 && (
              <div className="flex items-center gap-1.5">
                {activeGates.slice(0, 3).map((gate) => {
                  const meta = GATE_META[gate];
                  if (!meta) return null;
                  return (
                    <span
                      key={gate}
                      className="text-[10px] font-mono px-1.5 py-0.5 rounded-md border border-white/[0.06] transition-colors"
                      style={{ color: meta.color, borderColor: `${meta.color}20` }}
                      title={`${meta.label} Gate — ${meta.hz} Hz`}
                    >
                      {meta.hz}
                    </span>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {messages.length > 0 && (
              <button
                onClick={startNewChat}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-white/40 hover:text-white/70 hover:bg-white/[0.04] transition-colors"
              >
                <PhPlus className="w-3.5 h-3.5" />
                New
              </button>
            )}
          </div>
        </div>

        {/* Error banner with retry */}
        {chatError && (
          <div role="alert" className="bg-red-500/8 border-b border-red-500/20 px-4 py-2.5">
            <div className="max-w-[680px] mx-auto flex items-center justify-between">
              <div className="flex items-center gap-2 text-red-400/80 text-sm min-w-0">
                <PhWarningCircle className="w-4 h-4 shrink-0" />
                <span className="truncate">{chatError}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href="/settings/providers"
                  className="px-2.5 py-1 rounded-md text-xs text-red-400/70 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                >
                  Settings
                </Link>
                <button
                  onClick={handleRetry}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs text-red-400/70 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                >
                  <PhArrowClockwise className="w-3.5 h-3.5" />
                  Retry
                </button>
                <button onClick={() => { startNewChat(); setChatError(null); }} aria-label="Dismiss error" className="text-red-400/60 hover:text-red-400">
                  <PhX className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Messages area */}
        <div
          ref={containerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto"
          style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.08) transparent' }}
        >
          {isEmpty ? (
            <div className="flex flex-col items-center justify-center h-full px-4">
              <div className="max-w-[540px] w-full text-center">
                <h1 className="text-3xl font-semibold text-white/90 mb-2 tracking-tight">
                  {activeLuminor ? activeLuminor.name : 'What will you create?'}
                </h1>
                <p className="text-sm text-white/35 mb-6">
                  {activeLuminor ? activeLuminor.title || activeLuminor.tagline : 'Write, code, design, research. Or just think out loud.'}
                </p>

                {/* Focus mode selector — Perplexity-style */}
                <div className="flex justify-center mb-6">
                  <FocusModeSelector value={focusMode} onChange={setFocusMode} />
                </div>

                <div className="flex flex-wrap justify-center gap-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => sendMessage({ text: s })}
                      className="px-4 py-2 rounded-full text-sm text-white/50 border border-white/[0.08] hover:border-white/[0.16] hover:text-white/70 hover:bg-white/[0.03] transition-all duration-150"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-[680px] mx-auto px-4 py-6" aria-live="polite">
              {messages.map((msg) => (
                <div key={msg.id} className={`mb-6 ${msg.role === 'user' ? 'flex justify-end' : ''}`}>
                  {msg.role === 'user' ? (
                    <div className="max-w-[85%]">
                      <div className="inline-block px-4 py-3 rounded-2xl rounded-br-md bg-[#1a1a1f] text-white/90 text-[15px] leading-relaxed whitespace-pre-wrap">
                        {getMessageText(msg)}
                      </div>
                    </div>
                  ) : (() => {
                    const rawText = getMessageText(msg);
                    const isComplete = !isLoading || msg.id !== lastMsg?.id;
                    const { clean, followUps } = isComplete ? parseFollowUps(rawText) : { clean: rawText, followUps: [] };

                    return (
                    <div className="group flex gap-3">
                      {/* Avatar — Luminor or Arcanea */}
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5"
                        style={{
                          background: activeLuminor
                            ? `linear-gradient(135deg, ${activeLuminor.color || '#00bcd4'}, ${activeLuminor.color || '#00bcd4'}80)`
                            : 'linear-gradient(135deg, #00bcd4, #0d47a1)',
                        }}
                      >
                        {activeLuminor?.avatar || 'A'}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium" style={{ color: activeLuminor?.color || '#00bcd4' }}>
                            {activeLuminor?.name || 'Arcanea'}
                          </span>
                          {activeLuminor?.title && (
                            <span className="text-[10px] text-white/25">{activeLuminor.title}</span>
                          )}
                          <span className="text-[10px] text-white/20 font-mono">{providerLabel}</span>
                        </div>
                        <div className="prose prose-invert prose-sm max-w-none text-[15px] leading-[1.7] text-white/85">
                          <ChatMarkdown content={clean} />
                          {isStreaming && msg.id === lastMsg?.id && (
                            <span className="inline-block w-[2px] h-[18px] bg-[#00bcd4] animate-pulse ml-0.5 align-text-bottom" />
                          )}
                        </div>

                        {/* Follow-up suggestions (Perplexity pattern) */}
                        {followUps.length > 0 && !isLoading && (
                          <div className="flex flex-wrap gap-1.5 mt-3">
                            {followUps.map((fu, i) => (
                              <button
                                key={i}
                                type="button"
                                onClick={() => sendMessage({ text: fu })}
                                className="px-3 py-1.5 rounded-full text-[12px] text-white/45 border border-white/[0.06]
                                  hover:border-white/[0.14] hover:text-white/65 hover:bg-white/[0.03] transition-all"
                              >
                                {fu}
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Message actions — visible on hover/focus */}
                        {!isLoading && rawText && (
                          <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">
                            <button
                              type="button"
                              onClick={() => handleCopy(msg.id, clean)}
                              className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] text-white/30 hover:text-white/60 hover:bg-white/[0.04] transition-colors focus:outline-none focus:ring-1 focus:ring-[#00bcd4]/40"
                              aria-label="Copy response"
                            >
                              {copiedId === msg.id ? (
                                <><PhCheck className="w-3.5 h-3.5 text-emerald-400" /><span className="text-emerald-400">Copied</span></>
                              ) : (
                                <><PhCopy className="w-3.5 h-3.5" /><span>Copy</span></>
                              )}
                            </button>
                            {msg.id === lastMsg?.id && (
                              <button
                                type="button"
                                onClick={handleRegenerate}
                                className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] text-white/30 hover:text-white/60 hover:bg-white/[0.04] transition-colors focus:outline-none focus:ring-1 focus:ring-[#00bcd4]/40"
                                aria-label="Regenerate response"
                              >
                                <PhArrowClockwise className="w-3.5 h-3.5" />
                                <span>Regenerate</span>
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    );
                  })()}
                </div>
              ))}

              {/* Thinking indicator */}
              {isThinking && (
                <div className="mb-6 flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 animate-pulse"
                    style={{
                      background: activeLuminor
                        ? `linear-gradient(135deg, ${activeLuminor.color || '#00bcd4'}, ${activeLuminor.color || '#00bcd4'}80)`
                        : 'linear-gradient(135deg, #00bcd4, #0d47a1)',
                    }}
                  >
                    {activeLuminor?.avatar || 'A'}
                  </div>
                  <div className="flex items-center gap-2 text-white/30">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00bcd4] animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00bcd4] animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00bcd4] animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                    <span className="text-xs">Thinking...</span>
                  </div>
                </div>
              )}

              <div ref={bottomRef} className="h-4" />
            </div>
          )}
        </div>

        {/* Scroll to bottom */}
        {showScrollBtn && (
          <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-10">
            <button
              onClick={scrollToBottom}
              aria-label="Scroll to bottom"
              className="w-9 h-9 rounded-full bg-[#1a1a1f] border border-white/[0.1] shadow-lg flex items-center justify-center text-white/50 hover:text-white/80 transition-colors"
            >
              <PhArrowDown className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Input area */}
        <div className="border-t border-white/[0.06] bg-[#09090b]">
          <div className="max-w-[680px] mx-auto px-4 py-4">
            <form onSubmit={handleSubmit}>
              <div
                className="relative rounded-2xl border transition-colors duration-150"
                style={{
                  borderColor: input.trim() ? 'rgba(0,188,212,0.3)' : 'rgba(255,255,255,0.08)',
                  backgroundColor: '#111113',
                }}
              >
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Message Arcanea..."
                  aria-label="Message input"
                  disabled={isLoading}
                  rows={1}
                  className="w-full px-4 py-3 pr-14 bg-transparent text-white/90 placeholder-white/25 resize-none focus:outline-none disabled:opacity-40 text-[15px] rounded-2xl"
                  style={{ minHeight: '52px', maxHeight: '200px' }}
                />

                <div className="absolute right-2 bottom-2 flex items-center gap-1.5">
                  <button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    aria-label="Send message"
                    className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-150 disabled:opacity-20"
                    style={{
                      backgroundColor: input.trim() && !isLoading ? ACCENT : 'transparent',
                    }}
                  >
                    {isLoading ? (
                      <PhCircleNotch className="w-4 h-4 text-white/40 animate-spin" />
                    ) : (
                      <PhPaperPlane className="w-4 h-4 text-white" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between mt-2 px-1">
                <span className="text-[11px] text-white/20">
                  Enter · @model · /beam to compare
                </span>
                <div className="flex items-center gap-2">
                  {focusMode !== 'auto' && (
                    <FocusModeSelector value={focusMode} onChange={setFocusMode} />
                  )}
                  <span className="text-[11px] text-white/15 font-mono">
                    {providerLabel}
                  </span>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Beam Mode overlay */}
      {beamPrompt && (
        <BeamMode
          prompt={beamPrompt}
          provider={provider}
          clientApiKey={clientApiKey}
          focusHint={focusHint}
          onSelectResponse={(text, beamModelId) => {
            // Add the beam result as if the user sent and got a response
            sendMessage({ text: beamPrompt });
            setBeamPrompt(null);
          }}
          onClose={() => setBeamPrompt(null)}
        />
      )}
    </div>
  );
}
