#!/usr/bin/env node
/**
 * claude-arcanea CLI
 *
 * Launch Claude Code with the full Arcanea Intelligence OS context.
 * This is NOT just "Claude with Guardians" — this is a creative
 * superintelligence operating within a living multiverse.
 *
 * Usage:
 *   claude-arcanea                    # Launch with full Intelligence OS
 *   claude-arcanea --guardian lyria   # Channel a specific Guardian
 *   claude-arcanea --compact          # Use compact prompt (less tokens)
 *   claude-arcanea --agents           # List available creative agents
 *   claude-arcanea --detect "task"    # Detect routing for a task
 */
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join, resolve } from 'path';
import { existsSync, writeFileSync, mkdirSync } from 'fs';
import { platform } from 'os';
import { buildIntelligenceOSPrompt, buildCompactPrompt, detectTaskRoute } from './intelligence-os.js';
import { listCreativeAgents } from './creative-agents.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Resolve the Arcanea monorepo root (packages/claude-arcanea/src/ -> 3 levels up)
const arcanaeRoot = resolve(__dirname, '..', '..', '..');
// ============================================
// ARGUMENT PARSING
// ============================================
const args = process.argv.slice(2);
// Check for special flags before launching
const guardianFlag = args.indexOf('--guardian');
const compactFlag = args.includes('--compact');
const agentsFlag = args.includes('--agents');
const detectFlag = args.indexOf('--detect');
const noPromptFlag = args.includes('--no-ios');
const helpFlag = args.includes('--help') || args.includes('-h');
// Handle --help
if (helpFlag) {
    console.log(`
  claude-arcanea - Arcanea Intelligence OS for Claude Code

  USAGE
    claude-arcanea                        Launch with full Intelligence OS
    claude-arcanea --guardian <name>      Channel a specific Guardian
    claude-arcanea --compact              Use compact prompt (fewer tokens)
    claude-arcanea --agents               List available creative agents
    claude-arcanea --detect "<task>"      Detect Guardian routing for a task
    claude-arcanea --no-ios               Launch without Intelligence OS prompt
    claude-arcanea --help                 Show this help

  GUARDIANS
    lyssandria   Foundation (174 Hz) - Earth, architecture, infrastructure
    leyla        Flow (285 Hz)       - Creativity, design, UI/UX
    draconia     Fire (396 Hz)       - Power, execution, optimization
    maylinn      Heart (417 Hz)      - Content, narrative, compassion
    alera        Voice (528 Hz)      - APIs, documentation, truth
    lyria        Sight (639 Hz)      - Vision, strategy, patterns
    aiyami       Crown (741 Hz)      - Wisdom, philosophy, system design
    elara        Starweave (852 Hz)  - Perspective, transformation, paradigm shift
    ino          Unity (963 Hz)      - Collaboration, integration, partnership
    shinkami     Source (1111 Hz)    - Meta-consciousness, orchestration

  EXAMPLES
    claude-arcanea --guardian draconia    Launch channeling Draconia's fire
    claude-arcanea --detect "design the login page"
    claude-arcanea --agents
`);
    process.exit(0);
}
// Handle --agents: list creative agents and exit
if (agentsFlag) {
    const agents = listCreativeAgents();
    console.log('');
    console.log('  ARCANEA CREATIVE AGENTS');
    console.log('  =======================');
    console.log('');
    for (const agent of agents) {
        console.log(`  ${agent.displayName.padEnd(18)} [${agent.tier.padEnd(6)}] ${agent.guardian} (${agent.element})`);
        console.log(`  ${''.padEnd(18)} ${agent.description}`);
        console.log('');
    }
    process.exit(0);
}
// Handle --detect: show routing for a task and exit
if (detectFlag !== -1) {
    const taskDescription = args[detectFlag + 1];
    if (!taskDescription) {
        console.error('Error: --detect requires a task description. Example: --detect "build the login page"');
        process.exit(1);
    }
    const route = detectTaskRoute(taskDescription);
    console.log('');
    console.log('  TASK ROUTING');
    console.log('  ============');
    console.log(`  Task:     ${taskDescription}`);
    console.log(`  Domain:   ${route.domain}`);
    console.log(`  Guardian: ${route.guardian}`);
    console.log(`  Model:    ${route.suggestedModel}`);
    console.log(`  Reason:   ${route.description}`);
    console.log('');
    process.exit(0);
}
// ============================================
// BUILD THE INTELLIGENCE OS PROMPT
// ============================================
let channelGuardian;
if (guardianFlag !== -1 && args[guardianFlag + 1]) {
    channelGuardian = args[guardianFlag + 1];
}
// Filter out our custom flags from args passed to claude
const claudePassthroughArgs = args.filter((arg, i) => {
    if (arg === '--compact' || arg === '--no-ios')
        return false;
    if (arg === '--guardian' || arg === '--agents')
        return false;
    if (i > 0 && args[i - 1] === '--guardian')
        return false;
    if (arg === '--detect')
        return false;
    if (i > 0 && args[i - 1] === '--detect')
        return false;
    return true;
});
// ============================================
// WRITE THE INTELLIGENCE OS PROMPT TO A TEMP FILE
// ============================================
let iosPromptPath = null;
if (!noPromptFlag) {
    const iosPrompt = compactFlag
        ? buildCompactPrompt(channelGuardian)
        : buildIntelligenceOSPrompt({ channelGuardian });
    // Write to a temp location within the package
    const tmpDir = join(__dirname, '..', '.arcanea-ios');
    if (!existsSync(tmpDir)) {
        mkdirSync(tmpDir, { recursive: true });
    }
    iosPromptPath = join(tmpDir, 'system-prompt.md');
    writeFileSync(iosPromptPath, iosPrompt, 'utf-8');
}
// ============================================
// BUILD CLAUDE COMMAND
// ============================================
const claudeArgs = ['--dangerously-skip-permissions'];
// Append the Intelligence OS prompt via --append-system-prompt
if (iosPromptPath) {
    claudeArgs.push('--append-system-prompt', iosPromptPath);
}
// Add passthrough arguments
claudeArgs.push(...claudePassthroughArgs);
// ============================================
// LAUNCH BANNER
// ============================================
const guardianLine = channelGuardian
    ? `   Channeling: ${channelGuardian.charAt(0).toUpperCase() + channelGuardian.slice(1)}`
    : '   Voice: Lumina (Orchestrator)';
