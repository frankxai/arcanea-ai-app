'use client';

import { useState, useEffect, useRef } from 'react';
import type {
  Creation,
  CreationStatus,
  Visibility,
  ElementName,
  GateName,
} from '@/lib/database/types/api-responses';
import { X, Trash, CaretDown, Plus, Tag } from '@/lib/phosphor-icons';

// ── Constants ───────────────────────────────────────────────────────────────

const ELEMENTS: ElementName[] = ['Fire', 'Water', 'Earth', 'Wind', 'Void', 'Spirit'];
const GATES: GateName[] = [
  'Foundation', 'Flow', 'Fire', 'Heart', 'Voice',
  'Sight', 'Crown', 'Starweave', 'Unity', 'Source',
];
const STATUSES: { value: CreationStatus; label: string }[] = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'archived', label: 'Archived' },
];
const VISIBILITIES: { value: Visibility; label: string; desc: string }[] = [
  { value: 'private', label: 'Private', desc: 'Only you can see this' },
  { value: 'unlisted', label: 'Unlisted', desc: 'Anyone with the link' },
  { value: 'public', label: 'Public', desc: 'Visible on your profile' },
];

// ── Props ───────────────────────────────────────────────────────────────────

interface EditCreationModalProps {
  creation: Creation;
  collections: { id: string; title: string }[];
  onClose: () => void;
  onSave: (id: string, updates: Partial<Creation>) => Promise<void>;
  onDelete: (id: string) => void;
  onAddToCollection: (creationId: string, collectionId: string) => void;
}

// ── Component ───────────────────────────────────────────────────────────────

