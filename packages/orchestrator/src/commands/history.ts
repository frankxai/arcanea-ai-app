import { readHistory, historyPath } from '../history.js';
import kleur from 'kleur';

interface Options {
  limit?: string;
  json?: boolean;
}

export function historyCommand(opts: Options): void {
  const limit = Number(opts.limit ?? 20);
  const events = readHistory(limit);

  if (opts.json) {
    console.log(JSON.stringify(events, null, 2));
    return;
  }

  console.log();
  console.log(kleur.bold(`  arcanea-orchestrator history — last ${events.length} run(s)`));
  console.log(kleur.dim(`  ${historyPath()}`));
  console.log();

  if (events.length === 0) {
    console.log(kleur.dim('  (no events yet — run `arcanea-orchestrator run ...` to populate)'));
    console.log();
    return;
  }

  const col = (s: string, n: number) => s.padEnd(n);
  console.log(
    kleur.dim(
      `  ${col('TIME', 20)} ${col('TASK', 20)} ${col('MODEL', 24)} ${col('EXIT', 5)} DURATION`,
    ),
  );
  console.log(kleur.dim(`  ${'-'.repeat(86)}`));
  for (const e of events) {
    const t = new Date(e.ts).toISOString().slice(11, 19);
    const exitColor = e.exitCode === 0 ? kleur.green : kleur.red;
    console.log(
      `  ${col(t, 20)} ${col(e.task, 20)} ${col(e.model, 24)} ${exitColor(col(String(e.exitCode ?? '-'), 5))} ${e.durationMs}ms`,
    );
  }
  console.log();
}
