'use client';

import React, { useRef, useEffect, useCallback, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useChat } from '@ai-sdk/react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import {
  PhPaperPlane,
  PhPlus,
  PhCircleNotch,
  PhArrowDown,
  PhWarningCircle,
  PhX,
} from '@/lib/phosphor-icons';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const ACCENT = '#00bcd4';
const MODEL_LABEL = 'Gemini 2.0 Flash';

const SUGGESTIONS = [
  'Write a short story about a wandering inventor',
  'Design the architecture for a real-time app',
  'Help me name my creative project',
  'Analyze the trends shaping indie games',
];

// ---------------------------------------------------------------------------
// Chat Page — powered by Vercel AI SDK useChat
// ---------------------------------------------------------------------------

export default function ChatPage() {
  const searchParams = useSearchParams();
  const initialPrompt = searchParams.get('prompt');

  // Vercel AI SDK — handles streaming, messages, parsing automatically
  // @ai-sdk/react v3.0.118 removed `input`/`handleInputChange` — using local state
  const [input, setInput] = useState('');
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  }, []);

  const {
    messages,
    status,
    error,
    sendMessage,
    setMessages,
  } = useChat({
    api: '/api/ai/chat',
  });

  // @ai-sdk/react v3.0.118 replaced isLoading with status enum
  const isLoading = status === 'submitted' || status === 'streaming';

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      sendMessage({ text: input.trim() });
      setInput('');
    }
  }, [input, isLoading, sendMessage]);

  // UI state
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [autoScroll, setAutoScroll] = useState(true);
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-send initial prompt from hero chat (?prompt= query param)
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

  // New chat
  const startNewChat = () => {
    setMessages([]);
    setInput('');
    textareaRef.current?.focus();
  };

  // Keyboard: Enter to send, Shift+Enter for newline
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
            <span className="text-[11px] text-white/25 font-mono">{MODEL_LABEL}</span>
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

        {/* Error banner */}
        {error && (
          <div role="alert" className="bg-red-500/8 border-b border-red-500/20 px-4 py-2.5">
            <div className="max-w-[680px] mx-auto flex items-center justify-between">
              <div className="flex items-center gap-2 text-red-400/80 text-sm">
                <PhWarningCircle className="w-4 h-4" />
                <span>{error.message}</span>
              </div>
              <button onClick={startNewChat} aria-label="Dismiss error" className="text-red-400/60 hover:text-red-400">
                <PhX className="w-4 h-4" />
              </button>
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
            /* Empty state */
            <div className="flex flex-col items-center justify-center h-full px-4">
              <div className="max-w-[540px] w-full text-center">
                <h1 className="text-3xl font-semibold text-white/90 mb-2 tracking-tight">
                  What will you create?
                </h1>
                <p className="text-sm text-white/35 mb-10">
                  Write, code, design, research. Or just think out loud.
                </p>

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
            /* Messages */
            <div className="max-w-[680px] mx-auto px-4 py-6" aria-live="polite">
              {messages.map((msg) => (
                <div key={msg.id} className={`mb-6 ${msg.role === 'user' ? 'flex justify-end' : ''}`}>
                  {msg.role === 'user' ? (
                    <div className="max-w-[85%]">
                      <div className="inline-block px-4 py-3 rounded-2xl rounded-br-md bg-[#1a1a1f] text-white/90 text-[15px] leading-relaxed">
                        {msg.content}
                      </div>
                    </div>
                  ) : (
                    <div className="prose prose-invert prose-sm max-w-none text-[15px] leading-[1.7] text-white/85">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                      {isStreaming && msg.id === lastMsg?.id && (
                        <span className="inline-block w-[2px] h-[18px] bg-[#00bcd4] animate-pulse ml-0.5 align-text-bottom" />
                      )}
                    </div>
                  )}
                </div>
              ))}

              {/* Thinking indicator */}
              {isThinking && (
                <div className="mb-6 flex items-center gap-2 text-white/30">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-white/30 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-white/30 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-white/30 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-xs">Thinking...</span>
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
                  Enter to send · Shift+Enter for new line
                </span>
                <span className="text-[11px] text-white/15 font-mono">
                  {MODEL_LABEL}
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
