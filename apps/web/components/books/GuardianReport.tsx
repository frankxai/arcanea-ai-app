/**
 * GuardianReport — server component that loads the latest Guardian review
 * for a book and renders the composite score, grade badge, radar chart,
 * and per-Guardian breakdown cards.
 *
 * Fetches directly via the admin client (guardian_reviews has public SELECT,
 * but using admin here keeps the read path consistent with the scorer and
 * works even when the user is logged out).
 *
 * Handles the empty state ("not yet reviewed") and the DB-unavailable state
 * gracefully — this component should NEVER break page render.
 */

import { loadLatestReport } from '@/lib/books/guardian-scorer';
import type { GuardianScore } from '@/lib/books/guardian-scorer';
import { GuardianRadar, type GuardianGrade } from './GuardianRadar';
import { GuardianNotesToggle } from './GuardianNotesToggle';

interface GuardianReportProps {
  bookSlug: string;
}

interface GuardianDisplay {
  id: string;
  name: string;
  dimension: string;
  icon: string;
  accent: string;
  tagline: string;
}

// Visual metadata for each Guardian card (kept in sync with guardian-prompts.ts)
const GUARDIAN_DISPLAY: Record<string, GuardianDisplay> = {
  alera: {
    id: 'alera',
    name: 'Alera',
    dimension: 'Voice',
    icon: 'VOI',
    accent: 'text-cyan-300',
    tagline: 'Guardian of the Voice Gate',
  },
  draconia: {
    id: 'draconia',
    name: 'Draconia',
    dimension: 'Craft',
    icon: 'CRF',
    accent: 'text-red-300',
    tagline: 'Guardian of the Craft Gate',
  },
  lyria: {
    id: 'lyria',
    name: 'Lyria',
    dimension: 'Originality',
    icon: 'ORG',
    accent: 'text-violet-300',
    tagline: 'Guardian of the Originality Gate',
  },
  lyssandria: {
    id: 'lyssandria',
    name: 'Lyssandria',
    dimension: 'Depth',
    icon: 'DPT',
    accent: 'text-emerald-300',
    tagline: 'Guardian of the Depth Gate',
  },
  maylinn: {
    id: 'maylinn',
    name: 'Maylinn',
    dimension: 'Resonance',
    icon: 'RES',
    accent: 'text-amber-300',
    tagline: 'Guardian of the Resonance Gate',
  },
};

const GRADE_BADGE: Record<
  GuardianGrade,
  { label: string; color: string; border: string; bg: string }
> = {
  luminor: {
    label: 'Luminor Grade',
    color: 'text-[#ffd700]',
    border: 'border-[#ffd700]/30',
    bg: 'bg-[#ffd700]/[0.06]',
  },
  master: {
    label: 'Master Grade',
    color: 'text-slate-200',
    border: 'border-slate-300/30',
    bg: 'bg-slate-300/[0.05]',
  },
  apprentice: {
    label: 'Apprentice Grade',
    color: 'text-[#cd7f32]',
    border: 'border-[#cd7f32]/30',
    bg: 'bg-[#cd7f32]/[0.06]',
  },
  none: {
    label: 'Unrated',
    color: 'text-white/50',
    border: 'border-white/[0.08]',
    bg: 'bg-white/[0.02]',
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
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-10 text-center backdrop-blur-sm">
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
      </div>
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
  const badge = GRADE_BADGE[grade];

  return (
    <section className="max-w-3xl mx-auto px-6 pb-16">
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-8 backdrop-blur-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-[10px] uppercase tracking-[0.3em] text-white/30 mb-3">
            Guardian Intelligence Rating
          </p>
          <div className="flex items-baseline justify-center gap-2 mb-3">
            <span className="text-6xl font-display font-bold text-white/95">
              {composite.toFixed(1)}
            </span>
            <span className="text-xl text-white/30 font-mono">/ 10</span>
          </div>
          <span
            className={`inline-block text-[11px] uppercase tracking-[0.2em] px-3 py-1.5 rounded-full border ${badge.border} ${badge.bg} ${badge.color}`}
          >
            {badge.label}
          </span>
        </div>

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
              <div
                key={`${s.guardian}:${s.dimension}`}
                className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 hover:bg-white/[0.04] transition-colors"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <p className={`text-xs font-mono uppercase tracking-wider ${display.accent}/80`}>
                      {display.icon} &middot; {display.dimension}
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
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between text-[10px] uppercase tracking-wider text-white/25">
          <span>Last assessed: {daysAgo(assessedAt)}</span>
          <span className="font-mono">{scores[0]?.modelId || 'claude'}</span>
        </div>
      </div>
    </section>
  );
}
