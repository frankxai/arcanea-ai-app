/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { WORKFLOWS, type Workflow } from '../lib/workflows';
import { RUNTIMES, type Runtime } from '../lib/runtimes';
import { AGENTS, type AgentDef } from '../lib/agents';
import { emit } from '../lib/intent-bus';

type Item =
  | { kind: 'persona'; agent: AgentDef }
  | { kind: 'workflow'; workflow: Workflow }
  | { kind: 'runtime'; runtime: Runtime };

const KIND_LABEL: Record<Item['kind'], string> = {
  persona: 'PERSONA',
  workflow: 'WORKFLOW',
  runtime: 'RUNTIME',
};

export function CommandPalette({
  onSummon,
  onEmbed,
}: {
  onSummon: (id: string) => void;
  onEmbed: (url: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Hotkey: Cmd/Ctrl + K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === 'Escape' && open) {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open]);

  useEffect(() => {
    if (open) {
      setQuery('');
      setActiveIdx(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const items = useMemo<Item[]>(() => {
    const personas: Item[] = AGENTS.filter((a) => a.tier !== 'specialist').map((agent) => ({
      kind: 'persona',
      agent,
    }));
    const workflows: Item[] = WORKFLOWS.map((workflow) => ({ kind: 'workflow', workflow }));
    const runtimes: Item[] = RUNTIMES.map((runtime) => ({ kind: 'runtime', runtime }));
    const all = [...personas, ...workflows, ...runtimes];
    if (!query.trim()) return all;
    const q = query.toLowerCase();
    return all.filter((it) => labelOf(it).toLowerCase().includes(q) || hintOf(it).toLowerCase().includes(q));
  }, [query]);

  const exec = (item: Item) => {
    if (item.kind === 'persona') {
      emit({
        kind: 'summon',
        persona: item.agent.id,
        trigger: 'palette',
        summary: `Summon ${item.agent.name}`,
      });
      onSummon(item.agent.id);
    } else if (item.kind === 'workflow') {
      emit({
        kind: 'workflow',
        workflowId: item.workflow.id,
        trigger: 'palette',
        summary: `Workflow → ${item.workflow.label}`,
      });
      const a = item.workflow.action;
      if (a.kind === 'route') {
        window.location.href = a.href;
      } else if (a.kind === 'cli') {
        navigator.clipboard?.writeText(a.command).catch(() => {});
      } else if (a.kind === 'external') {
        if (/^https:\/\/(www\.)?(youtube|github|vercel|figma)\./.test(a.url)) {
          onEmbed(a.url);
        } else {
          window.open(a.url, '_blank', 'noopener,noreferrer');
        }
      }
    } else if (item.kind === 'runtime') {
      emit({
        kind: 'runtime',
        runtimeId: item.runtime.id,
        command: item.runtime.command,
        trigger: 'palette',
        summary: `Copy launch — ${item.runtime.name}`,
      });
      navigator.clipboard?.writeText(item.runtime.command).catch(() => {});
    }
    setOpen(false);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx((i) => Math.min(items.length - 1, i + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx((i) => Math.max(0, i - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const it = items[activeIdx];
      if (it) exec(it);
    }
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="palette-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-[14vh] px-4"
          onClick={() => setOpen(false)}
        >
          <motion.div
            key="palette-card"
            initial={{ opacity: 0, y: -16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-xl rounded-2xl bg-[var(--arc-cosmic-void)] border border-white/15 shadow-[0_0_80px_rgba(0,0,0,0.6),0_0_24px_rgba(0,188,212,0.1)] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-4 border-b border-white/[0.06] flex items-center gap-3">
              <span className="text-white/30 text-sm">⌘</span>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActiveIdx(0);
                }}
                onKeyDown={handleKey}
                placeholder="Summon a persona, run a workflow, copy a runtime…"
                className="flex-1 bg-transparent text-base text-white placeholder:text-white/30 focus:outline-none"
              />
              <span className="text-[10px] uppercase tracking-widest text-white/25">esc</span>
            </div>
            <div className="max-h-[50vh] overflow-y-auto">
              {items.length === 0 ? (
                <p className="px-5 py-10 text-center text-sm text-white/30">No matches.</p>
              ) : (
                items.map((it, idx) => (
                  <PaletteRow
                    key={`${it.kind}-${labelOf(it)}-${idx}`}
                    item={it}
                    active={idx === activeIdx}
                    onHover={() => setActiveIdx(idx)}
                    onClick={() => exec(it)}
                  />
                ))
              )}
            </div>
            <div className="px-5 py-2 border-t border-white/[0.06] text-[10px] text-white/30 flex items-center justify-between">
              <span>↑ ↓ navigate · ↵ select</span>
              <span>⌘K to toggle</span>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function PaletteRow({
  item,
  active,
  onHover,
  onClick,
}: {
  item: Item;
  active: boolean;
  onHover: () => void;
  onClick: () => void;
}) {
  const color = colorOf(item);
  return (
    <button
      type="button"
      onMouseEnter={onHover}
      onClick={onClick}
      className={`w-full text-left px-5 py-2.5 flex items-center gap-3 transition-colors ${
        active ? 'bg-white/[0.05]' : 'bg-transparent hover:bg-white/[0.03]'
      }`}
    >
      <span
        className="inline-block w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ background: color, boxShadow: active ? `0 0 8px ${color}` : undefined }}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm text-white/85 truncate">{labelOf(item)}</span>
          <span className="text-[9px] uppercase tracking-widest text-white/30">
            {KIND_LABEL[item.kind]}
          </span>
        </div>
        <p className="text-[11px] text-white/40 truncate">{hintOf(item)}</p>
      </div>
      {active ? <span className="text-[10px] text-white/30">↵</span> : null}
    </button>
  );
}

function labelOf(it: Item): string {
  if (it.kind === 'persona') return it.agent.name;
  if (it.kind === 'workflow') return it.workflow.label;
  return it.runtime.name;
}
function hintOf(it: Item): string {
  if (it.kind === 'persona') return it.agent.description;
  if (it.kind === 'workflow') return it.workflow.hint;
  return it.runtime.tagline;
}
function colorOf(it: Item): string {
  if (it.kind === 'persona') return it.agent.color;
  if (it.kind === 'workflow') return it.workflow.color;
  return it.runtime.color;
}
