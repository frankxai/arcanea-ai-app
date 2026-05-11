/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { WORKFLOWS, type Workflow } from '../lib/workflows';
import { emit } from '../lib/intent-bus';

const CATEGORY_LABEL: Record<Workflow['category'], string> = {
  create: 'Create',
  ops: 'Ops',
  review: 'Review',
  discover: 'Discover',
};

export function WorkflowGrid({
  onEmbed,
  workflows,
}: {
  onEmbed: (url: string) => void;
  /** Optional tenant-scoped workflow set. Defaults to full WORKFLOWS catalog. */
  workflows?: Workflow[];
}) {
  const [filter, setFilter] = useState<Workflow['category'] | 'all'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const source = workflows ?? WORKFLOWS;
  const visible = filter === 'all' ? source : source.filter((w) => w.category === filter);

  const trigger = async (w: Workflow) => {
    emit({
      kind: 'workflow',
      workflowId: w.id,
      trigger: 'click',
      summary: `Workflow → ${w.label}`,
    });
    if (w.action.kind === 'cli') {
      try {
        await navigator.clipboard.writeText(w.action.command);
        setCopiedId(w.id);
        setTimeout(() => setCopiedId(null), 1200);
      } catch {}
    } else if (w.action.kind === 'external') {
      // Render in embedded viewer instead of opening a tab when possible.
      if (/^https:\/\/(www\.)?(youtube|github|vercel|figma)\./.test(w.action.url)) {
        onEmbed(w.action.url);
      } else {
        window.open(w.action.url, '_blank', 'noopener,noreferrer');
      }
    }
  };

  return (
    <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-md p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[10px] uppercase tracking-[0.3em] text-white/40">Workflows</p>
        <div className="flex gap-1">
          {(['all', 'create', 'discover', 'ops', 'review'] as const).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilter(cat as Workflow['category'] | 'all')}
              className={`text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded transition-colors ${
                filter === cat
                  ? 'bg-[var(--arc-brand-atlantean-teal)]/20 text-[var(--arc-brand-atlantean-teal)]'
                  : 'text-white/35 hover:text-white/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-1.5">
        {visible.map((w) => {
          const isCli = w.action.kind === 'cli';
          const isRoute = w.action.kind === 'route';
          const inner = (
            <motion.div
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.97 }}
              className="relative h-full rounded-lg px-2.5 py-2 bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.05] hover:border-white/[0.12] transition-colors cursor-pointer"
              style={{ boxShadow: copiedId === w.id ? `0 0 18px ${w.color}55` : undefined }}
            >
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="inline-block w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: w.color, boxShadow: `0 0 6px ${w.color}66` }}
                />
                <span className="text-[11px] font-medium text-white/85 truncate">{w.label}</span>
              </div>
              <p className="text-[10px] text-white/40 line-clamp-1">{w.hint}</p>
              <span className="absolute top-1.5 right-2 text-[8px] uppercase tracking-widest text-white/25">
                {CATEGORY_LABEL[w.category]}
              </span>
              {copiedId === w.id ? (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute bottom-1.5 right-2 text-[8px] uppercase tracking-widest"
                  style={{ color: w.color }}
                >
                  copied
                </motion.span>
              ) : null}
            </motion.div>
          );
          if (isRoute && w.action.kind === 'route') {
            return (
              <Link
                key={w.id}
                href={w.action.href}
                onClick={() =>
                  emit({
                    kind: 'workflow',
                    workflowId: w.id,
                    trigger: 'click',
                    summary: `Workflow → ${w.label}`,
                  })
                }
              >
                {inner}
              </Link>
            );
          }
          return (
            <button
              key={w.id}
              type="button"
              onClick={() => trigger(w)}
              className="text-left"
            >
              {inner}
            </button>
          );
        })}
      </div>
      <p className="text-[10px] text-white/30 mt-3 leading-relaxed">
        {filter === 'all' ? `${WORKFLOWS.length} workflows` : `${visible.length} in ${filter}`} · CLI commands
        copy to clipboard, routes navigate, web links embed.
      </p>
    </div>
  );
}
