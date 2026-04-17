import { execa } from 'execa';
import { writeFileSync } from 'node:fs';
import { loadSpec } from '@arcanea/router-spec';
import { loadConfig } from '../config.js';
import kleur from 'kleur';

interface Options {
  surface?: string;
  out?: string;
  execute?: boolean;
  dryRun?: boolean;
}

interface PlannedTask {
  id: number;
  task: string;
  prompt: string;
  why: string;
}

interface Plan {
  goal: string;
  tasks: PlannedTask[];
}

const PLANNER_PROMPT_TEMPLATE = (
  goal: string,
  taskClasses: string[],
): string => `You are the Arcanea Orchestrator's Planner. Decompose a high-level goal into 3-7 concrete sub-tasks that can be dispatched to coding agents via @arcanea/orchestrator.

GOAL:
${goal}

AVAILABLE TASK CLASSES (pick from these, one per sub-task):
${taskClasses.map((t) => `- ${t}`).join('\n')}

OUTPUT REQUIREMENTS:
- Return VALID JSON only. No prose, no markdown fences.
- Shape: {"goal":"...","tasks":[{"id":1,"task":"<task-class>","prompt":"<concrete instruction>","why":"<1-line rationale>"}]}
- Each task.prompt should be self-contained and actionable by one agent in isolation.
- Order tasks by dependency: if task N needs task M's output, N comes after M.
- Between 3 and 7 tasks total. Fewer is better if the goal is small.

Return the JSON now.`;

function stripJson(raw: string): string {
  // Sub-CLIs sometimes wrap in ```json fences despite our instruction.
  const fenceMatch = raw.match(/```(?:json)?\s*\n([\s\S]*?)\n```/);
  if (fenceMatch) return fenceMatch[1];
  // Or include preamble — grab from first { to last }.
  const start = raw.indexOf('{');
  const end = raw.lastIndexOf('}');
  if (start >= 0 && end > start) return raw.slice(start, end + 1);
  return raw;
}

export async function planCommand(
  goalParts: string[],
  opts: Options,
): Promise<void> {
  const goal = goalParts.join(' ').trim();
  if (!goal) {
    console.error(kleur.red('Provide a goal, e.g. `arcanea-orchestrator plan "build a landing page"`'));
    process.exit(1);
  }

  const spec = loadSpec();
  const config = loadConfig();
  const taskClasses = Object.keys(spec.tasks);
  const prompt = PLANNER_PROMPT_TEMPLATE(goal, taskClasses);

  const claudeInstalled = config.auth.claude?.installed !== false;

  if (!claudeInstalled || opts.dryRun) {
    // Fallback: produce a template plan the user can hand-edit.
    const template: Plan = {
      goal,
      tasks: [
        {
          id: 1,
          task: 'plan',
          prompt:
            '(claude CLI not available or --dry-run) — this is a template. Fill in concrete prompts manually.',
          why: 'Planner requires claude -p; install claude CLI or run without --dry-run.',
        },
      ],
    };
    console.log(JSON.stringify(template, null, 2));
    if (opts.out) writeFileSync(opts.out, JSON.stringify(template, null, 2), 'utf8');
    return;
  }

  console.error(kleur.dim(`  [arcanea] planning via claude -p (haiku-4-5) …`));

  const res = await execa(
    'claude',
    ['-p', prompt, '--model', 'claude-haiku-4-5'],
    { reject: false, timeout: 90_000, stdin: 'ignore' },
  );

  if (res.exitCode !== 0) {
    console.error(kleur.red(`  [arcanea] planner failed (exit ${res.exitCode}). stderr:`));
    console.error(res.stderr.slice(0, 500));
    process.exit(res.exitCode ?? 1);
  }

  const jsonText = stripJson(res.stdout);
  let plan: Plan;
  try {
    plan = JSON.parse(jsonText);
  } catch (err) {
    console.error(kleur.red(`  [arcanea] planner returned invalid JSON.`));
    console.error(kleur.dim('  Raw output:'));
    console.error(res.stdout.slice(0, 800));
    process.exit(1);
  }

  // Validate task classes are known.
  const validTasks = new Set(taskClasses);
  for (const t of plan.tasks) {
    if (!validTasks.has(t.task)) {
      console.error(
        kleur.yellow(
          `  [arcanea] warning: planner chose unknown task "${t.task}" for id=${t.id}; it will be treated as code.implement`,
        ),
      );
    }
  }

  console.log(JSON.stringify(plan, null, 2));

  if (opts.out) {
    writeFileSync(opts.out, JSON.stringify(plan, null, 2), 'utf8');
    console.error(kleur.dim(`  [arcanea] wrote plan to ${opts.out}`));
  }

  if (opts.execute) {
    console.error(kleur.dim('\n  [arcanea] --execute not yet wired. Save plan and pipe to swarm:'));
    console.error(kleur.dim(`  arcanea-orchestrator plan "${goal}" --out plan.json`));
    console.error(kleur.dim(`  # then manually: for each task in plan.json, arcanea-orchestrator run ...`));
  }
}
