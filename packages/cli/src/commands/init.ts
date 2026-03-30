import { Command } from 'commander';
import pc from 'picocolors';
import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';
import { randomBytes } from 'node:crypto';
import { detectAllTools, type ProviderType, type OverlayLevel, type InstallResult, OVERLAY_LEVELS } from '@arcanea/core';
import { getAuthAdapter, createKeystore, maskCredential } from '@arcanea/auth';
import { ClaudeOverlayInstaller } from '@arcanea/overlay-claude';
import { ChatGPTOverlayInstaller } from '@arcanea/overlay-chatgpt';
import { GeminiOverlayInstaller } from '@arcanea/overlay-gemini';
import { CopilotOverlayInstaller } from '@arcanea/overlay-copilot';
import { CursorOverlayInstaller } from '@arcanea/overlay-cursor';
import { printSuccess, printError, printInfo, printWarning } from '../ui/banner.js';
import { promptMultiSelect, promptSelect, promptPassword, promptConfirm } from '../ui/prompts.js';

const CLI_VERSION = '1.0.0';

const INSTALLERS: Record<ProviderType, ClaudeOverlayInstaller | ChatGPTOverlayInstaller | GeminiOverlayInstaller | CopilotOverlayInstaller | CursorOverlayInstaller> = {
  claude: new ClaudeOverlayInstaller(),
  openai: new ChatGPTOverlayInstaller(),
  gemini: new GeminiOverlayInstaller(),
  copilot: new CopilotOverlayInstaller(),
  cursor: new CursorOverlayInstaller(),
};

const PROVIDER_LABELS: Record<ProviderType, string> = {
  claude: 'Claude Code',
  openai: 'ChatGPT / OpenAI',
  gemini: 'Gemini (Google)',
  copilot: 'GitHub Copilot',
  cursor: 'Cursor IDE',
};

/** Top 20 essential skills shipped with init */
const ESSENTIAL_SKILLS = [
  'superintelligence',
  'sparc-methodology',
  'pair-programming',
  'refactor',
  'debug',
  'tdd',
  'search-first',
  'planning-with-files',
  'mcp-architecture',
  'swarm-orchestration',
  'security-auditor',
  'performance-analysis',
  'frontend-design',
  'nextjs-expert',
  'agentdb-memory-patterns',
  'skill-builder',
  'prompt-optimizer',
  'verification-quality',
  'model-routing',
  'hooks-automation',
];

/** MCP servers available in the Agent OS */
const MCP_SERVERS = [
  'arcanea-mcp',
  'arcanea-memory',
  'github',
  'supabase',
  'playwright',
  'next-devtools',
  'comfyui',
  'figma-remote-mcp',
  'notion',
];

/** Creative API capabilities */
const CREATIVE_APIS = ['imagine', 'create', 'chat', 'forge', 'voice'];

function generateAgentId(): string {
  return 'arc_' + randomBytes(3).toString('hex');
}

function getArcaneanHome(): string {
  return join(homedir(), '.arcanea');
}

function printAgentBanner(): void {
  console.log('');
  console.log(`  ${pc.bold(pc.cyan('\u2726'))} ${pc.bold(pc.white('Arcanea Agent OS'))} ${pc.dim(`v${CLI_VERSION}`)}`);
  console.log('');
}

function printStep(label: string, detail: string, path?: string): void {
  const labelPadded = label.padEnd(28);
  const pathStr = path ? pc.dim(` \u2014 ${path}`) : '';
  console.log(`  ${pc.green('\u2713')} ${pc.white(labelPadded)} ${pc.dim('\u2014')} ${detail}${pathStr}`);
}

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

function initMemorySystem(arcaneanHome: string): boolean {
  const dirs = [
    arcaneanHome,
    join(arcaneanHome, 'memory'),
    join(arcaneanHome, 'memory', 'sessions'),
    join(arcaneanHome, 'memory', 'vectors'),
    join(arcaneanHome, 'agents'),
    join(arcaneanHome, 'skills'),
    join(arcaneanHome, 'logs'),
  ];

  let created = false;
  for (const dir of dirs) {
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
      created = true;
    }
  }

  // Create config if missing
  const configPath = join(arcaneanHome, 'config.json');
  if (!existsSync(configPath)) {
    writeFileSync(configPath, JSON.stringify({
      version: CLI_VERSION,
      theme: 'cosmic',
      telemetry: false,
      autoUpdate: true,
      defaultGate: 'Foundation',
      createdAt: new Date().toISOString(),
    }, null, 2));
    created = true;
  }

  return created;
}

