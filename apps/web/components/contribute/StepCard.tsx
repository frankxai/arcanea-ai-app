/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import * as React from 'react';
import { cn } from '@/lib/utils';

export interface StepCardProps {
  step: number;
  title: string;
  description: string;
  children?: React.ReactNode;
  accent?: string;
  id?: string;
}

/**
 * Vertical step card used by /contribute to lay out the 5-step publishing
 * journey. Server-friendly — no client hooks — so it streams cleanly from RSC.
 */
export function StepCard({
  step,
  title,
  description,
  children,
  accent = 'var(--arc-brand-atlantean-teal)',
  id,
}: StepCardProps) {
  return (
    <article
      id={id}
      className={cn(
        'relative rounded-2xl border border-white/[0.06]',
        'bg-gradient-to-br from-white/[0.035] to-white/[0.01]',
        'p-6 md:p-8 transition-all duration-300',
        'hover:border-[var(--arc-brand-atlantean-teal)]/20 hover:shadow-[0_0_40px_rgba(0,188,212,0.06)]',
      )}
    >
      <div className="flex items-start gap-5">
        <div
          aria-hidden="true"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border text-base font-display font-semibold"
          style={{
            background: `${accent}14`,
            borderColor: `${accent}33`,
            color: accent,
            boxShadow: `0 0 24px ${accent}18`,
          }}
        >
          {String(step).padStart(2, '0')}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-xl font-semibold text-white/90">{title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-white/55">{description}</p>
          {children ? <div className="mt-5 space-y-3">{children}</div> : null}
        </div>
      </div>
    </article>
  );
}
