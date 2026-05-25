/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { subscribe, type Intent } from '../lib/intent-bus';

interface LogLine {
  id: string;
  ts: number;
  trigger: Intent['trigger'];
  kind: Intent['kind'];
  summary: string;
  color: string;
}

const TRIGGER_COLOR: Record<Intent['trigger'], string> = {
  click: 'var(--arc-text-primary)',
  clap: 'var(--arc-brand-arcanean-gold)',
  voice: 'var(--arc-brand-atlantean-teal)',
  palette: 'var(--arc-void)',
  hotkey: 'var(--arc-fire)',
};

const KIND_LABEL: Record<Intent['kind'], string> = {
  summon: 'SUMMON',
  workflow: 'WORKFLOW',
  runtime: 'RUNTIME',
  embed: 'EMBED',
  clap: 'CLAP',
};

export function LogicStream() {
  const [lines, setLines] = useState<LogLine[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    return subscribe((intent: Intent) => {
      const line: LogLine = {
        id: intent.id,
        ts: intent.ts,
        trigger: intent.trigger,
        kind: intent.kind,
        summary: intent.summary,
        color: TRIGGER_COLOR[intent.trigger],
      };
      setLines((prev) => [line, ...prev].slice(0, 80));
    });
  }, []);

  useEffect(() => {
    // Always scroll the latest line into view.
    if (containerRef.current) containerRef.current.scrollTop = 0;
  }, [lines]);

  return (
    <div className="rounded-2xl bg-black/40 border border-white/[0.06] backdrop-blur-md p-5 font-mono">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[10px] uppercase tracking-[0.3em] text-white/40">Logic Stream</p>
        <span className="text-[10px] text-white/25">{lines.length} events</span>
      </div>

      <div
        ref={containerRef}
        className="h-64 overflow-y-auto pr-2 space-y-1.5 text-[11px] leading-relaxed"
      >
        <AnimatePresence initial={false}>
          {lines.length === 0 ? (
            <p className="text-white/25 text-[11px] font-sans italic">
              Stream is quiet. Click a workflow, summon a Guardian, or clap to populate.
            </p>
          ) : null}
          {lines.map((line) => (
            <motion.div
              key={line.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="flex items-start gap-2"
            >
              <span className="text-white/30 flex-shrink-0">{formatTs(line.ts)}</span>
              <span
                className="uppercase tracking-widest text-[9px] flex-shrink-0 mt-0.5"
                style={{ color: line.color }}
              >
                {line.trigger}
              </span>
              <span className="text-white/40 flex-shrink-0 mt-0.5 text-[9px]">
                {KIND_LABEL[line.kind]}
              </span>
              <span className="text-white/75 flex-1">{line.summary}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function formatTs(ts: number): string {
  const d = new Date(ts);
  const h = d.getHours().toString().padStart(2, '0');
  const m = d.getMinutes().toString().padStart(2, '0');
  const s = d.getSeconds().toString().padStart(2, '0');
  return `${h}:${m}:${s}`;
}
