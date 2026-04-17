import { loadConfig, saveConfig, configPath, type TierPreference } from '../config.js';
import kleur from 'kleur';

const VALID_PREFS: TierPreference[] = ['sub-first', 'free-first', 'byok-first', 'cheapest'];

export function configCommand(key?: string, value?: string): void {
  const config = loadConfig();

  if (!key) {
    // Print current config.
    console.log();
    console.log(kleur.bold(`  Config: ${kleur.dim(configPath())}`));
    console.log();
    console.log(`    preference:      ${kleur.cyan(config.preference)}`);
    console.log(`    defaultSurface:  ${kleur.cyan(config.defaultSurface ?? '(router-spec default)')}`);
    console.log(`    auth:`);
    for (const [rt, rec] of Object.entries(config.auth)) {
      console.log(`      ${rt}: installed=${rec?.installed} tier=${rec?.tier}`);
    }
    console.log();
    console.log(kleur.dim(`  Examples:`));
    console.log(kleur.dim(`    arcanea-orchestrator config preference free-first`));
    console.log(kleur.dim(`    arcanea-orchestrator config defaultSurface oh-my-arcanea`));
    console.log();
    return;
  }

  if (key === 'preference') {
    if (!value || !VALID_PREFS.includes(value as TierPreference)) {
      console.error(kleur.red(`Invalid preference. Use one of: ${VALID_PREFS.join(', ')}`));
      process.exit(1);
    }
    config.preference = value as TierPreference;
    saveConfig(config);
    console.log(kleur.green(`  preference set to: ${value}`));
    return;
  }

  if (key === 'defaultSurface') {
    config.defaultSurface = value;
    saveConfig(config);
    console.log(kleur.green(`  defaultSurface set to: ${value ?? '(unset)'}`));
    return;
  }

  console.error(kleur.red(`Unknown config key: ${key}`));
  console.error(kleur.dim(`Valid keys: preference, defaultSurface`));
  process.exit(1);
}
