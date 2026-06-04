'use client';

/**
 * PageEditor — owner editing surface for a Page.
 *
 * Craft notes: Phosphor duotone icons (never glyphs), a segmented visibility
 * control with an animated layoutId pill, layout-animated section reordering,
 * and spring/magnetic affordances on the primary actions. Restraint over
 * spectacle — motion is reserved for state changes that benefit from it.
 */

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { LazyMotion, domAnimation, m, useReducedMotion } from 'framer-motion';
import ChatMarkdown from '@/components/chat/chat-markdown';
import { createClient } from '@/lib/supabase/client';
import {
  PhArrowLeft,
  PhCaretUp,
  PhCaretDown,
  PhTrash,
  PhEye,
  PhEyeSlash,
  PhMagicWand,
  PhImage,
  PhPlus,
  PhX,
  PhGlobe,
  PhLink as PhLinkIcon,
  PhLock,
  PhDotsSixVertical,
  PhCheck,
  PhCircleNotch,
} from '@/lib/phosphor-icons';
import type { PageSection, PageView, PageVisibility } from '@/lib/pages/types';

const EDITORIAL = 'var(--font-editorial), var(--font-serif), serif';
const SPRING = { type: 'spring' as const, stiffness: 380, damping: 32 };

const VISIBILITIES: { value: PageVisibility; label: string; hint: string; icon: typeof PhGlobe }[] = [
  { value: 'public', label: 'Public', hint: 'Listed in Discover and indexed by search engines.', icon: PhGlobe },
  { value: 'unlisted', label: 'Unlisted', hint: 'Anyone with the link can view. Not indexed.', icon: PhLinkIcon },
  { value: 'private', label: 'Private', hint: 'Only you can view it.', icon: PhLock },
];