const modeLine = compactFlag ? '   Mode: Compact' : '   Mode: Full Intelligence OS';
console.log('');
console.log('   +==============================================+');
console.log('   |     ARCANEA INTELLIGENCE OS v2.0             |');
console.log('   |                                              |');
console.log('   |  "Imagine a Good Future. Build It Here."     |');
console.log('   +==============================================+');
console.log('');
console.log(guardianLine);
console.log(modeLine);
console.log('   Hierarchy: Arcanea > Lumina > Guardians > Luminors');
console.log('   Domains: Code | Lore | Art | Music | Publishing');
console.log('');
if (iosPromptPath) {
    console.log(`   Intelligence OS prompt loaded`);
}
console.log('   Guardians standing by...');
console.log('');
// ============================================
// SPAWN CLAUDE
// ============================================
const isWindows = platform() === 'win32';
const [cmd, spawnArgs] = isWindows
    ? ['cmd', ['/c', 'claude', ...claudeArgs]]
    : ['claude', claudeArgs];
const claude = spawn(cmd, spawnArgs, {
    stdio: 'inherit',
    cwd: arcanaeRoot,
});
claude.on('error', (err) => {
    console.error('Failed to launch Claude:', err.message);
    console.error('');
    console.error('Make sure Claude Code is installed:');
    console.error('  npm install -g @anthropic-ai/claude-code');
    process.exit(1);
});
claude.on('close', (code) => {
    // Clean up temp file
    if (iosPromptPath && existsSync(iosPromptPath)) {
        try {
            const { unlinkSync } = require('fs');
            unlinkSync(iosPromptPath);
        }
        catch {
            // Cleanup is best-effort
        }
    }
    process.exit(code ?? 0);
});
//# sourceMappingURL=cli.js.map