import { appendFileSync, readFileSync, existsSync, mkdirSync, statSync, renameSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

export interface HistoryEvent {
  ts: string;
  task: string;
  surface: string;
  model: string;
  runtime: string;
  durationMs: number;
  exitCode: number | null;
  promptLen: number;
  /** Optional error snippet (first 200 chars of stderr if nonzero exit). */
  error?: string;
}

const HISTORY_DIR = join(homedir(), '.arcanea');
const HISTORY_PATH = join(HISTORY_DIR, 'history.jsonl');
const MAX_BYTES = 10 * 1024 * 1024; // 10 MB rotate threshold
const MAX_KEEP = 3; // keep up to history.jsonl.0, .1, .2

function ensureDir(): void {
  if (!existsSync(HISTORY_DIR)) mkdirSync(HISTORY_DIR, { recursive: true });
}

function rotateIfNeeded(): void {
  if (!existsSync(HISTORY_PATH)) return;
  const size = statSync(HISTORY_PATH).size;
  if (size < MAX_BYTES) return;

  // Shift .N → .(N+1) up to MAX_KEEP, discarding the oldest.
  for (let i = MAX_KEEP - 1; i >= 0; i--) {
    const src = `${HISTORY_PATH}.${i}`;
    const dst = `${HISTORY_PATH}.${i + 1}`;
    if (existsSync(src)) renameSync(src, dst);
  }
  renameSync(HISTORY_PATH, `${HISTORY_PATH}.0`);
}

export function appendHistory(event: HistoryEvent): void {
  ensureDir();
  rotateIfNeeded();
  const line = JSON.stringify(event) + '\n';
  try {
    appendFileSync(HISTORY_PATH, line, 'utf8');
  } catch {
    // History is non-critical. Swallow errors so they don't break the run.
  }
}

export function readHistory(limit?: number): HistoryEvent[] {
  if (!existsSync(HISTORY_PATH)) return [];
  try {
    const raw = readFileSync(HISTORY_PATH, 'utf8');
    const events: HistoryEvent[] = [];
    for (const line of raw.split('\n')) {
      if (!line.trim()) continue;
      try {
        events.push(JSON.parse(line) as HistoryEvent);
      } catch {
        // Skip malformed lines rather than fail the whole read.
      }
    }
    return limit ? events.slice(-limit) : events;
  } catch {
    return [];
  }
}

export function historyPath(): string {
  return HISTORY_PATH;
}

/**
 * Aggregate: per-task → per-model → stats.
 */
export interface TaskStats {
  task: string;
  model: string;
  runs: number;
  successes: number;
  avgDurationMs: number;
  successRate: number;
}

export function aggregateStats(events: HistoryEvent[]): TaskStats[] {
  const key = (e: HistoryEvent) => `${e.task}::${e.model}`;
  const groups = new Map<string, HistoryEvent[]>();
  for (const e of events) {
    const k = key(e);
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k)!.push(e);
  }
  const stats: TaskStats[] = [];
  for (const [k, evs] of groups) {
    const [task, model] = k.split('::');
    const runs = evs.length;
    const successes = evs.filter((e) => e.exitCode === 0).length;
    const avgDurationMs = Math.round(
      evs.reduce((sum, e) => sum + e.durationMs, 0) / runs,
    );
    stats.push({
      task,
      model,
      runs,
      successes,
      successRate: successes / runs,
      avgDurationMs,
    });
  }
  return stats.sort((a, b) => b.runs - a.runs);
}
