#!/usr/bin/env node
/**
 * @arcanea/voice-agent — Arcanea Agent CLI
 *
 * Usage:
 *   arcanea-agent                  # local gateway on 127.0.0.1:7777
 *   arcanea-agent chat             # Hermes chat (arcanea-agent profile)
 *   arcanea-agent desktop          # Hermes Desktop
 *   arcanea-agent install          # install/update Hermes profile
 */

import { startAgent } from '../src/server.mjs';
import { hermesChat, hermesDesktop, hermesInstall, printHelp } from '../src/hermes-bridge.mjs';

const argv = process.argv.slice(2);

const arg = (name, fallback = null) => {
  const i = argv.indexOf(`--${name}`);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};

const sub = argv[0];
const rest = argv.slice(1);

if (sub === '--help' || sub === '-h' || sub === 'help') {
  printHelp();
  process.exit(0);
}

if (sub === 'install') {
  try {
    await hermesInstall({ fromGithub: rest.includes('--github') });
  } catch (e) {
    console.error('[arcanea-agent] install failed:', e?.message || e);
    process.exit(1);
  }
  process.exit(0);
}

if (sub === 'chat') {
  try {
    await hermesChat(rest);
  } catch (e) {
    console.error('[arcanea-agent] chat failed:', e?.message || e);
    process.exit(1);
  }
  process.exit(0);
}

if (sub === 'desktop') {
  try {
    await hermesDesktop(rest);
  } catch (e) {
    console.error('[arcanea-agent] desktop failed:', e?.message || e);
    process.exit(1);
  }
  process.exit(0);
}

// Default: local HTTP gateway
const tenantArg = arg('tenant', null);
const tenants = tenantArg ? [tenantArg] : ['arcanea', 'sis', 'frankx'];

try {
  const { port, token } = await startAgent({ tenants });
  const tokenPreview = token.slice(0, 8) + '…';
  console.log(`[agent] @arcanea/voice-agent v0.2.0`);
  console.log(`[agent] listening on http://127.0.0.1:${port}`);
  console.log(`[agent] tenants=${tenants.join(',')}`);
  console.log(`[agent] token=${tokenPreview} (full at ~/.arcanea/agent-token)`);
  console.log(`[agent] hermes → arcanea-agent chat | arcanea-agent desktop`);
  console.log(`[agent] health → curl http://127.0.0.1:${port}/health`);
  console.log(`[agent] (Ctrl+C to stop)`);
} catch (e) {
  console.error('[agent] failed to start:', e?.message || e);
  process.exit(1);
}