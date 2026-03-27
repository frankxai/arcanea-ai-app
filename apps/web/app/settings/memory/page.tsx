'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Memory {
  id: string;
  content: string;
  category: string;
  created_at: string;
}

const CATEGORIES = [
  'preference',
  'background',
  'goal',
  'project',
  'style',
  'general',
] as const;

// ---------------------------------------------------------------------------
// Memory Settings Page
// ---------------------------------------------------------------------------

export default function MemorySettingsPage() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/memories')
      .then((r) => r.json())
      .then((data) => {
        const memoryPayload = data?.data?.memories ?? data?.memories ?? [];
        setMemories(memoryPayload);
        setLoading(false);
      })
      .catch(() => {
        setStatus("Memory is unavailable right now. Your active chat can still work without saved memory.");
        setLoading(false);
      });
  }, []);

  const deleteMemory = async (id: string) => {
    const res = await fetch(`/api/memories?id=${id}`, { method: 'DELETE' });
    if (!res.ok) {
      setStatus("Could not delete that memory right now.");
      return;
    }
    setMemories((prev) => prev.filter((m) => m.id !== id));
  };

  const grouped = CATEGORIES.reduce(
    (acc, cat) => {
      const items = memories.filter((m) => m.category === cat);
      if (items.length) acc[cat] = items;
      return acc;
    },
    {} as Record<string, Memory[]>,
  );

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold">Memory</h1>
            <p className="text-sm text-white/40 mt-1">
              Review and remove facts Arcanea may use across conversations.
            </p>
          </div>
          <Link
            href="/settings"
            className="text-sm text-white/30 hover:text-white/50 transition-colors"
          >
            &larr; Settings
          </Link>
        </div>

        <div className="mb-6 rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-3">
          <p className="text-sm text-white/70">
            Memory is opt-in trust infrastructure, not magic. If saved memory is unavailable, Arcanea should still behave clearly and safely in the current session.
          </p>
          {status ? (
            <p className="mt-2 text-xs text-amber-300">{status}</p>
          ) : (
            <p className="mt-2 text-xs text-white/40">
              Saved memories help with continuity, but they should never be implied when storage is unavailable.
            </p>
          )}
        </div>

        {/* Content */}
        {loading ? (
          <div className="space-y-3">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-12 rounded-lg bg-white/[0.03] animate-pulse"
              />
            ))}
          </div>
        ) : memories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-white/30 text-sm">No memories saved yet.</p>
            <p className="text-white/20 text-xs mt-2">
              Arcanea will only use saved memory when the memory service is available and you are signed in.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(grouped).map(([category, items]) => (
              <div key={category}>
                <h2 className="text-xs uppercase tracking-wider text-white/25 font-medium mb-2">
                  {category}
                </h2>
                <div className="space-y-1.5">
                  {items.map((m) => (
                    <div
                      key={m.id}
                      className="flex items-start justify-between gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/[0.04] group"
                    >
                      <p className="text-sm text-white/60 flex-1">
                        {m.content}
                      </p>
                      <button
                        onClick={() => deleteMemory(m.id)}
                        className="text-white/20 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all text-xs shrink-0"
                        aria-label="Delete memory"
                      >
                        &#10005;
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <p className="text-xs text-white/15 mt-8 text-center">
          {memories.length} of 100 memories used
        </p>
      </div>
    </div>
  );
}
