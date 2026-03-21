'use client';

import { useCallback, useState } from 'react';
import {
  useAssets,
  useApproveAsset,
  useRejectAsset,
  useBulkApprove,
} from '@/lib/command-center/hooks';
import { MediaCard } from '@/components/command-center/MediaCard';
import type {
  AssetMetadata,
  AssetStatus,
  Guardian,
  Element,
  QualityTier,
  InboxFilter,
} from '@/lib/command-center/types';

const GUARDIANS: Guardian[] = [
  'Lyssandria', 'Leyla', 'Draconia', 'Maylinn', 'Alera',
  'Lyria', 'Aiyami', 'Elara', 'Ino', 'Shinkami',
];

const ELEMENTS: Element[] = ['Earth', 'Water', 'Fire', 'Wind', 'Void'];

const INBOX_STATUSES: AssetStatus[] = [
  'new', 'classified', 'processed', 'scored',
];

const QUALITY_TIERS: QualityTier[] = ['hero', 'gallery', 'thumbnail', 'reject'];

export default function InboxPage() {
  const [filter, setFilter] = useState<InboxFilter>({});
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [expandedAsset, setExpandedAsset] = useState<AssetMetadata | null>(null);
  const [search, setSearch] = useState('');

  const activeFilter: InboxFilter = {
    ...filter,
    search: search || undefined,
  };

  const { assets, loading, total } = useAssets(activeFilter);
  const { approve } = useApproveAsset();
  const { reject } = useRejectAsset();
  const { bulkApprove, loading: bulkLoading } = useBulkApprove();

  const toggleSelect = useCallback(
    (asset: AssetMetadata, selected: boolean) => {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        if (selected) next.add(asset.id);
        else next.delete(asset.id);
        return next;
      });
    },
    []
  );

  const handleAction = useCallback(
    async (asset: AssetMetadata, action: string) => {
      if (action === 'approve') await approve(asset.id);
      if (action === 'reject') await reject(asset.id);
    },
    [approve, reject]
  );

  const handleBulkApproveHero = useCallback(async () => {
    const heroIds = assets
      .filter((a) => a.quality_tier === 'hero')
      .map((a) => a.id);
    if (heroIds.length > 0) await bulkApprove(heroIds);
  }, [assets, bulkApprove]);

  const handleBulkRejectSelected = useCallback(async () => {
    // Reject each selected individually (no bulk reject helper needed)
    for (const id of selectedIds) {
      await reject(id);
    }
    setSelectedIds(new Set());
  }, [selectedIds, reject]);

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1
            className="text-2xl font-bold text-white"
            style={{ fontFamily: 'Cinzel, serif' }}
          >
            Inbox
          </h1>
          <p className="text-sm text-white/50 mt-0.5">
            {total} asset{total !== 1 ? 's' : ''} awaiting review
          </p>
        </div>

        {/* Bulk actions */}
        <div className="flex gap-2">
          <button
            onClick={handleBulkApproveHero}
            disabled={bulkLoading}
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 transition-colors disabled:opacity-50"
          >
            Approve All Hero
          </button>
          {selectedIds.size > 0 && (
            <button
              onClick={handleBulkRejectSelected}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors"
            >
              Reject Selected ({selectedIds.size})
            </button>
          )}
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap gap-2 items-center">
        <FilterSelect
          label="Status"
          value={filter.status ?? ''}
          options={INBOX_STATUSES}
          onChange={(v) =>
            setFilter((f) => ({
              ...f,
              status: (v as AssetStatus) || undefined,
            }))
          }
        />
        <FilterSelect
          label="Guardian"
          value={filter.guardian ?? ''}
          options={GUARDIANS}
          onChange={(v) =>
            setFilter((f) => ({
              ...f,
              guardian: (v as Guardian) || undefined,
            }))
          }
        />
        <FilterSelect
          label="Element"
          value={filter.element ?? ''}
          options={ELEMENTS}
          onChange={(v) =>
            setFilter((f) => ({
              ...f,
              element: (v as Element) || undefined,
            }))
          }
        />
        <FilterSelect
          label="Quality"
          value={filter.quality_tier ?? ''}
          options={QUALITY_TIERS}
          onChange={(v) =>
            setFilter((f) => ({
              ...f,
              quality_tier: (v as QualityTier) || undefined,
            }))
          }
        />

        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Search assets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#7fffd4]/40"
          />
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="bg-white/5 border border-white/10 rounded-xl aspect-square animate-pulse"
            />
          ))}
        </div>
      ) : assets.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-xl p-12 text-center">
          <p className="text-white/40 text-sm">
            No assets match the current filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {assets.map((asset) => (
            <MediaCard
              key={asset.id}
              asset={asset}
              selected={selectedIds.has(asset.id)}
              onClick={setExpandedAsset}
              onSelect={toggleSelect}
              onAction={handleAction}
            />
          ))}
        </div>
      )}

      {/* Expanded modal */}
      {expandedAsset && (
        <AssetModal
          asset={expandedAsset}
          onClose={() => setExpandedAsset(null)}
          onApprove={async () => {
            await approve(expandedAsset.id);
            setExpandedAsset(null);
          }}
          onReject={async () => {
            await reject(expandedAsset.id);
            setExpandedAsset(null);
          }}
        />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Filter select
// ---------------------------------------------------------------------------

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="px-3 py-2 text-xs rounded-lg bg-white/5 border border-white/10 text-white/70 focus:outline-none focus:border-[#7fffd4]/40 appearance-none cursor-pointer"
    >
      <option value="">{label}: All</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
}

// ---------------------------------------------------------------------------
// Asset detail modal
// ---------------------------------------------------------------------------

function AssetModal({
  asset,
  onClose,
  onApprove,
  onReject,
}: {
  asset: AssetMetadata;
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#0d1117] border border-white/10 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image */}
        {asset.storage_url && (
          <div className="relative aspect-video bg-black rounded-t-2xl overflow-hidden">
            <img
              src={asset.storage_url}
              alt={asset.filename}
              className="w-full h-full object-contain"
            />
          </div>
        )}

        <div className="p-6 space-y-4">
          {/* Title + status */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-white">
                {asset.filename}
              </h2>
              <p className="text-xs text-white/40 mt-0.5">
                {asset.mime_type} &middot;{' '}
                {asset.width && asset.height
                  ? `${asset.width}x${asset.height}`
                  : 'unknown size'}{' '}
                &middot; {formatBytes(asset.file_size)}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Metadata grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <MetaField label="Status" value={asset.status} />
            <MetaField label="Quality" value={asset.quality_score != null ? `${asset.quality_score}/100` : 'Unscored'} />
            <MetaField label="Tier" value={asset.quality_tier} />
            <MetaField label="Guardian" value={asset.guardian ?? 'Unassigned'} />
            <MetaField label="Element" value={asset.element ?? 'None'} />
            <MetaField label="Gate" value={asset.gate ?? 'None'} />
            <MetaField label="Storage" value={asset.storage_tier} />
            <MetaField label="Agent" value={asset.source_agent ?? 'Manual'} />
          </div>

          {/* AI description */}
          {asset.ai_description && (
            <div>
              <p className="text-[11px] text-white/40 uppercase tracking-wider mb-1">
                AI Description
              </p>
              <p className="text-sm text-white/70 leading-relaxed">
                {asset.ai_description}
              </p>
            </div>
          )}

          {/* Tags */}
          {asset.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {asset.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] px-2 py-0.5 rounded-full bg-white/5 text-white/50"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={onApprove}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 transition-colors"
            >
              Approve
            </button>
            <button
              onClick={onReject}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors"
            >
              Reject
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function MetaField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] text-white/30 uppercase tracking-wider">
        {label}
      </p>
      <p className="text-white/70 capitalize mt-0.5">{value}</p>
    </div>
  );
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
