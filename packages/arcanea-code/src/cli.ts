#!/usr/bin/env node
import { Command } from 'commander';
import { listModelsCommand } from './commands/list-models.js';
import { listTasksCommand } from './commands/list-tasks.js';
import { explainCommand } from './commands/explain.js';
import { runCommand } from './commands/run.js';
import { swarmCommand } from './commands/swarm.js';

const program = new Command();

program
  .name('arcanea-code')
  .description('Thin multi-CLI dispatcher for coding tasks across claude, opencode, codex, gemini.')
  .version('0.1.0');

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
  .description('Spawn a multi-worker swarm via arcanea-orchestrator. [stub — Phase 3]')
  .option('--from <file>', 'Parse tasks from a backlog file')
  .option('--tasks <n>', 'Number of workers to spawn', '3')
  .action(swarmCommand);

program.parseAsync(process.argv).catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
