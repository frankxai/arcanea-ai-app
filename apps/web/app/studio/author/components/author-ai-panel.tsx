/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import {
  Sparkle,
  ShieldCheck,
  Cpu,
  Terminal,
  PaperPlaneTilt,
  CheckCircle,
  WarningCircle,
  Eye,
  ArrowsClockwise,
} from '@/lib/phosphor-icons';
import { evaluateProse } from '@/lib/author/canon-evaluator';
import { SensoryPalette } from './sensory-palette';
import { BeatSheetView } from './beat-sheet-view';

function extractMessageText(msg: { parts?: Array<{ type: string; text?: string }> }): string {
  if (!Array.isArray(msg.parts)) return '';
  return msg.parts
    .filter((p) => p.type === 'text')
    .map((p) => p.text ?? '')
    .join('');
}

type AgentHarness = 'antigravity' | 'claude-code' | 'codex';
type ModelTier = 'haiku' | 'sonnet' | 'opus';
type PanelTab = 'companion' | 'sensory' | 'beats' | 'humanizer';

interface AuthorAIPanelProps {
  bookSlug: string;
  currentChapter: string;
  chapterProse?: string;
  onInsertProseSnippet?: (text: string) => void;
}

const COUNCIL_AGENTS = [
  { name: 'Lore Master (Aiyami)', role: 'Crown / Canon Gatekeeper' },
  { name: 'World Architect', role: 'Magic Systems & Geography' },
  { name: 'Character Psychologist', role: 'Diamond & Voice Swatches' },
  { name: 'Continuity Guardian', role: 'Fact & Timeline Consistency' },
  { name: 'Humanizer / Voice Alchemist', role: 'AI-Tell Stripper & Flow' },
];

