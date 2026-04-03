'use client';

import * as React from 'react';
import { m, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import {
  type ElementType,
  type NodeType,
  ELEMENT_COLORS,
  NODE_TYPE_SHAPES,
} from './graph-utils';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PanelNode {
  id: string;
  label: string;
  nodeType: NodeType;
  element: ElementType;
  gate: number;
  connectedIds: string[];
  connectedLabels: string[];
}

interface WorldGraphPanelProps {
  node: PanelNode | null;
  onClose: () => void;
  className?: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const ELEMENT_VARIANT_MAP: Record<ElementType, 'fire' | 'water' | 'crystal' | 'outline' | 'void' | 'gold'> = {
  Fire:   'fire',
  Water:  'water',
  Earth:  'crystal',
  Wind:   'outline',
  Void:   'void',
  Spirit: 'gold',
};

const TYPE_LABELS: Record<NodeType, string> = {
  character: 'Character',
  location:  'Location',
  creature:  'Creature',
  artifact:  'Artifact',
};

// ─── Gate dots ───────────────────────────────────────────────────────────────

function GateDots({ gate, element }: { gate: number; element: ElementType }) {
  const colors = ELEMENT_COLORS[element];
  return (
    <div className="flex items-center gap-1" aria-label={`Gate level ${gate}`}>
      {Array.from({ length: 10 }, (_, i) => (
        <span
          key={i}
          className="block w-2 h-2 rounded-full transition-all duration-300"
          style={{
            background: i < gate ? colors.border : 'rgba(255,255,255,0.06)',
            boxShadow: i < gate ? `0 0 4px ${colors.glow}` : 'none',
          }}
        />
      ))}
      <span className="ml-2 text-xs text-slate-400 tabular-nums">{gate}/10</span>
    </div>
  );
}

// ─── Panel ────────────────────────────────────────────────────────────────────

export function WorldGraphPanel({ node, onClose, className }: WorldGraphPanelProps) {
  const colors = node ? ELEMENT_COLORS[node.element] : ELEMENT_COLORS.Void;

  return (
    <AnimatePresence>
      {node && (
        <m.aside
          key={node.id}
          initial={{ x: '110%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '110%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 32, mass: 0.9 }}
          className={cn(
            'absolute right-3 top-3 bottom-3 w-72 z-10',
            'flex flex-col rounded-xl overflow-hidden',
            'border',
            className,
          )}
          style={{
            background: 'linear-gradient(160deg, rgba(14,14,20,0.96) 0%, rgba(9,9,11,0.98) 100%)',
            backdropFilter: 'blur(40px)',
            WebkitBackdropFilter: 'blur(40px)',
            borderColor: colors.border + '33',
            boxShadow: `0 0 40px ${colors.glow}, inset 0 1px 0 rgba(255,255,255,0.04)`,
          }}
          aria-label={`Details for ${node.label}`}
        >
          {/* Accent top strip */}
          <div
            className="h-0.5 w-full flex-shrink-0"
            style={{ background: `linear-gradient(90deg, transparent, ${colors.border}, transparent)` }}
          />

          {/* Header */}
          <div className="flex items-start justify-between p-4 pb-3">
            <div className="min-w-0">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1 font-sans">
                {NODE_TYPE_SHAPES[node.nodeType]} {TYPE_LABELS[node.nodeType]}
              </p>
              <h3 className="text-lg font-display font-bold text-white leading-tight truncate">
                {node.label}
              </h3>
            </div>

            <button
              onClick={onClose}
              aria-label="Close panel"
              className={cn(
                'flex-shrink-0 ml-2 mt-0.5 w-7 h-7 flex items-center justify-center rounded-lg',
                'text-slate-500 hover:text-white',
                'bg-white/[0.04] hover:bg-white/[0.08]',
                'border border-white/[0.06]',
                'transition-colors duration-150',
              )}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* Badges */}
          <div className="px-4 flex flex-wrap gap-2 mb-4">
            <Badge variant={ELEMENT_VARIANT_MAP[node.element]} size="sm">
              {node.element}
            </Badge>
            <Badge variant="outline" size="sm">
              {TYPE_LABELS[node.nodeType]}
            </Badge>
          </div>

          {/* Gate level */}
          <div className="px-4 mb-5">
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-2 font-sans">
              Gate Level
            </p>
            <GateDots gate={node.gate} element={node.element} />
          </div>

          {/* Divider */}
          <div className="mx-4 mb-4 h-px bg-white/[0.05]" />

          {/* Connected creations */}
          <div className="px-4 flex-1 overflow-y-auto min-h-0">
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-2 font-sans sticky top-0 bg-transparent">
              Connected Creations
              <span className="ml-2 text-slate-600">({node.connectedLabels.length})</span>
            </p>

            {node.connectedLabels.length === 0 ? (
              <p className="text-sm text-slate-600 italic">No connections</p>
            ) : (
              <ul className="space-y-1.5">
                {node.connectedLabels.map((label, i) => (
                  <li
                    key={node.connectedIds[i] ?? i}
                    className={cn(
                      'flex items-center gap-2.5 px-3 py-2 rounded-lg',
                      'bg-white/[0.03] border border-white/[0.04]',
                      'text-sm text-slate-300 font-sans',
                      'transition-colors duration-150 hover:bg-white/[0.06]',
                    )}
                  >
                    <span
                      className="block w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ background: colors.border }}
                    />
                    {label}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Footer action */}
          <div className="p-4 mt-3 border-t border-white/[0.05]">
            <Link
              href={`/imagine?prompt=${encodeURIComponent(node.label)}`}
              className={cn(
                'flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg',
                'text-sm font-semibold font-sans',
                'border transition-all duration-200',
                'hover:scale-[1.01] active:scale-[0.99]',
              )}
              style={{
                background: `linear-gradient(135deg, ${colors.bg}, rgba(9,9,11,0.8))`,
                borderColor: colors.border + '55',
                color: colors.border,
                boxShadow: `0 0 12px ${colors.glow}`,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path
                  d="M7 1.5c3.04 0 5.5 2.46 5.5 5.5S10.04 12.5 7 12.5 1.5 10.04 1.5 7 3.96 1.5 7 1.5zm0 2.5L5 7h1.5v3h1V7H9L7 4z"
                  fill="currentColor"
                />
              </svg>
              Visualize
            </Link>
          </div>
        </m.aside>
      )}
    </AnimatePresence>
  );
}
