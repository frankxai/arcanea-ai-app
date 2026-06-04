'use client';

/**
 * PageReader — the public reading experience for a published Page.
 *
 * A client island (the server route owns data, SEO metadata, and JSON-LD) so the
 * essay earns motion that static markup can't: a single cinematic blur-to-focus
 * hero, a scroll-linked reading-progress rail, and below-fold sections that
 * reveal as a wave. Restraint over spectacle — one hero moment, everything else
 * quiet. Respects prefers-reduced-motion.
 */

import { LazyMotion, domAnimation, m, useScroll, useReducedMotion, type Variants } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import ChatMarkdown from '@/components/chat/chat-markdown';
import {
  PhArrowRight,
  PhArrowSquareOut,
  PhPencilSimple,
  PhGlobe,
  PhLink as PhLinkIcon,
  PhLock,
  PhEye,
} from '@/lib/phosphor-icons';
import type { PageView, PageVisibility } from '@/lib/pages/types';
import { CopyLinkButton } from './copy-link-button';

const EDITORIAL = 'var(--font-editorial), var(--font-serif), serif';

// Apple expo-out + cinematic timing — never the framer default.
const HERO: Variants = {
  hidden: { opacity: 0, y: 28, filter: 'blur(14px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] } },
};
const STAND: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.12 } },
};
const SECTION: Variants = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const VISIBILITY_META: Record<PageVisibility, { icon: typeof PhGlobe; label: string }> = {
  public: { icon: PhGlobe, label: 'Public' },
  unlisted: { icon: PhLinkIcon, label: 'Unlisted' },
  private: { icon: PhLock, label: 'Private' },
};

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  } catch {
    return '';
  }
}

