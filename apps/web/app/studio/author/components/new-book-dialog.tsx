'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const GENRES = [
  { value: 'fantasy', label: 'Fantasy' },
  { value: 'sci-fi', label: 'Science Fiction' },
  { value: 'romance', label: 'Romance' },
  { value: 'thriller', label: 'Thriller' },
  { value: 'literary-fiction', label: 'Literary Fiction' },
  { value: 'horror', label: 'Horror' },
] as const;

export function NewBookDialog() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('fantasy');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  const handleCreate = async () => {
    if (!title.trim()) return;
    setCreating(true);
    setError(null);
    try {
      const res = await fetch('/api/author/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim(), slug, genre }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to create book');
        return;
      }
      if (data.redirect) {
        router.push(data.redirect);
      }
    } catch (e) {
      console.error('Create failed:', e);
      setError('Network error — please try again');
    } finally {
      setCreating(false);
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full rounded-2xl border-2 border-dashed border-white/[0.08] hover:border-[#00bcd4]/30 bg-transparent hover:bg-[#00bcd4]/[0.02] transition-all p-8 text-center group"
      >
        <div className="text-2xl text-white/10 group-hover:text-[#00bcd4]/30 mb-2">+</div>
        <div className="font-display text-sm text-white/30 group-hover:text-white/50">
          Start a New Book
        </div>
        <div className="text-[10px] text-white/15 mt-1">Create in 10 seconds</div>
      </button>
    );
  }

  return (
    <div className="rounded-2xl border border-[#00bcd4]/20 bg-white/[0.02] backdrop-blur-sm p-6 space-y-4">
      <h3 className="font-display text-sm font-semibold text-white/70">New Book</h3>

      <input
        autoFocus
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
        placeholder="Your book title..."
        className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-sm text-white/80 placeholder:text-white/20 focus:outline-none focus:border-[#00bcd4]/30"
      />

      <select
        value={genre}
        onChange={(e) => setGenre(e.target.value)}
        className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-sm text-white/60 focus:outline-none focus:border-[#00bcd4]/30"
      >
        {GENRES.map((g) => (
          <option key={g.value} value={g.value}>
            {g.label}
          </option>
        ))}
      </select>

      {slug && <p className="text-[10px] text-white/20">Slug: {slug}</p>}

      {error && <p className="text-[10px] text-red-400/80">{error}</p>}

      <div className="flex gap-2">
        <button
          onClick={handleCreate}
          disabled={!title.trim() || creating}
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#00bcd4] to-[#0d47a1] text-white text-sm font-medium hover:shadow-lg hover:shadow-[#00bcd4]/20 disabled:opacity-30 transition-all"
        >
          {creating ? 'Creating...' : 'Create & Start Writing'}
        </button>
        <button
          onClick={() => {
            setOpen(false);
            setTitle('');
            setError(null);
          }}
          className="px-4 py-2 rounded-lg border border-white/[0.08] text-white/40 text-sm hover:bg-white/[0.04] transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
