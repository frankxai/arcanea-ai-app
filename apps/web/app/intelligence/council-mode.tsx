'use client';

/**
 * Council Mode — parallel multi-agent invocation.
 *
 * One prompt fans out to five distinct voices simultaneously. Each agent
 * streams its answer in its own panel. The visual demonstration of
 * "many minds, one question" — multi-agent capability made viscerally
 * legible in three seconds.
 *
 * Why these five: they were chosen for maximum tonal variance — synthesis
 * (Lumina), execution (Draconia), vision (Lyria), future-back (Oracle),
 * and clinical brevity (JARVIS). Hearing the same prompt answered through
 * those five lenses is the demo.
 */

import { useEffect, useRef, useState } from 'react';
import { m } from 'framer-motion';
import { AGENT_BY_ID, type Agent } from '@/lib/intelligence/agents';

const COUNCIL_IDS = ['lumina', 'draconia', 'lyria', 'luminor-oracle', 'jarvis'] as const;

type VoiceState = 'idle' | 'streaming' | 'done' | 'error';

interface VoicePanelState {
  text: string;
  state: VoiceState;
  errorMsg?: string;
  durationMs?: number;
}

const SAMPLE_PROMPTS = [
  'What should I ship today?',
  'How do I know I am on the right path?',
  'Tell me what is true about creation.',
  'What is the one move I am avoiding?',
];

interface CouncilModeProps {
  onClose: () => void;
}

export function CouncilMode({ onClose }: CouncilModeProps) {
  const [prompt, setPrompt] = useState('');
  const [round, setRound] = useState(0); // increments each "summon" — used as key/reset trigger
  const [panels, setPanels] = useState<Record<string, VoicePanelState>>(() =>
    Object.fromEntries(COUNCIL_IDS.map((id) => [id, { text: '', state: 'idle' }])),
  );
  const abortControllers = useRef<AbortController[]>([]);

  // ESC closes
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  useEffect(() => {
    return () => {
      abortControllers.current.forEach((c) => c.abort());
    };
  }, []);

  const summon = async () => {
    const trimmed = prompt.trim();
    if (!trimmed) return;
    // Cancel any in-flight calls
    abortControllers.current.forEach((c) => c.abort());
    abortControllers.current = [];
    setRound((r) => r + 1);
    setPanels(
      Object.fromEntries(
        COUNCIL_IDS.map((id) => [id, { text: '', state: 'streaming' as VoiceState }]),
      ),
    );

    // Fire all five in parallel — Promise.all not needed; we let each
    // resolve independently so panels light up as their agent finishes.
    COUNCIL_IDS.forEach((agentId) => {
      const agent = AGENT_BY_ID[agentId];
      if (!agent) return;
      const ctl = new AbortController();
      abortControllers.current.push(ctl);
      void invokeAgent(agent, trimmed, ctl.signal, (text, state, errorMsg, durationMs) => {
        setPanels((prev) => ({
          ...prev,
          [agentId]: { text, state, errorMsg, durationMs },
        }));
      });
    });
  };

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void summon();
    }
  };

  const stopAll = () => {
    abortControllers.current.forEach((c) => c.abort());
    abortControllers.current = [];
    setPanels((prev) =>
      Object.fromEntries(
        Object.entries(prev).map(([k, v]) => [
          k,
          v.state === 'streaming' ? { ...v, state: 'done' } : v,
        ]),
      ),
    );
  };

  const anyStreaming = Object.values(panels).some((p) => p.state === 'streaming');

  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.32 }}
      className="fixed inset-0 z-[60] bg-[#050507]/95 backdrop-blur-xl flex flex-col"
      role="dialog"
      aria-modal="true"
      aria-label="Council Mode — five agents, one prompt"
    >
      {/* Backdrop atmosphere */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 40% at 50% 12%, rgba(255,215,0,0.10) 0%, transparent 60%), radial-gradient(ellipse 80% 50% at 50% 88%, rgba(0,188,212,0.08) 0%, transparent 60%)',
        }}
      />

      {/* Header */}
      <header
        className="relative z-10 flex items-center justify-between px-6 sm:px-10 border-b border-white/[0.05]"
        style={{ paddingTop: 'max(1.5rem, env(safe-area-inset-top, 0px))', paddingBottom: '1.25rem' }}
      >
        <div>
          <p
            className="text-[10px] tracking-[0.42em] uppercase text-white/40"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Council Mode
          </p>
          <h2
            className="mt-1 text-[24px] sm:text-[28px] leading-[1.1] tracking-[-0.005em] text-white/95"
            style={{ fontFamily: 'var(--font-editorial), var(--font-serif), serif' }}
          >
            Five voices. One question.
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close Council"
          className="text-white/35 hover:text-white/85 transition-colors text-2xl leading-none"
          style={{ cursor: 'pointer' }}
        >
          ×
        </button>
      </header>

      {/* Composer */}
      <div className="relative z-10 px-6 sm:px-10 py-5 border-b border-white/[0.05]">
        <div className="flex gap-3 items-end max-w-5xl mx-auto">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ask the Council…"
            rows={2}
            className="flex-1 resize-none px-4 py-3 rounded-xl text-[15px] text-white/90 bg-white/[0.03] border border-white/[0.08] placeholder-white/25 focus:outline-none focus:border-white/25 transition-colors"
            style={{ fontFamily: 'var(--font-display)' }}
          />
          <button
            type="button"
            onClick={() => (anyStreaming ? stopAll() : void summon())}
            disabled={!anyStreaming && !prompt.trim()}
            className="px-5 py-3 rounded-xl text-[11px] tracking-[0.28em] uppercase font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              background: anyStreaming ? 'rgba(244,63,94,0.16)' : 'rgba(255,215,0,0.16)',
              color: anyStreaming ? '#fda4af' : '#ffd700',
              border: `1px solid ${anyStreaming ? 'rgba(244,63,94,0.4)' : 'rgba(255,215,0,0.4)'}`,
              fontFamily: 'var(--font-display)',
              cursor: anyStreaming || prompt.trim() ? 'pointer' : 'not-allowed',
            }}
          >
            {anyStreaming ? 'Stop' : 'Summon'}
          </button>
        </div>
        {round === 0 && (
          <div className="mt-3 max-w-5xl mx-auto flex flex-wrap gap-1.5">
            {SAMPLE_PROMPTS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setPrompt(s)}
                className="text-[11px] tracking-[0.04em] italic text-white/40 hover:text-white/80 transition-colors px-2 py-1 rounded-md"
                style={{ fontFamily: 'var(--font-editorial), var(--font-serif), serif', cursor: 'pointer' }}
              >
                &ldquo;{s}&rdquo;
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Panels */}
      <div className="relative z-10 flex-1 overflow-y-auto px-6 sm:px-10 py-8">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {COUNCIL_IDS.map((id, idx) => {
            const agent = AGENT_BY_ID[id];
            const state = panels[id];
            if (!agent) return null;
            return (
              <m.article
                key={`${id}-${round}`}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.05, ease: [0.22, 0.65, 0.25, 1] }}
                className="relative rounded-2xl bg-white/[0.025] border border-white/[0.06] p-5 overflow-hidden"
              >
                <div
                  aria-hidden
                  className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-15 blur-3xl"
                  style={{ background: agent.color }}
                />
                <header className="flex items-baseline gap-3">
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{
                      backgroundColor: agent.color,
                      boxShadow:
                        state.state === 'streaming'
                          ? `0 0 12px ${agent.color}`
                          : `0 0 4px ${agent.color}80`,
                    }}
                  />
                  <p
                    className="text-[10px] tracking-[0.32em] uppercase"
                    style={{ fontFamily: 'var(--font-display)', color: agent.color }}
                  >
                    {agent.name}
                  </p>
                  <p
                    className="text-[10px] tracking-[0.22em] uppercase text-white/30 ml-auto"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {state.state === 'streaming' ? '…' : state.durationMs ? `${state.durationMs}ms` : ''}
                  </p>
                </header>
                <p
                  className="mt-1 italic text-[12px] text-white/40"
                  style={{ fontFamily: 'var(--font-editorial), var(--font-serif), serif' }}
                >
                  {agent.tagline}
                </p>
                <div className="mt-4 min-h-[120px]">
                  {state.state === 'idle' && (
                    <p
                      className="text-[13px] text-white/30 italic"
                      style={{ fontFamily: 'var(--font-editorial), var(--font-serif), serif' }}
                    >
                      Ready.
                    </p>
                  )}
                  {state.state === 'streaming' && !state.text && (
                    <div className="flex items-center gap-1.5 text-white/40">
                      <span
                        className="w-1 h-1 rounded-full animate-pulse"
                        style={{ backgroundColor: agent.color, animationDelay: '0ms' }}
                      />
                      <span
                        className="w-1 h-1 rounded-full animate-pulse"
                        style={{ backgroundColor: agent.color, animationDelay: '180ms' }}
                      />
                      <span
                        className="w-1 h-1 rounded-full animate-pulse"
                        style={{ backgroundColor: agent.color, animationDelay: '360ms' }}
                      />
                    </div>
                  )}
                  {state.text && (
                    <p
                      className="text-[15px] leading-[1.65] text-white/85 whitespace-pre-wrap"
                      style={{
                        fontFamily: 'var(--font-editorial), var(--font-serif), serif',
                      }}
                    >
                      {state.text}
                    </p>
                  )}
                  {state.state === 'error' && (
                    <p className="text-[12px] text-rose-300/80 leading-relaxed">
                      {state.errorMsg || 'Voice unavailable.'}
                    </p>
                  )}
                </div>
              </m.article>
            );
          })}
        </div>

        {/* Hint footer */}
        <div
          className="mt-10 max-w-5xl mx-auto text-center text-[10px] tracking-[0.32em] uppercase text-white/25"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Five parallel calls · five distinct system prompts · one Vercel Gateway
        </div>
      </div>
    </m.div>
  );
}

