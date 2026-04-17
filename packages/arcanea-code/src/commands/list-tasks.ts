import { loadSpec } from '@arcanea/router-spec';
import kleur from 'kleur';

export function listTasksCommand(): void {
  const spec = loadSpec();
  const entries = Object.entries(spec.tasks);

  console.log(kleur.bold(`\n  ${entries.length} task classes\n`));

  const groups = new Map<string, Array<[string, (typeof entries)[number][1]]>>();
  for (const [id, task] of entries) {
    const [group] = id.split('.');
    if (!groups.has(group)) groups.set(group, []);
    groups.get(group)!.push([id, task]);
  }

  for (const [group, tasks] of groups) {
    console.log(kleur.cyan(`  ${group}`));
    for (const [id, task] of tasks) {
      console.log(`    ${kleur.bold(id.padEnd(22))} ${kleur.dim(task.description)}`);
    }
    console.log();
  }
}
