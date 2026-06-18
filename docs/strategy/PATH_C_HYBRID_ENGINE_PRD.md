# Product Requirement Document: Path C Hybrid Engine

## 1 · Executive Summary
Arcanea is a creative operating platform built to empower developers, writers, designers, and game creators. Historically, AI systems have forced a binary choice: a closed SaaS database (which locks in data and causes IP concerns) or a pure offline toolkit (which lacks sync and collaboration).

**Path C** is the **Hybrid Sovereign Engine**. It combines a **Local-First, Offline-Capable, BYOK (Bring Your Own Key)** core with a **Paid Cloud Sync & pgvector Intelligence Layer**. Creators get full ownership of their data while enjoying the convenience of cloud sync, semantic search, and collaborative canvases.

---

## 2 · Product North Stars & Value Propositions
* **Sovereignty First**: The user’s core world graphs, book outlines, and assets live locally as standard Markdown and JSONML files. 
* **Zero Infrastructure Pass-Through Costs**: Free users execute prompts using their own API keys (BYOK), eliminating compute overhead for the operator.
* **Premium convenience Gating**: The user pays not for access to the interface, but for convenience services: hosted sync, pgvector cloud embeddings, multiplayer sharing, and remote execution.

---

## 3 · Key Features & Scope

### 3.1 Local-First Workspace Core (Free Open Core)
* **BYOK Key Manager**: Secure browser storage (indexedDB / LocalStorage) for Anthropic, Google, and OpenAI keys.
* **Local File Exporter**: Saves lore bibles, assets, and audio as standard `.md` or `.jsonml` files.
* **Desktop Companion CLI**: Command-line tools (e.g. `npx @arcanea/mcp-server`) that read/write local vault directories directly.

### 3.2 Cloud Sync & pgvector Intelligence Layer (Paid Subscriptions)
* **Encrypted Vault Sync**: Securely mirrors local markdown vaults to Arcanea’s cloud postgres database.
* **pgvector Semantic Search**: Runs HNSW index queries across synced notes 150x faster than standard keyword searches, allowing users to ask queries like *"Which characters feel like Aiyami?"*.
* **Multiplayer Creative Canvas**: Allows real-time collaborative editing of node-based workflow recipe graphs (Canvas Flow Lab).

### 3.3 Asynchronous Remote Bench (Arcanea Cloud Bench)
* **Transient Cloud VMs**: Spawns clean remote containers (similar to KiloClaw VMs on `kilosessions.ai`) to execute complex, multi-model generation recipes.
* **Progress Logging Feed**: Renders live compilation logs directly in the UI, delivering a final `.zip` file of assets upon completion.

---

## 4 · User Experience (UX) Flow
1. **Onboarding**: A user signs up on `arcanea.ai`. They immediately access the Image, Video, and Audio Forge workspaces.
2. **Local Work**: They enter their own Anthropic API key. Creations are saved to their browser’s local cache and can be exported as a zip file.
3. **Upgrade Path**: To sync their lore vault across mobile and desktop, or to use pgvector search, they click the "Upgrade" CTA, bringing them to the **Founding Circle** waitlist funnel.
4. **Cloud Execution**: For heavy generations, they offload compilation to the Cloud Bench, which handles processing in the background.

---

## 5 · Long-term Operations & Support Guidelines
* **Sovereign Moat**: Maintain MIT licensing for the core tools to encourage community forks and extensions.
* **Self-Serve Diagnostics**: Replace live support agents with community forums, Discord Q&A channels, and automated environment diagnostic scripts.
* **Encrypted Storage**: Sync servers must encrypt file payloads, ensuring the platform operator cannot read user IP, shielding the BV from privacy liabilities.
