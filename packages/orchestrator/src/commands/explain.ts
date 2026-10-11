import { loadSpec, resolveTask } from "@arcanea/router-spec";
import { runtimeFor, getRuntime } from "../runtimes.js";
import kleur from "kleur";
import { loadConfig } from "../config.js";
import { resolveRunnableCandidates } from "./run.js";

interface Options {
  surface: string;
}

export function explainCommand(taskId: string, opts: Options): void {
  const spec = loadSpec();

  if (!spec.tasks[taskId]) {
    console.error(kleur.red(`Unknown task: ${taskId}`));
    console.error(
      kleur.dim(
        `Run \`arcanea-orchestrator list-tasks\` to see all task classes.`,
      ),
    );
    process.exit(1);
  }
  if (!spec.surfaces[opts.surface]) {
    console.error(kleur.red(`Unknown surface: ${opts.surface}`));
    process.exit(1);
  }

  const task = spec.tasks[taskId];
  const surface = spec.surfaces[opts.surface];
  const config = loadConfig();
  const catalogCandidates = resolveTask(taskId, opts.surface, spec);
  const runnable = resolveRunnableCandidates(
    taskId,
    opts.surface,
    spec,
    config,
  );
  const candidates = [...new Set([...runnable, ...catalogCandidates])];

  console.log();
  console.log(kleur.bold(`  Task: ${kleur.cyan(taskId)}`));
  console.log(`  ${kleur.dim(task.description)}`);
  console.log();
  console.log(kleur.bold(`  Surface: ${kleur.cyan(opts.surface)}`));
  console.log(`  ${kleur.dim(surface.description)}`);
  console.log(`  Prefer tier: ${kleur.yellow(surface.prefer)}`);
  console.log();
  console.log(kleur.bold(`  Resolved candidates (in priority order):`));
  if (runnable.length === 0) {
    console.log(
      kleur.dim(
        "  No executable route; catalog candidates below are for display.",
      ),
    );
  }

  if (candidates.length === 0) {
    console.log(
      kleur.red(
        `  (none — no model in task.primary|fallback matches surface auth)`,
      ),
    );
  }

  for (const modelId of candidates) {
    const model = spec.models[modelId];
    if (!model) continue;
    let binary: string;
    try {
      binary = getRuntime(runtimeFor(model)).binary;
      if (config.auth[runtimeFor(model)]?.installed === false)
        binary += " (not installed)";
    } catch {
      binary = "unsupported";
    }
    const marker = modelId === runnable[0] ? kleur.green("→") : kleur.dim(" ");
    const dep = model.deprecated ? kleur.red(" (deprecated)") : "";
    console.log(
      `  ${marker} ${kleur.bold(modelId.padEnd(28))} ${kleur.cyan(binary.padEnd(10))} ${kleur.yellow(model.tier.padEnd(6))} ${kleur.dim(model.strengths.slice(0, 2).join(", "))}${dep}`,
    );
  }

  console.log();
  console.log(kleur.dim(`  Rationale: ${task.rationale}`));
  console.log();
}
