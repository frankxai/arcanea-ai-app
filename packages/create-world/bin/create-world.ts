#!/usr/bin/env tsx
import fs from 'node:fs';
import path from 'node:path';
import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import prompts from 'prompts';

const program = new Command();

program
  .name('create-world')
  .description('Bootstrap a new Arcanea creative world project')
  .argument('[directory]', 'directory to create the world in')
  .action(async (directory) => {
    console.log(chalk.bold.cyan('\n🌌 Arcanea Creative World Bootstrapper\n'));

    let targetDir = directory;
    if (!targetDir) {
      const response = await prompts({
        type: 'text',
        name: 'dir',
        message: 'Where would you like to create your new creative world?',
        initial: './my-arcanea-world'
      });
      targetDir = response.dir;
    }

    if (!targetDir) {
      console.log(chalk.red('❌ Directory selection cancelled.'));
      process.exit(1);
    }

    const absTargetDir = path.resolve(targetDir);
    const projectName = path.basename(absTargetDir);

    console.log(chalk.gray(`Initializing world in: ${absTargetDir}`));

    const spinner = ora('Creating directory structure...').start();

    try {
      // Create folders
      const dirs = [
        'chapters',
        'characters',
        'worldbuilding',
        'skills',
        'commands',
        'agents',
        'hooks',
        '.claude-plugin'
      ];

      for (const d of dirs) {
        fs.mkdirSync(path.join(absTargetDir, d), { recursive: true });
      }

      spinner.text = 'Writing plugin manifest...';

      // Write .claude-plugin/plugin.json
      const manifest = {
        name: projectName,
        version: '0.1.0',
        description: `Creative world plugin for ${projectName}, powered by Arcanea.`,
        capabilities: {
          skills: ['skills/'],
          commands: ['commands/'],
          agents: ['agents/'],
          hooks: ['hooks/']
        },
        experimental: {
          monitors: []
        }
      };

      fs.writeFileSync(
        path.join(absTargetDir, '.claude-plugin', 'plugin.json'),
        JSON.stringify(manifest, null, 2),
        'utf8'
      );

      spinner.text = 'Writing boilerplate templates...';

      // Create a readme
      const readmeContent = `# 🌌 ${projectName} — Creative World

This is an Arcanea-compatible creative world plugin. It conforms to the \`agentskills.io\` open standard and the Claude Code plugin specification.

## Directory Structure

- \`chapters/\`: Manuscript chapters and drafts.
- \`characters/\`: Character sheets, lore, arcs, and alignment profiles.
- \`worldbuilding/\`: Codex, lore hubs, location descriptions, and institutional magic system profiles.
- \`skills/\`: Custom agent skills (\`SKILL.md\` with YAML frontmatter) for creative tasks.
- \`commands/\`: Custom slash commands for your local terminal assistant.
- \`agents/\`: Specialized agent definition configs and custom behaviors.
- \`.claude-plugin/\`: System-level configuration and plugin manifest.

## Usage

You can import this directory directly into any supported AI workspace or terminal client:
\`\`\`bash
agy plugin import .
\`\`\`
`;
      fs.writeFileSync(path.join(absTargetDir, 'README.md'), readmeContent, 'utf8');

      // Create a canonical template character file (Arion Vance)
      const templateCharacter = `# Arion Vance of Greenvale

## Metadata
- **Role**: Protagonist
- **Archetype**: Unawakened Apprentice → Source Resonator
- **Origin Realm**: Greenvale / Veldorian Outskirts
- **Dominant Gate**: Voice (528 Hz) & Source (1111 Hz)
- **Tactile Anchor**: Weathered ashwood training stave and father's silver signet

## Sensory Reality
Arion smells of crushed pine needles, damp loam, and morning woodsmoke. His hands are calloused from the forge, bearing a faint white burn line along his left forearm where an acoustic resonance first sparked.

## Backstory
Raised by his father in the quiet settlement of Greenvale, Arion spent seventeen years believing he was destined to tend the valley bellows. When the Void portal breached the Entrance Crucible, his latent harmonic frequency awakened, forcing him into the path of the Ten Gates.
`;
      fs.writeFileSync(path.join(absTargetDir, 'characters', 'arion.md'), templateCharacter, 'utf8');

      // Create a canonical template worldbuilding file (Eldria Prime)
      const templateWorld = `# The Citadel of Eldria Prime

## Description
The crystalline heart of the Kingdom of Light atop Mount Solaris, where the Ten Solfeggio Gates intersect in a perpetual acoustic standing wave.

## Leyline & Acoustic Properties
- **Base Frequency**: 1111 Hz (Source Gate)
- **Soil Resonance**: Pure Lapis-veined marble holding primordial harmonic memory
- **Corridor Connections**: Open acoustic leylines to Veldoria (528 Hz) and Aurevalde (396 Hz)

## Key Locations
- **The Crucible of the Dawn**: The circular arena where seekers undertake the Entrance Trials.
- **The Archives of Aiyami**: Vellum chronometers and star-woven tapestries preserving the lineage of the First War.
- **The Mar Arcano Aquifer**: Subterranean waterways conducting bio-acoustic resonance beneath the mountain bedrock.
`;
      fs.writeFileSync(path.join(absTargetDir, 'worldbuilding', 'eldria_prime.md'), templateWorld, 'utf8');

      spinner.succeed(chalk.green('World bootstrapped successfully!'));

      console.log(`\n${chalk.bold('Next steps:')}`);
      console.log(`  1. ${chalk.cyan(`cd ${targetDir}`)}`);
      console.log(`  2. Add your manuscript files to ${chalk.cyan('chapters/')}`);
      console.log(`  3. Run your local agent to start editing and validating!`);
      console.log(chalk.bold.yellow('\nLive long and build beautiful worlds! 🌌\n'));

    } catch (err: any) {
      spinner.fail(chalk.red(`Failed to bootstrap: ${err.message}`));
      process.exit(1);
    }
  });

program.parse(process.argv);
