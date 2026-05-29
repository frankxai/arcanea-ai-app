#!/usr/bin/env tsx
/**
 * Antigravity Programmatic Swarm Bridge CLI
 * 
 * Bridges Arcanea task checklists and task contracts directly to the
 * Antigravity subagent execution plane by outputting exact define_subagent
 * and invoke_subagent tool invocation structures.
 */

import { Command } from 'commander';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import {
  generateAntigravitySwarmPayload,
  GUARDIAN_AGENT_PROFILES
} from '../packages/swarm-coordinator/src/index.js';
import type { TaskConfig } from '../packages/swarm-coordinator/src/types.js';

const program = new Command();

program
  .name('agy-swarm-bridge')
  .description('Bridges Arcanea task lists to Antigravity subagent invocation structures')
  .version('1.0.0')
  .option('-f, --file <path>', 'Path to markdown task list or task.md')
  .option('-t, --topology <type>', 'Swarm topology: hierarchical, mesh, adaptive', 'hierarchical')
  .option('-d, --dry-run', 'Run a dry-run and print visual swarm layout', false)
  .action((options) => {
    const file = options.file;
    const dryRun = options.dryRun;
    const topology = options.topology;

    let tasks: TaskConfig[] = [];

    if (file && existsSync(file)) {
      console.log(`Parsing tasks from: ${file}`);
      const content = readFileSync(file, 'utf-8');
      tasks = parseTasksFromMarkdown(content);
    } else {
      console.log('No input task file provided or file does not exist. Using standard mock swarm template...');
      tasks = getMockSwarmTasks();
    }

    if (tasks.length === 0) {
      console.error('Error: No active tasks found to coordinate.');
      process.exit(1);
    }

    // Generate the Antigravity swarm payload
    const { definitions, invocations } = generateAntigravitySwarmPayload(tasks, topology as any);

    if (dryRun) {
      printSwarmDryRun(tasks, definitions, invocations, topology);
    } else {
      console.log(JSON.stringify({ definitions, invocations }, null, 2));
    }
  });

program.parse(process.argv);

/**
 * Parses markdown tasks (e.g. - [ ] Step description)
 */
function parseTasksFromMarkdown(content: string): TaskConfig[] {
  const lines = content.split('\n');
  const tasks: TaskConfig[] = [];
  let index = 1;

  for (const line of lines) {
    const match = line.match(/^\s*-\s*\[\s*[ x\/]*\s*\]\s*(.+)$/i);
    if (match) {
      const description = match[1].trim();
      // Map domain keyword to best matched Guardian
      const assignedTo = routeDescriptionToGuardian(description);

      tasks.push({
        id: `task-0${index}`,
        type: 'development',
        description,
        priority: 'high',
        assignedTo,
      });
      index++;
    }
  }

  return tasks;
}

/**
 * Route description keywords to matched Guardian ID
 */
function routeDescriptionToGuardian(description: string): string {
  const text = description.toLowerCase();
  
  // Keyword match mapping
  const mappings: Array<{ keywords: string[]; agentId: string }> = [
    { keywords: ['db', 'database', 'schema', 'migration', 'deploy', 'infra'], agentId: 'guardian-lyssandria' },
    { keywords: ['ui', 'ux', 'design', 'style', 'animation', 'css'], agentId: 'guardian-leyla' },
    { keywords: ['performance', 'optimize', 'refactor', 'speed', 'turbo'], agentId: 'guardian-draconia' },
    { keywords: ['documentation', 'comm', 'connect', 'copy', 'team'], agentId: 'guardian-maylinn' },
    { keywords: ['api', 'route', 'interface', 'naming', 'endpoints'], agentId: 'guardian-alera' },
    { keywords: ['debug', 'bug', 'QA', 'verify', 'test', 'review'], agentId: 'guardian-lyria' },
    { keywords: ['architect', 'system', 'wisdom', 'structure'], agentId: 'guardian-aiyami' },
    { keywords: ['migration', 'shift', 'transition'], agentId: 'guardian-elara' },
    { keywords: ['merge', 'git', 'collaboration', 'integration'], agentId: 'guardian-ino' },
  ];

  for (const map of mappings) {
    for (const keyword of map.keywords) {
      if (text.includes(keyword)) {
        return map.agentId;
      }
    }
  }

  // Fallback to Shinkami (Source)
  return 'guardian-shinkami';
}

/**
 * Fallback mock swarm template
 */
function getMockSwarmTasks(): TaskConfig[] {
  return [
    {
      id: 'task-1',
      type: 'architecture',
      description: 'Design the overall Antigravity-native swarm topology and interfaces.',
      priority: 'high',
      assignedTo: 'guardian-aiyami', // Sage Architect
    },
    {
      id: 'task-2',
      type: 'implementation',
      description: 'Implement the database schema and Supabase RLS migrations.',
      priority: 'high',
      assignedTo: 'guardian-lyssandria', // Foundation Architect
    },
    {
      id: 'task-3',
      type: 'design',
      description: 'Design the premium star-map visualization for the Agent Constellation.',
      priority: 'high',
      assignedTo: 'guardian-leyla', // Creative Flow
    },
    {
      id: 'task-4',
      type: 'review',
      description: 'Audit visual consistency, anti-slop guidelines, and run Playwright checks.',
      priority: 'high',
      assignedTo: 'guardian-lyria', // Vision Keeper
    },
  ];
}

/**
 * Print visually appealing dry-run output
 */
function printSwarmDryRun(
  tasks: TaskConfig[],
  definitions: any[],
  invocations: any[],
  topology: string
) {
  console.log('\n================================================================');
  console.log('                 ARCANEA SWARM CONSTELLATION                    ');
  console.log('                   (Antigravity-Native Swarm)                   ');
  console.log('================================================================');
  console.log(`Topology Mode:  ${topology.toUpperCase()}`);
  console.log(`Swarm Members:  ${definitions.length} Specialized Subagents`);
  console.log(`Active Tasks:   ${tasks.length} Parallel Workflows`);
  console.log('----------------------------------------------------------------\n');

  console.log('✦ ACTIVE SUBAGENTS TO DEFINE:');
  for (const def of definitions) {
    console.log(`  - [REGISTER] Name: "${def.name}" | Description: "${def.description}"`);
  }

  console.log('\n✦ SWARM PIPELINE INVOCATIONS:');
  for (const inv of invocations) {
    console.log(`  - [SPAWN] TeamType: "${inv.TypeName}" | Role: "${inv.Role}"`);
    console.log(`    └─ Prompt Seed: "${inv.Prompt.split('\n')[0]}..."`);
  }

  console.log('\n✦ TOPOLOGY GRAPH REPRESENTATION:');
  if (topology === 'hierarchical') {
    console.log(`
            [guardian-shinkami] (Leader Conductor)
                     │
         ┌───────────┼───────────┐
         ▼           ▼           ▼
   [aiyami]    [lyssandria]   [leyla]   [lyria]
  (Architect)  (Foundation)   (Flow)   (Reviewer)
    `);
  } else {
    console.log(`
      [aiyami] ─── (peer) ─── [lyssandria]
         │                       │
      (peer)                  (peer)
         │                       │
      [leyla]  ─── (peer) ─── [lyria]
    `);
  }
  console.log('================================================================\n');
}
