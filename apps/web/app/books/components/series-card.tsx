import Link from 'next/link';
import type { BookSeries } from '@/lib/saga/loader';
import { GlowCard } from '@/components/saga/glow-card';
import {
  SERIES_ACCENTS,
  DEFAULT_ACCENT,
  CONTENT_TYPE_LABELS,
  SERIES_STATUS_STYLES,
  SERIES_BOOKID_MAP,
} from '../books-data';

export function SeriesCard({ series }: { series: BookSeries }) {
  const accent = SERIES_ACCENTS[series.id] ?? DEFAULT_ACCENT;
  const statusStyle = SERIES_STATUS_STYLES[series.status];
  const hasContent = series.totalChapters > 0;

  // Build first-chapter href using the registered [bookId] for this series.
  let firstChapterHref: string | null = null;
  const bookId = SERIES_BOOKID_MAP[series.id] ?? series.id;
  for (const book of series.books) {
    if (book.firstChapterSlug) {
      firstChapterHref = `/books/${bookId}/${book.firstChapterSlug}`;
      break;
    }
  }

  return (
    <GlowCard
      className={`group overflow-hidden rounded-xl border bg-white/[0.025] transition-all duration-300 ${accent.border} ${accent.hover}`}
    >
      {/* Top edge glow */}
      {hasContent && (
        <div
          className={`pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r ${accent.topEdge}`}
          aria-hidden="true"
        />
      )}

      <div className="p-6">
        {/* Header row */}
        <div className="mb-4 flex items-start justify-between gap-3">
          <span className={`font-mono text-2xl ${accent.badgeText}/40`} aria-hidden="true">
            {accent.symbol}
          </span>
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] ${statusStyle.bg} ${statusStyle.text}`}
          >
            {statusStyle.label}
          </span>
        </div>

        {/* Content type */}
        <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">
          {CONTENT_TYPE_LABELS[series.contentType]}
        </p>

        {/* Title */}
        <h3 className="font-display text-lg font-bold tracking-tight text-white/90">
          {series.title}
        </h3>
        <p className={`mt-0.5 text-[11px] ${accent.badgeText}/60`}>
          {series.subtitle}
        </p>

        {/* Description */}
        <p className="mt-3 text-sm leading-relaxed text-white/60">
          {series.description}
        </p>

        {/* Stats */}
        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-white/50">
          {hasContent ? (
            <>
              <span>{series.totalChapters} chapter{series.totalChapters !== 1 ? 's' : ''}</span>
              <span className="text-white/20" aria-hidden="true">|</span>
              <span>~{Math.round(series.totalWordCount / 1000)}K words</span>
            </>
          ) : (
            <span>Coming soon</span>
          )}
        </div>

        {/* CTA */}
        <div className="mt-5">
          {hasContent && firstChapterHref ? (
            <Link
              href={firstChapterHref}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium transition-all ${accent.badge} ${accent.badgeText} hover:opacity-80`}
            >
              Read Now
              <svg
                className="h-3 w-3"
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
            <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-medium text-white/25">
              Coming Soon
            </span>
          )}
        </div>
      </div>
    </GlowCard>
  );
}
