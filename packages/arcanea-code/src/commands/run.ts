import { loadSpec, resolveTask, pickModel } from '@arcanea/router-spec';
import { execa } from 'execa';
import { runtimeFor, getRuntime } from '../runtimes.js';
import { loadConfig, applyPreference } from '../config.js';
import kleur from 'kleur';

interface Options {
  task: string;
  surface: string;
  model?: string;
  dryRun?: boolean;
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
    modelId = pickModel(available.length > 0 ? available : preferred, spec);
  }

  if (!modelId) {
    console.error(
      kleur.red(`No model resolved for task=${opts.task} surface=${surface}.`),
    );
    console.error(kleur.dim(`Hint: run \`arcanea-code doctor\` to detect installed CLIs.`));
    process.exit(1);
  }

  const model = spec.models[modelId];
  const rtId = runtimeFor(model);
  const runtime = getRuntime(rtId);
  const argv = runtime.argv(modelId, prompt);

  const authRec = config.auth[rtId];
  const authNote = authRec?.installed === false
    ? kleur.red(' [not installed — run `arcanea-code doctor`]')
    : authRec?.tier
    ? kleur.dim(` [auth: ${authRec.tier}]`)
    : '';

  console.error(
    kleur.dim(
      `  [arcanea-code] task=${opts.task} surface=${surface} pref=${config.preference} → ${kleur.cyan(modelId)} via ${kleur.cyan(runtime.binary)}${authNote}`,
    ),
  );

  if (opts.dryRun) {
    console.error(kleur.dim(`  [dry-run] would exec: ${runtime.binary} ${argv.join(' ')}`));
    return;
  }

  try {
    // Stream stdout/stderr through. Inherit stdin so interactive auth prompts still work.
    const subprocess = execa(runtime.binary, argv, {
      stdio: 'inherit',
      reject: false,
    });
    const result = await subprocess;
    if (result.exitCode !== 0) {
      process.exit(result.exitCode ?? 1);
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes('ENOENT')) {
      console.error(
        kleur.red(
          `  [arcanea-code] binary not found: ${runtime.binary}. Install the CLI first.`,
        ),
      );
    } else {
      console.error(kleur.red(`  [arcanea-code] ${msg}`));
    }
    process.exit(1);
  }
}
