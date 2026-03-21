'use client';

import { useState } from 'react';
import type { MediaCardProps } from '@/lib/command-center/types';

const ELEMENT_COLORS: Record<string, string> = {
  Earth: '#22c55e',
  Water: '#3b82f6',
  Fire: '#ef4444',
  Wind: '#a855f7',
  Void: '#ffd700',
};

const STATUS_BG: Record<string, string> = {
  new: 'bg-blue-500/20 text-blue-300',
  classified: 'bg-purple-500/20 text-purple-300',
  processed: 'bg-cyan-500/20 text-cyan-300',
  scored: 'bg-yellow-500/20 text-yellow-300',
  approved: 'bg-green-500/20 text-green-300',
  rejected: 'bg-red-500/20 text-red-300',
  published: 'bg-[#7fffd4]/20 text-[#7fffd4]',
};

function qualityColor(score: number): string {
  if (score >= 80) return '#22c55e';
  if (score >= 60) return '#3b82f6';
  if (score >= 40) return '#eab308';
  return '#ef4444';
}

export function MediaCard({
  asset,
  selected = false,
  onClick,
  onSelect,
  onAction,
  compact = false,
}: MediaCardProps) {
  const [imgError, setImgError] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const imageUrl = asset.storage_url;
  const hasImage = imageUrl && !imgError;

  return (
    <div
      className={`
        group relative bg-white/5 backdrop-blur-sm border rounded-xl overflow-hidden
        transition-all duration-200 cursor-pointer
        ${selected ? 'border-[#7fffd4]/60 ring-1 ring-[#7fffd4]/30' : 'border-white/10'}
        hover:border-[#7fffd4]/30
      `}
      onClick={() => onClick?.(asset)}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Selection checkbox */}
      {onSelect && (
        <button
          className={`
            absolute top-2 left-2 z-10 w-5 h-5 rounded border-2 flex items-center justify-center
            transition-all duration-150
            ${
              selected
                ? 'bg-[#7fffd4] border-[#7fffd4] text-[#0a0e1a]'
                : 'border-white/30 bg-black/40 hover:border-white/60'
            }
          `}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(asset, !selected);
          }}
        >
          {selected && (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </button>
      )}

      {/* Quality score badge */}
      {asset.quality_score != null && (
        <div
          className="absolute top-2 right-2 z-10 px-2 py-0.5 rounded-full text-xs font-bold"
          style={{
            backgroundColor: `${qualityColor(asset.quality_score)}20`,
            color: qualityColor(asset.quality_score),
          }}
        >
          {asset.quality_score}
        </div>
      )}

      {/* Thumbnail */}
      <div className="aspect-square bg-white/5 relative overflow-hidden">
        {hasImage ? (
          <img
            src={imageUrl}
            alt={asset.filename}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/20">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
        )}
      </div>

      {/* Info section */}
      <div className="p-3 space-y-2">
        <p className="text-xs text-white/80 truncate font-medium">
          {asset.filename}
        </p>

        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Status badge */}
          <span
            className={`text-[10px] px-1.5 py-0.5 rounded-full ${STATUS_BG[asset.status] ?? 'bg-white/10 text-white/60'}`}
          >
            {asset.status}
          </span>

          {/* Guardian tag */}
          {asset.guardian && (
            <span
              className="text-[10px] px-1.5 py-0.5 rounded-full"
              style={{
                backgroundColor: `${ELEMENT_COLORS[asset.element ?? ''] ?? '#6b7280'}15`,
                color: ELEMENT_COLORS[asset.element ?? ''] ?? '#9ca3af',
              }}
            >
              {asset.guardian}
            </span>
          )}

          {/* Quality tier */}
          {asset.quality_tier && asset.quality_tier !== 'unscored' && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/5 text-white/50 capitalize">
              {asset.quality_tier}
            </span>
          )}
        </div>

        {/* Quick actions */}
        {!compact && onAction && (
          <div className="flex gap-1 pt-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <ActionButton
              label="Approve"
              color="#22c55e"
              onClick={(e) => {
                e.stopPropagation();
                onAction(asset, 'approve');
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </ActionButton>
            <ActionButton
              label="Reject"
              color="#ef4444"
              onClick={(e) => {
                e.stopPropagation();
                onAction(asset, 'reject');
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </ActionButton>
            <ActionButton
              label="Reclassify"
              color="#3b82f6"
              onClick={(e) => {
                e.stopPropagation();
                onAction(asset, 'reclassify');
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="23 4 23 10 17 10" />
                <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" />
              </svg>
            </ActionButton>
          </div>
        )}
      </div>

      {/* Hover tooltip with full metadata */}
      {showTooltip && asset.ai_description && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 pointer-events-none">
          <div className="bg-[#0a0e1a] border border-white/20 rounded-lg p-3 max-w-64 shadow-xl">
            <p className="text-xs text-white/70 leading-relaxed">
              {asset.ai_description}
            </p>
            {asset.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {asset.tags.slice(0, 5).map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-white/50"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Action button atom
// ---------------------------------------------------------------------------

function ActionButton({
  label,
  color,
  onClick,
  children,
}: {
  label: string;
  color: string;
  onClick: (e: React.MouseEvent) => void;
  children: React.ReactNode;
}) {
  return (
    <button
      title={label}
      onClick={onClick}
      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
      style={{ color }}
    >
      {children}
    </button>
  );
}
