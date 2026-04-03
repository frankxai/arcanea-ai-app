/**
 * AgentDB Cloud - Memory Store
 *
 * Persistent vector memory for AI agents.
 * Uses local Starlight-backed persistence when available, and otherwise
 * falls back to an in-memory Map. This keeps local Arcanea development
 * aligned with the canonical SIS home at ~/.starlight without breaking
 * hosted environments that do not have durable local storage.
 *
 * Storage schema (future Supabase `agent_memories` table):
 *   id          uuid  PK DEFAULT gen_random_uuid()
 *   agent_id    text  NOT NULL
 *   key         text  NOT NULL
 *   value       text  NOT NULL
 *   namespace   text  DEFAULT 'default'
 *   tags        text[] DEFAULT '{}'
 *   ttl         integer  (seconds, NULL = no expiry)
 *   created_at  timestamptz DEFAULT now()
 *   updated_at  timestamptz DEFAULT now()
 *   expires_at  timestamptz  (computed from ttl)
 *   embedding   vector(1536)  -- for HNSW semantic search
 *
 *   UNIQUE(agent_id, namespace, key)
 */

import {
  estimateStorageBytes,
  loadAgentRecords,
  saveAgentRecords,
  shouldUseStarlightAgentDb,
} from './starlight-store';

export interface MemoryRecord {
  key: string;
  value: string;
  namespace: string;
  tags: string[];
  ttl: number | null;
  created_at: string;
  updated_at: string;
  expires_at: string | null;
  agent_id: string;
}

export interface StoreResult {
  record: MemoryRecord;
}

export interface SearchResult {
  record: MemoryRecord;
  score: number;
}

export interface StoreStats {
  total_memories: number;
  namespaces: string[];
  storage_bytes_estimate: number;
}

/** Composite key: agentId::namespace::key */
function compositeKey(agentId: string, namespace: string, key: string): string {
  return `${agentId}::${namespace}::${key}`;
}

const memoryStore = new Map<string, MemoryRecord>();

function isExpired(record: MemoryRecord): boolean {
  if (!record.expires_at) return false;
  return new Date(record.expires_at).getTime() < Date.now();
}

function pruneExpired(records: MemoryRecord[]): MemoryRecord[] {
  return records.filter((record) => !isExpired(record));
}

async function loadAllRecords(agentId: string): Promise<MemoryRecord[]> {
  if (shouldUseStarlightAgentDb()) {
    return pruneExpired(await loadAgentRecords(agentId));
  }

  const results: MemoryRecord[] = [];
  for (const [ck, record] of memoryStore) {
    if (record.agent_id !== agentId) continue;
    if (isExpired(record)) {
      memoryStore.delete(ck);
      continue;
    }
    results.push(record);
  }
  return results;
}

async function saveAllRecords(agentId: string, records: MemoryRecord[]): Promise<void> {
  if (shouldUseStarlightAgentDb()) {
    await saveAgentRecords(agentId, pruneExpired(records));
    return;
  }

  for (const [ck, record] of memoryStore) {
    if (record.agent_id === agentId || isExpired(record)) {
      memoryStore.delete(ck);
    }
  }

  for (const record of pruneExpired(records)) {
    memoryStore.set(compositeKey(record.agent_id, record.namespace, record.key), record);
  }
}

export async function storeMemory(
  agentId: string,
  key: string,
  value: string,
  namespace = 'default',
  tags: string[] = [],
  ttl: number | null = null,
): Promise<MemoryRecord> {
  const records = await loadAllRecords(agentId);
  const now = new Date().toISOString();
  const expiresAt = ttl ? new Date(Date.now() + ttl * 1000).toISOString() : null;

  const record: MemoryRecord = {
    key,
    value,
    namespace,
    tags,
    ttl,
    created_at: now,
    updated_at: now,
    expires_at: expiresAt,
    agent_id: agentId,
  };

  const existingIndex = records.findIndex(
    (existingRecord) => existingRecord.namespace === namespace && existingRecord.key === key,
  );
  const existing = existingIndex >= 0 ? records[existingIndex] : null;

  if (existing) {
    record.created_at = existing.created_at;
    records[existingIndex] = record;
  } else {
    records.push(record);
  }

  await saveAllRecords(agentId, records);
  return record;
}

export async function getMemory(
  agentId: string,
  key: string,
  namespace = 'default',
): Promise<MemoryRecord | null> {
  const records = await loadAllRecords(agentId);
  const record = records.find(
    (existingRecord) => existingRecord.namespace === namespace && existingRecord.key === key,
  );

  return record ?? null;
}

export async function deleteMemory(
  agentId: string,
  key: string,
  namespace = 'default',
): Promise<boolean> {
  const records = await loadAllRecords(agentId);
  const nextRecords = records.filter(
    (record) => !(record.namespace === namespace && record.key === key),
  );

  if (nextRecords.length === records.length) return false;
  await saveAllRecords(agentId, nextRecords);
  return true;
}

export async function updateMemory(
  agentId: string,
  key: string,
  updates: { value?: string; tags?: string[]; ttl?: number | null; namespace?: string },
  namespace = 'default',
): Promise<MemoryRecord | null> {
  const records = await loadAllRecords(agentId);
  const recordIndex = records.findIndex(
    (record) => record.namespace === namespace && record.key === key,
  );
  const record = recordIndex >= 0 ? records[recordIndex] : null;

  if (!record) return null;

  if (updates.value !== undefined) record.value = updates.value;
  if (updates.tags !== undefined) record.tags = updates.tags;
  if (updates.ttl !== undefined) {
    record.ttl = updates.ttl;
    record.expires_at = updates.ttl
      ? new Date(Date.now() + updates.ttl * 1000).toISOString()
      : null;
  }
  if (updates.namespace && updates.namespace !== namespace) {
    record.namespace = updates.namespace;
  }
  record.updated_at = new Date().toISOString();

  records[recordIndex] = record;
  await saveAllRecords(agentId, records);
  return record;
}

export async function listMemories(
  agentId: string,
  namespace?: string,
  limit = 20,
): Promise<MemoryRecord[]> {
  const records = await loadAllRecords(agentId);

  return records
    .filter((record) => (namespace ? record.namespace === namespace : true))
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, limit);
}

/**
 * Semantic search across agent memories.
 *
 * Current implementation: simple token overlap text matching.
 *
 * TODO [HNSW]: Replace with vector similarity search when embeddings are available.
 */
export async function searchMemories(
  agentId: string,
  query: string,
  namespace?: string,
  limit = 10,
  threshold = 0.0,
): Promise<SearchResult[]> {
  const queryTokens = query.toLowerCase().split(/\s+/).filter(Boolean);
  const results: SearchResult[] = [];

  if (queryTokens.length === 0) return results;

  for (const record of await loadAllRecords(agentId)) {
    if (namespace && record.namespace !== namespace) continue;

    const haystack = [record.key, record.value, ...record.tags].join(' ').toLowerCase();

    let matchCount = 0;
    for (const token of queryTokens) {
      if (haystack.includes(token)) matchCount += 1;
    }

    const score = matchCount / queryTokens.length;
    if (score > threshold) {
      results.push({ record, score });
    }
  }

  return results.sort((a, b) => b.score - a.score).slice(0, limit);
}

export async function getStats(agentId: string): Promise<StoreStats> {
  const records = await loadAllRecords(agentId);
  const namespaces = new Set(records.map((record) => record.namespace));

  return {
    total_memories: records.length,
    namespaces: Array.from(namespaces),
    storage_bytes_estimate: estimateStorageBytes(records),
  };
}