export function EditCreationModal({
  creation,
  collections,
  onClose,
  onSave,
  onDelete,
  onAddToCollection,
}: EditCreationModalProps) {
  const [title, setTitle] = useState(creation.title);
  const [description, setDescription] = useState(creation.description || '');
  const [tags, setTags] = useState<string[]>(creation.tags);
  const [newTag, setNewTag] = useState('');
  const [element, setElement] = useState<ElementName | ''>(creation.element || '');
  const [gate, setGate] = useState<GateName | ''>(creation.gate || '');
  const [status, setStatus] = useState<CreationStatus>(creation.status);
  const [visibility, setVisibility] = useState<Visibility>(creation.visibility);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState('');
  const overlayRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(creation.id, {
        title: title.trim(),
        description: description.trim() || null,
        tags,
        element: element || null,
        gate: gate || null,
        status,
        visibility,
      });
      onClose();
    } catch {
      // Error handled by parent
    } finally {
      setSaving(false);
    }
  };

  const addTag = () => {
    const t = newTag.trim().toLowerCase();
    if (t && !tags.includes(t) && tags.length < 10) {
      setTags([...tags, t]);
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const contentText = creation.content
    ? typeof creation.content.text === 'string'
      ? creation.content.text
      : JSON.stringify(creation.content, null, 2)
    : null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div className="w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto rounded-2xl bg-[#111113] border border-white/[0.08] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
          <h2 className="font-display text-lg text-white">Edit Creation</h2>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-white/30 hover:text-white/60 hover:bg-white/5 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-5 py-4 space-y-5">
          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-[11px] uppercase tracking-wider text-white/30 font-medium">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder-white/25 focus:outline-none focus:border-teal-400/30 transition-colors"
              placeholder="Creation title"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-[11px] uppercase tracking-wider text-white/30 font-medium">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder-white/25 focus:outline-none focus:border-teal-400/30 transition-colors resize-none"
              placeholder="A short description..."
            />
          </div>

          {/* Tags */}
          <div className="space-y-1.5">
            <label className="text-[11px] uppercase tracking-wider text-white/30 font-medium">Tags</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] text-white/50 bg-white/[0.06] border border-white/[0.06]"
                >
                  <Tag className="w-2.5 h-2.5" />
                  {tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="text-white/30 hover:text-white/60 ml-0.5"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
                placeholder="Add tag..."
                className="flex-1 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-xs text-white/60 placeholder-white/20 focus:outline-none focus:border-teal-400/30 transition-colors"
              />
              <button
                onClick={addTag}
                disabled={!newTag.trim() || tags.length >= 10}
                className="px-2 py-1.5 rounded-lg text-xs text-teal-400/60 hover:text-teal-400 hover:bg-teal-400/5 disabled:opacity-30 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Element + Gate row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider text-white/30 font-medium">Element</label>
              <div className="relative">
                <select
                  value={element}
                  onChange={(e) => setElement(e.target.value as ElementName | '')}
                  className="w-full appearance-none px-3 py-2 pr-8 rounded-lg bg-white/[0.04] border border-white/[0.06] text-xs text-white/60 focus:outline-none focus:border-teal-400/30 cursor-pointer"
                >
                  <option value="" className="bg-[#16161e]">None</option>
                  {ELEMENTS.map((e) => (
                    <option key={e} value={e} className="bg-[#16161e]">{e}</option>
                  ))}
                </select>
                <CaretDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-white/25 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider text-white/30 font-medium">Gate</label>
              <div className="relative">
                <select
                  value={gate}
                  onChange={(e) => setGate(e.target.value as GateName | '')}
                  className="w-full appearance-none px-3 py-2 pr-8 rounded-lg bg-white/[0.04] border border-white/[0.06] text-xs text-white/60 focus:outline-none focus:border-teal-400/30 cursor-pointer"
                >
                  <option value="" className="bg-[#16161e]">None</option>
                  {GATES.map((g) => (
                    <option key={g} value={g} className="bg-[#16161e]">{g}</option>
                  ))}
                </select>
                <CaretDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-white/25 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Status + Visibility row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider text-white/30 font-medium">Status</label>
              <div className="relative">
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as CreationStatus)}
                  className="w-full appearance-none px-3 py-2 pr-8 rounded-lg bg-white/[0.04] border border-white/[0.06] text-xs text-white/60 focus:outline-none focus:border-teal-400/30 cursor-pointer"
                >
                  {STATUSES.map(({ value: v, label }) => (
                    <option key={v} value={v} className="bg-[#16161e]">{label}</option>
                  ))}
                </select>
                <CaretDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-white/25 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider text-white/30 font-medium">Visibility</label>
              <div className="relative">
                <select
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value as Visibility)}
                  className="w-full appearance-none px-3 py-2 pr-8 rounded-lg bg-white/[0.04] border border-white/[0.06] text-xs text-white/60 focus:outline-none focus:border-teal-400/30 cursor-pointer"
                >
                  {VISIBILITIES.map(({ value: v, label }) => (
                    <option key={v} value={v} className="bg-[#16161e]">{label}</option>
                  ))}
                </select>
                <CaretDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-white/25 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Add to collection */}
          {collections.length > 0 && (
            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider text-white/30 font-medium">Add to Collection</label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <select
                    value={selectedCollection}
                    onChange={(e) => setSelectedCollection(e.target.value)}
                    className="w-full appearance-none px-3 py-2 pr-8 rounded-lg bg-white/[0.04] border border-white/[0.06] text-xs text-white/60 focus:outline-none focus:border-teal-400/30 cursor-pointer"
                  >
                    <option value="" className="bg-[#16161e]">Select collection...</option>
                    {collections.map((c) => (
                      <option key={c.id} value={c.id} className="bg-[#16161e]">{c.title}</option>
                    ))}
                  </select>
                  <CaretDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-white/25 pointer-events-none" />
                </div>
                <button
                  onClick={() => {
                    if (selectedCollection) {
                      onAddToCollection(creation.id, selectedCollection);
                      setSelectedCollection('');
                    }
                  }}
                  disabled={!selectedCollection}
                  className="px-3 py-2 rounded-lg text-xs text-teal-400/70 hover:text-teal-400 border border-teal-400/20 hover:bg-teal-400/5 disabled:opacity-30 transition-colors"
                >
                  Add
                </button>
              </div>
            </div>
          )}

          {/* View original content */}
          {contentText && (
            <div className="space-y-1.5">
              <button
                onClick={() => setShowContent((v) => !v)}
                className="text-[11px] uppercase tracking-wider text-white/30 font-medium hover:text-white/50 transition-colors"
              >
                {showContent ? 'Hide' : 'View'} original content
              </button>
              {showContent && (
                <div
                  className="max-h-48 overflow-y-auto rounded-lg bg-white/[0.02] border border-white/[0.06] p-3 text-xs text-white/40 whitespace-pre-wrap font-mono"
                  style={{ scrollbarWidth: 'thin' }}
                >
                  {contentText}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-white/[0.06]">
          <div>
            {confirmDelete ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-red-400/70">Delete permanently?</span>
                <button
                  onClick={() => onDelete(creation.id)}
                  className="px-3 py-1.5 rounded-lg text-xs text-red-400 bg-red-400/10 hover:bg-red-400/20 transition-colors"
                >
                  Yes, delete
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-white/40 hover:text-white/60 transition-colors"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmDelete(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-red-400/50 hover:text-red-400 hover:bg-red-400/10 transition-colors"
              >
                <Trash className="w-3.5 h-3.5" />
                Delete
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs text-white/40 hover:text-white/60 hover:bg-white/[0.04] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !title.trim()}
              className="px-4 py-2 rounded-lg text-xs font-medium text-white bg-teal-400/20 border border-teal-400/30 hover:bg-teal-400/30 disabled:opacity-40 transition-colors"
            >
              {saving ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
