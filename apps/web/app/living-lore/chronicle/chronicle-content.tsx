'use client';

import Link from 'next/link';
import { LazyMotion, domAnimation, m } from 'framer-motion';
import { slideUp, staggerContainer, staggerItem } from '@/lib/design/motion';
import { getCrewMember } from '@/lib/living-lore/crew-data';
import type { ActInfo } from '@/lib/living-lore/types';
import { ScrollToTop } from '@/components/living-lore/scroll-to-top';

const GATE_ELEMENT_COLORS: Record<number, string> = {
  1: '#32CD32', 2: '#4169E1', 3: '#FF6B35', 4: '#4169E1', 5: '#C0C0C0',
  6: '#9370DB', 7: '#9370DB', 8: '#9370DB', 9: '#9370DB', 10: '#FFD700',
};

interface ActStub {
  number: number;
  title: string;
  subtitle: string;
  guardianName: string;
}

interface ChronicleContentProps {
  acts: ActInfo[];
  allActs: ActStub[];
}

export function ChronicleContent({ acts, allActs }: ChronicleContentProps) {
  const actMap = new Map(acts.map((a) => [a.number, a]));

  return (
    <LazyMotion features={domAnimation}>
      <main className="mx-auto max-w-5xl px-6 pb-24 pt-8">
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
            <li className="text-text-primary">Chronicle</li>
          </ol>
        </nav>

        <m.header
          className="mb-12 text-center"
          variants={slideUp}
          initial="hidden"
          animate="visible"
        >
          <h1 className="font-display text-4xl font-semibold text-text-primary md:text-5xl">
            The Chronicle
          </h1>
          <p className="mt-3 text-lg text-text-muted">
            Ten Acts. Ten Gates. The full journey.
          </p>
        </m.header>

        <m.div
          className="space-y-8"
          variants={staggerContainer('normal')}
          initial="hidden"
          animate="visible"
        >
          {allActs.map((actStub) => {
            const act = actMap.get(actStub.number);
            const hasEpisodes = act && act.episodes.length > 0;
            const color = GATE_ELEMENT_COLORS[actStub.number];

            return (
              <m.section
                key={actStub.number}
                variants={staggerItem}
                className="group rounded-2xl border bg-white/[0.03] p-6 transition-all duration-300"
                style={{
                  borderColor: `${color}20`,
                }}
                whileHover={{
                  boxShadow: `0 0 20px ${color}10, inset 0 0 20px ${color}05`,
                }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <span
                    className="flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold"
                    style={{
                      backgroundColor: `${color}15`,
                      color: color,
                      boxShadow: `0 0 12px ${color}30`,
                    }}
                  >
                    {actStub.number}
                  </span>
                  <div>
                    <h2 className="font-display text-xl font-semibold text-text-primary">
                      Act {actStub.number}: {actStub.title}
                    </h2>
                    <p className="text-xs text-text-muted">
                      {actStub.subtitle} &middot; Gate {actStub.number} &middot;
                      Guardian:{' '}
                      <span
                        className="font-medium"
                        style={{
                          color: color,
                          textShadow: `0 0 8px ${color}40`,
                        }}
                      >
                        {actStub.guardianName}
                      </span>
                    </p>
                  </div>
                </div>

                {hasEpisodes ? (
                  <div className="space-y-3">
                    {act.episodes.map((ep) => {
                      const perspectiveMembers = ep.perspectives
                        .map((id) => getCrewMember(id))
                        .filter(Boolean);

                      return (
                        <Link
                          key={ep.slug}
                          href={`/living-lore/chronicle/${ep.slug}`}
                          className="flex items-center justify-between rounded-xl glass-subtle p-4 hover:border-white/[0.12] transition-all duration-200 group/ep"
                        >
                          <div>
                            <p className="text-sm font-semibold text-text-primary group-hover/ep:text-atlantean-teal-aqua transition-colors">
                              Episode {ep.episodeNumber}: {ep.title}
                            </p>
                            {perspectiveMembers.length > 0 && (
                              <div className="mt-1.5 flex items-center gap-1.5">
                                {perspectiveMembers.map((member) =>
                                  member ? (
                                    <span
                                      key={member.id}
                                      className="flex h-5 w-5 items-center justify-center rounded-full text-[10px]"
                                      style={{ backgroundColor: `${member.color}20`, color: member.color }}
                                      title={member.name}
                                    >
                                      {member.avatar}
                                    </span>
                                  ) : null
                                )}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {ep.connectedLore.length > 0 && (
                              <span
                                className="rounded-full px-2 py-0.5 text-[10px] font-medium"
                                style={{
                                  backgroundColor: `${color}15`,
                                  color: color,
                                }}
                              >
                                {ep.connectedLore.length} lore
                              </span>
                            )}
                            <svg className="h-4 w-4 text-text-dim group-hover/ep:text-atlantean-teal-aqua transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-text-muted italic">Coming soon</p>
                )}
              </m.section>
            );
          })}
        </m.div>

        <ScrollToTop />
      </main>
    </LazyMotion>
  );
}
