'use client';

/**
 * ReviewListClient — client-side review list with expand + load more.
 *
 * Kept separate from the server ReviewList so the parent can stay a server
 * component and fetch data on the server.
 */

import { useState, useMemo } from 'react';
import { StarRating } from './StarRating';

export interface ReviewItem {
  id: string;
  stars: number;
  review: string | null;
  displayName: string;
  avatarUrl: string | null;
  createdAt: string;
}

export interface ReviewListClientProps {
  ratings: ReviewItem[];
  limit?: number;
}

const EXPAND_THRESHOLD = 280;

function formatTimeAgo(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return '';
  const seconds = Math.max(0, Math.floor((Date.now() - then) / 1000));
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days === 1 ? '' : 's'} ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months === 1 ? '' : 's'} ago`;
  const years = Math.floor(days / 365);
  return `${years} year${years === 1 ? '' : 's'} ago`;
}

function Avatar({ name, url }: { name: string; url: string | null }) {
  if (url) {
    /* eslint-disable-next-line @next/next/no-img-element */
    return (
      <img
        src={url}
        alt={`${name} avatar`}
        className="w-10 h-10 rounded-full object-cover border border-white/[0.08]"
      />
    );
  }
  const initial = name.trim().charAt(0).toUpperCase() || 'A';
  return (
    <div className="w-10 h-10 rounded-full bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-sm font-medium text-white/60">
      {initial}
    </div>
  );
}

function ReviewCard({ item }: { item: ReviewItem }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = (item.review?.length ?? 0) > EXPAND_THRESHOLD;
  const display =
    !isLong || expanded
      ? item.review ?? ''
      : `${item.review!.slice(0, EXPAND_THRESHOLD).trimEnd()}...`;

  return (
    <article className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-5 backdrop-blur-sm">
      <header className="flex items-start gap-3">
        <Avatar name={item.displayName} url={item.avatarUrl} />
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-white/90 truncate">
              {item.displayName}
            </span>
            <span className="text-xs text-white/30">
              {formatTimeAgo(item.createdAt)}
            </span>
          </div>
          <div className="mt-1">
            <StarRating value={item.stars} size="sm" />
          </div>
        </div>
      </header>

      {item.review && (
        <div className="mt-3 pl-[52px]">
          <p className="text-sm text-white/70 leading-relaxed whitespace-pre-wrap">
            {display}
          </p>
          {isLong && (
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="mt-2 text-xs text-[#00bcd4] hover:text-[#00bcd4]/80 transition-colors"
            >
              {expanded ? 'Show less' : 'Show more'}
            </button>
          )}
        </div>
      )}
    </article>
  );
}

export function ReviewListClient({ ratings, limit = 10 }: ReviewListClientProps) {
  const [visibleCount, setVisibleCount] = useState(limit);

  const visible = useMemo(
    () => ratings.slice(0, visibleCount),
    [ratings, visibleCount],
  );
  const hasMore = ratings.length > visibleCount;

  return (
    <div className="space-y-4">
      {visible.map((item) => (
        <ReviewCard key={item.id} item={item} />
      ))}

      {hasMore && (
        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => setVisibleCount((n) => n + limit)}
            className="px-5 py-2 text-xs font-medium text-white/60 border border-white/[0.08] rounded-lg hover:text-white/90 hover:border-white/[0.16] transition-colors"
          >
            Load {Math.min(limit, ratings.length - visibleCount)} more
          </button>
        </div>
      )}
    </div>
  );
}

export default ReviewListClient;
