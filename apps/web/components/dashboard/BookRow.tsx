import Link from 'next/link';
import {
  Star,
  Award,
  ExternalLink,
  Edit3,
  Sparkles,
} from 'lucide-react';
import type { AuthorBook } from '@/lib/dashboard/queries';

interface BookRowProps {
  book: AuthorBook;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}w ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

const STATUS_STYLES: Record<AuthorBook['status'], string> = {
  draft: 'bg-white/[0.06] text-white/60 border-white/[0.1]',
  'in-progress': 'bg-amber-500/10 text-amber-300 border-amber-500/20',
  complete: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
  archived: 'bg-white/[0.03] text-white/30 border-white/[0.08]',
};

const TIER_STYLES: Record<AuthorBook['tier'], string> = {
  community: 'bg-[#0d47a1]/20 text-sky-300 border-sky-500/20',
  featured: 'bg-[#ffd700]/10 text-[#ffd700] border-[#ffd700]/20',
  canon: 'bg-violet-500/10 text-violet-300 border-violet-500/20',
};

function guardianGrade(score: number | null): { label: string; color: string } | null {
  if (score === null || score === undefined) return null;
  if (score >= 90) return { label: 'A+', color: 'text-[#ffd700]' };
  if (score >= 85) return { label: 'A', color: 'text-[#ffd700]' };
  if (score >= 80) return { label: 'A-', color: 'text-amber-300' };
  if (score >= 75) return { label: 'B+', color: 'text-[#00bcd4]' };
  if (score >= 70) return { label: 'B', color: 'text-[#00bcd4]' };
  if (score >= 65) return { label: 'B-', color: 'text-sky-300' };
  if (score >= 60) return { label: 'C+', color: 'text-white/60' };
  if (score >= 50) return { label: 'C', color: 'text-white/50' };
  return { label: 'D', color: 'text-white/40' };
}

export function BookRow({ book }: BookRowProps) {
  const grade = guardianGrade(book.guardian_score);
  const githubUrl = `https://github.com/frankxai/arcanea-ai-app/tree/main/book/${book.slug}`;
  const featuredIssueUrl = `https://github.com/frankxai/arcanea-ai-app/issues/new?template=feature_request.md&title=Request+Featured:+${encodeURIComponent(book.title)}&labels=request-featured`;

  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 sm:p-5 rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm transition-all hover:border-white/[0.12] hover:bg-white/[0.05]">
      {/* Cover */}
      <Link
        href={`/books/drafts/${book.slug}`}
        className="flex-shrink-0 w-20 h-[120px] rounded-lg overflow-hidden bg-white/[0.04] border border-white/[0.06] self-center sm:self-start"
      >
        {book.cover_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={book.cover_url}
            alt={`${book.title} cover`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/20">
            <Sparkles size={24} />
          </div>
        )}
      </Link>

      {/* Main content */}
      <div className="flex-1 min-w-0 flex flex-col">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="min-w-0">
            <Link
              href={`/books/drafts/${book.slug}`}
              className="block font-display text-lg font-semibold text-white/95 hover:text-[#00bcd4] transition-colors truncate"
            >
              {book.title}
            </Link>
            {book.subtitle && (
              <p className="text-sm text-white/40 truncate font-serif italic">
                {book.subtitle}
              </p>
            )}
          </div>
          <span className="text-[10px] text-white/30 flex-shrink-0 whitespace-nowrap">
            {timeAgo(book.updated_at)}
          </span>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap items-center gap-1.5 mb-3">
          <span
            className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md border ${STATUS_STYLES[book.status]}`}
          >
            {book.status.replace('-', ' ')}
          </span>
          <span
            className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md border ${TIER_STYLES[book.tier]}`}
          >
            {book.tier}
          </span>

          {(book.rating_count ?? 0) > 0 && (
            <span className="inline-flex items-center gap-1 text-xs text-white/60 px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.06]">
              <Star size={12} className="text-[#ffd700]" fill="currentColor" />
              <span className="tabular-nums">
                {(book.star_average ?? 0).toFixed(1)}
              </span>
              <span className="text-white/40 tabular-nums">
                ({book.rating_count})
              </span>
            </span>
          )}

          {grade && (
            <span
              className={`inline-flex items-center gap-1 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md border border-white/[0.1] bg-white/[0.04] ${grade.color}`}
              title={`Guardian score: ${book.guardian_score}`}
            >
              <Award size={11} />
              {grade.label}
            </span>
          )}
        </div>

        {/* Quick actions */}
        <div className="flex flex-wrap gap-2 mt-auto text-xs">
          <Link
            href={`/books/drafts/${book.slug}`}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#00bcd4]/10 text-[#00bcd4] border border-[#00bcd4]/20 hover:bg-[#00bcd4]/15 transition-colors"
          >
            View
          </Link>
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.04] text-white/60 border border-white/[0.08] hover:bg-white/[0.08] hover:text-white/80 transition-colors"
          >
            <Edit3 size={12} />
            Edit
          </a>
          <Link
            href={`/books/drafts/${book.slug}#reviews`}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.04] text-white/60 border border-white/[0.08] hover:bg-white/[0.08] hover:text-white/80 transition-colors"
          >
            <Star size={12} />
            Reviews
          </Link>
          {book.tier === 'community' && (
            <a
              href={featuredIssueUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#ffd700]/10 text-[#ffd700] border border-[#ffd700]/20 hover:bg-[#ffd700]/15 transition-colors"
            >
              <Sparkles size={12} />
              Request featured
              <ExternalLink size={10} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
