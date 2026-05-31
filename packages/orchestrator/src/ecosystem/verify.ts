/**
 * `verify` regenerates derived.ts in-place and compares it (modulo timestamps
 * and enrichment-from-GitHub fields) to the committed copy. Used by CI to fail
 * builds when the manifest or scans drift from what's checked in.
 *
 * Verify's job is STRUCTURAL integrity (nodes, edges, names, layers, statuses
 * derived from manifest+repos). Freshness of GitHub-enriched fields is owned
 * by `ecosystem-weekly-refresh`, not verify.
 *
 * The previous compare also stripped lastCommitAt as a string-substitution,
 * but `lastCommitAt` is optional in the schema and may be ABSENT (not just
 * null) in derived.ts when build runs without enrichment. A simple
 * `"lastCommitAt": "..."` → `<normalized>` substitution doesn't equate a
 * present field with a missing one. So we strip the entire field line from
 * both sides (along with the optional comma + trailing whitespace) before
 * comparing.
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
// Strip the entire lastCommitAt line (incl. trailing comma + line break) so
// "present" and "absent" both reduce to the same shape.
const STRIP_LAST_COMMIT_LINE = /[ \t]*"?lastCommitAt"?: (?:"[^"]+"|null),?\s*\n/g;

function normalize(s: string): string {
  return s
    .replace(NORMALIZE_GENERATED_AT, 'export const GENERATED_AT = "<normalized>";')
    .replace(NORMALIZE_LAST_VERIFIED, 'lastVerifiedAt: "<normalized>"')
    .replace(STRIP_LAST_COMMIT_LINE, '');
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

  const { outPath } = await build({ repoRoot, skipGitHub: !process.env.GITHUB_TOKEN });
  // build() overwrites derived.ts. Read the freshly-written version.
  const fresh = await fs.readFile(outPath, 'utf8');

  if (normalize(existing) === normalize(fresh)) {
    // No semantic drift — restore the original (preserves committed timestamps + enrichment).
    await fs.writeFile(derivedPath, existing, 'utf8');
    return { drift: false, message: 'derived.ts is in sync (structural)' };
  }

  // Drift: leave the fresh version on disk so the developer sees the diff.
  return {
    drift: true,
    message: 'derived.ts is stale — re-run `pnpm -F @arcanea/orchestrator ecosystem:build` and commit the diff',
  };
}
