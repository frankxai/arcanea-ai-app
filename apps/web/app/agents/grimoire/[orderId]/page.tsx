'use client';

import { useState, useEffect, useRef, useCallback, use } from 'react';
import Link from 'next/link';
import { m, LazyMotion, domAnimation, AnimatePresence } from 'framer-motion';
import { GrimoireProgress, type GrimoireSection } from '@/components/agents/grimoire-progress';
import { GrimoireViewer } from '@/components/agents/grimoire-viewer';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type PageMode = 'generating' | 'complete' | 'error';

interface StoredOrder {
  answers: Record<string, string>;
  tier: 'Seeker' | 'Archmage' | 'Luminor';
  email: string;
  worldName: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const GRIMOIRE_SECTIONS: Array<Omit<GrimoireSection, 'status'>> = [
  { id: 'world-overview', title: 'World Overview' },
  { id: 'history-lore', title: 'History & Lore' },
  { id: 'magic-systems', title: 'Magic Systems' },
  { id: 'geography', title: 'Geography & Realms' },
  { id: 'characters', title: 'Characters & Factions' },
  { id: 'conflicts', title: 'Conflicts & Tensions' },
  { id: 'cultures', title: 'Cultures & Societies' },
  { id: 'cosmology', title: 'Cosmology & Deities' },
];

const TIER_ESTIMATES: Record<string, number> = {
  Seeker: 90,
  Archmage: 180,
  Luminor: 360,
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function parseSectionMarkers(
  raw: string,
  setSections: React.Dispatch<React.SetStateAction<GrimoireSection[]>>,
  setCurrentSection: React.Dispatch<React.SetStateAction<string>>,
  appendContent: (chunk: string) => void
) {
  // [SECTION:id] marks section complete, [PROGRESS:id] marks section starting
  const progressRe = /\[PROGRESS:([^\]]+)\]/g;
  const sectionRe = /\[SECTION:([^\]]+)\]/g;

  let cleaned = raw;

  let match: RegExpExecArray | null;
  while ((match = progressRe.exec(raw)) !== null) {
    const id = match[1];
    cleaned = cleaned.replace(match[0], '');
    setCurrentSection(id);
    setSections((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, status: 'generating' } : s
      )
    );
  }

  while ((match = sectionRe.exec(raw)) !== null) {
    const id = match[1];
    cleaned = cleaned.replace(match[0], '');
    setSections((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, status: 'complete' } : s
      )
    );
  }

  if (cleaned.replace(/\s/g, '').length > 0) {
    appendContent(cleaned);
  }
}

