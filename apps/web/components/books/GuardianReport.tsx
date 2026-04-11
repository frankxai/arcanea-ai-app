/**
 * GuardianReport — server component that loads the latest Guardian review
 * for a book and renders the composite score, grade badge, radar chart,
 * and per-Guardian breakdown cards.
 *
 * Built on Card + Badge + GlassCard primitives and lucide-react icons.
 * Handles the empty state and DB-unavailable state gracefully — this
 * component should NEVER break page render.
 */

import type { ReactNode } from 'react';
import {
  Sparkles,
  Award,
  Star,
  Feather,
  Flame,
  Lightbulb,
  Compass,
  Heart,
} from 'lucide-react';
import { loadLatestReport } from '@/lib/books/guardian-scorer';
import type { GuardianScore } from '@/lib/books/guardian-scorer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge, type BadgeProps } from '@/components/ui/badge';
import { GuardianRadar, type GuardianGrade } from './GuardianRadar';
import { GuardianNotesToggle } from './GuardianNotesToggle';

interface GuardianReportProps {
  bookSlug: string;
}

interface GuardianDisplay {
  name: string;
  dimension: string;
  icon: ReactNode;
  accent: string;
  tagline: string;
}

const GUARDIAN_DISPLAY: Record<string, GuardianDisplay> = {
  alera: {
    name: 'Alera',
    dimension: 'Voice',
    icon: <Feather className="h-4 w-4" aria-hidden="true" />,
    accent: 'text-cyan-300',
    tagline: 'Guardian of the Voice Gate',
  },
  draconia: {
    name: 'Draconia',
    dimension: 'Craft',
    icon: <Flame className="h-4 w-4" aria-hidden="true" />,
    accent: 'text-red-300',
    tagline: 'Guardian of the Craft Gate',
  },
  lyria: {
    name: 'Lyria',
    dimension: 'Originality',
    icon: <Lightbulb className="h-4 w-4" aria-hidden="true" />,
    accent: 'text-violet-300',
    tagline: 'Guardian of the Originality Gate',
  },
  lyssandria: {
    name: 'Lyssandria',
    dimension: 'Depth',
    icon: <Compass className="h-4 w-4" aria-hidden="true" />,
    accent: 'text-emerald-300',
    tagline: 'Guardian of the Depth Gate',
  },
  maylinn: {
    name: 'Maylinn',
    dimension: 'Resonance',
    icon: <Heart className="h-4 w-4" aria-hidden="true" />,
    accent: 'text-amber-300',
    tagline: 'Guardian of the Resonance Gate',
  },
};

interface GradeMeta {
  label: string;
  variant: BadgeProps['variant'];
  icon: ReactNode;
}

const GRADE_META: Record<GuardianGrade, GradeMeta> = {
  luminor: {
    label: 'Luminor Grade',
    variant: 'gold',
    icon: <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />,
  },
  master: {
    label: 'Master Grade',
    variant: 'outline',
    icon: <Award className="h-3.5 w-3.5" aria-hidden="true" />,
  },
  apprentice: {
    label: 'Apprentice Grade',
    variant: 'fire',
    icon: <Star className="h-3.5 w-3.5" aria-hidden="true" />,
  },
  none: {
    label: 'Unrated',
    variant: 'outline',
    icon: null,
  },
};

function daysAgo(iso: string): string {
  const then = new Date(iso).getTime();
  if (!Number.isFinite(then)) return 'recently';
  const diffMs = Date.now() - then;
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (days <= 0) {
    const hours = Math.max(1, Math.floor(diffMs / (1000 * 60 * 60)));
    return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  }
  if (days === 1) return '1 day ago';
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  return months === 1 ? '1 month ago' : `${months} months ago`;
}

function scoresByDimension(scores: GuardianScore[]): {
  voice: number;
  craft: number;
  originality: number;
  depth: number;
  resonance: number;
} {
  const out = { voice: 0, craft: 0, originality: 0, depth: 0, resonance: 0 };
  for (const s of scores) {
    if (s.dimension in out) {
      out[s.dimension as keyof typeof out] = s.score;
    }
  }
  return out;
}

function EmptyState() {
  return (
    <section className="max-w-3xl mx-auto px-6 pb-16">
      <Card variant="ghost" className="p-10 text-center backdrop-blur-sm">
        <p className="text-[10px] uppercase tracking-[0.3em] text-white/30 mb-3">
          Guardian Intelligence
        </p>
        <h2 className="text-lg font-display font-semibold text-white/80 mb-3">
          Not yet reviewed by the Guardians
        </h2>
        <p className="text-sm text-white/40 max-w-md mx-auto leading-relaxed">
          Five Guardians stand ready to read this draft — Alera, Draconia,
          Lyria, Lyssandria, and Maylinn. The author can call them from the
          draft studio when the work is ready.
        </p>
      </Card>
    </section>
  );
}

export default async function GuardianReport({ bookSlug }: GuardianReportProps) {
  let report: Awaited<ReturnType<typeof loadLatestReport>> = null;
  try {
    report = await loadLatestReport(bookSlug);
  } catch (err) {
    // DB unavailable — render empty state, do not crash the page
    console.error('[GuardianReport] load failed:', err);
    return <EmptyState />;
  }

  if (!report || report.scores.length === 0) {
    return <EmptyState />;
  }

  const { scores, composite, grade, assessedAt } = report;
  const radarScores = scoresByDimension(scores);
  const gradeMeta = GRADE_META[grade];

  return (
    <section className="max-w-3xl mx-auto px-6 pb-16 space-y-6">
      {/* Composite score card */}
      <Card variant="ghost" className="backdrop-blur-sm">
        <CardHeader className="items-center text-center">
          <p className="text-[10px] uppercase tracking-[0.3em] text-white/30">
            Guardian Intelligence Rating
          </p>
          <CardTitle className="flex items-baseline justify-center gap-2 text-6xl font-bold text-white/95">
            {composite.toFixed(1)}
            <span className="text-xl text-white/30 font-mono">/ 10</span>
          </CardTitle>
          <div className="pt-2">
            <Badge variant={gradeMeta.variant} icon={gradeMeta.icon} className="uppercase tracking-[0.2em]">
              {gradeMeta.label}
            </Badge>
          </div>
        </CardHeader>

        <CardContent>
          {/* Radar */}
          <div className="flex justify-center mb-8">
            <GuardianRadar scores={radarScores} grade={grade} size={320} />
          </div>

          {/* Per-Guardian cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {scores.map((s) => {
              const display = GUARDIAN_DISPLAY[s.guardian];
              if (!display) return null;
              return (
                <Card
                  key={`${s.guardian}:${s.dimension}`}
                  variant="ghost"
                  className="p-4 hover:bg-white/[0.04] transition-colors"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <p className={`flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider ${display.accent}`}>
                        {display.icon}
                        <span>{display.dimension}</span>
                      </p>
                      <p className="text-sm font-display font-semibold text-white/85 mt-0.5">
                        {display.name}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-display font-bold text-white/90 leading-none font-mono">
                        {s.score.toFixed(1)}
                      </p>
                      <p className="text-[10px] text-white/30">/ 10</p>
                    </div>
                  </div>

                  <p className="text-xs text-white/60 leading-relaxed italic mb-3">
                    &ldquo;{s.assessment}&rdquo;
                  </p>

                  <GuardianNotesToggle notes={s.detailedNotes} />
                </Card>
              );
            })}
          </div>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between text-[10px] uppercase tracking-wider text-white/25">
            <span>Last assessed: {daysAgo(assessedAt)}</span>
            <span className="font-mono">{scores[0]?.modelId || 'claude'}</span>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
