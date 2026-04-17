import { readFileSync, existsSync } from 'node:fs';
import { loadSpec } from '@arcanea/router-spec';
import kleur from 'kleur';

interface Options {
  from?: string;
  tasks?: string;
}

/**
 * Phase 3 will wire this to `ao spawn`. For now we parse the input, classify
 * each line to a task-class heuristically, and print the planned dispatch.
 */
export function swarmCommand(opts: Options): void {
  const spec = loadSpec();

  const items: string[] = [];
  if (opts.from) {
    if (!existsSync(opts.from)) {
      console.error(kleur.red(`File not found: ${opts.from}`));
      process.exit(1);
    }
    const text = readFileSync(opts.from, 'utf8');
    // Naive: each markdown list item becomes a task candidate.
    for (const line of text.split('\n')) {
      const m = line.match(/^\s*[-*]\s+(.+)$/);
      if (m) items.push(m[1].trim());
    }
  }

  console.log();
  console.log(kleur.bold('  swarm — Phase 3 stub'));
  console.log();
  console.log(kleur.dim(`  Source: ${opts.from ?? '(none)'} (${items.length} item(s))`));
  console.log(kleur.dim(`  Max workers requested: ${opts.tasks ?? '3'}`));
  console.log();

  if (items.length === 0) {
    console.log(
      kleur.yellow('  No items found. Provide --from <markdown-file> with "- item" lines.'),
    );
    console.log();
    return;
  }

  console.log(kleur.bold('  Planned dispatch (heuristic classification):'));
  for (const item of items.slice(0, Number(opts.tasks ?? 3))) {
    const taskId = classify(item);
    const rationale = spec.tasks[taskId]?.description ?? '(unknown)';
    console.log(
      `    ${kleur.cyan(taskId.padEnd(22))} ${kleur.dim(item.slice(0, 60))}${item.length > 60 ? '…' : ''}`,
    );
    console.log(`      ${kleur.dim(rationale)}`);
  }
  console.log();
  console.log(
    kleur.dim(
      `  Phase 3 will pipe this to \`ao batch-spawn\` with Router Spec model selection per worker.`,
    ),
  );
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
