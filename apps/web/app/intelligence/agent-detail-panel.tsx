/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
'use client';

import { useEffect, useRef, useState } from 'react';
import { m } from 'framer-motion';
import type { Agent } from '@/lib/intelligence/agents';

const DRAWER = {
  initial: { x: '100%', opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: '100%', opacity: 0 },
  transition: { duration: 0.42, ease: [0.22, 0.65, 0.25, 1] as [number, number, number, number] },
};

const BACKDROP = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.3 },
};

interface AgentDetailPanelProps {
  agent: Agent;
  onClose: () => void;
}

type Turn = { role: 'user' | 'assistant'; content: string };

export function AgentDetailPanel({ agent, onClose }: AgentDetailPanelProps) {
  const [input, setInput] = useState('');
  const [turns, setTurns] = useState<Turn[]>([]);
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  // Reset state whenever the agent changes
  useEffect(() => {
    setTurns([]);
    setInput('');
    setError(null);
    abortRef.current?.abort();
    abortRef.current = null;
  }, [agent.id]);

  // Focus the input on open
  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 420);
    return () => clearTimeout(t);
  }, [agent.id]);

  // ESC closes
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const send = async () => {
    const trimmed = input.trim();
    if (!trimmed || streaming) return;
    setError(null);
    const next: Turn[] = [...turns, { role: 'user', content: trimmed }];
    setTurns([...next, { role: 'assistant', content: '' }]);
    setInput('');
    setStreaming(true);
    const ctl = new AbortController();
    abortRef.current = ctl;

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          messages: next.map((t) => ({ role: t.role, content: t.content })),
          systemPrompt: agent.prompt,
          temperature: 0.55,
          maxTokens: 360,
        }),
        signal: ctl.signal,
      });
      if (!res.ok || !res.body) {
        const payload = await res.json().catch(() => null) as
          | { error?: string; hint?: string; cta?: string }
          | null;
        throw new Error(payload?.error || `chat ${res.status}`);
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = '';
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        for (const line of chunk.split(/\r?\n/)) {
          if (!line) continue;
          if (line.startsWith('data:')) {
            const body = line.slice(5).trim();
            // SSE terminator emitted by Vercel AI SDK / OpenAI-style streams.
            if (!body || body === '[DONE]') continue;
            try {
              const p = JSON.parse(body);
              // Skip control events that carry no content; they have no
              // delta/text/content but valid JSON shape.
              if (p?.type && !['text-delta'].includes(p.type) &&
                  p?.choices === undefined && p?.text === undefined) {
                continue;
              }
              const piece =
                p?.choices?.[0]?.delta?.content ?? p?.text ?? p?.delta ?? '';
              if (typeof piece === 'string') acc += piece;
            } catch {
              // Not JSON — treat as raw streaming text.
              acc += body;
            }
          } else if (!line.startsWith('event:') && !line.startsWith(':')) {
            acc += line;
          }
        }
        setTurns((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: 'assistant', content: acc };
          return updated;
        });
      }
    } catch (e) {
      if ((e as Error).name === 'AbortError') return;
      setError((e as Error).message || 'Something broke. Try again.');
      setTurns((prev) => prev.slice(0, -1));
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  };

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void send();
    }
  };

  return (
    <>
      <m.div
        {...BACKDROP}
        className="fixed inset-0 z-40 bg-black/55 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <m.aside
        {...DRAWER}
        className="fixed inset-y-0 right-0 z-50 flex flex-col bg-[var(--arc-cosmic-void)]/95 border-l border-white/[0.06] backdrop-blur-2xl"
        style={{ width: 'min(560px, 100vw)' }}
        role="dialog"
        aria-modal="true"
        aria-label={`Speak with ${agent.name}`}
      >
        {/* Header */}
        <header
          className="px-7 pb-5 border-b border-white/[0.05]"
          style={{
            paddingTop: 'max(1.75rem, env(safe-area-inset-top, 0px))',
          }}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p
                className="text-[10px] tracking-[0.32em] uppercase text-white/35"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {agent.tier} {agent.gate ? `· ${agent.gate}` : ''}
              </p>
              <h2
                className="mt-1 text-[28px] sm:text-[32px] leading-[1.1] tracking-[-0.01em] text-white/95"
                style={{ fontFamily: 'var(--font-editorial), var(--font-serif), serif' }}
              >
                {agent.name}
              </h2>
              <p
                className="mt-1 italic text-[14px] text-white/45"
                style={{ fontFamily: 'var(--font-editorial), var(--font-serif), serif' }}
              >
                {agent.tagline}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="text-white/30 hover:text-white/80 transition-colors text-2xl leading-none"
              style={{ cursor: 'pointer' }}
            >
              ×
            </button>
          </div>
          <p
            className="mt-4 text-[13px] leading-[1.65] text-white/55"
            style={{ fontFamily: 'var(--font-editorial), var(--font-serif), serif' }}
          >
            {agent.essence}
          </p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {agent.capabilities.map((cap) => (
              <span
                key={cap}
                className="text-[10px] tracking-[0.22em] uppercase px-2.5 py-1 rounded-full border"
                style={{
                  fontFamily: 'var(--font-display)',
                  color: agent.color,
                  borderColor: `${agent.color}33`,
                  backgroundColor: `${agent.color}10`,
                }}
              >
                {cap}
              </span>
            ))}
          </div>
        </header>

        {/* Conversation */}
        <div className="flex-1 overflow-y-auto px-7 py-6 space-y-6">
          {turns.length === 0 && (
            <div className="space-y-3 text-white/35">
              <p
                className="text-[12px] tracking-[0.28em] uppercase"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Try asking
              </p>
              <ul className="space-y-2">
                {sampleQuestions(agent).map((q) => (
                  <li key={q}>
                    <button
                      type="button"
                      onClick={() => setInput(q)}
                      className="text-left text-[14px] italic leading-relaxed text-white/55 hover:text-white/85 transition-colors"
                      style={{
                        fontFamily: 'var(--font-editorial), var(--font-serif), serif',
                        cursor: 'pointer',
                      }}
                    >
                      &ldquo;{q}&rdquo;
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {turns.map((t, i) => (
            <div key={i} className={t.role === 'user' ? 'pl-10' : 'pr-10'}>
              <p
                className="text-[10px] tracking-[0.28em] uppercase mb-1.5"
                style={{
                  fontFamily: 'var(--font-display)',
                  color: t.role === 'user' ? 'rgba(255,255,255,0.45)' : agent.color,
                }}
              >
                {t.role === 'user' ? 'You' : agent.name}
              </p>
              <p
                className={
                  t.role === 'assistant'
                    ? 'text-[16px] leading-[1.65] text-white/85'
                    : 'text-[14px] leading-[1.6] text-white/65'
                }
                style={{
                  fontFamily:
                    t.role === 'assistant'
                      ? 'var(--font-editorial), var(--font-serif), serif'
                      : 'var(--font-display)',
                }}
              >
                {t.content || (streaming && i === turns.length - 1 ? '…' : '')}
              </p>
            </div>
          ))}

          {error && (
            <div
              role="alert"
              className="px-4 py-3 rounded-xl bg-rose-950/40 border border-rose-400/20 text-rose-100"
            >
              <p className="text-[12px] leading-relaxed">{error}</p>
              <p className="mt-1 text-[11px] text-rose-200/60">
                The hosted intelligence may not be configured for this agent yet. Voice keys
                also enable text invocation — connect them on{' '}
                <a href="/room/lumina" className="underline hover:text-white">
                  /room/lumina
                </a>{' '}
                or wait for tomorrow&apos;s key drop.
              </p>
            </div>
          )}
        </div>

        {/* Composer */}
        <div
          className="px-7 py-5 border-t border-white/[0.05]"
          style={{
            paddingBottom: 'max(1.25rem, env(safe-area-inset-bottom, 0px))',
          }}
        >
          <div className="flex gap-2 items-end">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder={`Ask ${agent.name}…`}
              rows={2}
              className="flex-1 resize-none px-4 py-3 rounded-xl text-[14px] text-white/90 bg-white/[0.03] border border-white/[0.08] placeholder-white/25 focus:outline-none focus:border-white/25 transition-colors"
              style={{ fontFamily: 'var(--font-display)' }}
            />
            <button
              type="button"
              onClick={() => void send()}
              disabled={!input.trim() || streaming}
              className="px-4 py-3 rounded-xl text-[11px] tracking-[0.22em] uppercase font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              style={{
                background: `${agent.color}1f`,
                color: agent.color,
                border: `1px solid ${agent.color}55`,
                fontFamily: 'var(--font-display)',
                cursor: streaming || !input.trim() ? 'not-allowed' : 'pointer',
              }}
            >
              {streaming ? '…' : 'Send'}
            </button>
          </div>
          <p
            className="mt-2 text-[10px] tracking-[0.22em] uppercase text-white/25"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Enter to send · Shift+Enter for newline · Esc to close
          </p>
        </div>
      </m.aside>
    </>
  );
}

function sampleQuestions(agent: Agent): string[] {
  switch (agent.tier) {
    case 'orchestrator':
      return [
        'Which of you should I talk to about shipping a launch page?',
        'What did the Council decide about the constellation aesthetic?',
      ];
    case 'guardian':
      return [
        `Tell me what ${agent.name} sees right now.`,
        `What is the one move you would make today?`,
      ];
    case 'specialist':
      return [
        `What is the cleanest way to do this in our stack?`,
        `Show me a concrete pattern for ${agent.capabilities[0].toLowerCase()}.`,
      ];
    case 'persona':
      return [
        'Status report.',
        'What should I focus on this hour?',
      ];
    case 'strategic':
      return [
        'Where will Arcanea be in five years?',
        'What does the future demand of me today?',
      ];
    case 'creative':
      return [
        'Give me a fragment of canon.',
        'What new region should we map?',
      ];
  }
}
