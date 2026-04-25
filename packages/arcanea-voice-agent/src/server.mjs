/**
 * Arcanea Voice Agent — local HTTP + WebSocket server.
 *
 * Binds to 127.0.0.1 only (NEVER 0.0.0.0). Token-auth on every endpoint
 * except /health (used by the dashboard for discovery). CORS allowlist
 * limited to the dashboards that ship with this stack.
 *
 * Tries port 7777 first; on EADDRINUSE falls back to 7778, 7779, ... up
 * to 7785. Writes the chosen port to ~/.arcanea/agent-port so the
 * dashboard can read it during discovery.
 */

import { createServer } from 'node:http';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { homedir } from 'node:os';
import { WebSocketServer } from 'ws';
import { extractBearer, getOrCreateToken, timingSafeEqual } from './auth.mjs';
import { dispatch, events, listActiveRuntimes, killAllRuntimes } from './dispatch.mjs';

const VERSION = '0.1.0';
const HOST = '127.0.0.1';
const PORT_CANDIDATES = [7777, 7778, 7779, 7780, 7781, 7785];
const PORT_PATH = join(homedir(), '.arcanea', 'agent-port');

const ALLOW_ORIGINS = new Set([
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'https://arcanea.ai',
  'https://www.arcanea.ai',
]);

function corsOrigin(req) {
  const origin = req.headers.origin;
  if (origin && ALLOW_ORIGINS.has(origin)) return origin;
  return null;
}

function sendJson(res, status, body, extraHeaders = {}) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store',
    ...extraHeaders,
  });
  res.end(JSON.stringify(body));
}

function applyCors(req, res) {
  const origin = corsOrigin(req);
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Authorization,Content-Type');
    res.setHeader('Vary', 'Origin');
  }
}

async function readJson(req, limitBytes = 1024 * 64) {
  return new Promise((resolve, reject) => {
    let data = '';
    let total = 0;
    req.on('data', (chunk) => {
      total += chunk.length;
      if (total > limitBytes) {
        reject(new Error('body too large'));
        req.destroy();
        return;
      }
      data += chunk.toString('utf8');
    });
    req.on('end', () => {
      if (!data) return resolve({});
      try { resolve(JSON.parse(data)); }
      catch (e) { reject(e); }
    });
    req.on('error', reject);
  });
}

function logMem(prefix = '') {
  const m = process.memoryUsage();
  const mb = (n) => Math.round(n / 1024 / 1024);
  return `${prefix}rss=${mb(m.rss)}MB heap=${mb(m.heapUsed)}MB`;
}

export async function startAgent({ tenants = ['arcanea'] } = {}) {
  const token = getOrCreateToken();
  const startedAt = Date.now();

  // Auth checker. Returns true if request is authorized.
  function authorized(req) {
    const presented = extractBearer(req);
    if (!presented) return false;
    return timingSafeEqual(presented, token);
  }

  const server = createServer(async (req, res) => {
    applyCors(req, res);

    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

    const url = new URL(req.url || '/', `http://${HOST}`);

    // ----- Public endpoint: /health -----
    if (url.pathname === '/health' && req.method === 'GET') {
      const uptimeMs = Date.now() - startedAt;
      sendJson(res, 200, {
        ok: true,
        version: VERSION,
        uptimeMs,
        tenants,
        runtimes: listActiveRuntimes(),
        memory: logMem(),
      });
      return;
    }

    // ----- Authenticated endpoints below -----
    if (!authorized(req)) {
      sendJson(res, 401, { error: 'unauthorized' });
      return;
    }

    if (url.pathname === '/intent' && req.method === 'POST') {
      try {
        const intent = await readJson(req);
        const result = await dispatch(intent);
        sendJson(res, result.ok ? 200 : 400, result);
      } catch (e) {
        sendJson(res, 400, { error: 'bad request', detail: String(e?.message || e) });
      }
      return;
    }

    if (url.pathname === '/runtimes' && req.method === 'GET') {
      sendJson(res, 200, { active: listActiveRuntimes() });
      return;
    }

    if (url.pathname === '/runtimes' && req.method === 'DELETE') {
      killAllRuntimes();
      sendJson(res, 200, { ok: true, killed: true });
      return;
    }

    // Per-persona summon shorthand: /summon/lumina?tenant=sis
    const summonMatch = url.pathname.match(/^\/summon\/([a-z][a-z0-9-]{0,30})$/);
    if (summonMatch && req.method === 'POST') {
      const persona = summonMatch[1];
      const tenant = url.searchParams.get('tenant') || 'arcanea';
      const result = await dispatch({ kind: 'summon', persona, tenant });
      sendJson(res, 200, result);
      return;
    }

    sendJson(res, 404, { error: 'not found', path: url.pathname });
  });

  // ----- WebSocket /events -----
  const wss = new WebSocketServer({ noServer: true });
  server.on('upgrade', (req, socket, head) => {
    const url = new URL(req.url || '/', `http://${HOST}`);
    if (url.pathname !== '/events') {
      socket.destroy();
      return;
    }
    // WS auth: token via ?token= or Authorization header.
    const presented = url.searchParams.get('token') || extractBearer(req);
    if (!presented || !timingSafeEqual(presented, token)) {
      socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
      socket.destroy();
      return;
    }
    wss.handleUpgrade(req, socket, head, (ws) => {
      wss.emit('connection', ws, req);
    });
  });

  wss.on('connection', (ws) => {
    const onEvent = (evt) => {
      try { ws.send(JSON.stringify(evt)); } catch {}
    };
    events.on('event', onEvent);
    ws.on('close', () => events.off('event', onEvent));
    ws.send(JSON.stringify({ kind: 'hello', ts: Date.now(), payload: { version: VERSION } }));
  });

  // Bind with port fallback.
  const port = await new Promise((resolve, reject) => {
    let i = 0;
    const tryNext = () => {
      if (i >= PORT_CANDIDATES.length) {
        reject(new Error(`could not bind any of ports ${PORT_CANDIDATES.join(', ')}`));
        return;
      }
      const p = PORT_CANDIDATES[i++];
      server.once('error', (err) => {
        if (err && err.code === 'EADDRINUSE') {
          tryNext();
        } else {
          reject(err);
        }
      });
      server.listen(p, HOST, () => {
        server.removeAllListeners('error');
        resolve(p);
      });
    };
    tryNext();
  });

  // Persist port for dashboard discovery.
  try {
    const dir = dirname(PORT_PATH);
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    writeFileSync(PORT_PATH, String(port), 'utf8');
  } catch {}

  // Memory telemetry every 60s. >250MB suggests a leak.
  const memTimer = setInterval(() => {
    const m = process.memoryUsage();
    const rssMb = m.rss / 1024 / 1024;
    if (rssMb > 250) {
      console.warn(`[agent] high memory: ${logMem()}`);
    }
    events.emit('event', {
      kind: 'memory',
      ts: Date.now(),
      payload: { rss: Math.round(rssMb), heap: Math.round(m.heapUsed / 1024 / 1024) },
    });
  }, 60_000);

  function shutdown() {
    clearInterval(memTimer);
    killAllRuntimes();
    wss.close();
    server.close();
  }

  process.on('SIGINT', () => { shutdown(); process.exit(0); });
  process.on('SIGTERM', () => { shutdown(); process.exit(0); });

  return {
    port,
    token,
    server,
    wss,
    shutdown,
  };
}
