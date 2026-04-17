import { loadSpec, resolveTask } from '@arcanea/router-spec';
import { runtimeFor, getRuntime } from '../runtimes.js';
import kleur from 'kleur';

interface Options {
  surface: string;
}

export function explainCommand(taskId: string, opts: Options): void {
  const spec = loadSpec();

  if (!spec.tasks[taskId]) {
    console.error(kleur.red(`Unknown task: ${taskId}`));
    console.error(kleur.dim(`Run \`arcanea-code list-tasks\` to see all task classes.`));
    process.exit(1);
  }
  if (!spec.surfaces[opts.surface]) {
    console.error(kleur.red(`Unknown surface: ${opts.surface}`));
    process.exit(1);
  }

  const task = spec.tasks[taskId];
  const surface = spec.surfaces[opts.surface];
  const candidates = resolveTask(taskId, opts.surface, spec);

  console.log();
  console.log(kleur.bold(`  Task: ${kleur.cyan(taskId)}`));
  console.log(`  ${kleur.dim(task.description)}`);
  console.log();
  console.log(kleur.bold(`  Surface: ${kleur.cyan(opts.surface)}`));
  console.log(`  ${kleur.dim(surface.description)}`);
  console.log(`  Prefer tier: ${kleur.yellow(surface.prefer)}`);
  console.log();
  console.log(kleur.bold(`  Resolved candidates (in priority order):`));

  if (candidates.length === 0) {
    console.log(kleur.red(`  (none — no model in task.primary|fallback matches surface auth)`));
  }

  for (const [i, modelId] of candidates.entries()) {
    const model = spec.models[modelId];
    if (!model) continue;
    const rt = runtimeFor(model);
    const runtime = getRuntime(rt);
    const marker = i === 0 ? kleur.green('→') : kleur.dim(' ');
    const dep = model.deprecated ? kleur.red(' (deprecated)') : '';
    console.log(
      `  ${marker} ${kleur.bold(modelId.padEnd(28))} ${kleur.cyan(runtime.binary.padEnd(10))} ${kleur.yellow(model.tier.padEnd(6))} ${kleur.dim(model.strengths.slice(0, 2).join(', '))}${dep}`,
    );
  }

  console.log();
  console.log(kleur.dim(`  Rationale: ${task.rationale}`));
  console.log();
}
