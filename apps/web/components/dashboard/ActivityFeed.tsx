import Link from 'next/link';
import {
  Star,
  MessageSquare,
  Award,
  Sparkles,
  BookOpen,
  Activity as ActivityIcon,
} from 'lucide-react';
import type { ActivityEvent, ActivityEventType } from '@/lib/dashboard/queries';

interface ActivityFeedProps {
  events: ActivityEvent[];
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
  return `${Math.floor(days / 7)}w ago`;
}

const ICON_MAP: Record<
  ActivityEventType,
  { icon: typeof Star; color: string; bg: string }
> = {
  rating: { icon: Star, color: 'text-[#ffd700]', bg: 'bg-[#ffd700]/10' },
  review: {
    icon: MessageSquare,
    color: 'text-[#00bcd4]',
    bg: 'bg-[#00bcd4]/10',
  },
  guardian_review: {
    icon: Award,
    color: 'text-violet-300',
    bg: 'bg-violet-500/10',
  },
  tier_promoted: {
    icon: Sparkles,
    color: 'text-[#ffd700]',
    bg: 'bg-[#ffd700]/10',
  },
  chapter_published: {
    icon: BookOpen,
    color: 'text-emerald-300',
    bg: 'bg-emerald-500/10',
  },
};

function renderEventText(event: ActivityEvent): React.ReactNode {
  const titleLink = (
    <Link
      href={`/books/drafts/${event.bookSlug}`}
      className="text-white/90 hover:text-[#00bcd4] transition-colors font-medium"
    >
      {event.bookTitle}
    </Link>
  );

  switch (event.type) {
    case 'rating':
      return (
        <span className="text-white/60">
          {event.stars}-star rating on {titleLink}
        </span>
      );
    case 'review':
      return (
        <span className="text-white/60">
          {event.stars} stars on {titleLink}
          {event.reviewText && (
            <span className="block mt-1 text-white/45 italic text-xs line-clamp-2">
              &ldquo;{event.reviewText}&rdquo;
            </span>
          )}
        </span>
      );
    case 'guardian_review':
      return (
        <span className="text-white/60">
          <span className="capitalize">{event.guardian}</span> reviewed{' '}
          {titleLink} on {event.dimension}
          {event.score !== undefined && (
            <span className="ml-1 text-violet-300 font-mono">
              ({event.score})
            </span>
          )}
        </span>
      );
    case 'chapter_published':
      return (
        <span className="text-white/60">
          Chapter published:{' '}
          <span className="text-white/80">{event.chapterTitle}</span> in{' '}
          {titleLink}
        </span>
      );
    case 'tier_promoted':
      return (
        <span className="text-white/60">
          {titleLink} promoted to{' '}
          <span className="text-[#ffd700] font-medium">{event.newTier}</span>
        </span>
      );
    default:
      return <span className="text-white/60">Activity on {titleLink}</span>;
  }
}

export function ActivityFeed({ events }: ActivityFeedProps) {
  if (events.length === 0) {
    return (
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm p-8 text-center">
        <div className="mx-auto w-12 h-12 rounded-xl bg-white/[0.04] flex items-center justify-center mb-3">
          <ActivityIcon size={20} className="text-white/30" />
        </div>
        <p className="text-sm text-white/50">No activity yet</p>
        <p className="text-xs text-white/30 mt-1">
          Ratings, reviews, and Guardian feedback will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm divide-y divide-white/[0.04]">
      {events.map((event) => {
        const { icon: Icon, color, bg } = ICON_MAP[event.type];
        return (
          <div
            key={event.id}
            className="flex items-start gap-3 px-5 py-4 transition-colors hover:bg-white/[0.02]"
          >
            <div
              className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}
            >
              <Icon size={16} className={color} strokeWidth={1.75} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm leading-snug">{renderEventText(event)}</p>
              <p className="text-[11px] text-white/30 mt-1 font-sans">
                {timeAgo(event.createdAt)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
