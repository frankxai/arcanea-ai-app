#!/usr/bin/env tsx

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

type Mode = 'plan' | 'apply';

const repoRoot = process.cwd();
const migrationPaths = [
  'supabase/migrations/20260329000001_chat_projects_graph.sql',
  'supabase/migrations/20260329000002_project_graph_enrichment.sql',
  'supabase/migrations/20260403000001_project_runs_graph.sql',
];
const generatedTypesPath = 'apps/web/lib/database/types/supabase-generated.ts';
const projectRef = process.env.SUPABASE_PROJECT_REF?.trim() || '';
const supabaseCommand = process.env.SUPABASE_CLI_COMMAND?.trim() || 'supabase';

function parseMode(): Mode {
  const args = process.argv.slice(2);
  if (args.includes('--apply')) return 'apply';
  return 'plan';
}

function print(message: string): void {
  console.log(message);
}

function fail(message: string): never {
  console.error(message);
  process.exit(1);
}

function assertMigrationFiles(): void {
  const missing = migrationPaths.filter((relPath) => !existsSync(join(repoRoot, relPath)));
  if (missing.length > 0) {
    fail(`Missing project graph migration(s):\n${missing.map((file) => `- ${file}`).join('\n')}`);
  }
}

function run(
  command: string,
  args: string[],
  options: { allowFailure?: boolean; stdio?: 'inherit' | 'pipe' } = {},
) {
  const result = spawnSync(command, args, {
    cwd: repoRoot,
    encoding: 'utf8',
    shell: false,
    stdio: options.stdio ?? 'pipe',
  });

  if (!options.allowFailure && result.status !== 0) {
    const stdout = typeof result.stdout === 'string' ? result.stdout.trim() : '';
    const stderr = typeof result.stderr === 'string' ? result.stderr.trim() : '';
    fail([
      `Command failed: ${command} ${args.join(' ')}`,
      stdout,
      stderr,
    ].filter(Boolean).join('\n'));
  }

  return result;
}

function ensureSupabaseCli(): void {
  const result = run(supabaseCommand, ['--version'], { allowFailure: true });
  if (result.status === 0) return;

  fail([
    'Supabase CLI is not available.',
    `Install it or set SUPABASE_CLI_COMMAND before using apply mode.`,
    `Expected binary: ${supabaseCommand}`,
    'Fallback example: npx supabase@latest --version',
  ].join('\n'));
}

function readGeneratedPreview(): string {
  const path = join(repoRoot, generatedTypesPath);
  if (!existsSync(path)) return '(file missing)';
  return readFileSync(path, 'utf8').slice(0, 240);
}

function printPlan(): void {
  print('Arcanea project graph activation plan');
  print(`Repo root: ${repoRoot}`);
  print('');
  print('Migrations to apply:');
  for (const migration of migrationPaths) {
    print(`- ${migration}`);
  }
  print('');
  print('Prerequisites for apply mode:');
  print('- Supabase CLI installed and authenticated');
  print('- SUPABASE_PROJECT_REF set to the linked project ref');
  print('- Target project already linked or link step performed manually');
  print('');
  print('Recommended remote sequence:');
  print('1. supabase link --project-ref $SUPABASE_PROJECT_REF');
  print('2. supabase db push');
  print(`3. supabase gen types typescript --project-id $SUPABASE_PROJECT_REF --schema public > ${generatedTypesPath}`);
  print('');
  print('Local fallback if Docker is available:');
  print('1. supabase start');
  print('2. supabase db reset');
  print(`3. supabase gen types typescript --local --schema public > ${generatedTypesPath}`);
  print('');
  print(`Generated types preview: ${readGeneratedPreview()}`);
}

function runApply(): void {
  if (!projectRef) {
    fail('SUPABASE_PROJECT_REF is required for apply mode.');
  }

  ensureSupabaseCli();
  assertMigrationFiles();

  print(`Linking Supabase project: ${projectRef}`);
  run(supabaseCommand, ['link', '--project-ref', projectRef], { stdio: 'inherit' });

  print('Pushing database migrations');
  run(supabaseCommand, ['db', 'push'], { stdio: 'inherit' });

  print('Regenerating Supabase types');
  const typesResult = run(
    supabaseCommand,
    ['gen', 'types', 'typescript', '--project-id', projectRef, '--schema', 'public'],
    { stdio: 'pipe' },
  );
  const output = (typesResult.stdout ?? '').toString().trim();
  if (!output) {
    fail('Supabase type generation produced no output.');
  }

  const typesPath = join(repoRoot, generatedTypesPath);
  writeFileSync(typesPath, `${output}\n`, 'utf8');

  print('Project graph activation complete.');
  print(`Updated file: ${generatedTypesPath}`);
}

function main(): void {
  assertMigrationFiles();
  const mode = parseMode();

  if (mode === 'plan') {
    printPlan();
    return;
  }

  runApply();
}

main();
