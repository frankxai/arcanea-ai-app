/**
 * Arcanea Publishing House — HTTP Server for Railway/Docker deploys
 *
 * Minimal Node http server that exposes:
 *   GET  /health         — liveness probe
 *   POST /cron/scan      — trigger a full publish scan
 *   POST /cron/social-drain — drain social queue
 *   POST /cron/scout-watch  — run Scout market scan
 *   POST /publish        — publish one content item (webhook-friendly)
 *
 * Deploy target: Railway (primary), Docker, any Node 20+ host.
 *
 * This is the PERMANENT RUNTIME for the Publishing House orchestrator.
 * Claude Code is the development brain; this is the production brain.
 */

import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import { loadClawKernel } from '../agents/kernel-loader.js';
import {
  PUBLISHING_HANDS,
  detectRuntime,
  canRunHere,
} from '../agents/hierarchy.js';

const PORT = Number(process.env.PORT ?? 8080);
const START_TIME = new Date();
let invocationCount = 0;

interface HealthResponse {
  status: 'ok' | 'degraded';
  uptime: number;
  version: string;
  runtime: string;
  kernelLoaded: boolean;
  hands: string[];
  startedAt: string;
  invocations: number;
}

async function handleHealth(res: ServerResponse): Promise<void> {
  const kernel = await loadClawKernel().catch(() => null);
  const runtime = detectRuntime();

  const body: HealthResponse = {
    status: kernel ? 'ok' : 'degraded',
    uptime: Math.floor((Date.now() - START_TIME.getTime()) / 1000),
    version: '0.3.0',
    runtime,
    kernelLoaded: kernel !== null && kernel.length > 0,
    hands: Object.keys(PUBLISHING_HANDS),
    startedAt: START_TIME.toISOString(),
    invocations: invocationCount,
  };

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body, null, 2));
}

async function handleCronScan(res: ServerResponse): Promise<void> {
  invocationCount++;
  console.log(`[cron/scan] Triggered at ${new Date().toISOString()}`);

  // TODO: wire to maestro.publishScan() once implemented
  // For now, return an acknowledgement
  res.writeHead(202, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    status: 'queued',
    message: 'publish scan queued',
    triggeredAt: new Date().toISOString(),
  }));
}

async function handleCronSocialDrain(res: ServerResponse): Promise<void> {
  invocationCount++;
  console.log(`[cron/social-drain] Triggered at ${new Date().toISOString()}`);

  res.writeHead(202, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    status: 'queued',
    message: 'social queue drain queued',
    triggeredAt: new Date().toISOString(),
  }));
}

async function handleCronScoutWatch(res: ServerResponse): Promise<void> {
  invocationCount++;
  const scoutHand = PUBLISHING_HANDS['scout-claw'];
  const runtime = detectRuntime();
  const canRun = canRunHere(scoutHand, runtime);

  console.log(`[cron/scout-watch] Triggered at ${new Date().toISOString()}, canRun=${canRun}`);

  res.writeHead(canRun ? 202 : 503, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    status: canRun ? 'queued' : 'incompatible-runtime',
    claw: 'scout-claw',
    runtime,
    triggeredAt: new Date().toISOString(),
  }));
}

async function handlePublish(req: IncomingMessage, res: ServerResponse): Promise<void> {
  invocationCount++;
  let body = '';
  for await (const chunk of req) body += chunk;

  try {
    const payload = JSON.parse(body) as { sourcePath?: string; title?: string; platforms?: string[] };

    if (!payload.sourcePath || !payload.title) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'sourcePath and title required' }));
      return;
    }

    console.log(`[publish] ${payload.title} from ${payload.sourcePath}`);

    // TODO: wire to maestro.publishContent(payload)
    res.writeHead(202, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'queued',
      title: payload.title,
      platforms: payload.platforms ?? [],
      triggeredAt: new Date().toISOString(),
    }));
  } catch (err) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      error: 'invalid json',
      detail: (err as Error).message,
    }));
  }
}

async function handleRequest(req: IncomingMessage, res: ServerResponse): Promise<void> {
  const url = req.url ?? '/';
  const method = req.method ?? 'GET';

  try {
    if (url === '/health' && method === 'GET') {
      await handleHealth(res);
      return;
    }
    if (url === '/cron/scan' && method === 'POST') {
      await handleCronScan(res);
      return;
    }
    if (url === '/cron/social-drain' && method === 'POST') {
      await handleCronSocialDrain(res);
      return;
    }
    if (url === '/cron/scout-watch' && method === 'POST') {
      await handleCronScoutWatch(res);
      return;
    }
    if (url === '/publish' && method === 'POST') {
      await handlePublish(req, res);
      return;
    }

    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'not found', path: url }));
  } catch (err) {
    console.error('[server] unhandled error:', err);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'internal', detail: (err as Error).message }));
  }
}

async function main(): Promise<void> {
  // Preload kernel so /health can report status immediately
  await loadClawKernel().catch(err => {
    console.warn('[server] kernel preload failed:', err);
  });

  const server = createServer((req, res) => {
    handleRequest(req, res).catch(err => {
      console.error('[server] handler threw:', err);
    });
  });

  server.listen(PORT, () => {
    console.log(`[server] Arcanea Publishing House listening on :${PORT}`);
    console.log(`[server] Runtime: ${detectRuntime()}`);
    console.log(`[server] Hands: ${Object.keys(PUBLISHING_HANDS).join(', ')}`);
  });

  const shutdown = (signal: string): void => {
    console.log(`[server] ${signal} received, shutting down`);
    server.close(() => process.exit(0));
  };
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

main().catch(err => {
  console.error('[server] fatal:', err);
  process.exit(1);
});
