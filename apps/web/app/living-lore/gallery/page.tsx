'use client';

import Link from 'next/link';
import { LazyMotion, domMax, m } from 'framer-motion';
import {
  slideUp,
  staggerContainer,
  staggerItem,
  hoverPresets,
} from '@/lib/design/motion';
import { getAllCrew } from '@/lib/living-lore/crew-data';
import { getAllCrewVisuals, getCrewVisual } from '@/lib/living-lore/crew-visuals';
import { CrewPortrait } from '@/components/living-lore/crew-portrait';
import { ELEMENT_COLORS } from '@/lib/living-lore/types';
import type { CrewMember } from '@/lib/living-lore/types';
import type { CrewVisualSpec } from '@/lib/living-lore/crew-visuals';

function GalleryCard({
  member,
  visual,
  index,
}: {
  member: CrewMember;
  visual: CrewVisualSpec;
  index: number;
}) {
  return (
    <m.div
      variants={staggerItem}
      {...hoverPresets.card}
      className="group"
    >
      <Link
        href={`/living-lore/crew/${member.id}`}
        className="block overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.04]"
        style={{
          boxShadow: `0 0 0 0 ${member.color}00`,
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.boxShadow =
            `0 0 30px ${member.color}20, 0 4px 20px rgba(0,0,0,0.3)`;
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.boxShadow =
            `0 0 0 0 ${member.color}00`;
        }}
      >
        {/* Portrait Area */}
        <div className="relative flex items-center justify-center overflow-hidden py-8">
          {/* Background gradient wash */}
          <div
            className="pointer-events-none absolute inset-0 opacity-20"
            style={{ background: visual.placeholderGradient }}
          />

          <CrewPortrait member={member} visual={visual} size="lg" />
        </div>

        {/* Info Area */}
        <div className="border-t border-white/[0.06] p-5">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-cinzel text-lg font-semibold text-text-primary transition-colors group-hover:text-atlantean-teal-aqua">
                {member.name}
              </h3>
              <p className="mt-0.5 text-xs text-text-muted">{member.title}</p>
            </div>

            {/* Element badge */}
            <span
              className="shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-medium"
              style={{
                backgroundColor: ELEMENT_COLORS[member.element] + '15',
                color: ELEMENT_COLORS[member.element],
                border: `1px solid ${ELEMENT_COLORS[member.element]}25`,
              }}
            >
              {member.element}
            </span>
          </div>

          <p className="mt-1 text-[11px] text-text-dim">
            {member.species.split(',')[0]}
          </p>

          <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-text-muted">
            {member.tagline}
          </p>

          {/* View profile link */}
          <div className="mt-4 flex items-center gap-1 text-xs font-medium text-text-dim transition-colors group-hover:text-atlantean-teal-aqua">
            <span>View Profile</span>
            <svg
              className="h-3 w-3 transition-transform group-hover:translate-x-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </Link>
    </m.div>
  );
}

export default function GalleryPage() {
  const crew = getAllCrew();
  const visuals = getAllCrewVisuals();

  return (
    <LazyMotion features={domMax} strict>
      <main className="mx-auto max-w-7xl px-6 pb-24 pt-8">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-text-muted">
            <li>
              <Link
                href="/living-lore"
                className="transition-colors hover:text-atlantean-teal-aqua"
              >
                Living Lore
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-text-primary">Gallery</li>
          </ol>
        </nav>

        {/* Hero */}
        <m.header
          variants={slideUp}
          initial="hidden"
          animate="visible"
          className="mb-12 text-center"
        >
          <h1 className="font-cinzel text-4xl font-bold text-gradient-cosmic sm:text-5xl">
            The Crew
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-text-muted">
            Seven beings. Seven perspectives. One journey.
          </p>
        </m.header>

        {/* Gallery Grid */}
        <m.div
          variants={staggerContainer('slow')}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {crew.map((member, i) => {
            const visual = getCrewVisual(member.id);
            if (!visual) return null;
            return (
              <GalleryCard
                key={member.id}
                member={member}
                visual={visual}
                index={i}
              />
            );
          })}
        </m.div>

        {/* Bottom CTA */}
        <m.div
          variants={slideUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <p className="text-sm text-text-muted">
            Each character has a unique voice, backstory, and perspective on the journey.
          </p>
          <div className="mt-4 flex items-center justify-center gap-4">
            <Link
              href="/living-lore/crew"
              className="text-sm text-atlantean-teal-aqua transition-colors hover:underline"
            >
              Meet the Crew
            </Link>
            <span className="text-white/20">|</span>
            <Link
              href="/living-lore/chronicle"
              className="text-sm text-atlantean-teal-aqua transition-colors hover:underline"
            >
              Read the Chronicle
            </Link>
          </div>
        </m.div>
      </main>
    </LazyMotion>
  );
}
