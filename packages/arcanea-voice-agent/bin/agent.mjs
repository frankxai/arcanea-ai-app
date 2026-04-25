#!/usr/bin/env node
/**
 * @arcanea/voice-agent — local agent CLI entrypoint.
 *
 * Usage:
 *   arcanea-agent                  # start agent on 127.0.0.1:7777
 *   arcanea-agent --tenant sis     # restrict to single tenant
 *   arcanea-agent --port 7778      # override port preference
 *
 * The agent runs as a foreground Node process. For autostart on login,
 * use the Tauri sidecar (Day 6) or a platform service manager. v0.1 is
 * intentionally manual-start so Frank can iterate.
 */

import { startAgent } from '../src/server.mjs';

const argv = process.argv.slice(2);
const arg = (name, fallback = null) => {
  const i = argv.indexOf(`--${name}`);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};

const tenantArg = arg('tenant', null);
const tenants = tenantArg ? [tenantArg] : ['arcanea', 'sis', 'frankx'];

(async () => {
  try {
    const { port, token } = await startAgent({ tenants });
    const tokenPreview = token.slice(0, 8) + '…';
    console.log(`[agent] @arcanea/voice-agent v0.1.0`);
    console.log(`[agent] listening on http://127.0.0.1:${port}`);
    console.log(`[agent] tenants=${tenants.join(',')}`);
    console.log(`[agent] token=${tokenPreview} (full at ~/.arcanea/agent-token)`);
    console.log(`[agent] health → curl http://127.0.0.1:${port}/health`);
    console.log(`[agent] (Ctrl+C to stop)`);
  } catch (e) {
    console.error('[agent] failed to start:', e?.message || e);
    process.exit(1);
  }
})();
