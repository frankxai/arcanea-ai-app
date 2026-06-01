/**
 * `verify` regenerates derived.ts in-place (without GitHub enrichment) and
 * compares it (modulo timestamps) to the committed copy. Used by CI to fail
 * builds when the manifest or scans drift from what's checked in.
 *
 * Verify's job is STRUCTURAL integrity (nodes, edges, names, layers, statuses
 * derived from manifest+repos). To make the comparison deterministic across
 * environments, verify always forces `skipGitHub: true` — this means:
 *
 * - `lastCommitAt` is never populated by verify
 * - `status` is computed via the fallback path in `inferStatus` (no
 *   freshness-based `wip`/`sunset` reclassification)
 *
 * The committed derived.ts must be regenerated with `skipGitHub: true` as
 * well (e.g. via `pnpm -F @arcanea/orchestrator ecosystem:build`) so the
 * committed snapshot matches verify's output.
 *
 * Note: this is in tension with the originally-suggested
 * `skipGitHub: !process.env.GITHUB_TOKEN`. That suggestion produces an
 * asymmetry — when a token is available, enrichment populates `lastCommitAt`
 * AND `status` (via the >90d/>365d age branches in `inferStatus`), which
 * would never match a committed snapshot regenerated without a token.
 * Forcing `skipGitHub: true` here keeps verify deterministic. Enrichment is
 * the responsibility of `ecosystem-weekly-refresh`, which writes the
 * enriched derived.ts and commits it — when that flow lands, verify will
 * need an extension to strip enrichment-derived fields (lastCommitAt + the
 * freshness-influenced status values) from both sides.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { build } from './build.js';

export interface VerifyResult {
  drift: boolean;
  message: string;
}

const NORMALIZE_GENERATED_AT = /export const GENERATED_AT = "[^"]+";/;
const NORMALIZE_LAST_VERIFIED = /"?lastVerifiedAt"?: "[^"]+"/g;

function normalize(s: string): string {
  return s
    .replace(NORMALIZE_GENERATED_AT, 'export const GENERATED_AT = "<normalized>";')
    .replace(NORMALIZE_LAST_VERIFIED, 'lastVerifiedAt: "<normalized>"');
}

export async function verify(repoRoot: string): Promise<VerifyResult> {
  const derivedPath = path.join(repoRoot, 'apps/web/lib/ecosystem/derived.ts');
  let existing: string;
  try {
    existing = await fs.readFile(derivedPath, 'utf8');
  } catch {
    return {
      drift: true,
      message: 'derived.ts missing — run `pnpm -F @arcanea/orchestrator ecosystem:build` and commit',
    };
  }

  // Force skipGitHub: true for deterministic structural comparison. See file
  // header for the trade-off rationale.
  const { outPath } = await build({ repoRoot, skipGitHub: true });
  // build() overwrites derived.ts. Read the freshly-written version.
  const fresh = await fs.readFile(outPath, 'utf8');

  if (normalize(existing) === normalize(fresh)) {
    // No semantic drift — restore the original (preserves committed timestamp).
    await fs.writeFile(derivedPath, existing, 'utf8');
    return { drift: false, message: 'derived.ts is in sync' };
  }

  // Drift: leave the fresh version on disk so the developer sees the diff.
  return {
    drift: true,
    message: 'derived.ts is stale — re-run `pnpm -F @arcanea/orchestrator ecosystem:build` and commit the diff',
  };
}
