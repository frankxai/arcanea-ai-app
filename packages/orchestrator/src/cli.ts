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

const program = new Command();

program
  .name('arcanea-orchestrator')
  .description('The Arcanea Orchestrator — routes, plans, swarms, and learns across claude / opencode / codex / gemini.')
  .version('1.0.0');

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

program.parseAsync(process.argv).catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