// ───────────────────────────────────────────────────────────────────────────
// Streaming invocation helper
// ───────────────────────────────────────────────────────────────────────────

async function invokeAgent(
  agent: Agent,
  userText: string,
  signal: AbortSignal,
  onUpdate: (text: string, state: VoiceState, errorMsg?: string, durationMs?: number) => void,
) {
  const t0 = performance.now();
  try {
    const res = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: userText }],
        systemPrompt: agent.prompt,
        temperature: 0.6,
        maxTokens: 220,
      }),
      signal,
    });
    if (!res.ok || !res.body) {
      const body = await res.text().catch(() => '');
      onUpdate('', 'error', `${res.status} ${body.slice(0, 120)}`);
      return;
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
          if (!body || body === '[DONE]') continue;
          try {
            const p = JSON.parse(body);
            if (p?.type && !['text-delta'].includes(p.type) &&
                p?.choices === undefined && p?.text === undefined) {
              continue;
            }
            const piece =
              p?.choices?.[0]?.delta?.content ?? p?.text ?? p?.delta ?? '';
            if (typeof piece === 'string') {
              acc += piece;
              onUpdate(acc, 'streaming');
            }
          } catch {
            acc += body;
            onUpdate(acc, 'streaming');
          }
        }
      }
    }
    onUpdate(acc.trim(), 'done', undefined, Math.round(performance.now() - t0));
  } catch (e) {
    if ((e as Error).name === 'AbortError') return;
    onUpdate('', 'error', (e as Error).message);
  }
}
