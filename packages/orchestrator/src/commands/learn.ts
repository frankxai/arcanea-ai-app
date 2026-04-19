import { loadSpec, resolveTask } from '@arcanea/router-spec';
import { loadConfig, applyPreference } from '../config.js';
import { readHistory } from '../history.js';
import { adaptiveRerank, computeStats, shouldApplyAdaptive } from '../adaptive.js';
import { runtimeFor } from '../runtimes.js';
import kleur from 'kleur';

interface Options {
  surface: string;
}

export function learnCommand(taskId: string, opts: Options): void {
  const spec = loadSpec();
  const config = loadConfig();
  const events = readHistory();

  if (!spec.tasks[taskId]) {
    console.error(kleur.red(`Unknown task: ${taskId}`));
    process.exit(1);
  }

  const candidates = resolveTask(taskId, opts.surface, spec);
  const tierMap = new Map(
    candidates.map((id) => [id, spec.models[id]?.tier]).filter(([, t]) => !!t) as [string, 'free' | 'sub' | 'byok'][],
  );
  const preferred = applyPreference(candidates, tierMap, config.preference);
  const adapted = adaptiveRerank(preferred, events, taskId);

  const adaptiveActive = shouldApplyAdaptive(config.adaptiveRouting, events.length);
  const stats = computeStats(events, taskId);

  console.log();
  console.log(kleur.bold(`  arcanea-orchestrator learn — ${taskId}`));
  console.log();
  console.log(kleur.dim(`  surface:       ${opts.surface}`));
  console.log(kleur.dim(`  preference:    ${config.preference}`));
  console.log(kleur.dim(`  adaptive mode: ${config.adaptiveRouting ?? 'auto'}`));
  console.log(
    kleur.dim(`  adaptive on:   ${adaptiveActive ? kleur.green('yes') : kleur.red('no')} (${events.length} total events)`),
  );
  console.log();

  console.log(kleur.bold(`  Baseline (preference + surface):`));
  for (const [i, m] of preferred.entries()) {
    const rt = runtimeFor(spec.models[m]);
    const marker = i === 0 ? kleur.green('→') : ' ';
    console.log(`    ${marker} ${i + 1}. ${kleur.bold(m.padEnd(28))} ${kleur.cyan(rt)}`);
  }
  console.log();

  console.log(kleur.bold(`  Adaptive (after history-weighted re-rank):`));
  for (const [i, m] of adapted.entries()) {
    const rt = runtimeFor(spec.models[m]);
    const rec = stats.get(m);
    const marker = i === 0 ? kleur.green('→') : ' ';
    const statsStr = rec
      ? kleur.dim(
          ` [${rec.runs} runs, ${Math.round((rec.successes / rec.runs) * 100)}% ok, ${Math.round(rec.avgDurationMs)}ms avg]`,
        )
      : kleur.dim(' [no data]');
    const moved = preferred.indexOf(m) !== i;
    const moveFlag = moved ? kleur.yellow(' ↑') : '';
    console.log(
      `    ${marker} ${i + 1}. ${kleur.bold(m.padEnd(28))} ${kleur.cyan(rt.padEnd(10))}${statsStr}${moveFlag}`,
    );
  }
  console.log();

  if (!adaptiveActive) {
    console.log(
      kleur.dim(
        `  (need ≥10 events to enable adaptive routing; run more tasks or set adaptiveRouting=on in config)`,
      ),
    );
    console.log();
  }
}
