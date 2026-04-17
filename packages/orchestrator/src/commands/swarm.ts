import { readFileSync, existsSync } from 'node:fs';
import { loadSpec } from '@arcanea/router-spec';
import { aoStatus, aoBatchSpawn } from '../ao-bridge.js';
import kleur from 'kleur';

interface Options {
  from?: string;
  tasks?: string;
  dryRun?: boolean;
}

export async function swarmCommand(opts: Options): Promise<void> {
  const spec = loadSpec();

  const items: string[] = [];
  if (opts.from) {
    if (!existsSync(opts.from)) {
      console.error(kleur.red(`File not found: ${opts.from}`));
      process.exit(1);
    }
    const text = readFileSync(opts.from, 'utf8');
    for (const line of text.split('\n')) {
      const m = line.match(/^\s*[-*]\s+(.+)$/);
      if (m) items.push(m[1].trim());
    }
  }

  const max = Number(opts.tasks ?? 3);
  const selected = items.slice(0, max);

  console.log();
  console.log(kleur.bold('  arcanea-orchestrator swarm'));
  console.log();
  console.log(kleur.dim(`  Source: ${opts.from ?? '(none — pass --from <file>)'}`));
  console.log(kleur.dim(`  Max workers: ${max}`));
  console.log(kleur.dim(`  Dry-run: ${opts.dryRun ? 'yes' : 'no'}`));
  console.log();

  if (selected.length === 0) {
    console.log(kleur.yellow('  No items found. Provide --from <markdown-file> with "- item" lines.'));
    return;
  }

  console.log(kleur.bold('  Planned dispatch (heuristic classification):'));
  for (const item of selected) {
    const taskId = classify(item);
    const rationale = spec.tasks[taskId]?.description ?? '(unknown)';
    console.log(
      `    ${kleur.cyan(taskId.padEnd(22))} ${kleur.dim(item.slice(0, 60))}${item.length > 60 ? '…' : ''}`,
    );
    console.log(`      ${kleur.dim(rationale)}`);
  }
  console.log();

  if (opts.dryRun) {
    console.log(kleur.dim('  (dry-run — no workers spawned)'));
    console.log();
    return;
  }

  // Check AO availability before attempting dispatch.
  const ao = await aoStatus();
  if (!ao.cliInstalled || !ao.daemonRunning) {
    console.log(kleur.yellow('  AO not ready:'));
    console.log(kleur.yellow(`    cli installed: ${ao.cliInstalled}`));
    console.log(kleur.yellow(`    daemon running: ${ao.daemonRunning}`));
    if (ao.hint) console.log(kleur.dim(`    ${ao.hint}`));
    console.log(kleur.dim('  Run `arcanea-orchestrator swarm --dry-run` to preview dispatch without AO.'));
    return;
  }

  console.log(kleur.bold('  Spawning via ao batch-spawn…'));
  const result = await aoBatchSpawn(selected);
  if (result.ok) {
    console.log(kleur.green(`  ✓ Spawned ${result.sessionIds.length} worker(s): ${result.sessionIds.join(', ')}`));
    console.log(kleur.dim('  Dashboard: http://localhost:4200'));
  } else {
    console.log(kleur.red(`  ✗ ao batch-spawn failed.`));
    if (result.stderr) console.log(kleur.dim(`  stderr: ${result.stderr.slice(0, 400)}`));
  }
  console.log();
}

function classify(item: string): string {
  const lc = item.toLowerCase();
  if (/\b(bug|fix|error|broken|crash)\b/.test(lc)) return 'code.debug';
  if (/\b(refactor|rename|modernize|migrate)\b/.test(lc)) return 'code.refactor';
  if (/\b(review|audit|security|perf)\b/.test(lc)) return 'code.review';
  if (/\b(doc|readme|guide|write)\b/.test(lc)) return 'docs.write';
  if (/\b(research|compare|investigate|analysis)\b/.test(lc)) return 'research.deep';
  if (/\b(canon|lore|character|arc)\b/.test(lc)) return 'world.canon';
  if (/\b(component|ui|page|layout|css|tailwind)\b/.test(lc)) return 'code.frontend';
  if (/\b(plan|roadmap|strategy|design)\b/.test(lc)) return 'plan';
  return 'code.implement';
}
