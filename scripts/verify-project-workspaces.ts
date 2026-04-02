#!/usr/bin/env tsx

import { spawnSync } from 'node:child_process';
import path from 'node:path';

const repoRoot = process.cwd();
const webDir = path.join(repoRoot, 'apps', 'web');
const env = {
  ...process.env,
  NEXT_PUBLIC_SUPABASE_URL:
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://example.supabase.co',
  NEXT_PUBLIC_SUPABASE_ANON_KEY:
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy-anon-key',
};

const steps = [
  ['pnpm --dir apps/web type-check'],
  ['pnpm --dir apps/web test:projects'],
  ['pnpm --dir apps/web build'],
  ['pnpm --dir apps/web exec playwright test'],
] as const;

for (const [stepLabel] of steps) {
  console.log(`\n> ${stepLabel}\n`);

  const result = process.platform === 'win32'
    ? spawnSync(process.env.ComSpec || 'cmd.exe', ['/d', '/s', '/c', stepLabel], {
        cwd: repoRoot,
        env,
        stdio: 'inherit',
      })
    : spawnSync(stepLabel, {
        cwd: repoRoot,
        env,
        stdio: 'inherit',
        shell: true,
      });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

console.log(`\nProject workspace verification passed in ${webDir}`);
