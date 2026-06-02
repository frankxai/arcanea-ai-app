#!/usr/bin/env node
import { Command } from 'commander';
import { listModelsCommand } from './commands/list-models.js';
import { listTasksCommand } from './commands/list-tasks.js';
import { explainCommand } from './commands/explain.js';
import { runCommand } from './commands/run.js';
import { swarmCommand } from './commands/swarm.js';
import { doctorCommand } from './commands/doctor.js';
import { configCommand } from './commands/config.js';
import { statusCommand } from './commands/status.js';
import { planCommand } from './commands/plan.js';
import { historyCommand } from './commands/history.js';
import { statsCommand } from './commands/stats.js';
import { learnCommand } from './commands/learn.js';
import {
  workflowListCommand,
  workflowShowCommand,
  workflowRunCommand,
} from './commands/workflow.js';
import { authorCouncilCommand } from './commands/author-council.js';

const program = new Command();

program
  .name('arcanea-orchestrator')
  .description('The Arcanea Orchestrator — routes, plans, swarms, and learns across claude / opencode / codex / gemini.')
  .version('1.2.0');

program
  .command('list-models')
  .description('List every model in the router spec.')
  .option('-t, --tier <tier>', 'Filter by tier (free|sub|byok|premium)')
  .action(listModelsCommand);

program
  .command('list-tasks')
  .description('List every task class the router knows.')
  .action(listTasksCommand);

program
  .command('explain <task>')
  .description('Show which model+runtime will run a task for a given surface.')
  .option('-s, --surface <surface>', 'Surface to resolve against', 'claude-arcanea')
  .action(explainCommand);

program
  .command('run')
  .description('Dispatch a prompt to the routed runtime.')
  .requiredOption('-t, --task <task>', 'Task class (e.g. code.debug)')
  .option('-s, --surface <surface>', 'Surface to route through', 'claude-arcanea')
  .option('-m, --model <model>', 'Override model selection')
  .option('--dry-run', 'Show the command that would run, do not execute')
  .option('--no-history', 'Do not log this run to ~/.arcanea/history.jsonl')
  .argument('<prompt...>', 'Prompt to send')
  .action(runCommand);

program
  .command('swarm')
  .description('Spawn a multi-worker swarm via arcanea-orchestrator (Composio `ao`).')
  .option('--from <file>', 'Parse tasks from a backlog file')
  .option('--tasks <n>', 'Number of workers to spawn', '3')
  .option('--dry-run', 'Show planned dispatch without spawning')
  .action(swarmCommand);

program
  .command('author-council')
  .description('Run the Author Council deliberation over a chapter.')
  .argument('<bookDir>', 'Directory of the book')
  .argument('<chapterPath>', 'Relative path to the chapter markdown file')
  .action(authorCouncilCommand);

program
  .command('status')
  .description('Unified dashboard: router spec, config, CLI auth, AO sessions, worktrees.')
  .action(statusCommand);

program
  .command('doctor')
  .description('Detect installed CLIs, infer auth tiers, save to ~/.arcanea/config.yaml.')
  .action(doctorCommand);

program
  .command('config [key] [value]')
  .description('Read or write user config (preference, defaultSurface).')
  .action(configCommand);

program
  .command('plan')
  .description('Decompose a high-level goal into 3-7 dispatchable sub-tasks via claude -p.')
  .option('-s, --surface <surface>', 'Surface to plan against', 'claude-arcanea')
  .option('-o, --out <file>', 'Write plan JSON to file')
  .option('--execute', 'After planning, dispatch via swarm (preview only for v1.1)')
  .option('--dry-run', 'Return a template plan without invoking claude')
  .argument('<goal...>', 'High-level goal to decompose')
  .action(planCommand);

program
  .command('history')
  .description('Show recent run history from ~/.arcanea/history.jsonl.')
  .option('-n, --limit <n>', 'How many recent events', '20')
  .option('--json', 'Output as JSON')
  .action(historyCommand);

program
  .command('stats')
  .description('Aggregate success rates + avg duration per task→model.')
  .option('--json', 'Output as JSON')
  .action(statsCommand);

program
  .command('learn <task>')
  .description('Show baseline vs adaptive routing for a task, using ~/.arcanea/history.jsonl.')
  .option('-s, --surface <surface>', 'Surface to analyze', 'claude-arcanea')
  .action(learnCommand);

const workflow = program.command('workflow').description('Built-in multi-task compositions.');

workflow
  .command('list')
  .description('List all built-in workflow templates.')
  .option('--json', 'Output as JSON')
  .action(workflowListCommand);

workflow
  .command('show <name>')
  .description('Show a workflow template.')
  .option('--json', 'Output as JSON')
  .action(workflowShowCommand);

workflow
  .command('run <name>')
  .description('Expand + emit a workflow as a plan (for piping / manual dispatch).')
  .option('--var <kv...>', 'Substitute {{vars}} — --var page=/pricing --var pitch="..."')
  .option('-o, --out <file>', 'Write expanded plan to file')
  .option('--dry-run', 'Alias — always emits without executing')
  .action(workflowRunCommand);

program.parseAsync(process.argv).catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
