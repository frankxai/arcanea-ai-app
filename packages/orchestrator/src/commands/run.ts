import { loadSpec, resolveTask, pickModel } from '@arcanea/router-spec';
import { execa } from 'execa';
import { runtimeFor, getRuntime } from '../runtimes.js';
import { loadConfig, applyPreference } from '../config.js';
import { appendHistory, readHistory } from '../history.js';
import { adaptiveRerank, shouldApplyAdaptive } from '../adaptive.js';
import kleur from 'kleur';

interface Options {
  task: string;
  surface: string;
  model?: string;
  dryRun?: boolean;
  noHistory?: boolean;
}

export async function runCommand(promptParts: string[], opts: Options): Promise<void> {
  const prompt = promptParts.join(' ');
  if (!prompt.trim()) {
    console.error(kleur.red('Empty prompt.'));
    process.exit(1);
  }

  const spec = loadSpec();
  const config = loadConfig();
  const surface = config.defaultSurface ?? opts.surface;

  let modelId: string | null;
  if (opts.model) {
    if (!spec.models[opts.model]) {
      console.error(kleur.red(`Unknown model override: ${opts.model}`));
      process.exit(1);
    }
    modelId = opts.model;
  } else {
    const candidates = resolveTask(opts.task, surface, spec);
    // Re-rank by user's tier preference, then filter by installed runtimes.
    const tierMap = new Map(
      candidates.map((id) => [id, spec.models[id]?.tier]).filter(([, t]) => !!t) as [string, 'free' | 'sub' | 'byok'][],
    );
    const preferred = applyPreference(candidates, tierMap, config.preference);
    const available = preferred.filter((id) => {
      const rt = runtimeFor(spec.models[id]);
      return config.auth[rt]?.installed !== false;
    });
    // Phase 8: adaptive routing — re-rank by local success history
    let finalCandidates = available.length > 0 ? available : preferred;
    const events = readHistory();
    if (shouldApplyAdaptive(config.adaptiveRouting, events.length)) {
      finalCandidates = adaptiveRerank(finalCandidates, events, opts.task);
    }
    modelId = pickModel(finalCandidates, spec);
  }

  if (!modelId) {
    console.error(
      kleur.red(`No model resolved for task=${opts.task} surface=${surface}.`),
    );
    console.error(kleur.dim(`Hint: run \`arcanea-orchestrator doctor\` to detect installed CLIs.`));
    process.exit(1);
  }

  const model = spec.models[modelId];
  const rtId = runtimeFor(model);
  const runtime = getRuntime(rtId);
  const argv = runtime.argv(modelId, prompt);

  const authRec = config.auth[rtId];
  const authNote = authRec?.installed === false
    ? kleur.red(' [not installed — run `arcanea-orchestrator doctor`]')
    : authRec?.tier
    ? kleur.dim(` [auth: ${authRec.tier}]`)
    : '';

  console.error(
    kleur.dim(
      `  [arcanea] task=${opts.task} surface=${surface} pref=${config.preference} → ${kleur.cyan(modelId)} via ${kleur.cyan(runtime.binary)}${authNote}`,
    ),
  );

  if (opts.dryRun) {
    console.error(kleur.dim(`  [dry-run] would exec: ${runtime.binary} ${argv.join(' ')}`));
    return;
  }

  const startTime = Date.now();
  let capturedExit: number | null = null;
  let capturedError: string | undefined;

  try {
    // Stream stdout/stderr through. Inherit stdin so interactive auth prompts still work.
    const subprocess = execa(runtime.binary, argv, {
      stdio: 'inherit',
      reject: false,
    });
    const result = await subprocess;
    capturedExit = result.exitCode ?? null;
    if (result.exitCode !== 0) {
      // stderr already streamed via inherit; nothing to capture here.
      if (!opts.noHistory) {
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
    if (!opts.noHistory) {
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
    if (msg.includes('ENOENT')) {
      console.error(
        kleur.red(
          `  [arcanea] binary not found: ${runtime.binary}. Install the CLI first.`,
        ),
      );
    } else {
      console.error(kleur.red(`  [arcanea] ${msg}`));
    }
    if (!opts.noHistory) {
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
