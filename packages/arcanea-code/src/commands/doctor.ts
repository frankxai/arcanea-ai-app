import { execa } from 'execa';
import kleur from 'kleur';
import { loadConfig, saveConfig, type AuthRecord } from '../config.js';

type RuntimeId = 'claude' | 'opencode' | 'codex' | 'gemini';

const RUNTIMES: RuntimeId[] = ['claude', 'opencode', 'codex', 'gemini'];

async function which(binary: string): Promise<string | null> {
  try {
    const cmd = process.platform === 'win32' ? 'where' : 'which';
    const { stdout } = await execa(cmd, [binary], { reject: false });
    const first = stdout.split(/\r?\n/).find((l) => l.trim().length > 0);
    return first?.trim() ?? null;
  } catch {
    return null;
  }
}

async function detectAuth(runtime: RuntimeId): Promise<AuthRecord['tier']> {
  // Heuristic detection — each CLI exposes auth state differently. We run a
  // cheap version/help probe and look for known signals. The goal is not
  // perfection, it's giving the user an honest readout so `run` can pick a
  // sensible default.
  try {
    switch (runtime) {
      case 'claude': {
        // If `claude --version` succeeds and user has logged in, treat as sub.
        // BYOK users typically have ANTHROPIC_API_KEY set.
        const res = await execa('claude', ['--version'], { reject: false, timeout: 5000 });
        if (res.exitCode !== 0) return 'unknown';
        if (process.env.ANTHROPIC_API_KEY) return 'byok';
        return 'sub';
      }
      case 'opencode': {
        const res = await execa('opencode', ['--version'], { reject: false, timeout: 5000 });
        if (res.exitCode !== 0) return 'unknown';
        // OpenCode Zen free tier works without keys.
        return 'free';
      }
      case 'codex': {
        const res = await execa('codex', ['--version'], { reject: false, timeout: 5000 });
        if (res.exitCode !== 0) return 'unknown';
        if (process.env.OPENAI_API_KEY) return 'byok';
        return 'unknown';
      }
      case 'gemini': {
        const res = await execa('gemini', ['--version'], { reject: false, timeout: 5000 });
        if (res.exitCode !== 0) return 'unknown';
        if (process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY) return 'byok';
        return 'unknown';
      }
    }
  } catch {
    return 'unknown';
  }
}

export async function doctorCommand(): Promise<void> {
  const config = loadConfig();

  console.log();
  console.log(kleur.bold('  arcanea-code doctor'));
  console.log(kleur.dim('  Detects installed CLIs and infers auth tier.'));
  console.log();

  const checkedAt = new Date().toISOString();

  for (const rt of RUNTIMES) {
    const path = await which(rt);
    const installed = path !== null;
    let tier: AuthRecord['tier'] = 'unknown';
    if (installed) tier = await detectAuth(rt);

    const record: AuthRecord = { installed, tier, checkedAt };
    config.auth[rt] = record;

    const status = !installed
      ? kleur.red('not installed')
      : tier === 'sub'
      ? kleur.cyan('sub')
      : tier === 'byok'
      ? kleur.yellow('byok')
      : tier === 'free'
      ? kleur.green('free')
      : kleur.dim('unknown');

    console.log(
      `  ${kleur.bold(rt.padEnd(10))} ${status.padEnd(20)} ${kleur.dim(path ?? 'install: https://docs.arcanea.ai/cli/' + rt)}`,
    );
  }

  saveConfig(config);

  console.log();
  console.log(kleur.dim(`  Preference: ${kleur.bold(config.preference)}`));
  console.log(kleur.dim(`  Change with: arcanea-code config preference sub-first|free-first|byok-first|cheapest`));
  console.log();
  console.log(kleur.dim(`  Written: ~/.arcanea/config.yaml`));
  console.log();

  // Walkthrough hints for missing runtimes
  const missing = RUNTIMES.filter((r) => !config.auth[r]?.installed);
  if (missing.length > 0) {
    console.log(kleur.bold('  Next steps:'));
    for (const rt of missing) {
      console.log(`    • ${kleur.cyan(rt)}: ${installHint(rt)}`);
    }
    console.log();
  }

  // Auth hints for unknown tier
  const unauthed = RUNTIMES.filter(
    (r) => config.auth[r]?.installed && config.auth[r]?.tier === 'unknown',
  );
  if (unauthed.length > 0) {
    console.log(kleur.bold('  Auth hints:'));
    for (const rt of unauthed) {
      console.log(`    • ${kleur.cyan(rt)}: ${authHint(rt)}`);
    }
    console.log();
  }
}

function installHint(rt: RuntimeId): string {
  switch (rt) {
    case 'claude':
      return 'npm i -g @anthropic-ai/claude-code  (then `claude login`)';
    case 'opencode':
      return 'npm i -g opencode-ai  (free Zen tier works out of the box)';
    case 'codex':
      return 'npm i -g @openai/codex  (then set OPENAI_API_KEY)';
    case 'gemini':
      return 'npm i -g @google/gemini-cli  (then set GOOGLE_API_KEY)';
  }
}

function authHint(rt: RuntimeId): string {
  switch (rt) {
    case 'claude':
      return 'Run `claude login` for Max sub, or set ANTHROPIC_API_KEY for BYOK.';
    case 'codex':
      return 'Set OPENAI_API_KEY to enable BYOK.';
    case 'gemini':
      return 'Set GOOGLE_API_KEY (or GEMINI_API_KEY) to enable BYOK.';
    default:
      return 'Check the vendor docs.';
  }
}
