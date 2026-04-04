'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { LazyMotion, domMax, m, AnimatePresence } from 'framer-motion';
import type { Episode, Encounter } from '@/lib/living-lore/types';
import type { Text } from '@/lib/content/types';
import { getCrewMember } from '@/lib/living-lore/crew-data';
import { springs, transitions } from '@/lib/design/motion';
import { ReadingProgressBar } from './reading-progress-bar';
import { EpisodeToc } from './episode-toc';

interface EpisodeReaderProps {
  episode: Episode;
  connectedLore: Text[];
  encounters?: Encounter[];
  nextEpisode?: { slug: string; title: string } | null;
}

export function EpisodeReader({ episode, connectedLore, encounters = [], nextEpisode }: EpisodeReaderProps) {
  const [showLore, setShowLore] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [showStickyHeader, setShowStickyHeader] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  const readingTime = Math.ceil(episode.content.split(/\s+/).length / 200);

  const perspectiveMembers = episode.perspectives
    .map((id) => getCrewMember(id))
    .filter(Boolean);

  // Sticky header visibility based on main header intersection
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowStickyHeader(!entry.isIntersecting);
      },
      { threshold: 0 }
    );

    observer.observe(header);
    return () => observer.disconnect();
  }, []);

  const handleMarkComplete = useCallback(async () => {
    if (completed || completing) return;
    setCompleting(true);

    try {
      const res = await fetch('/api/living-lore/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contentType: 'episode',
          contentSlug: episode.slug,
          actNumber: episode.act,
        }),
      });

      if (res.ok) {
        setCompleted(true);
      }
    } catch {
      // Silently fail — user can retry
    } finally {
      setCompleting(false);
    }
  }, [completed, completing, episode.slug, episode.act]);

  return (
    <LazyMotion features={domMax}>
      <ReadingProgressBar />

      {/* Sticky compact header */}
      <AnimatePresence>
        {showStickyHeader && (
          <m.div
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -40, opacity: 0 }}
            transition={transitions.snappy}
            className="fixed left-0 right-0 z-[60] glass-subtle backdrop-blur-md border-b border-white/[0.06]"
            style={{ top: 3 }}
          >
            <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-2">
              <p className="truncate text-sm font-semibold text-text-primary font-display">
                {episode.title}
              </p>
              <span className="ml-4 shrink-0 text-xs text-text-muted">
                {readingTime} min read
              </span>
            </div>
          </m.div>
        )}
      </AnimatePresence>

      <div className="mx-auto max-w-5xl px-6 pb-24 pt-8">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-text-muted">
            <li>
              <Link
                href="/living-lore"
                className="hover:text-atlantean-teal-aqua transition-colors"
              >
                Living Lore
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link
                href="/living-lore/chronicle"
                className="hover:text-atlantean-teal-aqua transition-colors"
              >
                Chronicle
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-text-primary">{episode.title}</li>
          </ol>
        </nav>

        {/* Header */}
        <header ref={headerRef} className="mb-12">
          <div className="mb-4 flex flex-wrap items-center gap-3 text-xs text-text-muted">
            <span className="rounded-full border border-atlantean-teal-aqua/20 bg-atlantean-teal-aqua/10 px-3 py-1 text-atlantean-teal-aqua">
              Act {episode.act}: {episode.actTitle}
            </span>
            <span>Episode {episode.episodeNumber}</span>
            <span>Gate {episode.gate}</span>
            <span className="flex items-center gap-1">
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {readingTime} min read
            </span>
          </div>

          <h1 className="font-display text-3xl font-semibold text-text-primary md:text-4xl">
            {episode.title}
          </h1>

          {perspectiveMembers.length > 0 && (
            <div className="mt-4 flex items-center gap-2">
              <span className="text-xs text-text-muted">Perspectives:</span>
              {perspectiveMembers.map((member) =>
                member ? (
                  <Link
                    key={member.id}
                    href={`/living-lore/crew/${member.id}`}
                    className="flex items-center gap-1.5 rounded-full border border-white/[0.06] bg-white/[0.03] px-3 py-1 text-xs text-text-muted hover:border-white/[0.12] transition-colors"
                  >
                    <span>{member.avatar}</span>
                    <span>{member.name}</span>
                  </Link>
                ) : null
              )}
            </div>
          )}
        </header>

        {/* Mobile TOC */}
        <div className="lg:hidden">
          <EpisodeToc content={episode.content} />
        </div>

        {/* Content grid: article + sidebar TOC */}
        <div className="lg:grid lg:grid-cols-[1fr_200px] lg:gap-10">
          {/* Episode content */}
          <div className="min-w-0">
            <div className="prose prose-invert prose-sm max-w-none prose-headings:font-display prose-headings:text-text-primary prose-p:text-text-muted prose-p:leading-relaxed prose-a:text-atlantean-teal-aqua prose-blockquote:border-l-atlantean-teal-aqua/30 prose-blockquote:text-text-muted/80">
              <ReactMarkdown
                components={{
                  h2: ({ children, ...props }: { children?: React.ReactNode } & React.ComponentProps<'h2'>) => {
                    const text = String(children);
                    const id = text.toLowerCase().replace(/\s+/g, '-');
                    return (
                      <h2 id={id} className="scroll-mt-16" {...props}>
                        {children}
                      </h2>
                    );
                  },
                }}
              >
                {episode.content}
              </ReactMarkdown>
            </div>

            {/* Mark as Complete */}
            <div className="mt-16 flex flex-col items-center border-t border-white/[0.06] pt-8">
              <AnimatePresence mode="wait">
                {completed ? (
                  <m.div
                    key="completed"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={springs.bouncy}
                    className="flex flex-col items-center gap-2"
                  >
                    <m.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={springs.bouncy}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-atlantean-teal-aqua/20 text-atlantean-teal-aqua"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </m.span>
                    <p className="text-sm font-semibold text-atlantean-teal-aqua">
                      Episode Complete
                    </p>
                    <m.p
                      initial={{ opacity: 0, scale: 1.3 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2, ...springs.bouncy }}
                      className="text-[11px] text-gold-bright font-semibold"
                      style={{
                        textShadow: '0 0 12px rgba(255,215,0,0.5)',
                      }}
                    >
                      +50 XP earned
                    </m.p>
                  </m.div>
                ) : (
                  <m.button
                    key="button"
                    onClick={handleMarkComplete}
                    disabled={completing}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={springs.snappy}
                    className="inline-flex items-center gap-2 rounded-xl border border-atlantean-teal-aqua/30 bg-atlantean-teal-aqua/10 px-6 py-3 text-sm font-semibold text-atlantean-teal-aqua hover:bg-atlantean-teal-aqua/20 disabled:opacity-50 transition-all duration-300"
                  >
                    {completing ? 'Saving...' : 'Mark as Complete'}
                  </m.button>
                )}
              </AnimatePresence>
            </div>

            {/* Related Encounters */}
            {encounters.length > 0 && (
              <section className="mt-10 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6">
                <h2 className="font-display text-lg font-semibold text-text-primary mb-1">
                  Related Encounters
                </h2>
                <p className="text-xs text-text-muted mb-4">
                  Interactive scenes from this episode
                </p>
                <div className="space-y-3">
                  {encounters.map((enc) => (
                    <Link
                      key={enc.slug}
                      href={`/living-lore/encounters/${enc.slug}`}
                      className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 hover:border-atlantean-teal-aqua/20 transition-colors group"
                    >
                      <div>
                        <p className="text-sm font-semibold text-text-primary group-hover:text-atlantean-teal-aqua transition-colors">
                          {enc.title}
                        </p>
                        <p className="mt-0.5 text-[11px] text-text-muted">
                          {enc.presentCrew.length} crew member{enc.presentCrew.length !== 1 ? 's' : ''} present &middot; {enc.xpReward} XP
                        </p>
                      </div>
                      <svg
                        className="h-4 w-4 text-text-dim group-hover:text-atlantean-teal-aqua transition-colors"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Next Episode */}
            {nextEpisode && (
              <div className="mt-8 flex justify-end">
                <Link
                  href={`/living-lore/chronicle/${nextEpisode.slug}`}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.03] px-5 py-3 text-sm font-semibold text-text-primary hover:border-atlantean-teal-aqua/20 hover:text-atlantean-teal-aqua transition-all duration-300 group"
                >
                  Next: {nextEpisode.title}
                  <svg
                    className="h-4 w-4 text-text-dim group-hover:text-atlantean-teal-aqua transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            )}

            {/* Connected Lore panel */}
            {connectedLore.length > 0 && (
              <aside className="mt-10 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6">
                <button
                  onClick={() => setShowLore(!showLore)}
                  className="flex w-full items-center justify-between text-left"
                >
                  <div>
                    <h2 className="font-display text-lg font-semibold text-text-primary">
                      Connected Lore
                    </h2>
                    <p className="text-xs text-text-muted">
                      {connectedLore.length} text
                      {connectedLore.length !== 1 ? 's' : ''} from the Library
                    </p>
                  </div>
                  <m.svg
                    animate={{ rotate: showLore ? 180 : 0 }}
                    transition={transitions.snappy}
                    className="h-5 w-5 text-text-muted"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </m.svg>
                </button>

                <AnimatePresence>
                  {showLore && (
                    <m.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={transitions.smooth}
                      className="overflow-hidden"
                    >
                      <div className="mt-4 space-y-3">
                        {connectedLore.map((text) => (
                          <Link
                            key={text.slug}
                            href={`/library/${text.slug}`}
                            className="block rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 hover:border-white/[0.12] transition-colors"
                          >
                            <p className="text-sm font-semibold text-text-primary">
                              {text.frontmatter.title}
                            </p>
                            {text.frontmatter.excerpt && (
                              <p className="mt-1 text-xs text-text-muted line-clamp-2">
                                {text.frontmatter.excerpt}
                              </p>
                            )}
                          </Link>
                        ))}
                      </div>
                    </m.div>
                  )}
                </AnimatePresence>
              </aside>
            )}
          </div>

          {/* Desktop TOC sidebar */}
          <div className="hidden lg:block">
            <EpisodeToc content={episode.content} />
          </div>
        </div>
      </div>
    </LazyMotion>
  );
}
