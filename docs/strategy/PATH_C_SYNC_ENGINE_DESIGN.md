# Technical Design Document: Path C Sync Engine

## 1 · System Architecture Overview

The Sync Engine enables a seamless transition between local offline directories and cloud-hosted database states. It consists of three primary layers:

```
  ┌────────────────────────────────────────────────────────┐
  │                   LOCAL CLIENT LAYER                   │
  │   IndexedDB / OPFS Storage  <───>  Local Filesystem    │
  └───────────────────────────┬────────────────────────────┘
                              │ Encrypted WebSocket/HTTPS
                              ▼
  ┌────────────────────────────────────────────────────────┐
  │                 CENTRAL SYNC ROUTER                    │
  │   Authentication Gate  &  AES-GCM Payload Decryptor    │
  └───────────────────────────┬────────────────────────────┘
                              │
                              ▼
  ┌────────────────────────────────────────────────────────┐
  │                    DATA STORE LAYER                    │
  │   PostgreSQL DB  +  pgvector Extension (HNSW Index)    │
  └────────────────────────────────────────────────────────┘
```

---

## 2 · Database & Storage Schema

### 2.1 Postgres Table Schema: `vault_nodes`
```sql
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE vault_nodes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    path TEXT NOT NULL,
    content TEXT, -- Encrypted JSONML/Markdown content
    metadata JSONB,
    embedding VECTOR(1536), -- OpenAI text-embedding-3-small or Gemini equivalent
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_user_path UNIQUE(user_id, path)
);

CREATE INDEX vault_nodes_embedding_idx ON vault_nodes 
USING hnsw (embedding vector_cosine_ops);
```

### 2.2 Local Storage (Client-side)
* **IndexedDB**: Serves as the primary transaction buffer. Cache-first strategy for instant page loading.
* **Origin Private File System (OPFS)**: Used for fast multi-threading operations and binary files (like image previews and audio loops).

---

## 3 · Encryption & Security Protocol

To maintain the **moat of sovereignty** and ensure the platform operator cannot be forced to expose or parse user-owned IP:
* **Zero-Knowledge Sync Option**: Users can define an optional **Vault Passphrase**.
* **Client-Side Derivation**: The passphrase is run through PBKDF2 (100,000 iterations) to derive a 256-bit AES-GCM key.
* **Payload Encryption**: All document content and metadata are encrypted *before* leaving the browser. The database store only receives ciphertext and path hashes.
* **Vector Indexing Trade-off**: If zero-knowledge encryption is active, local-side embeddings are computed and sent to the cloud, protecting raw text.

---

## 4 · pgvector Semantic Indexing (HNSW)

* **Embedding Model**: We utilize the `text-embedding-3-small` (1536 dimensions) or Google's `text-embedding-004`.
* **Cosine Similarity**: HNSW (Hierarchical Navigable Small World) index operates using cosine distance operators (`<=>`), providing 150x faster query rates than linear search on large datasets.
* **Semantic Query Function**:
```sql
CREATE OR REPLACE FUNCTION match_vault_nodes (
  query_embedding VECTOR(1536),
  match_threshold FLOAT,
  match_count INT
) RETURNS TABLE (
  id UUID,
  path TEXT,
  content TEXT,
  similarity FLOAT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    v.id,
    v.path,
    v.content,
    1 - (v.embedding <=> query_embedding) AS similarity
  FROM vault_nodes v
  WHERE 1 - (v.embedding <=> query_embedding) > match_threshold
  ORDER BY v.embedding <=> query_embedding
  LIMIT match_count;
END;
$$ LANGUAGE plpgsql;
```

---

## 5 · Remote Cloud Bench (Transient VMs)

* **Orchestration**: Node-RED or n8n scripts spin up lightweight Docker containers (Docker-in-Docker or Podman) on demand.
* **KiloClaw Parallels**:
  * Each container is a clean Linux instance pre-loaded with `node:20`, `pnpm`, and the `@arcanea/world-engine` package.
  * The runner clones the user's target repo, injects temporary BYOK credentials, runs compile processes, and stores output files in a secure transient S3 bucket before shutting down.
  * Uptime is strictly capped at **30 minutes** to prevent token abuse or looping processes.