function downloadFile(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function generateShareLink(orderId: string): string {
  if (typeof window === 'undefined') return '';
  return `${window.location.origin}/agents/grimoire/${orderId}`;
}

// ---------------------------------------------------------------------------
// Loading animation
// ---------------------------------------------------------------------------

function CosmicForgeAnimation() {
  return (
    <div className="relative flex items-center justify-center w-24 h-24 mx-auto mb-8" aria-hidden="true">
      {/* Outer ring */}
      <m.div
        className="absolute inset-0 rounded-full border border-[#ffd700]/20"
        animate={{ rotate: 360 }}
        transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
      />
      {/* Middle ring */}
      <m.div
        className="absolute inset-3 rounded-full border border-[#7fffd4]/30"
        animate={{ rotate: -360 }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      />
      {/* Pulsing core */}
      <m.div
        className="w-10 h-10 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255,215,0,0.8) 0%, rgba(127,255,212,0.4) 60%, transparent 100%)',
        }}
        animate={{ scale: [0.9, 1.15, 0.9], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Orbit dot */}
      <m.div
        className="absolute w-2 h-2 rounded-full bg-[#ffd700]"
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        style={{ transformOrigin: '50% 2.75rem' }}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page header
// ---------------------------------------------------------------------------

function PageHeader({ mode, worldName }: { mode: PageMode; worldName: string }) {
  return (
    <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-[hsl(240_6%_4%/0.9)] backdrop-blur-xl print:hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
        <Link
          href="/agents"
          className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7fffd4]/50 rounded"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Agents
        </Link>

        <h1 className="text-sm font-medium text-white/80 truncate max-w-xs sm:max-w-md text-center">
          {mode === 'generating'
            ? 'Your Grimoire is Being Forged...'
            : mode === 'complete'
            ? `Your Grimoire — ${worldName}`
            : 'Grimoire Forge'}
        </h1>

        <div className="w-20" aria-hidden="true" />
      </div>
    </header>
  );
}

// ---------------------------------------------------------------------------
// Action toolbar (complete state)
// ---------------------------------------------------------------------------

interface ActionToolbarProps {
  content: string;
  worldName: string;
  orderId: string;
}

function ActionToolbar({ content, worldName, orderId }: ActionToolbarProps) {
  const [copied, setCopied] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  const handleDownload = useCallback(() => {
    const filename = `${worldName.toLowerCase().replace(/\s+/g, '-')}-grimoire.md`;
    downloadFile(content, filename);
  }, [content, worldName]);

  const handleCopyAll = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(content);
    } catch {
      const el = document.createElement('textarea');
      el.value = content;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }, [content]);

  const handleShare = useCallback(async () => {
    const link = generateShareLink(orderId);
    try {
      await navigator.clipboard.writeText(link);
    } catch {
      // ignore
    }
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2500);
  }, [orderId]);

  const handlePrint = useCallback(() => window.print(), []);

  const btnBase =
    'inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffd700]/60';

  return (
    <div className="flex flex-wrap items-center gap-3 print:hidden" role="toolbar" aria-label="Grimoire actions">
      <button
        onClick={handleDownload}
        className={`${btnBase} border-[#ffd700]/40 bg-[#ffd700]/10 text-[#ffd700] hover:bg-[#ffd700]/20`}
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Download Grimoire
      </button>

      <button
        onClick={handleCopyAll}
        className={`${btnBase} border-white/[0.1] bg-white/[0.05] text-white/70 hover:text-white hover:border-white/20`}
      >
        {copied ? (
          <>
            <svg className="w-4 h-4 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Copied!
          </>
        ) : (
          <>
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
            </svg>
            Copy All
          </>
        )}
      </button>

      <button
        onClick={handleShare}
        className={`${btnBase} border-white/[0.1] bg-white/[0.05] text-white/70 hover:text-white hover:border-white/20`}
      >
        {shareCopied ? (
          <>
            <svg className="w-4 h-4 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Link Copied!
          </>
        ) : (
          <>
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8m-4-6l-4-4-4 4m4-4v13" />
            </svg>
            Share
          </>
        )}
      </button>

      <button
        onClick={handlePrint}
        className={`${btnBase} border-white/[0.1] bg-white/[0.05] text-white/70 hover:text-white hover:border-white/20`}
        aria-label="Print grimoire"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2z" />
        </svg>
        Print
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Estimated time remaining ticker
// ---------------------------------------------------------------------------

function TimeRemaining({
  startedAt,
  estimatedSeconds,
}: {
  startedAt: number;
  estimatedSeconds: number;
}) {
  const [remaining, setRemaining] = useState(estimatedSeconds);

  useEffect(() => {
    const tick = () => {
      const elapsed = Math.floor((Date.now() - startedAt) / 1000);
      setRemaining(Math.max(0, estimatedSeconds - elapsed));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [startedAt, estimatedSeconds]);

  if (remaining === 0) return null;

  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const label =
    mins > 0
      ? `~${mins}m ${secs}s remaining`
      : `~${secs}s remaining`;

  return (
    <p className="text-sm text-white/40 tabular-nums" aria-live="polite" aria-atomic="true">
      {label}
    </p>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function GrimoireResultPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = use(params);

  const [mode, setMode] = useState<PageMode>('generating');
  const [order, setOrder] = useState<StoredOrder | null>(null);

  const [sections, setSections] = useState<GrimoireSection[]>(
    GRIMOIRE_SECTIONS.map((s) => ({ ...s, status: 'waiting' as const }))
  );
  const [currentSection, setCurrentSection] = useState('');
  const [streamedContent, setStreamedContent] = useState('');
  const [startedAt] = useState(() => Date.now());

  const contentRef = useRef('');
  const appendContent = useCallback((chunk: string) => {
    contentRef.current += chunk;
    setStreamedContent(contentRef.current);
  }, []);

  // Load order from sessionStorage and start streaming
  useEffect(() => {
    const raw = sessionStorage.getItem(`grimoire_order_${orderId}`);
    if (!raw) {
      // Could be a view-only link — try to load from saved state
      const saved = sessionStorage.getItem(`grimoire_result_${orderId}`);
      if (saved) {
        try {
          const parsed = JSON.parse(saved) as {
            content: string;
            worldName: string;
            tier: string;
            generatedAt: string;
          };
          contentRef.current = parsed.content;
          setStreamedContent(parsed.content);
          setOrder({
            worldName: parsed.worldName,
            tier: parsed.tier as StoredOrder['tier'],
            answers: {},
            email: '',
          });
          setSections((prev) => prev.map((s) => ({ ...s, status: 'complete' })));
          setMode('complete');
        } catch {
          setMode('error');
        }
      } else {
        setMode('error');
      }
      return;
    }

    let parsedOrder: StoredOrder;
    try {
      parsedOrder = JSON.parse(raw) as StoredOrder;
    } catch {
      setMode('error');
      return;
    }

    setOrder(parsedOrder);

    // Kick off generation
    const controller = new AbortController();

    async function generate() {
      try {
        const response = await fetch('/api/agents/grimoire/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            answers: parsedOrder.answers,
            tier: parsedOrder.tier,
            email: parsedOrder.email,
            orderId,
          }),
          signal: controller.signal,
        });

        if (!response.ok || !response.body) {
          setMode('error');
          return;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        // Mark first section as generating
        setSections((prev) =>
          prev.map((s, i) => (i === 0 ? { ...s, status: 'generating' } : s))
        );
        setCurrentSection(GRIMOIRE_SECTIONS[0].id);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const text = decoder.decode(value, { stream: true });
          parseSectionMarkers(text, setSections, setCurrentSection, appendContent);
        }

        // Mark all remaining sections complete
        setSections((prev) => prev.map((s) => ({ ...s, status: 'complete' })));
        setMode('complete');

        // Persist result so share links work in this session
        sessionStorage.setItem(
          `grimoire_result_${orderId}`,
          JSON.stringify({
            content: contentRef.current,
            worldName: parsedOrder.worldName,
            tier: parsedOrder.tier,
            generatedAt: new Date().toISOString(),
          })
        );
      } catch (err: unknown) {
        if ((err as { name?: string }).name !== 'AbortError') {
          setMode('error');
        }
      }
    }

    void generate();
    return () => controller.abort();
  }, [orderId, appendContent]);

  const worldName = order?.worldName ?? 'Your World';
  const tier = order?.tier ?? 'Seeker';
  const estimatedSeconds = TIER_ESTIMATES[tier] ?? 120;

  return (
    <LazyMotion features={domAnimation}>
      {/* ── Print styles ─────────────────────────────────────────────────── */}
      <style
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: `
            @media print {
              body { background: white !important; }
              .print\\:hidden { display: none !important; }
            }
          `,
        }}
      />

      <div className="min-h-screen text-white" style={{ background: 'hsl(240 6% 4%)' }}>
        <PageHeader mode={mode} worldName={worldName} />

        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <AnimatePresence mode="wait">
            {/* ── GENERATING STATE ─────────────────────────────────────────── */}
            {mode === 'generating' && (
              <m.div
                key="generating"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col lg:flex-row gap-10 lg:gap-16"
              >
                {/* Left: forge animation + progress */}
                <div className="w-full lg:w-72 shrink-0 flex flex-col items-center lg:items-start">
                  <CosmicForgeAnimation />

                  <div className="text-center lg:text-left mb-8 w-full">
                    <h2 className="text-xl font-semibold text-white mb-2">
                      Forging your Grimoire
                    </h2>
                    <p className="text-sm text-white/50 mb-4">
                      Each section is being woven with care. The deeper the tier, the richer the lore.
                    </p>
                    <TimeRemaining
                      startedAt={startedAt}
                      estimatedSeconds={estimatedSeconds}
                    />
                  </div>

                  <GrimoireProgress
                    sections={sections}
                    currentSection={currentSection}
                    className="w-full"
                  />
                </div>

                {/* Right: live content preview */}
                <div className="flex-1 min-w-0">
                  <div
                    className="rounded-2xl border border-[#c8a96e]/20 overflow-hidden"
                    style={{
                      background: 'linear-gradient(160deg, hsl(38 60% 96%) 0%, hsl(42 50% 92%) 100%)',
                      boxShadow: '0 0 60px rgba(200,169,110,0.08), 0 4px 24px rgba(0,0,0,0.4)',
                    }}
                  >
                    {/* Parchment header bar */}
                    <div className="px-6 py-4 border-b border-[#c8a96e]/20 flex items-center justify-between">
                      <span className="text-sm font-medium text-[#8c7355] [font-family:var(--font-display),serif] tracking-wide">
                        {worldName}
                      </span>
                      <m.div
                        className="flex items-center gap-1.5 text-xs text-[#c8a96e]/70"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.6, repeat: Infinity }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#ffd700] inline-block" />
                        Live Preview
                      </m.div>
                    </div>

                    {/* Streaming content */}
                    <div className="p-6 sm:p-8 max-h-[480px] overflow-y-auto">
                      {streamedContent ? (
                        <div className="prose prose-sm max-w-none text-[#4a3520] [font-family:'Crimson_Pro',serif] text-[15px] leading-relaxed whitespace-pre-wrap">
                          {streamedContent}
                          <m.span
                            className="inline-block w-0.5 h-4 bg-[#c8a96e] ml-0.5 align-middle"
                            animate={{ opacity: [1, 0, 1] }}
                            transition={{ duration: 0.8, repeat: Infinity, ease: 'steps(2)' }}
                            role="presentation"
                          />
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                          <m.p
                            className="text-[#c8a96e]/50 text-sm"
                            animate={{ opacity: [0.4, 0.9, 0.4] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            The ink is gathering...
                          </m.p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </m.div>
            )}

            {/* ── COMPLETE STATE ───────────────────────────────────────────── */}
            {mode === 'complete' && (
              <m.div
                key="complete"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {/* Action toolbar */}
                <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 print:hidden">
                  <div>
                    <m.p
                      className="text-sm text-[#7fffd4] font-medium mb-0.5"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      Your Grimoire is ready
                    </m.p>
                    <p className="text-white/40 text-sm">{tier} Edition</p>
                  </div>
                  <ActionToolbar
                    content={streamedContent}
                    worldName={worldName}
                    orderId={orderId}
                  />
                </div>

                {/* Parchment card */}
                <div
                  className="rounded-2xl border border-[#c8a96e]/25 overflow-hidden"
                  style={{
                    background: 'linear-gradient(160deg, hsl(38 60% 97%) 0%, hsl(42 50% 93%) 100%)',
                    boxShadow: '0 0 80px rgba(200,169,110,0.1), 0 8px 40px rgba(0,0,0,0.5)',
                  }}
                >
                  <div className="px-6 sm:px-10 lg:px-14 py-10 sm:py-14">
                    <GrimoireViewer
                      content={streamedContent}
                      worldName={worldName}
                      tier={tier}
                      generatedAt={new Date().toISOString()}
                    />
                  </div>
                </div>

                {/* CTA */}
                <div className="mt-16 flex flex-col items-center text-center gap-4 print:hidden">
                  <p className="text-white/40 text-sm">
                    Ready to forge another world?
                  </p>
                  <Link
                    href="/agents/grimoire"
                    className="inline-flex items-center gap-2 rounded-xl border border-[#ffd700]/40 bg-[#ffd700]/10 px-6 py-3 text-sm font-medium text-[#ffd700] hover:bg-[#ffd700]/20 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffd700]/60"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    Order Another Grimoire
                  </Link>
                </div>
              </m.div>
            )}

            {/* ── ERROR STATE ───────────────────────────────────────────────── */}
            {mode === 'error' && (
              <m.div
                key="error"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center justify-center py-24 text-center"
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
                  style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)' }}
                  aria-hidden="true"
                >
                  <svg className="w-8 h-8 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-white mb-3">
                  The forge went dark
                </h2>
                <p className="text-white/50 text-sm max-w-sm mb-8">
                  Your Grimoire could not be generated. This may be because the order link has expired or the generation failed.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <Link
                    href="/agents/grimoire"
                    className="inline-flex items-center gap-2 rounded-xl border border-[#ffd700]/40 bg-[#ffd700]/10 px-5 py-2.5 text-sm font-medium text-[#ffd700] hover:bg-[#ffd700]/20 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffd700]/60"
                  >
                    Try Again
                  </Link>
                  <Link
                    href="/agents"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.04] px-5 py-2.5 text-sm font-medium text-white/70 hover:text-white hover:border-white/20 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                  >
                    Back to Agents
                  </Link>
                </div>
              </m.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </LazyMotion>
  );
}
