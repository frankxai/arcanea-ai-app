/**
 * Arcanea Arena — Season 0 ledger loader
 *
 * The JSON ledger (data/challenges/season-0.json) is the source of truth for
 * every number the challenges page shows. Scores are written to it by the
 * maintainer-run judge pipeline via PR, so every public stat traces to a
 * commit. Spec: docs/superpowers/specs/2026-07-02-worldsmith-trials-season-0-design.md
 */

import ledgerJson from '@/data/challenges/season-0.json';

export type SeasonStatus = 'draft' | 'open' | 'judging' | 'complete';

export interface LedgerEntry {
  id: string;
  entrant: string;
  skill: string;
  submittedAt: string;
  prUrl: string;
  valid: boolean;
}

export interface LedgerScore {
  entryId: string;
  dimensions: Record<string, number>;
  judgeTotal: number;
  communitySignal: number;
  finalScore: number;
  canon: 'pass' | 'fail';
}

export interface LeaderboardRow {
  rank: number;
  entryId: string;
  finalScore: number;
}

export interface SeasonLedger {
  schema: string;
  program: string;
  season: number;
  title: string;
  tagline: string;
  status: SeasonStatus;
  opensAt: string | null;
  closesAt: string | null;
  rulesUrl: string;
  seeds: string[];
  prize: { label: string } | null;
  entries: LedgerEntry[];
  scores: LedgerScore[];
  leaderboard: LeaderboardRow[];
}

export const seasonZero = ledgerJson as SeasonLedger;

export interface ArenaStats {
  activeChallenges: number;
  entries: number;
  entrants: number;
  judgedEntries: number;
}

/** Every stat is derived from the ledger — nothing is hand-written. */
export function getArenaStats(ledger: SeasonLedger = seasonZero): ArenaStats {
  return {
    activeChallenges: ledger.status === 'open' ? 1 : 0,
    entries: ledger.entries.length,
    entrants: new Set(ledger.entries.map((e) => e.entrant)).size,
    judgedEntries: ledger.scores.length,
  };
}

export function getEntryById(id: string, ledger: SeasonLedger = seasonZero): LedgerEntry | undefined {
  return ledger.entries.find((e) => e.id === id);
}

/** Human label for the prize — never a number unless the ledger carries one. */
export function getPrizeLabel(ledger: SeasonLedger = seasonZero): string {
  return ledger.prize?.label ?? 'Recognition + plugin distribution';
}

export function getSeasonStatusLabel(ledger: SeasonLedger = seasonZero): string {
  switch (ledger.status) {
    case 'draft':
      return 'Announced — not yet open';
    case 'open':
      return 'Open for entries';
    case 'judging':
      return 'Judging in progress';
    case 'complete':
      return 'Complete';
  }
}
