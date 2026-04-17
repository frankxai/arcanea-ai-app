import { readHistory, aggregateStats, historyPath } from '../history.js';
import kleur from 'kleur';

interface Options {
  json?: boolean;
}

export function statsCommand(opts: Options): void {
  const events = readHistory();
  const stats = aggregateStats(events);

  if (opts.json) {
    console.log(JSON.stringify(stats, null, 2));
    return;
  }

  console.log();
  console.log(kleur.bold(`  arcanea-orchestrator stats — ${events.length} total run(s)`));
  console.log(kleur.dim(`  ${historyPath()}`));
  console.log();

  if (stats.length === 0) {
    console.log(kleur.dim('  (no data yet)'));
    console.log();
    return;
  }

  const col = (s: string, n: number) => s.padEnd(n);
  console.log(
    kleur.dim(
      `  ${col('TASK', 22)} ${col('MODEL', 28)} ${col('RUNS', 6)} ${col('SUCCESS', 9)} AVG DUR`,
    ),
  );
  console.log(kleur.dim(`  ${'-'.repeat(84)}`));
  for (const s of stats) {
    const rate = `${Math.round(s.successRate * 100)}%`;
    const rateColor =
      s.successRate >= 0.9 ? kleur.green : s.successRate >= 0.6 ? kleur.yellow : kleur.red;
    console.log(
      `  ${col(s.task, 22)} ${col(s.model, 28)} ${col(String(s.runs), 6)} ${rateColor(col(rate, 9))} ${s.avgDurationMs}ms`,
    );
  }
  console.log();
}
