import { loadSpec } from '@arcanea/router-spec';
import { loadConfig } from '../config.js';
import { aoStatus } from '../ao-bridge.js';
import kleur from 'kleur';
import { execa } from 'execa';

export async function statusCommand(): Promise<void> {
  console.log();
  console.log(kleur.bold('  arcanea-orchestrator status'));
  console.log();

  // ── Router spec ───────────────────────────────────────────────────────────
  const spec = loadSpec();
  console.log(kleur.bold('  Router Spec'));
  console.log(`    version:      ${kleur.cyan(spec.version)}`);
  console.log(`    lastUpdated:  ${kleur.cyan(spec.lastUpdated)}`);
  console.log(
    `    counts:       ${Object.keys(spec.models).length} models · ${Object.keys(spec.tasks).length} tasks · ${Object.keys(spec.surfaces).length} surfaces`,
  );
  console.log();

  // ── User config ───────────────────────────────────────────────────────────
  const config = loadConfig();
  console.log(kleur.bold('  User Config'));
  console.log(`    preference:   ${kleur.cyan(config.preference)}`);
  console.log(
    `    defaultSurface: ${kleur.cyan(config.defaultSurface ?? '(router-spec default)')}`,
  );
  for (const [rt, rec] of Object.entries(config.auth)) {
    const tierColor =
      rec?.tier === 'sub'
        ? kleur.cyan
        : rec?.tier === 'free'
        ? kleur.green
        : rec?.tier === 'byok'
        ? kleur.yellow
        : kleur.dim;
    const inst = rec?.installed ? kleur.dim(' installed') : kleur.red(' NOT installed');
    console.log(`    ${rt.padEnd(10)} ${tierColor((rec?.tier ?? 'unknown').padEnd(10))}${inst}`);
  }
  console.log();

  // ── Composio AO ───────────────────────────────────────────────────────────
  console.log(kleur.bold('  Agent Orchestrator (Composio)'));
  const ao = await aoStatus();
  const green = (s: string) => kleur.green(s);
  const red = (s: string) => kleur.red(s);
  console.log(`    cli:          ${ao.cliInstalled ? green('installed') : red('not installed')}`);
  console.log(`    daemon:       ${ao.daemonRunning ? green('running :4200') : red('not running')}`);
  if (ao.daemonRunning) {
    console.log(`    sessions:     ${kleur.cyan(String(ao.sessionCount))}`);
    console.log(`    projects:     ${ao.projects.join(', ') || '(none)'}`);
  }
  if (ao.hint) {
    console.log(kleur.dim(`    hint:         ${ao.hint}`));
  }
  console.log();

  // ── Worktrees ─────────────────────────────────────────────────────────────
  try {
    const wt = await execa('git', ['worktree', 'list', '--porcelain'], { reject: false });
    if (wt.exitCode === 0) {
      const trees = wt.stdout
        .split('\n\n')
        .filter(Boolean)
        .map((block) => {
          const pathLine = block.split('\n').find((l) => l.startsWith('worktree '));
          const branchLine = block.split('\n').find((l) => l.startsWith('branch '));
          return {
            path: pathLine?.slice('worktree '.length) ?? '',
            branch: branchLine?.slice('branch '.length) ?? '(detached)',
          };
        });
      console.log(kleur.bold(`  Git Worktrees (${trees.length})`));
      for (const t of trees.slice(0, 6)) {
        console.log(`    ${kleur.dim(t.branch.padEnd(40))} ${t.path}`);
      }
      if (trees.length > 6) {
        console.log(kleur.dim(`    … +${trees.length - 6} more`));
      }
      console.log();
    }
  } catch {
    // No git or not in a repo — silent.
  }
}
