import type { HistoryEvent } from './history.js';

/**
 * Adaptive routing — re-rank candidate models based on local success history.
 *
 * Scoring formula (additive, then sort desc):
 *   score(model) = baseScore(rank position)
 *                + successBonus(successRate, runs)
 *                + speedBonus(avgDurationMs)
 *                - failurePenalty(recent failures)
 *
 * Weights are tuned conservatively so adaptive routing never overrides
 * preference + surface auth-tier logic — it only re-orders within the
 * already-preference-filtered list.
 */

const MIN_RUNS_FOR_SIGNAL = 3;
const MIN_EVENTS_FOR_ADAPTIVE = 10;

export interface ModelStats {
  model: string;
  runs: number;
  successes: number;
  avgDurationMs: number;
  recentFailures: number;
}

export function computeStats(
  events: HistoryEvent[],
  taskId: string,
): Map<string, ModelStats> {
  const stats = new Map<string, ModelStats>();
  // Look at last 100 events for the task; older data is less relevant.
  const relevant = events.filter((e) => e.task === taskId).slice(-100);
  // Recent failures = last 10 events, count of non-zero exits.
  const recentCutoff = relevant.slice(-10);

  for (const event of relevant) {
    let rec = stats.get(event.model);
    if (!rec) {
      rec = {
        model: event.model,
        runs: 0,
        successes: 0,
        avgDurationMs: 0,
        recentFailures: 0,
      };
      stats.set(event.model, rec);
    }
    rec.runs += 1;
    if (event.exitCode === 0) rec.successes += 1;
    rec.avgDurationMs =
      (rec.avgDurationMs * (rec.runs - 1) + event.durationMs) / rec.runs;
  }

  // Count recent failures per model.
  for (const event of recentCutoff) {
    if (event.exitCode !== 0) {
      const rec = stats.get(event.model);
      if (rec) rec.recentFailures += 1;
    }
  }

  return stats;
}

/**
 * Re-rank candidates given a task's history. Returns a new ordered list.
 * Unknown models (no data) preserve their input position.
 */
export function adaptiveRerank(
  candidates: string[],
  events: HistoryEvent[],
  taskId: string,
): string[] {
  if (events.length < MIN_EVENTS_FOR_ADAPTIVE) return candidates;

  const stats = computeStats(events, taskId);

  const scored = candidates.map((model, idx) => {
    const rec = stats.get(model);
    // Base score: input rank (higher idx = worse).
    let score = candidates.length - idx;

    if (rec && rec.runs >= MIN_RUNS_FOR_SIGNAL) {
      const successRate = rec.successes / rec.runs;
      // Success bonus: 0 (0%) → 10 (100%) points.
      score += successRate * 10;
      // Speed bonus: under 5s → +2, 5-15s → +1, over 30s → -1.
      if (rec.avgDurationMs < 5_000) score += 2;
      else if (rec.avgDurationMs < 15_000) score += 1;
      else if (rec.avgDurationMs > 30_000) score -= 1;
      // Recent failure penalty: -3 per recent failure.
      score -= rec.recentFailures * 3;
    }

    return { model, score, rec };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.map((s) => s.model);
}

export function shouldApplyAdaptive(
  mode: 'auto' | 'on' | 'off' | undefined,
  eventCount: number,
): boolean {
  if (mode === 'off') return false;
  if (mode === 'on') return true;
  // auto (default): enable once we have enough signal
  return eventCount >= MIN_EVENTS_FOR_ADAPTIVE;
}
