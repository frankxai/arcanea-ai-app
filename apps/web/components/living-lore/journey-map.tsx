'use client';

import { LazyMotion, domMax, m } from 'framer-motion';
import { staggerContainer, staggerItem, hoverPresets } from '@/lib/design/motion';
import Link from 'next/link';
import type { ActInfo } from '@/lib/living-lore/types';

/** Element colors keyed by gate number */
const GATE_ELEMENT_COLORS: Record<number, string> = {
  1: '#32CD32', // Foundation / Earth
  2: '#4169E1', // Flow / Water
  3: '#FF6B35', // Fire
  4: '#4169E1', // Heart / Water
  5: '#C0C0C0', // Voice / Wind
  6: '#9370DB', // Sight / Void
  7: '#9370DB', // Crown / Void
  8: '#9370DB', // Starweave / Void
  9: '#9370DB', // Unity / Void
  10: '#FFD700', // Source / Spirit
};

const GATE_NAMES: Record<number, string> = {
  1: 'Foundation',
  2: 'Flow',
  3: 'Fire',
  4: 'Heart',
  5: 'Voice',
  6: 'Sight',
  7: 'Crown',
  8: 'Starweave',
  9: 'Unity',
  10: 'Source',
};

interface JourneyMapProps {
  acts: ActInfo[];
  gatesOpen?: number;
}

export function JourneyMap({ acts, gatesOpen = 0 }: JourneyMapProps) {
  // Build data: if we have acts use them, otherwise show all 10 gates as placeholders
  const hasActs = acts.length > 0;

  const nodes: Array<{
    gate: number;
    title: string;
    subtitle: string;
    guardianName: string;
    episodes: ActInfo['episodes'];
    status: 'completed' | 'current' | 'locked';
  }> = hasActs
    ? acts.map((act) => ({
        gate: act.gate,
        title: act.title,
        subtitle: act.subtitle,
        guardianName: act.guardianName,
        episodes: act.episodes,
        status:
          act.gate < gatesOpen
            ? 'completed'
            : act.gate === gatesOpen
              ? 'current'
              : 'locked',
      }))
    : Array.from({ length: 10 }, (_, i) => ({
        gate: i + 1,
        title: GATE_NAMES[i + 1] ?? `Gate ${i + 1}`,
        subtitle: 'Coming soon',
        guardianName: '',
        episodes: [],
        status: 'locked' as const,
      }));

  return (
    <LazyMotion features={domMax} strict>
      <m.div
        variants={staggerContainer('slow')}
        initial="hidden"
        animate="visible"
        className="relative pl-8"
      >
        {/* Connecting line */}
        <div className="absolute left-[19px] top-0 bottom-0 w-0.5">
          {/* Background track */}
          <div className="absolute inset-0 bg-white/[0.06] rounded-full" />
          {/* Completed portion */}
          {gatesOpen > 0 && (
            <div
              className="absolute top-0 left-0 right-0 bg-atlantean-teal-aqua/40 rounded-full transition-all duration-700"
              style={{
                height: `${Math.min(100, (gatesOpen / nodes.length) * 100)}%`,
              }}
            />
          )}
        </div>

        {nodes.map((node) => {
          const color = GATE_ELEMENT_COLORS[node.gate] ?? '#9370DB';
          const isCompleted = node.status === 'completed';
          const isCurrent = node.status === 'current';
          const isLocked = node.status === 'locked';

          return (
            <m.div
              key={node.gate}
              variants={staggerItem}
              className="relative flex items-start gap-4 pb-8 last:pb-0"
            >
              {/* Gate circle */}
              <div
                className={`relative z-10 flex h-10 w-10 shrink-0 -ml-8 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all duration-300 ${
                  isCompleted
                    ? 'glow-soft'
                    : isCurrent
                      ? 'animate-pulse-glow'
                      : ''
                }`}
                style={{
                  borderColor: isLocked ? 'rgba(255,255,255,0.08)' : color,
                  backgroundColor: isCompleted
                    ? color + '33'
                    : isCurrent
                      ? color + '1A'
                      : 'rgba(255,255,255,0.03)',
                  boxShadow: isCompleted
                    ? `0 0 12px ${color}30`
                    : isCurrent
                      ? `0 0 16px ${color}25`
                      : 'none',
                  color: isLocked ? 'rgba(255,255,255,0.25)' : color,
                }}
              >
                {node.gate}
              </div>

              {/* Act card */}
              <m.div
                {...(hasActs && !isLocked ? hoverPresets.card : {})}
                className={`flex-1 rounded-xl border p-4 transition-all duration-300 ${
                  isLocked
                    ? 'border-white/[0.04] bg-white/[0.01]'
                    : 'border-white/[0.06] bg-white/[0.03] hover:liquid-glass'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="min-w-0 flex-1">
                    <h3
                      className={`font-cinzel text-base font-semibold ${
                        isLocked
                          ? 'text-text-dim'
                          : 'text-text-primary'
                      }`}
                    >
                      {node.title}
                    </h3>
                    <p
                      className={`text-xs ${
                        isLocked ? 'text-text-dim' : 'text-text-muted'
                      }`}
                    >
                      {node.subtitle}
                    </p>
                  </div>
                  {node.episodes.length > 0 && (
                    <span className="shrink-0 rounded-full bg-white/[0.06] px-2 py-0.5 text-[10px] text-text-muted">
                      {node.episodes.length} ep.
                    </span>
                  )}
                </div>

                {node.guardianName && (
                  <p
                    className={`mt-2 text-xs ${
                      isLocked ? 'text-text-dim' : 'text-text-muted'
                    }`}
                  >
                    Gate {node.gate} &middot; Guardian: {node.guardianName}
                  </p>
                )}

                {/* Episode links */}
                {node.episodes.length > 0 && (
                  <ul className="mt-3 space-y-1">
                    {node.episodes.map((ep) => (
                      <li key={ep.slug}>
                        <Link
                          href={`/living-lore/chronicle/${ep.slug}`}
                          className="text-sm text-text-muted transition-colors hover:text-atlantean-teal-aqua"
                        >
                          Ep. {ep.episodeNumber}: {ep.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}

                {!hasActs && (
                  <p className="mt-2 text-xs italic text-text-dim">
                    The chronicle is being written...
                  </p>
                )}
              </m.div>
            </m.div>
          );
        })}
      </m.div>
    </LazyMotion>
  );
}
