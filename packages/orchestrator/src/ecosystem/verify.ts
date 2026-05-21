/**
 * `verify` regenerates derived.ts in-place and compares it (modulo timestamps)
 * to the committed copy. Used by CI to fail builds when the manifest or
 * scans drift from what's checked in.
 *
 * If the regenerated content matches the existing one (after normalising
 * GENERATED_AT and lastVerifiedAt), the original file is restored to keep
 * the committed timestamp stable.
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
