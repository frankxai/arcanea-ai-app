import {
  loadSpec,
  resolveTask,
  pickModel,
  isModelEligible,
  type RouterSpec,
} from "@arcanea/router-spec";
import { execa } from "execa";
import { runtimeFor, getRuntime } from "../runtimes.js";
import { loadConfig, applyPreference, type UserConfig } from "../config.js";
import { appendHistory, readHistory } from "../history.js";
import { adaptiveRerank, shouldApplyAdaptive } from "../adaptive.js";
import kleur from "kleur";

interface Options {
  task: string;
  surface?: string;
  model?: string;
  dryRun?: boolean;
  history?: boolean;
}

/** Shared by execution and diagnostics so the selected route cannot disagree. */
export function resolveRunnableCandidates(
  taskId: string,
  surface: string,
  spec: RouterSpec,
  config: UserConfig,
): string[] {
  if (
    !spec.surfaces[surface].authContext.some(
      (context) => context !== "display-only",
    )
  )
    return [];
  const candidates = resolveTask(taskId, surface, spec);
  const tierMap = new Map(
    candidates.map((id) => [id, spec.models[id].tier]) as [
      string,
      "free" | "sub" | "byok",
    ][],
  );
  const preferred = applyPreference(candidates, tierMap, config.preference);
  const available = preferred.filter((id) => {
    try {
      return config.auth[runtimeFor(spec.models[id])]?.installed !== false;
    } catch {
      return false;
    }
  });
  const events = readHistory();
  return shouldApplyAdaptive(config.adaptiveRouting, events.length)
    ? adaptiveRerank(available, events, taskId)
    : available;
}

export async function runCommand(
  promptParts: string[],
  opts: Options,
): Promise<void> {
  const prompt = promptParts.join(" ");
  if (!prompt.trim()) {
    console.error(kleur.red("Empty prompt."));
    process.exit(1);
  }

  const spec = loadSpec();
  const config = loadConfig();
  const surface = opts.surface ?? config.defaultSurface ?? "claude-arcanea";

  if (!spec.tasks[opts.task]) {
    console.error(kleur.red(`Unknown task: ${opts.task}`));
    process.exit(1);
  }
  if (!spec.surfaces[surface]) {
    console.error(kleur.red(`Unknown surface: ${surface}`));
    process.exit(1);
  }
  if (
    !spec.surfaces[surface].authContext.some(
      (context) => context !== "display-only",
    )
  ) {
    console.error(
      kleur.red(
        `Surface ${surface} is display-only and cannot dispatch tasks.`,
      ),
    );
    process.exit(1);
  }

  let modelId: string | null;
  if (opts.model) {
    if (!spec.models[opts.model]) {
      console.error(kleur.red(`Unknown model override: ${opts.model}`));
      process.exit(1);
    }
    if (!isModelEligible(opts.model, opts.task, surface, spec)) {
      console.error(
        kleur.red(
          `Model ${opts.model} is not eligible for task=${opts.task} surface=${surface}.${spec.models[opts.model].deprecated ? ` ${spec.models[opts.model].deprecated}` : ""}`,
        ),
      );
      process.exit(1);
    }
    modelId = opts.model;
  } else {
    modelId = pickModel(
      resolveRunnableCandidates(opts.task, surface, spec, config),
      spec,
    );
  }

  if (!modelId) {
    console.error(
      kleur.red(`No model resolved for task=${opts.task} surface=${surface}.`),
    );
    console.error(
      kleur.dim(
        `Hint: run \`arcanea-orchestrator doctor\` to detect installed CLIs.`,
      ),
    );
    process.exit(1);
  }

  const model = spec.models[modelId];
  let rtId: ReturnType<typeof runtimeFor>;
  try {
    rtId = runtimeFor(model);
  } catch (error) {
    console.error(
      kleur.red(error instanceof Error ? error.message : String(error)),
    );
    process.exit(1);
  }
  if (config.auth[rtId]?.installed === false) {
    console.error(
      kleur.red(
        `Runtime ${rtId} is not installed; run \`arcanea-orchestrator doctor\`.`,
      ),
    );
    process.exit(1);
  }
  const runtime = getRuntime(rtId);
  const argv = runtime.argv(modelId, prompt);

  const authRec = config.auth[rtId];
  const authNote =
    authRec?.installed === false
      ? kleur.red(" [not installed — run `arcanea-orchestrator doctor`]")
      : authRec?.tier
        ? kleur.dim(` [auth: ${authRec.tier}]`)
        : "";

  console.error(
    kleur.dim(
      `  [arcanea] task=${opts.task} surface=${surface} pref=${config.preference} → ${kleur.cyan(modelId)} via ${kleur.cyan(runtime.binary)}${authNote}`,
    ),
  );

  if (opts.dryRun) {
    console.error(
      kleur.dim(`  [dry-run] would exec: ${runtime.binary} ${argv.join(" ")}`),
    );
    return;
  }

  const startTime = Date.now();
  let capturedExit: number | null = null;
  let capturedError: string | undefined;

  try {
    // Stream stdout/stderr through. Inherit stdin so interactive auth prompts still work.
    const subprocess = execa(runtime.binary, argv, {
      stdio: "inherit",
      reject: false,
    });
    const result = await subprocess;
    capturedExit = result.exitCode ?? null;
    if (result.exitCode !== 0) {
      // stderr already streamed via inherit; nothing to capture here.
      if (opts.history !== false) {
        appendHistory({
          ts: new Date().toISOString(),
          task: opts.task,
          surface,
          model: modelId,
          runtime: rtId,
          durationMs: Date.now() - startTime,
          exitCode: capturedExit,
          promptLen: prompt.length,
        });
      }
      process.exit(result.exitCode ?? 1);
    }
    if (opts.history !== false) {
      appendHistory({
        ts: new Date().toISOString(),
        task: opts.task,
        surface,
        model: modelId,
        runtime: rtId,
        durationMs: Date.now() - startTime,
        exitCode: 0,
        promptLen: prompt.length,
      });
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    capturedError = msg.slice(0, 200);
    if (msg.includes("ENOENT")) {
      console.error(
        kleur.red(
          `  [arcanea] binary not found: ${runtime.binary}. Install the CLI first.`,
        ),
      );
    } else {
      console.error(kleur.red(`  [arcanea] ${msg}`));
    }
    if (opts.history !== false) {
      appendHistory({
        ts: new Date().toISOString(),
        task: opts.task,
        surface,
        model: modelId,
        runtime: rtId,
        durationMs: Date.now() - startTime,
        exitCode: capturedExit ?? -1,
        promptLen: prompt.length,
        error: capturedError,
      });
    }
    process.exit(1);
  }
}
