/**
 * AgentDB Cloud — Memory Store
 *
 * Persistent vector memory for AI agents.
 * Uses Supabase when available, falls back to in-memory Map.
 *
 * Storage schema (Supabase `agent_memories` table):
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

// ---------------------------------------------------------------------------
// In-Memory Fallback Store
// ---------------------------------------------------------------------------

/** Composite key: agentId::namespace::key */
function compositeKey(agentId: string, namespace: string, key: string): string {
  return `${agentId}::${namespace}::${key}`;
}

const memoryStore = new Map<string, MemoryRecord>();

function isExpired(record: MemoryRecord): boolean {
  if (!record.expires_at) return false;
  return new Date(record.expires_at).getTime() < Date.now();
}

// ---------------------------------------------------------------------------
// CRUD Operations
// ---------------------------------------------------------------------------

export async function storeMemory(
  agentId: string,
  key: string,
  value: string,
  namespace = 'default',
  tags: string[] = [],
  ttl: number | null = null
): Promise<MemoryRecord> {
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

  // TODO: When Supabase `agent_memories` table exists, use:
  //   const { data, error } = await supabase
  //     .from('agent_memories')
  //     .upsert({ agent_id: agentId, key, value, namespace, tags, ttl, expires_at: expiresAt })
  //     .select()
  //     .single();

  const ck = compositeKey(agentId, namespace, key);
  const existing = memoryStore.get(ck);

  if (existing) {
    record.created_at = existing.created_at;
  }

  memoryStore.set(ck, record);
  return record;
}

export async function getMemory(
  agentId: string,
  key: string,
  namespace = 'default'
): Promise<MemoryRecord | null> {
  const ck = compositeKey(agentId, namespace, key);
  const record = memoryStore.get(ck);

  if (!record) return null;
  if (record.agent_id !== agentId) return null;
  if (isExpired(record)) {
    memoryStore.delete(ck);
    return null;
  }

  return record;
}

export async function deleteMemory(
  agentId: string,
  key: string,
  namespace = 'default'
): Promise<boolean> {
  const ck = compositeKey(agentId, namespace, key);
  const record = memoryStore.get(ck);

  if (!record || record.agent_id !== agentId) return false;

  memoryStore.delete(ck);
  return true;
}

export async function updateMemory(
  agentId: string,
  key: string,
  updates: { value?: string; tags?: string[]; ttl?: number | null; namespace?: string },
  namespace = 'default'
): Promise<MemoryRecord | null> {
  const ck = compositeKey(agentId, namespace, key);
  const record = memoryStore.get(ck);

  if (!record || record.agent_id !== agentId) return null;
  if (isExpired(record)) {
    memoryStore.delete(ck);
    return null;
  }

  const now = new Date().toISOString();

  if (updates.value !== undefined) record.value = updates.value;
  if (updates.tags !== undefined) record.tags = updates.tags;
  if (updates.ttl !== undefined) {
    record.ttl = updates.ttl;
    record.expires_at = updates.ttl
      ? new Date(Date.now() + updates.ttl * 1000).toISOString()
      : null;
  }
  record.updated_at = now;

  // If namespace changed, re-key
  if (updates.namespace && updates.namespace !== namespace) {
    memoryStore.delete(ck);
    record.namespace = updates.namespace;
    const newCk = compositeKey(agentId, updates.namespace, key);
    memoryStore.set(newCk, record);
  } else {
    memoryStore.set(ck, record);
  }

  return record;
}

export async function listMemories(
  agentId: string,
  namespace?: string,
  limit = 20
): Promise<MemoryRecord[]> {
  const results: MemoryRecord[] = [];

  for (const [ck, record] of memoryStore) {
    if (record.agent_id !== agentId) continue;
    if (namespace && record.namespace !== namespace) continue;
    if (isExpired(record)) {
      memoryStore.delete(ck);
      continue;
    }
    results.push(record);
    if (results.length >= limit) break;
  }

  return results.sort(
    (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  );
}

// ---------------------------------------------------------------------------
// Search
// ---------------------------------------------------------------------------

/**
 * Semantic search across agent memories.
 *
 * Current implementation: simple text matching (includes/startsWith).
 *
 * TODO [HNSW]: Replace with vector similarity search when embeddings are available.
 * The upgrade path:
 *   1. Generate embeddings on store (OpenAI text-embedding-3-small or local model)
 *   2. Store in Supabase pgvector column with HNSW index:
 *      CREATE INDEX ON agent_memories USING hnsw (embedding vector_cosine_ops);
 *   3. Query: SELECT *, 1 - (embedding <=> query_embedding) AS score
 *      FROM agent_memories
 *      WHERE agent_id = $1
 *      ORDER BY embedding <=> query_embedding
 *      LIMIT $2;
 */
export async function searchMemories(
  agentId: string,
  query: string,
  namespace?: string,
  limit = 10,
  threshold = 0.0
): Promise<SearchResult[]> {
  const queryLower = query.toLowerCase();
  const queryTokens = queryLower.split(/\s+/).filter(Boolean);
  const results: SearchResult[] = [];

  for (const [ck, record] of memoryStore) {
    if (record.agent_id !== agentId) continue;
    if (namespace && record.namespace !== namespace) continue;
    if (isExpired(record)) {
      memoryStore.delete(ck);
      continue;
    }

    // Simple text similarity: count token matches in key + value + tags
    const haystack = [record.key, record.value, ...record.tags]
      .join(' ')
      .toLowerCase();

    let matchCount = 0;
    for (const token of queryTokens) {
      if (haystack.includes(token)) matchCount++;
    }

    if (queryTokens.length === 0) continue;

    const score = matchCount / queryTokens.length;

    if (score > threshold) {
      results.push({ record, score });
    }
  }

  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

// ---------------------------------------------------------------------------
// Stats
// ---------------------------------------------------------------------------

export async function getStats(agentId: string): Promise<StoreStats> {
  const namespaces = new Set<string>();
  let total = 0;
  let bytes = 0;

  for (const [ck, record] of memoryStore) {
    if (record.agent_id !== agentId) continue;
    if (isExpired(record)) {
      memoryStore.delete(ck);
      continue;
    }
    total++;
    namespaces.add(record.namespace);
    // Rough byte estimate: key + value + tags + metadata overhead
    bytes += record.key.length + record.value.length + record.tags.join('').length + 200;
  }

  return {
    total_memories: total,
    namespaces: Array.from(namespaces),
    storage_bytes_estimate: bytes,
  };
}
