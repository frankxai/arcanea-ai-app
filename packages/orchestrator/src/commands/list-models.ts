import { loadSpec } from '@arcanea/router-spec';
import kleur from 'kleur';

interface Options {
  tier?: string;
}

export function listModelsCommand(opts: Options): void {
  const spec = loadSpec();
  const entries = Object.entries(spec.models).filter(
    ([, model]) => !opts.tier || model.tier === opts.tier,
  );

  console.log(kleur.bold(`\n  Router Spec v${spec.version} — ${entries.length} models\n`));

  const col = (s: string, n: number) => s.padEnd(n);

  console.log(
    kleur.dim(
      `  ${col('ID', 28)} ${col('TIER', 8)} ${col('CONTEXT', 10)} ${col('SWE', 6)} PROVIDER`,
    ),
  );
  console.log(kleur.dim(`  ${'-'.repeat(78)}`));

  for (const [id, model] of entries) {
    const dep = model.deprecated ? kleur.red(' (deprecated)') : '';
    const ctx = model.context >= 1_000_000
      ? `${model.context / 1_000_000}M`
      : `${Math.round(model.context / 1000)}K`;
    const swe = model.sweBench ? `${model.sweBench}` : '—';
    const tierColor =
      model.tier === 'free'
        ? kleur.green
        : model.tier === 'sub'
        ? kleur.cyan
        : model.tier === 'byok'
        ? kleur.yellow
        : kleur.magenta;
    console.log(
      `  ${col(id, 28)} ${tierColor(col(model.tier, 8))} ${col(ctx, 10)} ${col(swe, 6)} ${kleur.dim(model.provider)}${dep}`,
    );
  }
  console.log();
}