export function AuthorAIPanel({
  bookSlug,
  currentChapter,
  chapterProse = '',
  onInsertProseSnippet,
}: AuthorAIPanelProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<PanelTab>('companion');
  const [harness, setHarness] = useState<AgentHarness>('antigravity');
  const [model, setModel] = useState<ModelTier>('sonnet');
  const [apiKey, setApiKey] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Live Humanizer Evaluation
  const evalResult = evaluateProse(chapterProse);

  const [input, setInput] = useState('');
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/ai/author-chat',
      body: { bookSlug, currentChapter, model, harness, userApiKey: apiKey || undefined },
    }),
  });
  const isLoading = status === 'streaming' || status === 'submitted';

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const text = input.trim();
      if (!text) return;
      sendMessage({ text });
      setInput('');
    },
    [input, sendMessage],
  );

  const triggerCouncilAudit = () => {
    sendMessage({
      text: `Dispatch the Arcanea Author Council (Lore Master, World Architect, Character Psychologist, Continuity Guardian, and Humanizer) to evaluate this chapter's prose, pacing, and canon resonance.`,
    });
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (collapsed) {
    return (
      <button
        onClick={() => setCollapsed(false)}
        className="fixed right-0 top-1/2 -translate-y-1/2 z-30 px-2 py-4 bg-[var(--arc-cosmic-void)] border border-white/[0.08] rounded-l-xl text-white/40 hover:text-white/80 shadow-2xl transition-colors"
        title="Show Creative Co-Pilot"
      >
        <span className="text-[11px] font-sans font-medium [writing-mode:vertical-rl] tracking-wider">
          AI Co-Pilot & Council
        </span>
      </button>
    );
  }

  return (
    <aside className="w-84 flex-shrink-0 border-l border-white/[0.06] bg-[var(--arc-cosmic-void)]/90 backdrop-blur-md flex flex-col h-full select-none">
      {/* Panel Header */}
      <div className="p-3.5 border-b border-white/[0.06] space-y-2.5">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <Sparkle size={14} className="text-[var(--arc-brand-atlantean-teal)]" />
              <h2 className="font-display text-xs font-semibold text-white/90">
                Author Intelligence
              </h2>
            </div>
            <p className="text-[10px] text-[var(--arc-brand-atlantean-teal)]/70 mt-0.5">
              Harness: {harness.toUpperCase()} &middot; {model.toUpperCase()}
            </p>
          </div>
          <button
            onClick={() => setCollapsed(true)}
            className="text-white/30 hover:text-white/60 text-xs px-1.5 py-0.5 rounded hover:bg-white/[0.04]"
            title="Collapse"
          >
            &rarr;
          </button>
        </div>

        {/* Harness / Agent Mode Switcher */}
        <div className="grid grid-cols-3 gap-1 bg-white/[0.03] p-1 rounded-lg">
          {(['antigravity', 'claude-code', 'codex'] as const).map((h) => (
            <button
              key={h}
              onClick={() => setHarness(h)}
              className={`py-1 rounded text-[10px] font-sans transition-all flex items-center justify-center gap-1 ${
                harness === h
                  ? 'bg-[var(--arc-brand-atlantean-teal)]/20 text-[var(--arc-brand-atlantean-teal)] font-medium border border-[var(--arc-brand-atlantean-teal)]/30'
                  : 'text-white/30 hover:text-white/60'
              }`}
            >
              {h === 'antigravity' && <Sparkle size={10} />}
              {h === 'claude-code' && <Terminal size={10} />}
              {h === 'codex' && <Cpu size={10} />}
              <span>{h === 'antigravity' ? 'Antigravity' : h === 'claude-code' ? 'Claude' : 'Codex'}</span>
            </button>
          ))}
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/[0.04] pt-1">
          {[
            { key: 'companion', label: 'Council' },
            { key: 'sensory', label: 'Sensory' },
            { key: 'beats', label: 'Beats' },
            { key: 'humanizer', label: `Anti-Slop (${evalResult.humanizerScore}%)` },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as PanelTab)}
              className={`flex-1 py-1 text-[11px] font-sans text-center transition-colors border-b-2 ${
                activeTab === key
                  ? 'border-[var(--arc-brand-atlantean-teal)] text-[var(--arc-brand-atlantean-teal)] font-medium'
                  : 'border-transparent text-white/30 hover:text-white/60'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content: Council & Chat */}
      {activeTab === 'companion' && (
        <>
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-3.5 space-y-3">
            {messages.length === 0 && (
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                  <div className="flex items-center gap-1.5 text-xs text-white/80 font-medium">
                    <ShieldCheck size={14} className="text-[var(--arc-brand-arcanean-gold)]" />
                    <span>Arcanea Author Council</span>
                  </div>
                  <p className="text-[11px] text-white/40 leading-relaxed">
                    9 specialized Luminors stand ready to audit pacing, character diamonds, world lore, and prose resonance.
                  </p>
                  <button
                    onClick={triggerCouncilAudit}
                    className="w-full py-2 rounded-lg bg-[var(--arc-brand-atlantean-teal)]/10 hover:bg-[var(--arc-brand-atlantean-teal)]/20 border border-[var(--arc-brand-atlantean-teal)]/30 text-xs text-[var(--arc-brand-atlantean-teal)] font-medium flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(45,212,191,0.1)]"
                  >
                    <ArrowsClockwise size={13} />
                    Run 5-Gate Council Audit
                  </button>
                </div>

                <div className="space-y-1.5 pt-2">
                  <span className="text-[10px] text-white/30 uppercase tracking-wider">Quick Prompts</span>
                  {[
                    'Check continuity with character wound & desire',
                    'Enhance sensory tension in the climax beat',
                    'Suggest next scene escalation',
                    'Scan for repetitive prose patterns',
                  ].map((p) => (
                    <button
                      key={p}
                      onClick={() => setInput(p)}
                      className="w-full text-left p-2 rounded-lg bg-white/[0.02] border border-white/[0.04] text-[11px] text-white/50 hover:text-white/80 hover:bg-white/[0.04] transition-all truncate"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg) => (
              <div key={msg.id} className={`${msg.role === 'user' ? 'ml-6' : 'mr-2'}`}>
                <div
                  className={`p-3 rounded-xl text-xs leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-[var(--arc-brand-atlantean-teal)]/15 border border-[var(--arc-brand-atlantean-teal)]/25 text-white/90'
                      : 'bg-white/[0.02] border border-white/[0.06] text-white/70 shadow-sm'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{extractMessageText(msg)}</div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center gap-2 text-xs text-[var(--arc-brand-atlantean-teal)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--arc-brand-atlantean-teal)] animate-pulse" />
                <span>Council synthesizing response...</span>
              </div>
            )}
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSubmit} className="p-3 border-t border-white/[0.06] bg-white/[0.01]">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Council or Co-Pilot..."
                className="flex-1 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-xs text-white/90 placeholder:text-white/25 focus:outline-none focus:border-[var(--arc-brand-atlantean-teal)]/40"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="p-2.5 rounded-lg bg-[var(--arc-brand-atlantean-teal)]/20 hover:bg-[var(--arc-brand-atlantean-teal)]/30 text-[var(--arc-brand-atlantean-teal)] disabled:opacity-30 transition-all"
                title="Send message"
              >
                <PaperPlaneTilt size={14} />
              </button>
            </div>
          </form>
        </>
      )}

      {/* Tab Content: Sensory Expander */}
      {activeTab === 'sensory' && (
        <div className="flex-1 overflow-y-auto p-3">
          <SensoryPalette onInsertSnippet={onInsertProseSnippet} />
        </div>
      )}

      {/* Tab Content: Beat Sheet */}
      {activeTab === 'beats' && (
        <div className="flex-1 overflow-y-auto p-3">
          <BeatSheetView />
        </div>
      )}

      {/* Tab Content: Humanizer & Anti-Slop Audit */}
      {activeTab === 'humanizer' && (
        <div className="flex-1 overflow-y-auto p-3.5 space-y-3">
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white/80">Prose Humanizer Score</span>
              <span className={`text-xs font-mono font-bold ${evalResult.humanizerScore > 85 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {evalResult.humanizerScore} / 100
              </span>
            </div>
            <div className="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${evalResult.humanizerScore > 85 ? 'bg-emerald-400' : 'bg-amber-400'}`}
                style={{ width: `${evalResult.humanizerScore}%` }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-[11px] font-sans text-white/50 uppercase tracking-wider">
              Flagged AI Tells ({evalResult.aiTells.length})
            </h4>

            {evalResult.aiTells.length === 0 ? (
              <div className="p-4 text-center rounded-lg bg-emerald-500/[0.04] border border-emerald-500/10 text-xs text-emerald-300/80">
                <CheckCircle size={16} className="mx-auto mb-1 text-emerald-400" />
                Clean prose! No AI verbal tics detected.
              </div>
            ) : (
              evalResult.aiTells.map((tell, i) => (
                <div key={i} className="p-2.5 rounded-lg bg-amber-500/[0.04] border border-amber-500/15 space-y-1 text-[11px]">
                  <div className="flex items-center justify-between text-amber-300 font-medium">
                    <span>&ldquo;{tell.matchedText}&rdquo;</span>
                    <span className="text-[9px] uppercase text-white/30">{tell.category}</span>
                  </div>
                  <p className="text-white/50">{tell.suggestion}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </aside>
  );
}
