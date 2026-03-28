'use client';

import { useState, useRef, useEffect } from 'react';
import type { Creation } from '@/lib/database/types/api-responses';
import {
  DotsThreeVertical,
  PencilSimple,
  Trash,
  Eye,
  Copy,
  Link,
  Stack,
} from '@/lib/phosphor-icons';

// ── Element colors ──────────────────────────────────────────────────────────

const ELEMENT_COLORS: Record<string, string> = {
  Fire: '#ef4444',
  Water: '#3b82f6',
  Earth: '#22c55e',
  Wind: '#e2e8f0',
  Void: '#8b5cf6',
  Spirit: '#fbbf24',
};

const STATUS_STYLES: Record<string, { label: string; bg: string; text: string }> = {
  draft: { label: 'Draft', bg: 'bg-white/[0.06]', text: 'text-white/50' },
  published: { label: 'Published', bg: 'bg-teal-400/10', text: 'text-teal-400' },
  archived: { label: 'Archived', bg: 'bg-amber-400/10', text: 'text-amber-400' },
};

const TYPE_ICONS: Record<string, string> = {
  text: '\u2710',
  image: '\u25A3',
  video: '\u25B6',
  audio: '\u266B',
  code: '\u2318',
  mixed: '\u2726',
};

// ── Helpers ─────────────────────────────────────────────────────────────────

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return 'now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return 'yesterday';
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// ── Props ───────────────────────────────────────────────────────────────────

interface CreationCardProps {
  creation: Creation;
  onEdit: (creation: Creation) => void;
  onDelete: (id: string) => void;
  onTogglePublish: (id: string, newStatus: 'draft' | 'published') => void;
  onAddToCollection: (id: string) => void;
}

// ── Component ───────────────────────────────────────────────────────────────

export function CreationCard({
  creation,
  onEdit,
  onDelete,
  onTogglePublish,
  onAddToCollection,
}: CreationCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [menuOpen]);

  const elementColor = creation.element ? ELEMENT_COLORS[creation.element] : '#7fffd4';
  const status = STATUS_STYLES[creation.status] || STATUS_STYLES.draft;
  const typeIcon = TYPE_ICONS[creation.type] || '\u2726';

  return (
    <div
      className="group relative rounded-xl border border-white/5 bg-[#0d0d14] hover:border-white/10 transition-all cursor-pointer"
      style={{ borderTopColor: elementColor, borderTopWidth: '2px' }}
      onClick={() => onEdit(creation)}
    >
      <div className="p-4 space-y-3">
        {/* Header: type icon + title */}
        <div className="flex items-start gap-2">
          <span className="text-base mt-0.5 shrink-0" style={{ color: elementColor }}>
            {typeIcon}
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-medium text-white/90 truncate leading-tight">
              {creation.title}
            </h3>
            {creation.description && (
              <p className="text-xs text-white/40 mt-1 line-clamp-2 leading-relaxed">
                {creation.description}
              </p>
            )}
          </div>

          {/* Actions menu trigger */}
          <div ref={menuRef} className="relative shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen((v) => !v);
              }}
              className="w-6 h-6 flex items-center justify-center rounded text-white/20 hover:text-white/50 hover:bg-white/5 opacity-0 group-hover:opacity-100 transition-all"
              aria-label="Actions"
            >
              <DotsThreeVertical className="w-4 h-4" />
            </button>

            {/* Dropdown menu */}
            {menuOpen && (
              <div className="absolute right-0 top-7 z-20 w-44 rounded-lg bg-[#16161e] border border-white/[0.08] shadow-xl py-1">
                <MenuButton
                  icon={<PencilSimple className="w-3.5 h-3.5" />}
                  label="Edit"
                  onClick={() => { onEdit(creation); setMenuOpen(false); }}
                />
                <MenuButton
                  icon={<Eye className="w-3.5 h-3.5" />}
                  label={creation.status === 'published' ? 'Unpublish' : 'Publish'}
                  onClick={() => {
                    onTogglePublish(creation.id, creation.status === 'published' ? 'draft' : 'published');
                    setMenuOpen(false);
                  }}
                />
                <MenuButton
                  icon={<Stack className="w-3.5 h-3.5" />}
                  label="Add to collection"
                  onClick={() => { onAddToCollection(creation.id); setMenuOpen(false); }}
                />
                <MenuButton
                  icon={<Copy className="w-3.5 h-3.5" />}
                  label="Copy link"
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/creations/${creation.id}`);
                    setMenuOpen(false);
                  }}
                />
                <div className="border-t border-white/[0.06] my-1" />
                <MenuButton
                  icon={<Trash className="w-3.5 h-3.5" />}
                  label="Delete"
                  onClick={() => { onDelete(creation.id); setMenuOpen(false); }}
                  danger
                />
              </div>
            )}
          </div>
        </div>

        {/* Tags */}
        {creation.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {creation.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="px-1.5 py-0.5 rounded text-[10px] text-white/30 bg-white/[0.04] border border-white/[0.06]"
              >
                {tag}
              </span>
            ))}
            {creation.tags.length > 4 && (
              <span className="text-[10px] text-white/20">+{creation.tags.length - 4}</span>
            )}
          </div>
        )}

        {/* Footer: status + time */}
        <div className="flex items-center justify-between">
          <span className={`text-[10px] px-1.5 py-0.5 rounded ${status.bg} ${status.text}`}>
            {status.label}
          </span>
          <span className="text-[10px] text-white/20">{relativeTime(creation.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}

// ── Menu button sub-component ───────────────────────────────────────────────

function MenuButton({
  icon,
  label,
  onClick,
  danger = false,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs transition-colors ${
        danger
          ? 'text-red-400/70 hover:text-red-400 hover:bg-red-400/10'
          : 'text-white/50 hover:text-white/80 hover:bg-white/[0.04]'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
