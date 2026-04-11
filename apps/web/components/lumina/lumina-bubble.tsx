'use client';

/**
 * Lumina Floating Bubble — The Queen's Always-Present Chat
 *
 * Site-wide floating chat that gives creators access to Lumina, the
 * meta-orchestrator, from any page. She routes them to the right Luminor,
 * coordinates swarms, and speaks for Arcanea when asked about the whole.
 *
 * Features:
 * - Fixed bottom-right bubble that expands to a chat panel
 * - Keyboard shortcut: Cmd+K (Mac) / Ctrl+K (others) to toggle
 * - Streaming responses from POST /api/agents/lumina/execute
 * - Minimal, doesn't conflict with existing chat pages
 * - Glass-morphism theme matching Arcanea design
 *
 * Reference: Luminor Kernel Spec v1.0, Lumina (13th Luminor — Queen)
 */

import { useState, useEffect, useRef, useCallback, KeyboardEvent } from 'react';
import { LazyMotion, domAnimation, m, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const GREETINGS = [
  'I am Lumina. What are you creating?',
  'Welcome. Tell me what you need.',
  'I hold the whole of Arcanea. Ask anything.',
  'What path shall I illuminate for you?',
];

const PROMPT_EXAMPLES = [
  'Which Luminor should I talk to?',
  "I'm stuck — help me find the first step",
  'What is Arcanea?',
  'Coordinate multiple Luminors for this',
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
        const res = await fetch('/api/agents/lumina/execute', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            input: text.trim(),
            context: { source: 'lumina-bubble' },
          }),
        });

        if (!res.ok || !res.body) {
          throw new Error(`Lumina unavailable (${res.status})`);
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let accumulated = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          accumulated += chunk;
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId ? { ...m, content: accumulated } : m
            )
          );
        }
      } catch (err) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? {
                  ...m,
                  content:
                    (err as Error).message ??
                    'The light flickered. Please try again.',
                }
              : m
          )
        );
      } finally {
        setStreaming(false);
      }
    },
    [streaming]
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
            className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-black/60 text-2xl shadow-[0_0_40px_rgba(255,215,0,0.15)] backdrop-blur-xl transition-all hover:scale-110 hover:border-[#ffd700]/40 hover:shadow-[0_0_60px_rgba(255,215,0,0.3)]"
            aria-label="Summon Lumina (Cmd+K)"
          >
            <span className="text-3xl" style={{ filter: 'drop-shadow(0 0 8px #ffd700)' }}>
              ✨
            </span>
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
            className="fixed bottom-6 right-6 z-50 flex h-[600px] w-[400px] max-w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-2xl border border-white/10 bg-black/80 shadow-[0_20px_80px_rgba(255,215,0,0.15)] backdrop-blur-2xl"
            style={{ maxHeight: 'calc(100vh - 3rem)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl" style={{ filter: 'drop-shadow(0 0 6px #ffd700)' }}>
                  ✨
                </span>
                <div>
                  <div className="font-display text-sm font-semibold text-white/90">
                    Lumina
                  </div>
                  <div className="text-[10px] uppercase tracking-widest text-white/40">
                    Queen of Arcanea · Orchestrator
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md p-1 text-white/40 transition hover:bg-white/[0.05] hover:text-white/80"
                aria-label="Close Lumina (Esc)"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M4 4L12 12M12 4L4 12"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 space-y-4 overflow-y-auto px-4 py-4"
            >
              {messages.length === 0 && (
                <div className="space-y-6 py-4">
                  <p className="font-serif text-lg italic text-white/70">
                    {greeting}
                  </p>
                  <div className="space-y-2">
                    <div className="text-[10px] uppercase tracking-widest text-white/30">
                      Try asking
                    </div>
                    {PROMPT_EXAMPLES.map((ex) => (
                      <button
                        key={ex}
                        type="button"
                        onClick={() => sendMessage(ex)}
                        className="block w-full rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-left text-xs text-white/60 transition hover:border-[#ffd700]/30 hover:bg-white/[0.04] hover:text-white/90"
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
                    className={`max-w-[85%] rounded-xl px-4 py-2.5 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-white/[0.08] text-white/90'
                        : 'border border-[#ffd700]/20 bg-[#ffd700]/[0.04] text-white/85'
                    }`}
                  >
                    {msg.content || (
                      <span className="inline-flex gap-1">
                        <span className="animate-pulse">·</span>
                        <span className="animate-pulse" style={{ animationDelay: '150ms' }}>
                          ·
                        </span>
                        <span className="animate-pulse" style={{ animationDelay: '300ms' }}>
                          ·
                        </span>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="border-t border-white/[0.06] p-3">
              <div className="flex items-end gap-2 rounded-xl border border-white/[0.08] bg-white/[0.02] px-3 py-2 focus-within:border-[#ffd700]/30">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask Lumina…"
                  rows={1}
                  className="flex-1 resize-none bg-transparent text-sm text-white/90 placeholder-white/30 outline-none"
                  style={{ maxHeight: '120px' }}
                  disabled={streaming}
                />
                <button
                  type="button"
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || streaming}
                  className="rounded-lg border border-[#ffd700]/30 bg-[#ffd700]/[0.08] px-3 py-1.5 text-xs font-medium text-[#ffd700] transition hover:border-[#ffd700]/50 hover:bg-[#ffd700]/[0.15] disabled:opacity-30"
                >
                  {streaming ? '…' : 'Send'}
                </button>
              </div>
              <div className="mt-1.5 flex items-center justify-between px-1">
                <span className="text-[10px] text-white/30">
                  <kbd className="rounded border border-white/10 bg-white/[0.05] px-1">⌘K</kbd>{' '}
                  to toggle
                </span>
                <span className="text-[10px] text-white/30">
                  Streaming via Vercel AI SDK
                </span>
              </div>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </LazyMotion>
  );
}
