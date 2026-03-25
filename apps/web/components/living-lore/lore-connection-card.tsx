/**
 * LoreConnectionCard -- Small glass-morphism card linking to /library/ texts.
 */

import Link from 'next/link';
import { BookOpen } from '@/lib/phosphor-icons';

interface LoreConnectionCardProps {
  slug: string;
  title: string;
  collection: string;
  excerpt?: string;
}

// Collection icon mapping (subset of common collections)
const COLLECTION_ICONS: Record<string, string> = {
  'legends-of-arcanea': 'scroll',
  'chronicles-of-luminors': 'shield',
  'wisdom-scrolls': 'lightbulb',
  'laws-of-arcanea': 'scales',
  'academy-handbook': 'graduation-cap',
  'meditations-on-elements': 'spiral',
  'book-of-shadows': 'moon',
  'parables-of-creation': 'feather',
  'tales-of-creators': 'pen',
  'book-of-rituals': 'flame',
  'dialogues-of-masters': 'chat',
};

function collectionLabel(slug: string): string {
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export function LoreConnectionCard({
  slug,
  title,
  collection,
  excerpt,
}: LoreConnectionCardProps) {
  // slug format: "collection/text-slug" -- extract for the link
  const href = `/library/${slug}`;

  return (
    <Link
      href={href}
      className="group flex items-start gap-3 rounded-xl border bg-white/[0.03] border-white/[0.06] backdrop-blur-xl px-4 py-3 transition-all duration-300 hover:border-[#7fffd4]/20 hover:bg-white/[0.05]"
    >
      {/* Icon */}
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#7fffd4]/10 text-[#7fffd4] mt-0.5">
        <BookOpen size={16} weight="duotone" />
      </div>

      <div className="min-w-0 flex-1">
        {/* Collection label */}
        <p className="text-[10px] uppercase tracking-wider text-text-dim font-semibold mb-0.5">
          {collectionLabel(collection)}
        </p>

        {/* Title */}
        <p className="font-display text-sm font-semibold text-text-primary group-hover:text-[#7fffd4] transition-colors truncate">
          {title}
        </p>

        {/* Excerpt */}
        {excerpt && (
          <p className="font-body text-[11px] text-text-muted leading-relaxed line-clamp-2 mt-1">
            {excerpt}
          </p>
        )}
      </div>
    </Link>
  );
}
