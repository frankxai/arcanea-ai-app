/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import Link from 'next/link';
import { GlowCard } from '@/components/saga/glow-card';
import type { ChronicleBook } from '../books-data';

// ============================================================
// STATUS BADGE
// ============================================================

type BookStatus = 'complete' | 'in-progress' | 'outlined' | 'planned';

function StatusBadge({ status }: { status: BookStatus }) {
  const styles: Record<BookStatus, { bg: string; text: string; label: string }> = {
    complete: {
      bg: 'bg-emerald-500/15 border border-emerald-500/30',
      text: 'text-emerald-400',
      label: 'Complete',
    },
    'in-progress': {
      bg: 'bg-[var(--arc-brand-atlantean-teal)]/10 border border-[var(--arc-brand-atlantean-teal)]/25',
      text: 'text-[var(--arc-brand-atlantean-teal)]',
      label: 'In Progress',
    },
    outlined: {
      bg: 'bg-amber-500/10 border border-amber-500/25',
      text: 'text-amber-400',
      label: 'Outlined',
    },
    planned: {
      bg: 'bg-white/5 border border-white/10',
      text: 'text-white/60',
      label: 'Coming Soon',
    },
  };

  const s = styles[status];
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] ${s.bg} ${s.text}`}
    >
      {s.label}
    </span>
  );
}

// ============================================================
// BOOK CARD
// ============================================================

export function BookCard({ book, isFeature = false }: { book: ChronicleBook; isFeature?: boolean }) {
  const isAvailable = book.status === 'complete' || book.status === 'in-progress';
  const isPartial = book.status === 'outlined';

  if (!isFeature && book.status === 'planned') {
    return (
      <GlowCard className="group overflow-hidden rounded-xl border border-white/6 bg-white/[0.02] p-5 transition-all">
        <div className="mb-3 flex items-start justify-between gap-3">
          <span className="font-mono text-2xl text-white/10" aria-hidden="true">
            {book.gateSymbol}
          </span>
          <StatusBadge status={book.status} />
        </div>
        <h3 className="mb-1 text-sm font-semibold text-white/60">{book.title}</h3>
        <p className="text-[11px] text-white/50">{book.subtitle}</p>
        <p className="mt-3 text-xs leading-relaxed text-white/50">{book.description}</p>
      </GlowCard>
    );
  }

  return (
    <GlowCard
      className={`group overflow-hidden rounded-xl border bg-white/[0.03] transition-all duration-300 ${
        isFeature
          ? 'border-[var(--arc-brand-atlantean-teal)]/15 hover:border-[var(--arc-brand-atlantean-teal)]/30 hover:bg-white/[0.05] hover:shadow-[0_0_50px_rgba(0,188,212,0.08)]'
          : 'border-white/8 hover:border-white/15 hover:bg-white/[0.05]'
      }`}
    >
      {/* Subtle top edge glow for active books */}
      {isAvailable && (
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--arc-brand-atlantean-teal)]/40 to-transparent"
          aria-hidden="true"
        />
      )}

      <div className={`p-6 ${isFeature ? 'md:p-8' : ''}`}>
        <div className="mb-4 flex items-start justify-between gap-3">
          <span
            className={`font-mono ${isFeature ? 'text-3xl text-[var(--arc-brand-atlantean-teal)]/40' : 'text-xl text-[var(--arc-brand-atlantean-teal)]/30'}`}
            aria-hidden="true"
          >
            {book.gateSymbol}
          </span>
          <StatusBadge status={book.status} />
        </div>

        <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">
          {book.subtitle}
        </p>
        <h3
          className={`font-display font-bold tracking-tight text-white/90 ${
            isFeature ? 'text-2xl md:text-3xl' : 'text-lg'
          }`}
        >
          {book.title}
        </h3>

        <p
          className={`mt-3 leading-relaxed text-white/65 ${isFeature ? 'text-sm md:text-base' : 'text-sm'}`}
        >
          {book.description}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-white/50">
          {book.chapterCount > 0 && <span>{book.chapterCount} chapters</span>}
          <span>{book.wordCount} words</span>
        </div>

        {(isAvailable || isPartial) && (
          <div className="mt-6">
            {isAvailable ? (
              <Link
                href={book.firstChapter}
                className="inline-flex items-center gap-2 rounded-full border border-[var(--arc-brand-atlantean-teal)]/25 bg-[var(--arc-brand-atlantean-teal)]/8 px-5 py-2.5 text-sm font-medium text-[var(--arc-brand-atlantean-teal)] transition-all hover:border-[var(--arc-brand-atlantean-teal)]/45 hover:bg-[var(--arc-brand-atlantean-teal)]/15 hover:shadow-[0_0_24px_rgba(0,188,212,0.12)]"
              >
                {book.chapterCount >= 10 ? 'Read Now' : 'Continue Reading'}
                <svg
                  className="h-3.5 w-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ) : (
              <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/8 px-5 py-2.5 text-sm font-medium text-amber-400/70">
                Outlined — Coming Soon
              </span>
            )}
          </div>
        )}
      </div>
    </GlowCard>
  );
}
