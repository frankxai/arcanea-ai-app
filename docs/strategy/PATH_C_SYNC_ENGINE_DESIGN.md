# Technical Design Document: Path C Sync Engine (SOTA L99)

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

To support zero-knowledge sync, credits, and Web3 TBA (Token-Bound Account) provenance, the Postgres instance implements the following tables:

### 2.1 The Sync Table: `vault_nodes`
```sql
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE vault_nodes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    path TEXT NOT NULL,                  -- Encrypted or hashed path value to preserve privacy
    content TEXT,                        -- Encrypted JSONML/Markdown content
    metadata JSONB,                      -- Encrypted client-side metadata properties
    embedding VECTOR(1536),              -- Local computed text embeddings (protects raw text)
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_user_path UNIQUE(user_id, path)
);

-- HNSW Index optimization for Cosine Similarity search queries
CREATE INDEX vault_nodes_embedding_idx ON vault_nodes 
USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);
```

### 2.2 User Wallet Profile Table: `user_profiles`
Stores the derived smart wallets (ERC-4337) generated for gasless transactions on Base Sepolia.
```sql
CREATE TABLE user_profiles (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    wallet_address VARCHAR(42) NOT NULL,
    wallet_owner_address VARCHAR(42) NOT NULL,
    provider_type VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
```

### 2.3 Waitlist Table: `waitlists`
Stores requests for pricing gates and beta registrations.
```sql
CREATE TABLE waitlists (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    source VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
```

---

## 3 · Zero-Knowledge Cryptography Protocol

To maintain the **moat of sovereignty** and ensure the platform operator cannot be forced to expose or parse user-owned IP, we implement Client-Side Zero-Knowledge Encryption:

### 3.1 Key Derivation (Web Crypto API)
The client derives a 256-bit AES-GCM key from the user passphrase using PBKDF2 (100,000 iterations):

```typescript
export async function deriveKey(passphrase: string, salt: Uint8Array): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    "raw",
    enc.encode(passphrase),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  return window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 100000,
      hash: "SHA-256"
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}
```

### 3.2 Payload Encryption
All file content and metadata are encrypted before leaving the browser:

```typescript
export interface EncryptedPayload {
  ciphertext: string; // Base64 encoded encrypted string
  iv: string;         // Base64 encoded Initialization Vector (12 bytes)
  salt: string;       // Base64 encoded PBKDF2 salt (16 bytes)
}

export async function encryptPayload(text: string, key: CryptoKey, salt: Uint8Array): Promise<EncryptedPayload> {
  const enc = new TextEncoder();
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  
  const ciphertextBuffer = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv: iv },
    key,
    enc.encode(text)
  );
  
  return {
    ciphertext: btoa(String.fromCharCode(...new Uint8Array(ciphertextBuffer))),
    iv: btoa(String.fromCharCode(...iv)),
    salt: btoa(String.fromCharCode(...salt))
  };
}
```

### 3.3 Payload Decryption
Rebuilds the plaintext string from the encrypted cloud payload:

```typescript
export async function decryptPayload(payload: EncryptedPayload, key: CryptoKey): Promise<string> {
  const dec = new TextDecoder();
  const iv = new Uint8Array(atob(payload.iv).split("").map((c) => c.charCodeAt(0)));
  const ciphertext = new Uint8Array(atob(payload.ciphertext).split("").map((c) => c.charCodeAt(0)));

  const decryptedBuffer = await window.crypto.subtle.decrypt(
    { name: "AES-GCM", iv: iv },
    key,
    ciphertext
  );

  return dec.decode(decryptedBuffer);
}
```

---

## 4 · Conflict Resolution & Merge Policies

Syncing local filesystem changes with a central database uses a **Last-Write-Wins (LWW)** model as default for single documents, and fallback **Three-Way Merge** for JSONML structured documents.

### 4.1 JSONML Tree Merging Strategy
JSONML represents HTML/XML elements as a nested JSON array: `["tagName", { attributes }, child1, child2, ...]`.
For concurrent edits:
1. **Compute LCS (Longest Common Subsequence):** The engine compares the local array (Mine) and the remote array (Theirs) against the common ancestor (Base).
2. **Attribute Merging:** Attributes are merged using a key-by-key comparison. If both modified a key to different values, local wins by default but creates a merge conflict log in the console.
3. **Child Node Insertion:** Nodes inserted locally that do not exist remotely are merged at their relative index.

---

## 5 · Hermes TCP Messaging Router

The local `arcanea-orchestrator` process runs a background TCP service (`HermesRouter`) on port `8520`. It coordinates JSONL packet structures between the Next.js runtime, CLI commands, and subagents:

### 5.1 JSONL-over-TCP Framing Packets
Packets are sent over TCP stream sockets terminated with a newline (`\n`) delimiter:

#### 1. Register Packet
```json
{
  "type": "register",
  "agentId": "runner-specialist"
}
```

#### 2. Subscribe Packet
```json
{
  "type": "subscribe",
  "topic": "world.creation.status"
}
```

#### 3. Publish Packet
```json
{
  "type": "publish",
  "message": {
    "from": "runner-specialist",
    "topic": "world.creation.status",
    "payload": {
      "status": "active",
      "progress": 85
    },
    "priority": "HIGH",
    "ttl": 60
  }
}
```

#### 4. Direct Message Packet
```json
{
  "type": "message",
  "message": {
    "from": "research-architect",
    "to": "runner-specialist",
    "topic": "task.trigger",
    "payload": {
      "command": "compile",
      "target": "apps/web"
    }
  }
}
```

---

## 6 · pgvector Semantic Indexing

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

## 7 · Remote Cloud Bench (Transient VMs)

* **Orchestration**: Node-RED or n8n scripts spin up lightweight Docker containers (Docker-in-Docker or Podman) on demand.
* **KiloClaw Parallels**:
  * Each container is a clean Linux instance pre-loaded with `node:20`, `pnpm`, and the `@arcanea/world-engine` package.
  * The runner clones the user's target repo, injects temporary BYOK credentials, runs compile processes, and stores output files in a secure transient S3 bucket before shutting down.
  * Uptime is strictly capped at **30 minutes** to prevent token abuse or looping processes.
