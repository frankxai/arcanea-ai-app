/**
 * Infer ecosystem node status from layer, consumer count, externality,
 * publicUrl, and freshness (lastCommitAt).
 *
 * Precedence: explicit override → external → staleness → orphan → shipped → built.
 * Staleness windows: >365d ⇒ sunset, >90d ⇒ wip.
 */
import type { Status, Layer } from './schema.js';

export type { Status, Layer };

export interface InferenceInput {
  layer: Layer;
  consumedByCount: number;
  isExternal: boolean;
  statusOverride?: Status;
  publicUrl?: string;
  lastCommitAt?: string;
  /** ISO timestamp used as `now` for age math (injected for testability). */
  now: string;
}

const DAY_MS = 24 * 60 * 60 * 1000;

export function inferStatus(input: InferenceInput): Status {
  if (input.statusOverride) return input.statusOverride;
  if (input.isExternal) return 'external';

  if (input.lastCommitAt) {
    const ageDays = (Date.parse(input.now) - Date.parse(input.lastCommitAt)) / DAY_MS;
    if (ageDays > 365) return 'sunset';
    if (ageDays > 90) return 'wip';
  }

  if (input.layer === 'product' && input.consumedByCount === 0) return 'orphan';
  if (input.publicUrl && input.consumedByCount > 0) return 'shipped';
  if (input.consumedByCount > 0) return 'built';

  return input.layer === 'surface' ? 'shipped' : 'built';
}
