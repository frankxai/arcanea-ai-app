import * as React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TierCardProps {
  name: string;
  tagline: string;
  description: string;
  glow: string;
  accent: string;
  href: string;
  badge?: string;
}

/**
 * Tier comparison card for Community / Featured / Canon tiers. Uses a soft
 * colored glow to hint at the tier identity without introducing new chrome.
 */
export function TierCard({
  name,
  tagline,
  description,
  glow,
  accent,
  href,
  badge,
}: TierCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        'group relative block overflow-hidden rounded-2xl border p-6 transition-all duration-300',
        'bg-gradient-to-br from-white/[0.04] to-white/[0.01]',
        'hover:-translate-y-0.5',
      )}
      style={{
        borderColor: `${glow}22`,
        boxShadow: `0 0 32px ${glow}10, inset 0 1px 0 rgba(255,255,255,0.04)`,
      }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full blur-3xl"
        style={{ background: `${glow}22` }}
      />
      <div className="relative">
        <div className="flex items-center justify-between">
          <span
            className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em]"
            style={{ background: `${glow}1f`, color: accent, border: `1px solid ${glow}33` }}
          >
            {badge ?? name}
          </span>
          <ArrowUpRight
            className="h-4 w-4 text-white/30 transition-colors group-hover:text-white/80"
            aria-hidden="true"
          />
        </div>
        <h3 className="mt-4 font-display text-2xl font-semibold text-white/95">{name}</h3>
        <p className="mt-1 text-[13px] font-medium" style={{ color: accent }}>
          {tagline}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-white/55">{description}</p>
        <span className="mt-5 inline-flex items-center gap-1 text-xs font-medium text-white/50 group-hover:text-white/80">
          Learn more <span aria-hidden="true">→</span>
        </span>
      </div>
    </Link>
  );
}