export function PageReader({ page }: { page: PageView }) {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const VisIcon = VISIBILITY_META[page.visibility].icon;

  // When reduced motion is requested, reveal everything immediately.
  const reveal = reduce ? { initial: 'show' as const, animate: 'show' as const } : {};

  return (
    <LazyMotion features={domAnimation} strict>
      <main className="relative min-h-screen bg-[var(--arc-cosmic-void)] text-white/85">
        {/* Reading-progress rail */}
        {!reduce && (
          <m.div
            aria-hidden
            style={{ scaleX: scrollYProgress }}
            className="fixed inset-x-0 top-0 z-50 h-[2px] origin-left bg-gradient-to-r from-[var(--arc-brand-atlantean-teal)] via-[var(--arc-brand-atlantean-teal)] to-[var(--arc-brand-cosmic-blue)]"
          />
        )}

        {/* ---- Hero ---- */}
        <header className="relative">
          {page.coverImageUrl ? (
            <div className="relative h-[46vh] min-h-[260px] max-h-[520px] w-full overflow-hidden">
              <Image
                src={page.coverImageUrl}
                alt=""
                fill
                priority
                sizes="100vw"
                className="object-cover opacity-70"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-[var(--arc-cosmic-void)]/30 via-[var(--arc-cosmic-void)]/40 to-[var(--arc-cosmic-void)]" />
            </div>
          ) : (
            <div className="relative h-[30vh] min-h-[180px] overflow-hidden">
              {/* Atmospheric teal glow — never a flat banner */}
              <div className="absolute left-1/2 top-0 h-[420px] w-[820px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-[radial-gradient(closest-side,rgba(0,188,212,0.18),transparent)] blur-2xl" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--arc-cosmic-void)]" />
            </div>
          )}

          <div className={`relative mx-auto w-full max-w-[720px] px-5 sm:px-8 ${page.coverImageUrl ? '-mt-28' : '-mt-20'}`}>
            <m.div initial="hidden" animate="show" variants={STAND}>
              <div className="mb-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-[11px] text-white/40">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 backdrop-blur-sm">
                  <VisIcon className="h-3 w-3" weight="duotone" />
                  {VISIBILITY_META[page.visibility].label}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <PhEye className="h-3.5 w-3.5" weight="duotone" />
                  {page.viewCount.toLocaleString()}
                </span>
                <span className="text-white/25">·</span>
                <span>{formatDate(page.createdAt)}</span>
                <span className="ml-auto flex items-center gap-2">
                  <CopyLinkButton />
                  {page.isOwner && (
                    <Link
                      href={`/p/${page.slug}/edit`}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--arc-brand-atlantean-teal)]/30 bg-[var(--arc-brand-atlantean-teal)]/10 px-2.5 py-1 text-[11px] font-medium text-[var(--arc-brand-atlantean-teal)] transition-colors hover:bg-[var(--arc-brand-atlantean-teal)]/20"
                    >
                      <PhPencilSimple className="h-3.5 w-3.5" weight="duotone" />
                      Edit
                    </Link>
                  )}
                </span>
              </div>
            </m.div>

            <m.h1
              initial="hidden"
              animate="show"
              variants={HERO}
              className="text-balance text-4xl leading-[1.06] tracking-[-0.02em] text-white sm:text-5xl md:text-[3.4rem]"
              style={{ fontFamily: EDITORIAL }}
            >
              {page.title}
            </m.h1>

            {page.summary && (
              <m.p
                initial="hidden"
                animate="show"
                variants={STAND}
                className="mt-5 max-w-[60ch] text-lg leading-relaxed text-white/55"
              >
                {page.summary}
              </m.p>
            )}

            <m.div
              initial="hidden"
              animate="show"
              variants={STAND}
              className="mt-8 h-px w-full bg-gradient-to-r from-white/[0.12] via-white/[0.06] to-transparent"
            />
          </div>
        </header>

        {/* ---- Body ---- */}
        <article className="mx-auto w-full max-w-[720px] px-5 pb-12 pt-12 sm:px-8">
          <div className="space-y-14">
            {page.sections.map((section) => (
              <m.section
                key={section.id}
                variants={SECTION}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-80px' }}
                {...reveal}
              >
                {section.heading && (
                  <h2
                    className="mb-4 text-pretty text-[1.7rem] leading-tight tracking-[-0.01em] text-white/95"
                    style={{ fontFamily: EDITORIAL }}
                  >
                    {section.heading}
                  </h2>
                )}
                {section.imageUrl && (
                  <div className="relative mb-5 aspect-[16/9] w-full overflow-hidden rounded-xl border border-white/[0.06]">
                    <Image src={section.imageUrl} alt={section.heading} fill sizes="(max-width: 720px) 100vw, 720px" className="object-cover" />
                  </div>
                )}
                <div className="text-[1.0625rem] leading-[1.75] text-white/75 [&_p]:my-4">
                  <ChatMarkdown content={section.markdown} />
                </div>
              </m.section>
            ))}
          </div>

          {/* ---- Sources ---- */}
          {page.sources.length > 0 && (
            <section className="mt-16 border-t border-white/[0.06] pt-10">
              <h2 className="mb-5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/35">
                Sources
              </h2>
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {page.sources.map((source, i) => (
                  <a
                    key={`${source.url}-${i}`}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3.5 py-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--arc-brand-atlantean-teal)]/25 hover:bg-white/[0.04] hover:shadow-[0_8px_30px_-12px_rgba(0,188,212,0.25)]"
                  >
                    <span className="mt-0.5 font-mono text-[11px] tabular-nums text-white/25">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm text-white/80 group-hover:text-white">
                        {source.title || source.url}
                      </span>
                      {source.domain && (
                        <span className="mt-0.5 block truncate text-[11px] text-white/35">{source.domain}</span>
                      )}
                    </span>
                    <PhArrowSquareOut className="mt-0.5 h-3.5 w-3.5 shrink-0 text-white/25 transition-colors group-hover:text-[var(--arc-brand-atlantean-teal)]" />
                  </a>
                ))}
              </div>
            </section>
          )}

          {/* ---- Exit ramp / CTA ---- */}
          <section className="mt-20 overflow-hidden rounded-2xl border border-white/[0.07] bg-gradient-to-br from-[var(--arc-brand-atlantean-teal)]/[0.07] to-transparent p-8 text-center">
            <p className="mx-auto max-w-md text-sm leading-relaxed text-white/50">
              This page was distilled from a conversation in Arcanea.
            </p>
            <m.div
              {...(reduce ? {} : { whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 } })}
              className="mt-5 inline-block"
            >
              <Link
                href="/chat"
                className="inline-flex items-center gap-2 rounded-xl bg-[var(--arc-brand-atlantean-teal)] px-5 py-2.5 text-sm font-semibold text-black transition-shadow hover:shadow-[0_0_28px_-4px_rgba(0,188,212,0.5)]"
              >
                Start your own
                <PhArrowRight className="h-4 w-4" weight="bold" />
              </Link>
            </m.div>
          </section>
        </article>
      </main>
    </LazyMotion>
  );
}
