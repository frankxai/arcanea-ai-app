import { Command } from 'commander';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';
import pc from 'picocolors';
import { createKeystore, getAuthAdapter, maskCredential } from '@arcanea/auth';
import type { ProviderType } from '@arcanea/core';
import { printSuccess, printError, printInfo, printDivider } from '../ui/banner.js';

const PROVIDERS: ProviderType[] = ['claude', 'openai', 'gemini', 'copilot', 'cursor'];

const GATE_COLORS: Record<string, (s: string) => string> = {
  Foundation: pc.green,
  Flow: pc.blue,
  Fire: pc.red,
  Heart: pc.magenta,
  Voice: pc.cyan,
  Sight: pc.yellow,
  Crown: pc.white,
  Starweave: (s: string) => pc.bold(pc.magenta(s)),
  Unity: (s: string) => pc.bold(pc.cyan(s)),
  Source: (s: string) => pc.bold(pc.yellow(s)),
};

const RANK_LABELS: Record<string, string> = {
  Apprentice: 'Apprentice',
  Mage: 'Mage',
  Master: 'Master',
  Archmage: 'Archmage',
  Luminor: 'Luminor',
};

interface AgentProfile {
  id: string;
  version: string;
  gate: string;
  rank: string;
  skills: string[];
  detectedTools: string[];
  capabilities: string[];
  mcpServers: string[];
  creativeApis: string[];
  createdAt: string;
  updatedAt: string;
}

function getArcaneanHome(): string {
  return join(homedir(), '.arcanea');
}

function formatUptime(createdAt: string): string {
  const created = new Date(createdAt);
  const now = new Date();
  const diffMs = now.getTime() - created.getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (days === 0) return 'today';
  if (days === 1) return '1 day';
  return `${days} days`;
}

export const statusCommand = new Command('status')
  .description('Show Arcanea Agent OS status')
  .option('-d, --dir <path>', 'Project directory', process.cwd())
  .action(async (options) => {
    const projectDir = options.dir as string;
    const arcaneanHome = getArcaneanHome();
    const profilePath = join(arcaneanHome, 'profile.json');

    // ── Banner ──────────────────────────────────────────────
    console.log('');
    console.log(`  ${pc.bold(pc.cyan('\u2726'))} ${pc.bold(pc.white('Arcanea Agent OS'))}`);
    console.log('');

    // ── Agent Profile ────────────────────────────────────────
    if (existsSync(profilePath)) {
      try {
        const profile = JSON.parse(readFileSync(profilePath, 'utf-8')) as AgentProfile;
        const gateColor = GATE_COLORS[profile.gate] || pc.white;

        console.log(`  ${pc.dim('Agent ID')}     ${pc.cyan(profile.id)}`);
        console.log(`  ${pc.dim('Gate')}         ${gateColor(profile.gate)}`);
        console.log(`  ${pc.dim('Rank')}         ${pc.yellow(RANK_LABELS[profile.rank] || profile.rank)}`);
        console.log(`  ${pc.dim('Skills')}       ${pc.white(String(profile.skills.length))} installed`);
        console.log(`  ${pc.dim('MCP Servers')}  ${pc.white(String(profile.mcpServers.length))} available`);
        console.log(`  ${pc.dim('APIs')}         ${profile.creativeApis.join(', ')}`);
        console.log(`  ${pc.dim('Uptime')}       ${formatUptime(profile.createdAt)}`);
        console.log('');

        // ── Detected Tools ──────────────────────────────────
        if (profile.detectedTools.length > 0) {
          printDivider();
          console.log(`  ${pc.bold('Tools')}\n`);
          for (const tool of profile.detectedTools) {
            try {
              const adapter = getAuthAdapter(tool as ProviderType);
              printSuccess(adapter.displayName);
            } catch {
              printSuccess(tool);
            }
          }
          console.log('');
        }

      } catch {
        printError('Could not read agent profile.');
        console.log('');
      }
    } else {
      printInfo('No agent profile found. Run `arcanea init` to bootstrap.');
      console.log('');
    }

    // ── Memory System ────────────────────────────────────────
    const memoryDir = join(arcaneanHome, 'memory');
    const sessionsDir = join(arcaneanHome, 'memory', 'sessions');
    const agentsDir = join(arcaneanHome, 'agents');

    printDivider();
    console.log(`  ${pc.bold('System')}\n`);

    if (existsSync(memoryDir)) {
      printSuccess('Memory system (AgentDB)');
    } else {
      printError('Memory system not initialized');
    }

    if (existsSync(sessionsDir)) {
      printSuccess('Session persistence');
    } else {
      printError('Session persistence not initialized');
    }

    if (existsSync(agentsDir)) {
      printSuccess('Agent registry');
    } else {
      printError('Agent registry not initialized');
    }

    console.log('');

    // ── Credentials ──────────────────────────────────────────
    printDivider();
    console.log(`  ${pc.bold('Credentials')}\n`);

    const keystore = createKeystore();
    let anyConfigured = false;
    for (const provider of PROVIDERS) {
      const cred = await keystore.load(provider);
      if (cred) {
        const adapter = getAuthAdapter(provider);
        printSuccess(`${adapter.displayName.padEnd(25)} ${pc.dim(maskCredential(cred))}`);
        anyConfigured = true;
      }
    }

    if (!anyConfigured) {
      printInfo('No API keys configured. Run `arcanea auth` to add credentials.');
    }

    console.log('');

    // ── Overlays ─────────────────────────────────────────────
    const manifestPath = join(projectDir, '.arcanea', 'overlay-manifest.json');

    printDivider();
    console.log(`  ${pc.bold('Overlays')}\n`);

    if (existsSync(manifestPath)) {
      try {
        const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));
        const overlays = manifest.overlays || {};

        if (Object.keys(overlays).length === 0) {
          printInfo('No overlays installed.');
        } else {
          for (const [provider, config] of Object.entries(overlays) as [string, Record<string, unknown>][]) {
            let adapterDisplayName: string;
            try {
              const adapter = getAuthAdapter(provider as ProviderType);
              adapterDisplayName = adapter.displayName;
            } catch {
              adapterDisplayName = provider;
            }
            const filesCount = (config.filesManaged as string[] | undefined)?.length || 0;
            printSuccess(
              `${adapterDisplayName.padEnd(18)} ${(config.level as string).padEnd(10)} v${config.packageVersion}  (${filesCount} files)`,
            );
          }
        }
      } catch {
        printError('Could not read overlay manifest.');
      }
    } else {
      printInfo('No overlays in this project. Run `arcanea init` to install.');
    }

    // ── Footer ───────────────────────────────────────────────
    console.log('');
    console.log(`  ${pc.dim('arcanea update')}  ${pc.dim('\u2014 check for updates')}`);
    console.log(`  ${pc.dim('arcanea auth')}    ${pc.dim('\u2014 manage credentials')}`);
    console.log(`  ${pc.dim('arcanea init')}    ${pc.dim('\u2014 re-bootstrap Agent OS')}`);
    console.log('');
  });
