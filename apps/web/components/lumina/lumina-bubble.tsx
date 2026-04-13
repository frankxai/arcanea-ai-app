'use client';

/**
 * Arcanea Companion Bubble — The Platform's Always-Present Intelligence
 *
 * Site-wide floating chat that gives creators access to Arcanea from any page.
 * Routes to the right Luminor, holds context, and speaks for the whole platform.
 *
 * Features:
 * - Fixed bottom-right bubble using the crystalline A mark
 * - Keyboard shortcut: Cmd+K (Mac) / Ctrl+K (others) to toggle
 * - Streaming responses from POST /api/ai/chat
 * - "Open full chat" link to /chat with history
 * - Glass-morphism panel matching Arcanea design
 */

import { useState, useEffect, useRef, useCallback, KeyboardEvent } from 'react';
import { LazyMotion, domAnimation, m, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ArcaneanMark } from '@/components/brand/arcanea-mark';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const GREETINGS = [
  'What are you creating?',
  'Describe a world. I\'ll build it.',
  'Ask me anything about Arcanea.',
  'What story wants to be told?',
];

const PROMPT_EXAMPLES = [
  'Build a world from one sentence',
  'Help me write an opening scene',
  'What can I create here?',
  'Generate a character for my story',
];

export function LuminaBubble() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [greeting] = useState(
    () => GREETINGS[Math.floor(Math.random() * GREETINGS.length)]
  );
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Keyboard shortcut: Cmd+K / Ctrl+K to toggle
  useEffect(() => {
    const handler = (e: globalThis.KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === 'Escape' && open) {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open]);

  // Focus input when panel opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || streaming) return;

      const userMsg: Message = {
        id: `u-${Date.now()}`,
        role: 'user',
        content: text.trim(),
      };
      const assistantId = `a-${Date.now()}`;

      setMessages((prev) => [
        ...prev,
        userMsg,
        { id: assistantId, role: 'assistant', content: '' },
      ]);
      setInput('');
      setStreaming(true);

      try {
        const res = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [
              ...messages.map(m => ({ role: m.role, content: m.content })),
              { role: 'user', content: text.trim() },
            ],
            model: 'gemini-2.5-flash',
          }),
        });

        if (!res.ok || !res.body) {
          throw new Error(`Arcanea unavailable (${res.status})`);
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let accumulated = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });

          // Parse SSE data lines
          for (const line of chunk.split('\n')) {
            if (!line.startsWith('data: ')) continue;
            const data = line.slice(6);
            if (data === '[DONE]') continue;
            try {
              const parsed = JSON.parse(data);
              if (parsed.type === 'text-delta' && parsed.delta) {
                accumulated += parsed.delta;
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantId ? { ...m, content: accumulated } : m
                  )
                );
              }
            } catch {
              // skip non-JSON lines
            }
          }
        }
      } catch (err) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, content: (err as Error).message ?? 'Something went wrong. Try again.' }
              : m
          )
        );
      } finally {
        setStreaming(false);
      }
    },
    [streaming, messages]
  );

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <LazyMotion features={domAnimation}>
      {/* Floating bubble (collapsed state) */}
      <AnimatePresence>
        {!open && (
          <m.button
            type="button"
            onClick={() => setOpen(true)}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-[#0a0e16]/80 shadow-[0_0_40px_rgba(0,188,212,0.15)] backdrop-blur-xl transition-all hover:scale-110 hover:border-[#00bcd4]/40 hover:shadow-[0_0_60px_rgba(0,188,212,0.3)]"
            aria-label="Open Arcanea (Cmd+K)"
          >
            <ArcaneanMark size={28} glow animate="breathe" />
          </m.button>
        )}
      </AnimatePresence>

      {/* Chat panel (expanded state) */}
      <AnimatePresence>
        {open && (
          <m.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 z-50 flex h-[560px] w-[380px] max-w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0a0e16]/90 shadow-[0_20px_80px_rgba(0,188,212,0.12)] backdrop-blur-2xl"
            style={{ maxHeight: 'calc(100vh - 3rem)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
              <div className="flex items-center gap-3">
                <ArcaneanMark size={24} glow />
                <div>
                  <div className="font-display text-sm font-semibold text-white/90">
                    Arcanea
                  </div>
                  <div className="text-[10px] text-white/40">
                    Your creative intelligence
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Link
                  href="/chat"
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-2 py-1 text-[11px] text-white/40 transition hover:bg-white/[0.05] hover:text-[#00bcd4]"
                  title="Open full chat"
                >
                  Full chat
                </Link>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-lg p-1.5 text-white/40 transition hover:bg-white/[0.05] hover:text-white/80"
                  aria-label="Close Arcanea (Esc)"
                >
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {messages.length === 0 && (
                <div className="space-y-5 py-2">
                  <p className="text-base font-medium text-white/70">
                    {greeting}
                  </p>
                  <div className="space-y-1.5">
                    <div className="text-[10px] uppercase tracking-[0.15em] text-white/25">
                      Try
                    </div>
                    {PROMPT_EXAMPLES.map((ex) => (
                      <button
                        key={ex}
                        type="button"
                        onClick={() => sendMessage(ex)}
                        className="block w-full rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2.5 text-left text-[13px] text-white/50 transition hover:border-[#00bcd4]/20 hover:bg-white/[0.04] hover:text-white/80"
                      >
                        {ex}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-white/[0.08] text-white/90'
                        : 'border border-[#00bcd4]/15 bg-[#00bcd4]/[0.04] text-white/85'
                    }`}
                  >
                    {msg.content || (
                      <span className="inline-flex gap-1 text-white/30">
                        <span className="animate-pulse">·</span>
                        <span className="animate-pulse" style={{ animationDelay: '150ms' }}>·</span>
                        <span className="animate-pulse" style={{ animationDelay: '300ms' }}>·</span>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="border-t border-white/[0.06] p-3">
              <div className="flex items-end gap-2 rounded-xl border border-white/[0.08] bg-white/[0.02] px-3 py-2 focus-within:border-[#00bcd4]/30 transition-colors">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask Arcanea..."
                  rows={1}
                  className="flex-1 resize-none bg-transparent text-[13px] text-white/90 placeholder-white/30 outline-none"
                  style={{ maxHeight: '100px' }}
                  disabled={streaming}
                />
                <button
                  type="button"
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || streaming}
                  className="rounded-lg bg-[#00bcd4]/15 px-3 py-1.5 text-xs font-medium text-[#00bcd4] transition hover:bg-[#00bcd4]/25 disabled:opacity-30"
                >
                  {streaming ? '...' : '↑'}
                </button>
              </div>
              <div className="mt-1.5 flex items-center justify-between px-1">
                <span className="text-[10px] text-white/25">
                  <kbd className="rounded border border-white/10 bg-white/[0.04] px-1 text-[9px]">⌘K</kbd>
                </span>
                <Link
                  href="/chat"
                  onClick={() => setOpen(false)}
                  className="text-[10px] text-white/25 hover:text-[#00bcd4] transition-colors"
                >
                  Open full experience →
                </Link>
              </div>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </LazyMotion>
  );
}
