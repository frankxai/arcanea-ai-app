# Sprint Plans & Agentic Team Mapping: Path C Hybrid Engine (SOTA L99)

## 1 · Agentic Team Structure

To execute the Path C roadmap asynchronously and verify every scope slice before integration, we structure a multi-agent team mapping to specific gates:

| Role | Domain Gate | Guardian | Responsibility |
|------|-------------|----------|----------------|
| **Research Architect** | Crown | Aiyami | Decomposes engineering questions, plans sync schemas, runs structural reviews. |
| **System Engineer** | Foundation | Lyssandria | Builds client-side IndexedDB drivers, OPFS buffers, local file exports, and CLI links. |
| **Data Guardian** | Starweave | Elara | Designs Postgres pgvector schemas, triggers, RLS policy gates, and HNSW indexes. |
| **Runner Specialist** | Fire | Draconia | Codes the Docker/Podman transient VM orchestrator scripts for remote Cloud Bench compilation. |
| **QA Automation Scout** | Sight | Lyria | Writes E2E Playwright smoke tests, runs coverage reviews, and asserts token safety. |

---

## 2 · Multi-Repository Sprint Plans (Phase 1 to 6)

### Sprint 1: Local-First Core & Browser Database (14 Days)
* **Goal**: Enable fully offline-first workspace loading.
* **Tasks**:
  * **`arcanea-studio`**:
    * Implement client-side IndexedDB schemas for `world_graphs`, `book_drafts`, and `creation_briefs`. (Owner: `System Engineer`)
    * Build the OPFS (Origin Private File System) sync buffer for preview images and local loops. (Owner: `System Engineer`)
  * **`arcanea-ai-app`**:
    * Connect local browser cache to the zip-exporter so creators can download vaults with zero internet dependency. (Owner: `System Engineer`)
* **Verification**: `QA Automation Scout` asserts offline page reloads and browser zip export contents.

### Sprint 2: Cloud Sync Foundation & Auth Gate (14 Days)
* **Goal**: Establish the Postgres database sync router.
* **Tasks**:
  * **`arcanea-ai-app`**:
    * Set up Supabase Auth client integration with custom provider parameters. (Owner: `Data Guardian`)
    * Construct the `vault_nodes` database table and enable Row-Level Security (RLS) policies. (Owner: `Data Guardian`)
    * Implement the delta sync HTTP API endpoint to resolve differences. (Owner: `Data Guardian`)
  * **`arcanea-studio`**:
    * Write the client-side delta sync algorithm (monitoring last updated timestamps to minimize data transfers). (Owner: `System Engineer`)
* **Verification**: Verify that only logged-in users can write to their own path keys via RLS tests.

### Sprint 3: pgvector Semantic Indexing (10 Days)
* **Goal**: Enable semantic search across synced world graphs.
* **Tasks**:
  * **`arcanea-ai-app`**:
    * Install the `pgvector` extension on Supabase. (Owner: `Data Guardian`)
    * Write the database trigger function `match_vault_nodes` and tune HNSW indexes. (Owner: `Data Guardian`)
  * **`arcanea-studio`**:
    * Set up client-side embedding computation pipelines using Onyx/Transformers.js so raw text stays client-side. (Owner: `System Engineer`)
* **Verification**: Measure Cosine similarity search latency. Target INP < 150ms.

### Sprint 4: Remote Cloud Bench Orchestration (14 Days)
* **Goal**: Spin up transient VM containers to run compilation recipes.
* **Tasks**:
  * **`arcanea-orchestrator`**:
    * Write Dockerfiles for the clean container compilation environment. (Owner: `Runner Specialist`)
    * Build n8n/Node-RED API endpoint triggering container spins. (Owner: `Runner Specialist`)
    * Set up transient S3 bucket listeners that push compiled zip binaries back to the user interface. (Owner: `Runner Specialist`)
* **Verification**: Force runner shut down after exactly 30 minutes of runtime. Assert zero lingering containers.

### Sprint 5: Billing, Credits, & Waitlist Funnels (10 Days)
* **Goal**: Deploy the waitlists, payment gating, and Stripe/Whop webhooks.
* **Tasks**:
  * **`arcanea-ai-app`**:
    * Redesign the public pricing pages to act as the Founding Circle waitlist. (Owner: `Research Architect`)
    * Wire up the waitlist email capture endpoints to register users into Supabase. (Owner: `Data Guardian`)
    * Design credit tracking hooks that decrement credits upon remote image/video/audio forge actions. (Owner: `Data Guardian`)
* **Verification**: Verify waitlist insertions and mock credit debit transactions.

### Sprint 6: Hardening, Security Audit, & Release (10 Days)
* **Goal**: Complete E2E audits and deploy to production.
* **Tasks**:
  * **All Repositories**:
    * Complete full CodeQL security reviews and fix dependencies. (Owner: `QA Automation Scout`)
    * Run project-wide typecheck and lint validations. (Owner: `QA Automation Scout`)
    * Deploy merged commits to `arcanea.ai` via Vercel integration. (Owner: `System Engineer`)
* **Verification**: `pnpm run verify:project-workspaces` runs successfully with zero E2E test failures.

---

## 3 · Swarm Orchestration & Handoff Specifications

### 3.1 Handoff Protocols over `@arcanea/agent-bus`
Agents communicate over a local TCP loop using the `HermesRouter`. When a subtask finishes (e.g. a module build), the executing agent publishes an event:

```
[System Engineer] ──► Hermes (Topic: "build.completed") ──► [QA Scout] (Trigger E2E test)
                                                                 │
                                     Success State ◄─────────────┴─────────────► Failure State
                                           │                                           │
                               [Promote to Next Gate]                          [Trigger Rollback]
```

### 3.2 Automated CI/CD Promotion and Rollback Rules
To prevent broken builds on `main`:
1. **Lint & Typecheck Gate:** Pull Requests must pass `tsc --noEmit` and ESLint checks.
2. **E2E Playwright Test Suite:** 100% of the smoke tests in `apps/web` must return green.
3. **Rollback Execution:** If a test fails in the CI pipeline:
   * CI runner aborts the deploy process.
   * A script automatically rolls back to the previous stable commit on the hosting platform.
   * Hermes emits an alert message to the `#engineering-ops` channel.
