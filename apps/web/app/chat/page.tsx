'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  PhPaperPlane,
  PhPlus,
  PhChatCircle,
  PhCircleNotch,
  PhArrowDown,
  PhWarningCircle,
  PhX,
} from '@/lib/phosphor-icons';
import ReactMarkdown from 'react-markdown';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  status?: 'sending' | 'sent' | 'error';
}

interface SessionListItem {
  id: string;
  title: string | null;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const ACCENT = '#00bcd4';
const MODEL_LABEL = 'Gemini 2.0 Flash';

const SUGGESTIONS = [
  'What can you help me create?',
  'Write a short story about a wandering inventor',
  'Explain quantum computing in simple terms',
  'Help me brainstorm a business idea',
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getGuestId(): string {
  if (typeof window === 'undefined') return 'guest';
  const key = 'arcanea-guest-id';
  let id = localStorage.getItem(key);
  if (!id) {
    id = `guest-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    localStorage.setItem(key, id);
  }
  return id;
}

async function getAuthToken(): Promise<string | null> {
  try {
    const { createClient } = await import('@/lib/supabase/client');
    const supabase = createClient();
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token ?? null;
  } catch {
    return null;
  }
}

function formatSessionDate(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

// ---------------------------------------------------------------------------
// Chat Page
// ---------------------------------------------------------------------------

export default function ChatPage() {
  const searchParams = useSearchParams();
  const initialPrompt = searchParams.get('prompt');

  // Auth
  const [userId, setUserId] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function resolveUser() {
      try {
        const { createClient } = await import('@/lib/supabase/client');
        const supabase = createClient();
        const { data } = await supabase.auth.getSession();
        if (!cancelled) {
          if (data.session?.user) {
            setUserId(data.session.user.id);
            setIsAuthenticated(true);
          } else {
            setUserId(getGuestId());
          }
          setAuthReady(true);
        }
      } catch {
        if (!cancelled) {
          setUserId(getGuestId());
          setAuthReady(true);
        }
      }
    }
    resolveUser();
    return () => { cancelled = true; };
  }, []);

  // Chat state
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sessions, setSessions] = useState<SessionListItem[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);

  const messagesRef = useRef<Message[]>([]);
  const abortRef = useRef<AbortController | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  useEffect(() => { messagesRef.current = messages; }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [inputValue]);

  // Auto-scroll
  useEffect(() => {
    if (autoScroll && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, streamingContent, autoScroll]);

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

  // Load sessions
  const loadSessions = useCallback(async () => {
    if (!isAuthenticated) return;
    setSessionsLoading(true);
    try {
      const res = await fetch(`/api/chat/sessions?userId=me&luminorId=general`);
      if (res.ok) {
        const json = await res.json();
        const list = Array.isArray(json.data) ? json.data : Array.isArray(json.sessions) ? json.sessions : [];
        setSessions(list.map((s: { id: string; title: string | null; updatedAt: string }) => ({
          id: s.id, title: s.title, updatedAt: s.updatedAt,
        })));
      }
    } catch { /* non-critical */ }
    finally { setSessionsLoading(false); }
  }, [isAuthenticated]);

  useEffect(() => { if (authReady) loadSessions(); }, [authReady, loadSessions]);

  // Send message
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isStreaming) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
      status: 'sending',
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setError(null);

    const recentMsgs = messagesRef.current.slice(-10).map(m => ({
      role: m.role, content: m.content,
    }));

    const payload = {
      messages: [...recentMsgs, { role: 'user' as const, content: content.trim() }],
      // No systemPrompt — the API route will use the default Arcanea creative intelligence prompt
    };

    try {
      abortRef.current = new AbortController();
      const token = await getAuthToken();
      const headers: Record<string, string> = { 'content-type': 'application/json' };
      if (token) headers.authorization = `Bearer ${token}`;

      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
        signal: abortRef.current.signal,
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(errData?.error || `Request failed (${response.status})`);
      }

      setMessages(prev => prev.map(m => m.id === userMsg.id ? { ...m, status: 'sent' } : m));
      setIsStreaming(true);
      setStreamingContent('');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) throw new Error('No response body');

      let fullContent = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullContent += decoder.decode(value, { stream: true });
        setStreamingContent(fullContent);
      }

      const assistantMsg: Message = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        content: fullContent,
        timestamp: new Date(),
        status: 'sent',
      };
      setMessages(prev => [...prev, assistantMsg]);
      setIsStreaming(false);
      setStreamingContent('');
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') return;
      setMessages(prev => prev.map(m => m.id === userMsg.id ? { ...m, status: 'error' } : m));
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setIsStreaming(false);
      setStreamingContent('');
    }
  }, [isStreaming]);

  // New chat
  const startNewChat = () => {
    if (abortRef.current) abortRef.current.abort();
    setMessages([]);
    setStreamingContent('');
    setIsStreaming(false);
    setError(null);
    setInputValue('');
    textareaRef.current?.focus();
  };

  // Auto-send initial prompt
  const [initialSent, setInitialSent] = useState(false);
  useEffect(() => {
    if (initialPrompt && !initialSent && authReady && messages.length === 0) {
      sendMessage(initialPrompt);
      setInitialSent(true);
    }
  }, [initialPrompt, initialSent, authReady, messages.length, sendMessage]);

  // Handle submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  };

  const isEmpty = messages.length === 0 && !isStreaming;

  // Cleanup
  useEffect(() => {
    return () => { abortRef.current?.abort(); };
  }, []);

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

        <div className="flex-1 overflow-y-auto p-2 space-y-0.5" style={{ scrollbarWidth: 'thin' }}>
          {!isAuthenticated ? (
            <p className="px-3 py-6 text-xs text-white/30 text-center leading-relaxed">
              Sign in to save history
            </p>
          ) : sessionsLoading ? (
            <div className="flex justify-center pt-8">
              <PhCircleNotch className="w-4 h-4 animate-spin text-white/30" />
            </div>
          ) : sessions.length === 0 ? (
            <p className="px-3 py-6 text-xs text-white/30 text-center">No conversations yet</p>
          ) : (
            sessions.map((session) => (
              <button
                key={session.id}
                className="w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-100 group hover:bg-white/[0.04]"
              >
                <div className="flex items-start gap-2 text-white/50 group-hover:text-white/80">
                  <PhChatCircle className="w-3.5 h-3.5 mt-0.5 shrink-0 opacity-50" />
                  <div className="min-w-0">
                    <p className="truncate text-xs leading-snug">
                      {session.title ?? 'Untitled'}
                    </p>
                    <p className="text-[10px] text-white/25 mt-0.5">
                      {formatSessionDate(session.updatedAt)}
                    </p>
                  </div>
                </div>
              </button>
            ))
          )}
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
          <div className="bg-red-500/8 border-b border-red-500/20 px-4 py-2.5">
            <div className="max-w-[680px] mx-auto flex items-center justify-between">
              <div className="flex items-center gap-2 text-red-400/80 text-sm">
                <PhWarningCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
              <button onClick={() => setError(null)} className="text-red-400/60 hover:text-red-400">
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
            /* Empty state — centered welcome */
            <div className="flex flex-col items-center justify-center h-full px-4">
              <div className="max-w-[540px] w-full text-center">
                <h1 className="text-3xl font-semibold text-white/90 mb-2 tracking-tight">
                  What can I help you with?
                </h1>
                <p className="text-sm text-white/35 mb-10">
                  Ask anything. Write, code, analyze, create.
                </p>

                {/* Suggestion chips */}
                <div className="flex flex-wrap justify-center gap-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => sendMessage(s)}
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
            <div className="max-w-[680px] mx-auto px-4 py-6">
              {messages.map((msg) => (
                <div key={msg.id} className={`mb-6 ${msg.role === 'user' ? 'flex justify-end' : ''}`}>
                  {msg.role === 'user' ? (
                    /* User message — right-aligned bubble */
                    <div className="max-w-[85%]">
                      <div className="inline-block px-4 py-3 rounded-2xl rounded-br-md bg-[#1a1a1f] text-white/90 text-[15px] leading-relaxed">
                        {msg.content}
                      </div>
                      {msg.status === 'error' && (
                        <p className="text-xs text-red-400/60 mt-1 text-right">Failed to send</p>
                      )}
                    </div>
                  ) : (
                    /* AI message — document-style, no bubble */
                    <div className="prose prose-invert prose-sm max-w-none text-[15px] leading-[1.7] text-white/85">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  )}
                </div>
              ))}

              {/* Streaming message */}
              {(isStreaming && streamingContent) && (
                <div className="mb-6">
                  <div className="prose prose-invert prose-sm max-w-none text-[15px] leading-[1.7] text-white/85">
                    <ReactMarkdown>{streamingContent}</ReactMarkdown>
                    <span className="inline-block w-[2px] h-[18px] bg-[#00bcd4] animate-pulse ml-0.5 align-text-bottom" />
                  </div>
                </div>
              )}

              {/* Thinking indicator */}
              {(isStreaming && !streamingContent) && (
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
                  borderColor: inputValue.trim() ? 'rgba(0,188,212,0.3)' : 'rgba(255,255,255,0.08)',
                  backgroundColor: '#111113',
                }}
              >
                <textarea
                  ref={textareaRef}
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Message Arcanea..."
                  disabled={isStreaming}
                  rows={1}
                  className="w-full px-4 py-3 pr-14 bg-transparent text-white/90 placeholder-white/25 resize-none focus:outline-none disabled:opacity-40 text-[15px]"
                  style={{ minHeight: '52px', maxHeight: '200px' }}
                />

                <div className="absolute right-2 bottom-2 flex items-center gap-1.5">
                  <button
                    type="submit"
                    disabled={!inputValue.trim() || isStreaming}
                    className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-150 disabled:opacity-20"
                    style={{
                      backgroundColor: inputValue.trim() && !isStreaming ? ACCENT : 'transparent',
                    }}
                  >
                    {isStreaming ? (
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