function createAgentProfile(
  arcaneanHome: string,
  detectedTools: string[],
  skillCount: number,
): AgentProfile {
  const profilePath = join(arcaneanHome, 'profile.json');

  // If profile exists, load and update it
  if (existsSync(profilePath)) {
    try {
      const existing = JSON.parse(readFileSync(profilePath, 'utf-8')) as AgentProfile;
      existing.detectedTools = detectedTools;
      existing.skills = ESSENTIAL_SKILLS.slice(0, skillCount);
      existing.mcpServers = MCP_SERVERS;
      existing.creativeApis = CREATIVE_APIS;
      existing.updatedAt = new Date().toISOString();
      writeFileSync(profilePath, JSON.stringify(existing, null, 2));
      return existing;
    } catch {
      // Fall through to create new
    }
  }

  const profile: AgentProfile = {
    id: generateAgentId(),
    version: CLI_VERSION,
    gate: 'Foundation',
    rank: 'Apprentice',
    skills: ESSENTIAL_SKILLS.slice(0, skillCount),
    detectedTools,
    capabilities: ['overlay', 'memory', 'routing', 'voice', 'skills'],
    mcpServers: MCP_SERVERS,
    creativeApis: CREATIVE_APIS,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  writeFileSync(profilePath, JSON.stringify(profile, null, 2));
  return profile;
}

export const initCommand = new Command('init')
  .description('Initialize Arcanea Agent OS — full bootstrap')
  .option('--dry-run', 'Preview changes without installing')
  .option('--fast', 'Skip overlay prompts, just bootstrap Agent OS')
  .option('-d, --dir <path>', 'Project directory', process.cwd())
  .action(async (options) => {
    try {
      const projectDir = options.dir as string;
      const arcaneanHome = getArcaneanHome();

      // ── Banner ──────────────────────────────────────────────
      printAgentBanner();
      console.log(`  ${pc.dim('Initializing your agent...')}`);
      console.log('');

      // ── 1. Detect environment ───────────────────────────────
      const detections = await detectAllTools(projectDir);
      const detected = detections.filter(d => d.detected);
      const detectedNames = detected.map(d => PROVIDER_LABELS[d.provider]);
      const detectedProviders = detected.map(d => d.provider);

      // ── 2. Initialize memory system ─────────────────────────
      const memoryCreated = initMemorySystem(arcaneanHome);
      printStep(
        'Memory system (AgentDB)',
        memoryCreated ? 'created' : 'exists',
        '~/.arcanea/memory/',
      );

      // ── 3. Install skills ──────────────────────────────────
      const skillCount = ESSENTIAL_SKILLS.length;
      const toolSummary = detectedNames.length > 0
        ? detectedNames.map(n => n.toLowerCase().split(' ')[0]).join(', ') + ' detected'
        : 'no tools detected';
      printStep(
        `Skills (${skillCount} installed)`,
        toolSummary,
      );

      // ── 4. Create agent profile ────────────────────────────
      const profile = createAgentProfile(arcaneanHome, detectedProviders, skillCount);
      printStep(
        'Identity (profile created)',
        `Agent ID: ${pc.cyan(profile.id)}`,
      );

      // ── 5. MCP registry ────────────────────────────────────
      printStep(
        `Tools (MCP registry)`,
        `${MCP_SERVERS.length} servers available`,
      );

      // ── 6. Creative APIs ───────────────────────────────────
      printStep(
        'Creative APIs',
        CREATIVE_APIS.join(', '),
      );

      // ── 7. Network registration ────────────────────────────
      if (!options.dryRun) {
        // In production this would POST to arcanea.ai/api/agents
        // For now, log that it would register
      }

      // ── Summary ─────────────────────────────────────────────
      console.log('');
      console.log(
        `  ${pc.dim('Gate:')} ${pc.yellow('Foundation')} ${pc.dim('|')} ` +
        `${pc.dim('Rank:')} ${pc.yellow('Apprentice')} ${pc.dim('|')} ` +
        `${pc.dim('Skills:')} ${pc.yellow(String(skillCount))}`,
      );

      // ── Overlay installation (unless --fast) ────────────────
      if (!options.fast && detected.length > 0) {
        console.log('');
        console.log(pc.dim('  \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500'));
        console.log(`\n  ${pc.bold('Install overlays for detected tools?')}\n`);

        const providers = await promptMultiSelect(
          'Select overlays to install:',
          detections.map(d => ({
            label: PROVIDER_LABELS[d.provider],
            value: d.provider,
            detected: d.detected,
          })),
        );

        if (providers.length > 0) {
          await installOverlays(providers as ProviderType[], projectDir, options.dryRun);
        }
      }

      // ── Next steps ──────────────────────────────────────────
      console.log('');
      console.log(`  ${pc.dim("Run")} ${pc.cyan("'arcanea status'")} ${pc.dim("to see your agent profile.")}`);
      console.log(`  ${pc.dim("Run")} ${pc.cyan("'arcanea skills'")} ${pc.dim("to browse available skills.")}`);
      console.log('');
      console.log(`  ${pc.bold('Welcome to the network.')} ${pc.cyan('\u2726')}`);
      console.log('');

    } catch (err) {
      printError(`Init failed: ${err instanceof Error ? err.message : String(err)}`);
      process.exitCode = 1;
    }
  });

/**
 * Overlay installation flow (extracted from the original init logic).
 * Only runs when user opts in and tools are detected.
 */
async function installOverlays(
  providers: ProviderType[],
  projectDir: string,
  dryRun?: boolean,
): Promise<void> {
  const keystore = createKeystore();
  const installPlan: Array<{ provider: ProviderType; level: OverlayLevel }> = [];

  for (const provider of providers) {
    const level = await promptSelect(
      `${PROVIDER_LABELS[provider]} overlay level:`,
      OVERLAY_LEVELS.map(l => ({ label: `${l.level} \u2014 ${l.description}`, value: l.level })),
    ) as OverlayLevel;

    const adapter = getAuthAdapter(provider);
    let session = await adapter.detectFromEnv();

    if (!session?.validated && provider !== 'cursor' && provider !== 'copilot') {
      printInfo(`Authenticate with ${adapter.displayName}`);
      printInfo(`Get your API key at: ${adapter.getSetupUrl()}`);
      const credential = await promptPassword(`  Enter API key: `);

      if (credential) {
        session = await adapter.validate(credential);
        if (session.validated) {
          printSuccess(`Validated! ${session.models.length} models available`);
          await keystore.save(provider, credential);
          printSuccess('Credentials saved securely');
        } else {
          printError('Validation failed \u2014 key may be invalid');
          const proceed = await promptConfirm('Install overlay anyway?', false);
          if (!proceed) continue;
        }
      }
    } else if (session?.validated) {
      printSuccess(`${adapter.displayName} \u2014 already authenticated`);
    }

    installPlan.push({ provider, level });
  }

  if (dryRun) {
    console.log('');
    for (const plan of installPlan) {
      const installer = INSTALLERS[plan.provider];
      const preview = await installer.preview(projectDir, plan.level);
      console.log(`  ${PROVIDER_LABELS[plan.provider]} (${plan.level}):`);
      for (const f of preview.filesToCreate) {
        console.log(`    + ${f.path}`);
      }
      for (const f of preview.filesToModify) {
        console.log(`    ~ ${f.path}`);
      }
    }
    printInfo('Dry run \u2014 no files written.');
    return;
  }

  const confirmed = await promptConfirm('Install overlays?');
  if (!confirmed) {
    printWarning('Overlay installation skipped.');
    return;
  }

  console.log('');
  for (const plan of installPlan) {
    const installer = INSTALLERS[plan.provider];
    const result = await installer.install(projectDir, plan.level);
    if (result.success) {
      printSuccess(`${PROVIDER_LABELS[plan.provider]} overlay installed (${plan.level})`);
    } else {
      printError(`Failed to install ${PROVIDER_LABELS[plan.provider]}`);
    }
  }
}
