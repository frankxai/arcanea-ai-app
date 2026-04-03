import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join } from 'node:path';
import type { MemoryRecord } from './store';

interface AgentMemoryEnvelope {
  agentId: string;
  updatedAt: string;
  records: MemoryRecord[];
}

function sanitizeFilePart(value: string): string {
  return value.replace(/[^a-zA-Z0-9._-]+/g, '_').slice(0, 120) || 'agent';
}

export function resolveStarlightHome(): string {
  return process.env.STARLIGHT_HOME || join(homedir(), '.starlight');
}

export function shouldUseStarlightAgentDb(): boolean {
  if (process.env.ARCANEA_AGENTDB_BACKEND === 'memory') return false;
  if (process.env.ARCANEA_AGENTDB_BACKEND === 'starlight') return true;
  return process.env.VERCEL !== '1';
}

export function getAgentDbBackendLabel(): 'starlight' | 'memory' {
  return shouldUseStarlightAgentDb() ? 'starlight' : 'memory';
}

function getAgentMemoryFile(agentId: string): string {
  return join(
    resolveStarlightHome(),
    'agentdb',
    'agents',
    `${sanitizeFilePart(agentId)}.json`,
  );
}

async function ensureParentDir(filePath: string): Promise<void> {
  await mkdir(dirname(filePath), { recursive: true });
}

export async function loadAgentRecords(agentId: string): Promise<MemoryRecord[]> {
  const filePath = getAgentMemoryFile(agentId);
  if (!existsSync(filePath)) return [];

  try {
    const raw = await readFile(filePath, 'utf8');
    const parsed = JSON.parse(raw) as AgentMemoryEnvelope;
    if (!Array.isArray(parsed.records)) return [];
    return parsed.records.filter((record) => record.agent_id === agentId);
  } catch {
    return [];
  }
}

export async function saveAgentRecords(agentId: string, records: MemoryRecord[]): Promise<void> {
  const filePath = getAgentMemoryFile(agentId);
  await ensureParentDir(filePath);

  const envelope: AgentMemoryEnvelope = {
    agentId,
    updatedAt: new Date().toISOString(),
    records,
  };

  const tempPath = `${filePath}.tmp`;
  await writeFile(tempPath, JSON.stringify(envelope, null, 2), 'utf8');
  await rename(tempPath, filePath);
}

export function estimateStorageBytes(records: MemoryRecord[]): number {
  return records.reduce((total, record) => {
    return total + record.key.length + record.value.length + record.tags.join('').length + 200;
  }, 0);
}
