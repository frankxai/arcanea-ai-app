'use client';

import Link from 'next/link';
import Image from 'next/image';
import { LazyMotion, domAnimation, m, useReducedMotion, type Variants } from 'framer-motion';
import { PhEye, PhArrowRight } from '@/lib/phosphor-icons';
import type { PageSummary } from '@/lib/pages/types';

const EDITORIAL = 'var(--font-editorial), var(--font-serif), serif';

const CONTAINER: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};
const CARD: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

export function DiscoverGrid({ pages }: { pages: PageSummary[] }) {
  const reduce = useReducedMotion();
  const revealProps = reduce
    ? { initial: 'show' as const, animate: 'show' as const }
    : { initial: 'hidden' as const, animate: 'show' as const };

  return (
    <LazyMotion features={domAnimation}>
      <m.div
        variants={CONTAINER}
        {...revealProps}
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        {pages.map((page) => (
          <m.div key={page.slug} variants={CARD}>
            <Link
              href={`/p/${page.slug}`}
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-[var(--arc-brand-atlantean-teal)]/25 hover:shadow-[0_18px_50px_-20px_rgba(0,188,212,0.35)]"
            >
              <div className="relative h-40 overflow-hidden">
                {page.coverImageUrl ? (
                  <Image
                    src={page.coverImageUrl}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover opacity-75 transition-all duration-500 group-hover:scale-[1.04] group-hover:opacity-95"
                  />
                ) : (
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,188,212,0.16),transparent_60%)]" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--arc-cosmic-void)]/80 to-transparent" />
              </div>

              <div className="flex flex-1 flex-col p-5">
                <h2
                  className="mb-1.5 line-clamp-2 text-balance text-lg leading-snug text-white/90 transition-colors group-hover:text-white"
                  style={{ fontFamily: EDITORIAL }}
                >
                  {page.title}
                </h2>
                {page.summary && <p className="line-clamp-2 text-sm leading-relaxed text-white/45">{page.summary}</p>}
                <div className="mt-auto flex items-center justify-between pt-4 text-[11px] text-white/30">
                  <span className="inline-flex items-center gap-1.5">
                    <PhEye className="h-3.5 w-3.5" weight="duotone" />
                    {page.viewCount.toLocaleString()}
                  </span>
                  <PhArrowRight className="h-4 w-4 -translate-x-1 text-white/20 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:text-[var(--arc-brand-atlantean-teal)] group-hover:opacity-100" weight="bold" />
                </div>
              </div>
            </Link>
          </m.div>
        ))}
      </m.div>
    </LazyMotion>
  );
}
