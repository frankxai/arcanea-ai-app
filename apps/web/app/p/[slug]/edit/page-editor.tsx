'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ChatMarkdown from '@/components/chat/chat-markdown';
import { createClient } from '@/lib/supabase/client';
import type { PageSection, PageView, PageVisibility } from '@/lib/pages/types';

const EDITORIAL = 'var(--font-editorial), var(--font-serif), serif';
const VISIBILITIES: { value: PageVisibility; label: string; hint: string }[] = [
  { value: 'public', label: 'Public', hint: 'Listed in Discover, indexed by search engines.' },
  { value: 'unlisted', label: 'Unlisted', hint: 'Anyone with the link can view. Not indexed.' },
  { value: 'private', label: 'Private', hint: 'Only you can view.' },
];

export function PageEditor({ slug, initial }: { slug: string; initial: PageView }) {
  const router = useRouter();
  const [title, setTitle] = useState(initial.title);
  const [summary, setSummary] = useState(initial.summary ?? '');
  const [sections, setSections] = useState<PageSection[]>(initial.sections);
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(initial.coverImageUrl);
  const [visibility, setVisibility] = useState<PageVisibility>(initial.visibility);

  const [status, setStatus] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [coverBusy, setCoverBusy] = useState(false);
  const [reviseBusy, setReviseBusy] = useState<string | null>(null);
  const [instructions, setInstructions] = useState<Record<string, string>>({});
  const [previewIds, setPreviewIds] = useState<Set<string>>(new Set());

  const flash = useCallback((msg: string) => {
    setStatus(msg);
    setTimeout(() => setStatus(null), 2500);
  }, []);

  const patchSection = useCallback((id: string, patch: Partial<PageSection>) => {
    setSections((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  }, []);

  const moveSection = useCallback((id: string, dir: -1 | 1) => {
    setSections((prev) => {
      const idx = prev.findIndex((s) => s.id === id);
      const next = idx + dir;
      if (idx < 0 || next < 0 || next >= prev.length) return prev;
      const copy = [...prev];
      [copy[idx], copy[next]] = [copy[next], copy[idx]];
      return copy;
    });
  }, []);

  const deleteSection = useCallback((id: string) => {
    setSections((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const togglePreview = useCallback((id: string) => {
    setPreviewIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const reviseSection = useCallback(
    async (id: string) => {
      const instruction = (instructions[id] || '').trim();
      if (!instruction) return;
      setReviseBusy(id);
      try {
        const res = await fetch(`/api/pages/${slug}/section`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sectionId: id, instruction }),
        });
        const data = await res.json();
        if (res.ok && data.markdown) {
          patchSection(id, { markdown: data.markdown });
          setInstructions((prev) => ({ ...prev, [id]: '' }));
          flash('Section revised');
        } else {
          flash(data.error || 'Could not revise section');
        }
      } catch {
        flash('Could not revise section');
      } finally {
        setReviseBusy(null);
      }
    },
    [instructions, slug, patchSection, flash],
  );

  const regenerateCover = useCallback(async () => {
    setCoverBusy(true);
    try {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (session?.access_token) headers.Authorization = `Bearer ${session.access_token}`;
      const res = await fetch('/api/ai/generate-image', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          prompt: `Editorial cover image for an article titled "${title}". ${summary}`.slice(0, 500),
          width: 1200,
          height: 630,
        }),
      });
      const data = await res.json();
      const url = data?.images?.[0]?.url || data?.images?.[0]?.storageUrl || data?.url;
      if (res.ok && url) {
        setCoverImageUrl(url);
        flash('Cover regenerated — remember to save');
      } else {
        flash(data?.error || 'Could not generate cover');
      }
    } catch {
      flash('Could not generate cover');
    } finally {
      setCoverBusy(false);
    }
  }, [title, summary, flash]);

  const save = useCallback(async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/pages/${slug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, summary, sections, visibility, coverImageUrl }),
      });
      const data = await res.json();
      if (res.ok) flash('Saved');
      else flash(data.error || 'Failed to save');
    } catch {
      flash('Failed to save');
    } finally {
      setSaving(false);
    }
  }, [slug, title, summary, sections, visibility, coverImageUrl, flash]);

  const deletePage = useCallback(async () => {
    if (!window.confirm('Delete this Page permanently?')) return;
    try {
      const res = await fetch(`/api/pages/${slug}`, { method: 'DELETE' });
      if (res.ok) router.push('/discover/pages');
      else flash('Failed to delete');
    } catch {
      flash('Failed to delete');
    }
  }, [slug, router, flash]);

  const inputCls =
    'w-full rounded-lg bg-white/[0.03] border border-white/[0.08] px-3 py-2 text-white/85 placeholder-white/25 focus:outline-none focus:border-[var(--arc-brand-atlantean-teal)]/40 transition-colors';

  return (
    <main className="min-h-screen bg-[var(--arc-cosmic-void)] text-white/90">
      {/* Sticky action bar */}
      <div className="sticky top-0 z-20 backdrop-blur-xl bg-[var(--arc-cosmic-void)]/80 border-b border-white/[0.06]">
        <div className="mx-auto max-w-3xl px-5 sm:px-8 py-3 flex items-center justify-between gap-3">
          <Link href={`/p/${slug}`} className="text-xs text-white/40 hover:text-white/70">
            ← View page
          </Link>
          <div className="flex items-center gap-2">
            {status && <span className="text-xs text-[var(--arc-brand-atlantean-teal)]/80">{status}</span>}
            <button
              type="button"
              onClick={save}
              disabled={saving}
              className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-[var(--arc-brand-atlantean-teal)] text-black hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-5 sm:px-8 py-10 space-y-8">
        {/* Visibility */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-white/35 mb-2">
            Visibility
          </label>
          <div className="flex flex-wrap gap-2">
            {VISIBILITIES.map((v) => (
              <button
                key={v.value}
                type="button"
                onClick={() => setVisibility(v.value)}
                title={v.hint}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  visibility === v.value
                    ? 'border-[var(--arc-brand-atlantean-teal)]/40 bg-[var(--arc-brand-atlantean-teal)]/10 text-[var(--arc-brand-atlantean-teal)]'
                    : 'border-white/[0.08] bg-white/[0.03] text-white/50 hover:text-white/80'
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>
          <p className="mt-1.5 text-[11px] text-white/30">
            {VISIBILITIES.find((v) => v.value === visibility)?.hint}
          </p>
        </div>

        {/* Cover */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-white/35">Cover</label>
            <button
              type="button"
              onClick={regenerateCover}
              disabled={coverBusy}
              className="text-xs text-white/50 hover:text-[var(--arc-brand-atlantean-teal)] disabled:opacity-50"
            >
              {coverBusy ? 'Generating…' : coverImageUrl ? 'Regenerate' : 'Generate cover'}
            </button>
          </div>
          {coverImageUrl ? (
            <div className="relative rounded-xl overflow-hidden border border-white/[0.06]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={coverImageUrl} alt="Cover" className="w-full h-40 object-cover" />
              <button
                type="button"
                onClick={() => setCoverImageUrl(null)}
                className="absolute top-2 right-2 px-2 py-1 rounded-md bg-black/60 text-white/80 text-[11px] hover:bg-black/80"
              >
                Remove
              </button>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-white/[0.1] h-24 flex items-center justify-center text-xs text-white/25">
              No cover image
            </div>
          )}
        </div>

        {/* Title + summary */}
        <div className="space-y-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className={`${inputCls} text-2xl`}
            style={{ fontFamily: EDITORIAL }}
          />
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="One or two sentence summary…"
            rows={2}
            className={inputCls}
          />
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {sections.map((section, i) => {
            const preview = previewIds.has(section.id);
            return (
              <div
                key={section.id}
                className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 space-y-3"
              >
                <div className="flex items-center gap-2">
                  <input
                    value={section.heading}
                    onChange={(e) => patchSection(section.id, { heading: e.target.value })}
                    placeholder="Section heading"
                    className={`${inputCls} font-medium`}
                  />
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => moveSection(section.id, -1)}
                      disabled={i === 0}
                      className="px-2 py-1.5 rounded-md text-white/40 hover:text-white/80 disabled:opacity-20"
                      aria-label="Move section up"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => moveSection(section.id, 1)}
                      disabled={i === sections.length - 1}
                      className="px-2 py-1.5 rounded-md text-white/40 hover:text-white/80 disabled:opacity-20"
                      aria-label="Move section down"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteSection(section.id)}
                      className="px-2 py-1.5 rounded-md text-white/40 hover:text-red-400"
                      aria-label="Delete section"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                {preview ? (
                  <div className="rounded-lg bg-white/[0.02] border border-white/[0.05] px-3 py-2 text-[15px] leading-relaxed text-white/75 min-h-[80px]">
                    <ChatMarkdown content={section.markdown} />
                  </div>
                ) : (
                  <textarea
                    value={section.markdown}
                    onChange={(e) => patchSection(section.id, { markdown: e.target.value })}
                    placeholder="Markdown body…"
                    rows={6}
                    className={`${inputCls} font-mono text-[13px] leading-relaxed`}
                  />
                )}

                <div className="flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => togglePreview(section.id)}
                    className="text-[11px] text-white/40 hover:text-white/70"
                  >
                    {preview ? 'Edit markdown' : 'Preview'}
                  </button>
                </div>

                {/* AI revise */}
                <div className="flex items-center gap-2 pt-1 border-t border-white/[0.05]">
                  <input
                    value={instructions[section.id] || ''}
                    onChange={(e) =>
                      setInstructions((prev) => ({ ...prev, [section.id]: e.target.value }))
                    }
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') reviseSection(section.id);
                    }}
                    placeholder="Ask AI to revise this section…"
                    className={`${inputCls} text-xs`}
                  />
                  <button
                    type="button"
                    onClick={() => reviseSection(section.id)}
                    disabled={reviseBusy === section.id || !(instructions[section.id] || '').trim()}
                    className="shrink-0 px-3 py-2 rounded-lg text-xs font-medium border border-[var(--arc-brand-atlantean-teal)]/30 bg-[var(--arc-brand-atlantean-teal)]/10 text-[var(--arc-brand-atlantean-teal)] hover:bg-[var(--arc-brand-atlantean-teal)]/15 disabled:opacity-40 transition-colors"
                  >
                    {reviseBusy === section.id ? 'Revising…' : 'Revise'}
                  </button>
                </div>
              </div>
            );
          })}

          <button
            type="button"
            onClick={() =>
              setSections((prev) => [
                ...prev,
                { id: Math.random().toString(36).slice(2, 10), heading: 'New section', markdown: '', imageUrl: null },
              ])
            }
            className="w-full py-2.5 rounded-xl border border-dashed border-white/[0.1] text-xs text-white/40 hover:text-white/70 hover:border-white/20 transition-colors"
          >
            + Add section
          </button>
        </div>

        {/* Danger zone */}
        <div className="pt-6 border-t border-white/[0.06]">
          <button
            type="button"
            onClick={deletePage}
            className="text-xs text-red-400/70 hover:text-red-400"
          >
            Delete this Page
          </button>
        </div>
      </div>
    </main>
  );
}
