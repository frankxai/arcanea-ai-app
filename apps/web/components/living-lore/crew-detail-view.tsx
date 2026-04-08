'use client';

import { LazyMotion, domAnimation, m } from 'framer-motion';
import {
  slideUp,
  staggerContainer,
  staggerItem,
  hoverPresets,
  transitions,
} from '@/lib/design/motion';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { BondMeter } from './bond-meter';
import { CrewPortrait } from './crew-portrait';
import type { CrewMember, Encounter } from '@/lib/living-lore/types';
import { getCrewVisual } from '@/lib/living-lore/crew-visuals';

interface Props {
  member: CrewMember;
  backstory: string | null;
  connectedTexts: Array<{
    slug: string;
    frontmatter: { title: string; excerpt?: string };
  }>;
  encounters: Encounter[];
}

export function CrewDetailView({
  member,
  backstory,
  connectedTexts,
  encounters,
}: Props) {
  const visual = getCrewVisual(member.id);

  return (
    <LazyMotion features={domAnimation} strict>
      <main className="mx-auto max-w-3xl px-6 pb-24 pt-8">
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
                href="/living-lore/crew"
                className="hover:text-atlantean-teal-aqua transition-colors"
              >
                Crew
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-text-primary">{member.name}</li>
          </ol>
        </nav>

        {/* Immersive Hero */}
        <m.header
          variants={slideUp}
          initial="hidden"
          animate="visible"
          className="relative mb-12 overflow-hidden rounded-2xl border border-white/[0.06] p-8"
          style={{
            background: `linear-gradient(to bottom, ${member.color}0A, transparent)`,
          }}
        >
          {/* Portrait + Identity */}
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
            {visual ? (
              <CrewPortrait
                member={member}
                visual={visual}
                size="xl"
                className="shrink-0 animate-float-slow"
              />
            ) : (
              <div
                className="flex h-24 w-24 shrink-0 animate-float-slow items-center justify-center rounded-2xl text-4xl"
                style={{
                  background: `linear-gradient(135deg, ${member.color}15, ${member.color}08)`,
                  boxShadow: `0 0 30px ${member.color}25`,
                }}
              >
                {member.avatar}
              </div>
            )}
            <div className="text-center sm:text-left">
              <h1
                className="font-display text-4xl font-semibold text-text-primary text-glow-soft"
                style={{ textShadow: `0 0 20px ${member.color}40` }}
              >
                {member.name}
              </h1>
              <p
                className="mt-1 text-sm font-medium"
                style={{ color: member.color }}
              >
                {member.title}
              </p>
              <p className="mt-1 text-xs text-text-muted">{member.species}</p>
            </div>
          </div>

          {/* Element + Guardian Stats */}
          <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
            <div className="glass-subtle rounded-xl p-3">
              <span className="mb-1 block text-xs text-text-muted">
                Element
              </span>
              <span className="flex items-center gap-2 text-text-primary">
                <span
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ backgroundColor: member.color }}
                />
                {member.element}
              </span>
            </div>
            <div className="glass-subtle rounded-xl p-3">
              <span className="mb-1 block text-xs text-text-muted">
                Guardian Affinity
              </span>
              <span className="capitalize text-text-primary">
                {member.guardianAffinity}
              </span>
            </div>
          </div>

          {/* Backstory Hook */}
          <p className="mt-6 text-sm leading-relaxed text-text-muted">
            {member.backstoryHook}
          </p>

          {/* Trait Pills */}
          <div className="mt-6 flex flex-wrap gap-2">
            {member.personality.map((trait) => (
              <span
                key={trait}
                className="glass-subtle rounded-full px-3 py-1 text-xs capitalize text-text-muted"
                style={{
                  background: member.color + '08',
                  borderColor: member.color + '15',
                }}
              >
                {trait}
              </span>
            ))}
          </div>

          {/* Talk Button */}
          <div className="mt-6">
            <Link
              href={`/chat/${member.id}`}
              className="liquid-glass inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-300 hover:brightness-110"
              style={{
                borderColor: member.color + '30',
                color: member.color,
              }}
            >
              Talk to {member.name}
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </Link>
          </div>
        </m.header>

        {/* Bond Meter */}
        <m.section
          variants={slideUp}
          initial="hidden"
          animate="visible"
          className="liquid-glass mb-12 rounded-2xl p-6"
        >
          <h2 className="mb-2 font-display text-lg text-text-primary">
            Bond Level
          </h2>
          <p className="mb-4 text-xs text-text-muted">
            Your connection with {member.name} grows through conversation and
            shared encounters.
          </p>
          <BondMeter
            level={0}
            maxLevel={100}
            color={member.color}
            showLabel
            size="lg"
          />
        </m.section>

        {/* Backstory */}
        {backstory && (
          <m.section
            variants={slideUp}
            initial="hidden"
            animate="visible"
            className="mb-12"
          >
            <h2 className="mb-4 font-display text-2xl text-text-primary">
              Backstory
            </h2>
            <div className="prose prose-invert prose-sm max-w-none prose-headings:font-display prose-headings:text-text-primary prose-p:leading-relaxed prose-p:text-text-muted">
              <ReactMarkdown>{backstory}</ReactMarkdown>
            </div>
          </m.section>
        )}

        {/* Encounters */}
        {encounters.length > 0 && (
          <section className="mb-12">
            <h2 className="mb-2 font-display text-2xl text-text-primary">
              Encounters
            </h2>
            <p className="mb-4 text-sm text-text-muted">
              Interactive scenes featuring {member.name}
            </p>
            <m.div
              variants={staggerContainer('normal')}
              initial="hidden"
              animate="visible"
              className="space-y-3"
            >
              {encounters.map((enc) => (
                <m.div key={enc.slug} variants={staggerItem}>
                  <Link
                    href={`/living-lore/encounters/${enc.slug}`}
                    className="group flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition-colors hover:border-atlantean-teal-aqua/20"
                  >
                    <div>
                      <p className="text-sm font-semibold text-text-primary transition-colors group-hover:text-atlantean-teal-aqua">
                        {enc.title}
                      </p>
                      <p className="mt-0.5 text-[11px] text-text-muted">
                        Act {enc.act} &middot; {enc.xpReward} XP
                      </p>
                    </div>
                    <svg
                      className="h-4 w-4 text-text-dim transition-colors group-hover:text-atlantean-teal-aqua"
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
                  </Link>
                </m.div>
              ))}
            </m.div>
          </section>
        )}

        {/* Connected Lore */}
        {connectedTexts.length > 0 && (
          <section>
            <h2 className="mb-4 font-display text-2xl text-text-primary">
              Connected Lore
            </h2>
            <p className="mb-4 text-sm text-text-muted">
              Library texts connected to {member.name}&apos;s journey
            </p>
            <m.div
              variants={staggerContainer('normal')}
              initial="hidden"
              animate="visible"
              className="space-y-3"
            >
              {connectedTexts.slice(0, 6).map((text) => (
                <m.div key={text.slug} variants={staggerItem}>
                  <Link
                    href={`/library/${text.slug}`}
                    className="block rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition-colors hover:border-white/[0.12]"
                  >
                    <p className="text-sm font-semibold text-text-primary">
                      {text.frontmatter.title}
                    </p>
                    {text.frontmatter.excerpt && (
                      <p className="mt-1 line-clamp-2 text-xs text-text-muted">
                        {text.frontmatter.excerpt}
                      </p>
                    )}
                  </Link>
                </m.div>
              ))}
            </m.div>
          </section>
        )}
      </main>
    </LazyMotion>
  );
}
