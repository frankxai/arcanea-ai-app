#!/usr/bin/env node
/**
 * arcanea-flow CLI
 *
 * Commands:
 *   prompt <agent-type> <task>   Print the Luminor-injected prompt for an agent
 *   list-modules                 List all registered agent types
 *   model <agent-type>           Show the recommended model tier
 */

import { buildLuminorPrompt, listAgentTypes, getRecommendedModel } from './index.js';

const [, , command, ...args] = process.argv;

function usage(): void {
  console.log(`
arcanea-flow — Luminor prompt injection for agent spawning

USAGE
  arcanea-flow prompt <agent-type> "<task>"
  arcanea-flow list-modules
  arcanea-flow model <agent-type>

EXAMPLES
  arcanea-flow prompt coder "Build a JWT auth middleware"
  arcanea-flow prompt researcher "Survey the MCP transport landscape"
  arcanea-flow list-modules
  arcanea-flow model system-architect
`.trim());
}

function handlePrompt(agentType: string | undefined, taskParts: string[]): void {
  if (!agentType) {
    console.error('Error: agent-type is required\n');
    usage();
    process.exit(1);
  }

  const task = taskParts.join(' ');
  if (!task.trim()) {
    console.error('Error: task instructions are required\n');
    usage();
    process.exit(1);
  }

  try {
    const prompt = buildLuminorPrompt(agentType, task);
    process.stdout.write(prompt + '\n');
  } catch (err) {
    console.error(`Error building prompt: ${(err as Error).message}`);
    process.exit(1);
  }
}

function handleListModules(): void {
  try {
    const types = listAgentTypes();
    console.log('Registered agent types:\n');
    for (const t of types) {
      const model = getRecommendedModel(t);
      console.log(`  ${t.padEnd(32)} [${model}]`);
    }
    console.log(`\nTotal: ${types.length} types`);
  } catch (err) {
    console.error(`Error: ${(err as Error).message}`);
    process.exit(1);
  }
}

function handleModel(agentType: string | undefined): void {
  if (!agentType) {
    console.error('Error: agent-type is required\n');
    usage();
    process.exit(1);
  }

  try {
    const model = getRecommendedModel(agentType);
    console.log(`${agentType} → ${model}`);
  } catch (err) {
    console.error(`Error: ${(err as Error).message}`);
    process.exit(1);
  }
}

switch (command) {
  case 'prompt':
    handlePrompt(args[0], args.slice(1));
    break;
  case 'list-modules':
    handleListModules();
    break;
  case 'model':
    handleModel(args[0]);
    break;
  case undefined:
  case '--help':
  case '-h':
    usage();
    break;
  default:
    console.error(`Unknown command: ${command}\n`);
    usage();
    process.exit(1);
}