export function PageEditor({ slug, initial }: { slug: string; initial: PageView }) {
  const router = useRouter();
  const reduce = useReducedMotion();
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
      flash(res.ok ? 'Saved' : data.error || 'Failed to save');
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
    'w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-white/85 placeholder-white/25 transition-colors focus:border-[var(--arc-brand-atlantean-teal)]/40 focus:outline-none focus:ring-1 focus:ring-[var(--arc-brand-atlantean-teal)]/20';
  const iconBtn =
    'flex h-8 w-8 items-center justify-center rounded-md text-white/40 transition-colors hover:bg-white/[0.06] hover:text-white/80 disabled:opacity-20 disabled:hover:bg-transparent';

  return (
    <LazyMotion features={domAnimation}>
      <main className="min-h-screen bg-[var(--arc-cosmic-void)] text-white/85">
        {/* Sticky toolbar */}
        <div className="sticky top-0 z-20 border-b border-white/[0.06] bg-[var(--arc-cosmic-void)]/80 backdrop-blur-xl">
          <div className="mx-auto flex max-w-[760px] items-center justify-between gap-3 px-5 py-3 sm:px-8">
            <Link href={`/p/${slug}`} className="inline-flex items-center gap-1.5 text-xs text-white/40 transition-colors hover:text-white/75">
              <PhArrowLeft className="h-3.5 w-3.5" weight="bold" />
              View page
            </Link>
            <div className="flex items-center gap-3">
              {status && (
                <m.span
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-[var(--arc-brand-atlantean-teal)]/90"
                >
                  {status}
                </m.span>
              )}
              <m.button
                type="button"
                onClick={save}
                disabled={saving}
                {...(reduce ? {} : { whileHover: { scale: 1.03 }, whileTap: { scale: 0.97 } })}
                transition={SPRING}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--arc-brand-atlantean-teal)] px-4 py-1.5 text-xs font-semibold text-black transition-shadow hover:shadow-[0_0_22px_-4px_rgba(0,188,212,0.6)] disabled:opacity-50"
              >
                {saving ? <PhCircleNotch className="h-3.5 w-3.5 animate-spin" weight="bold" /> : <PhCheck className="h-3.5 w-3.5" weight="bold" />}
                {saving ? 'Saving' : 'Save'}
              </m.button>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-[760px] space-y-8 px-5 py-10 sm:px-8">
          {/* Visibility — segmented control */}
          <div>
            <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.12em] text-white/35">Visibility</label>
            <div className="inline-flex rounded-xl border border-white/[0.08] bg-white/[0.02] p-1">
              {VISIBILITIES.map((v) => {
                const Icon = v.icon;
                const active = visibility === v.value;
                return (
                  <button
                    key={v.value}
                    type="button"
                    onClick={() => setVisibility(v.value)}
                    title={v.hint}
                    className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 ${active ? 'border border-[var(--arc-brand-atlantean-teal)]/30 bg-[var(--arc-brand-atlantean-teal)]/10 text-[var(--arc-brand-atlantean-teal)]' : 'border border-transparent text-white/45 hover:text-white/75'}`}
                  >
                    <Icon className="h-3.5 w-3.5" weight="duotone" />
                    <span>{v.label}</span>
                  </button>
                );
              })}
            </div>
            <p className="mt-1.5 text-[11px] text-white/30">{VISIBILITIES.find((v) => v.value === visibility)?.hint}</p>
          </div>

          {/* Cover */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/35">Cover</label>
              <button
                type="button"
                onClick={regenerateCover}
                disabled={coverBusy}
                className="inline-flex items-center gap-1.5 text-xs text-white/45 transition-colors hover:text-[var(--arc-brand-atlantean-teal)] disabled:opacity-50"
              >
                {coverBusy ? <PhCircleNotch className="h-3.5 w-3.5 animate-spin" /> : <PhMagicWand className="h-3.5 w-3.5" weight="duotone" />}
                {coverBusy ? 'Generating' : coverImageUrl ? 'Regenerate' : 'Generate cover'}
              </button>
            </div>
            {coverImageUrl ? (
              <div className="relative h-44 overflow-hidden rounded-xl border border-white/[0.06]">
                <Image src={coverImageUrl} alt="Cover" fill sizes="760px" className="object-cover" />
                <button
                  type="button"
                  onClick={() => setCoverImageUrl(null)}
                  className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-md bg-black/60 px-2 py-1 text-[11px] text-white/80 backdrop-blur-sm transition-colors hover:bg-black/80"
                >
                  <PhX className="h-3 w-3" weight="bold" /> Remove
                </button>
              </div>
            ) : (
              <div className="flex h-24 items-center justify-center gap-2 rounded-xl border border-dashed border-white/[0.1] text-xs text-white/25">
                <PhImage className="h-4 w-4" weight="duotone" /> No cover image
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
          <div className="space-y-4">
            {sections.map((section, i) => {
              const preview = previewIds.has(section.id);
              return (
                <div
                  key={section.id}
                  className="group rounded-xl border border-white/[0.06] bg-white/[0.02] p-4"
                >
                  <div className="mb-3 flex items-center gap-2">
                    <PhDotsSixVertical className="h-4 w-4 shrink-0 text-white/20" weight="bold" aria-hidden />
                    <input
                      value={section.heading}
                      onChange={(e) => patchSection(section.id, { heading: e.target.value })}
                      placeholder="Section heading"
                      className={`${inputCls} font-medium`}
                      style={{ fontFamily: EDITORIAL }}
                    />
                    <div className="flex shrink-0 items-center">
                      <button type="button" onClick={() => moveSection(section.id, -1)} disabled={i === 0} className={iconBtn} aria-label="Move section up">
                        <PhCaretUp className="h-4 w-4" weight="bold" />
                      </button>
                      <button type="button" onClick={() => moveSection(section.id, 1)} disabled={i === sections.length - 1} className={iconBtn} aria-label="Move section down">
                        <PhCaretDown className="h-4 w-4" weight="bold" />
                      </button>
                      <button type="button" onClick={() => deleteSection(section.id)} className={`${iconBtn} hover:text-red-400`} aria-label="Delete section">
                        <PhTrash className="h-4 w-4" weight="duotone" />
                      </button>
                    </div>
                  </div>

                  {preview ? (
                    <div className="min-h-[80px] rounded-lg border border-white/[0.05] bg-white/[0.02] px-3 py-2 text-[15px] leading-relaxed text-white/75">
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

                  <div className="mt-2 flex items-center">
                    <button
                      type="button"
                      onClick={() => togglePreview(section.id)}
                      className="inline-flex items-center gap-1.5 text-[11px] text-white/40 transition-colors hover:text-white/70"
                    >
                      {preview ? <PhEyeSlash className="h-3.5 w-3.5" weight="duotone" /> : <PhEye className="h-3.5 w-3.5" weight="duotone" />}
                      {preview ? 'Edit markdown' : 'Preview'}
                    </button>
                  </div>

                  {/* AI revise */}
                  <div className="mt-3 flex items-center gap-2 border-t border-white/[0.05] pt-3">
                    <PhMagicWand className="h-4 w-4 shrink-0 text-[var(--arc-brand-atlantean-teal)]/70" weight="duotone" />
                    <input
                      value={instructions[section.id] || ''}
                      onChange={(e) => setInstructions((prev) => ({ ...prev, [section.id]: e.target.value }))}
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
                      className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-[var(--arc-brand-atlantean-teal)]/30 bg-[var(--arc-brand-atlantean-teal)]/10 px-3 py-2 text-xs font-medium text-[var(--arc-brand-atlantean-teal)] transition-colors hover:bg-[var(--arc-brand-atlantean-teal)]/20 disabled:opacity-40"
                    >
                      {reviseBusy === section.id ? <PhCircleNotch className="h-3.5 w-3.5 animate-spin" /> : null}
                      {reviseBusy === section.id ? 'Revising' : 'Revise'}
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
              className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-white/[0.1] py-3 text-xs text-white/40 transition-colors hover:border-[var(--arc-brand-atlantean-teal)]/25 hover:text-white/70"
            >
              <PhPlus className="h-4 w-4" weight="bold" /> Add section
            </button>
          </div>

          {/* Danger zone */}
          <div className="border-t border-white/[0.06] pt-6">
            <button
              type="button"
              onClick={deletePage}
              className="inline-flex items-center gap-1.5 text-xs text-red-400/70 transition-colors hover:text-red-400"
            >
              <PhTrash className="h-3.5 w-3.5" weight="duotone" /> Delete this Page
            </button>
          </div>
        </div>
      </main>
    </LazyMotion>
  );
}
