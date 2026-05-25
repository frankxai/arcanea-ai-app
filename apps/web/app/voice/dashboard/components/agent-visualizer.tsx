/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  AGENTS,
  type AgentDef,
  type AgentRuntimeStatus,
  emptyRuntimeStatus,
} from '../lib/agents';
import { subscribe, type Intent } from '../lib/intent-bus';

const TIER_LABEL: Record<AgentDef['tier'], string> = {
  orchestrator: 'Orchestrator',
  guardian: 'Guardian',
  luminor: 'Luminor',
  specialist: 'Specialist',
};

const STATUS_COLORS: Record<AgentRuntimeStatus['status'], string> = {
  idle: 'rgba(255,255,255,0.18)',
  listening: 'var(--arc-text-primary)',
  thinking: 'var(--arc-void)',
  acting: 'var(--arc-brand-arcanean-gold)',
  reporting: 'var(--arc-brand-atlantean-teal)',
};

export function AgentVisualizer() {
  const [registry, setRegistry] = useState<AgentRuntimeStatus[]>(() => emptyRuntimeStatus(AGENTS));

  useEffect(() => {
    return subscribe((intent: Intent) => {
      // Synthetic activity-tagging: when intents fire, pretend the relevant
      // agent woke up briefly. Real SSE wiring is the v3 track.
      if (intent.kind === 'summon') {
        const id = intent.persona;
        setRegistry((prev) =>
          prev.map((r) =>
            r.id === id
              ? { ...r, status: 'listening', activity: 'Summoned by you', startedAt: Date.now() }
              : r,
          ),
        );
        setTimeout(() => {
          setRegistry((prev) =>
            prev.map((r) =>
              r.id === id ? { ...r, status: 'idle', activity: null, startedAt: null } : r,
            ),
          );
        }, 2400);
      }
      if (intent.kind === 'workflow') {
        // Lumina takes the workflow.
        setRegistry((prev) =>
          prev.map((r) =>
            r.id === 'lumina'
              ? { ...r, status: 'thinking', activity: intent.summary, startedAt: Date.now() }
              : r,
          ),
        );
        setTimeout(() => {
          setRegistry((prev) =>
            prev.map((r) =>
              r.id === 'lumina' ? { ...r, status: 'idle', activity: null, startedAt: null } : r,
            ),
          );
        }, 1800);
      }
    });
  }, []);

  const grouped = AGENTS.reduce<Record<AgentDef['tier'], AgentDef[]>>(
    (acc, a) => {
      (acc[a.tier] ??= []).push(a);
      return acc;
    },
    {} as Record<AgentDef['tier'], AgentDef[]>,
  );

  return (
    <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-md p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[10px] uppercase tracking-[0.3em] text-white/40">Agent registry</p>
        <span className="text-[10px] text-white/25">{AGENTS.length} agents</span>
      </div>

      <div className="space-y-4">
        {(['orchestrator', 'guardian', 'specialist'] as AgentDef['tier'][]).map((tier) => {
          const list = grouped[tier];
          if (!list || list.length === 0) return null;
          return (
            <div key={tier}>
              <p className="text-[9px] uppercase tracking-widest text-white/30 mb-2">
                {TIER_LABEL[tier]}
              </p>
              <div className="space-y-1.5">
                {list.map((agent) => {
                  const live = registry.find((r) => r.id === agent.id);
                  const status = live?.status ?? 'idle';
                  const isActive = status !== 'idle';
                  return (
                    <motion.div
                      key={agent.id}
                      layout
                      className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg hover:bg-white/[0.04] transition-colors"
                      animate={
                        isActive
                          ? { backgroundColor: 'rgba(255,255,255,0.04)' }
                          : { backgroundColor: 'rgba(255,255,255,0)' }
                      }
                    >
                      <div className="relative flex-shrink-0">
                        <span
                          className="block w-2 h-2 rounded-full"
                          style={{ background: agent.color }}
                        />
                        {isActive ? (
                          <motion.span
                            className="absolute inset-0 rounded-full"
                            style={{ background: STATUS_COLORS[status] }}
                            animate={{ opacity: [0.2, 0.8, 0.2], scale: [1, 1.6, 1] }}
                            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                          />
                        ) : null}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs text-white/80 font-medium truncate">
                            {agent.name}
                          </span>
                          {isActive ? (
                            <span
                              className="text-[9px] uppercase tracking-widest"
                              style={{ color: STATUS_COLORS[status] }}
                            >
                              {status}
                            </span>
                          ) : null}
                        </div>
                        {live?.activity ? (
                          <p className="text-[10px] text-white/40 truncate mt-0.5">
                            {live.activity}
                          </p>
                        ) : (
                          <p className="text-[10px] text-white/30 truncate">{agent.domain}</p>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
