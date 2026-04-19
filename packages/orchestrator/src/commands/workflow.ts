import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse as parseYaml } from 'yaml';
import kleur from 'kleur';

interface WorkflowTask {
  id: number;
  task: string;
  prompt: string;
  why: string;
}

interface Workflow {
  name: string;
  version: number;
  description: string;
  usage?: string;
  tasks: WorkflowTask[];
}

const here = dirname(fileURLToPath(import.meta.url));
// dist/commands/workflow.js → up 3 → package root → workflows/
const WORKFLOWS_DIR = resolve(here, '..', '..', 'workflows');

function listWorkflowFiles(): string[] {
  if (!existsSync(WORKFLOWS_DIR)) return [];
  return readdirSync(WORKFLOWS_DIR).filter((f) => f.endsWith('.yml') || f.endsWith('.yaml'));
}

function loadWorkflow(nameOrPath: string): Workflow {
  let path: string;
  if (existsSync(nameOrPath)) {
    path = nameOrPath;
  } else {
    const candidate = join(WORKFLOWS_DIR, `${nameOrPath}.yml`);
    if (!existsSync(candidate)) {
      throw new Error(`Workflow not found: ${nameOrPath} (looked in ${WORKFLOWS_DIR})`);
    }
    path = candidate;
  }
  const raw = readFileSync(path, 'utf8');
  return parseYaml(raw) as Workflow;
}

function substituteVars(text: string, vars: Record<string, string>): string {
  return text.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] ?? `{{${key}}}`);
}

function parseVarPairs(pairs: string[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (const p of pairs) {
    const eq = p.indexOf('=');
    if (eq < 0) continue;
    out[p.slice(0, eq)] = p.slice(eq + 1);
  }
  return out;
}

interface ListOptions {
  json?: boolean;
}

export function workflowListCommand(opts: ListOptions): void {
  const files = listWorkflowFiles();
  const workflows = files.map((f) => {
    try {
      const wf = loadWorkflow(join(WORKFLOWS_DIR, f));
      return { file: f, name: wf.name, description: wf.description.trim().split('\n')[0] };
    } catch {
      return { file: f, name: f.replace(/\.ya?ml$/, ''), description: '(unparseable)' };
    }
  });

  if (opts.json) {
    console.log(JSON.stringify(workflows, null, 2));
    return;
  }

  console.log();
  console.log(kleur.bold(`  arcanea-orchestrator workflow — ${workflows.length} built-in templates`));
  console.log(kleur.dim(`  ${WORKFLOWS_DIR}`));
  console.log();
  for (const w of workflows) {
    console.log(`    ${kleur.cyan(w.name.padEnd(32))} ${kleur.dim(w.description)}`);
  }
  console.log();
  console.log(kleur.dim(`  Run:  arcanea-orchestrator workflow run <name> [--var key=value]`));
  console.log(kleur.dim(`  View: arcanea-orchestrator workflow show <name>`));
  console.log();
}

interface ShowOptions {
  json?: boolean;
}

export function workflowShowCommand(name: string, opts: ShowOptions): void {
  const wf = loadWorkflow(name);
  if (opts.json) {
    console.log(JSON.stringify(wf, null, 2));
    return;
  }
  console.log();
  console.log(kleur.bold(`  ${wf.name} v${wf.version}`));
  console.log(kleur.dim(wf.description.trim()));
  console.log();
  if (wf.usage) {
    console.log(kleur.bold('  Usage:'));
    console.log(kleur.dim('    ' + wf.usage.trim().split('\n').join('\n    ')));
    console.log();
  }
  console.log(kleur.bold(`  Tasks (${wf.tasks.length}):`));
  for (const t of wf.tasks) {
    console.log(`    ${kleur.cyan(String(t.id).padEnd(3))} ${kleur.yellow(t.task.padEnd(20))} ${kleur.dim(t.why)}`);
  }
  console.log();
}

interface RunOptions {
  var?: string[];
  out?: string;
  dryRun?: boolean;
}

export function workflowRunCommand(name: string, opts: RunOptions): void {
  const wf = loadWorkflow(name);
  const vars = parseVarPairs(opts.var ?? []);

  const expanded = {
    ...wf,
    tasks: wf.tasks.map((t) => ({
      ...t,
      prompt: substituteVars(t.prompt, vars),
    })),
  };

  const jsonOut = JSON.stringify(expanded, null, 2);
  console.log(jsonOut);

  if (opts.out) {
    const { writeFileSync } = require('node:fs');
    writeFileSync(opts.out, jsonOut, 'utf8');
    console.error(kleur.dim(`  [arcanea] wrote plan to ${opts.out}`));
  }

  console.error();
  console.error(kleur.dim(`  [arcanea] workflow expanded. To execute:`));
  console.error(kleur.dim(`    1. Review the plan above.`));
  console.error(kleur.dim(`    2. For each task, run: arcanea-orchestrator run --task <task> "<prompt>"`));
  console.error(kleur.dim(`    3. Or pipe to ao batch-spawn when the executor is wired (Phase 3.5).`));
  console.error();
}
