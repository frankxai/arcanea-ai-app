# Sprint Plans & Agentic Team Mapping: Path C Hybrid Engine

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

## 2 · Sprint Plans (Phase 1 to 6)

### Sprint 1: Local-First Core & Browser Database (14 Days)
* **Goal**: Enable fully offline-first workspace loading.
* **Tasks**:
  * Implement client-side IndexedDB schemas for `world_graphs`, `book_drafts`, and `creation_briefs`.
  * Build the OPFS (Origin Private File System) sync buffer for preview images and local loops.
  * Connect local browser cache to the zip-exporter so creators can download vaults with zero internet dependency.
* **Verification**: `QA Automation Scout` asserts offline page reloads and browser zip export contents.

### Sprint 2: Cloud Sync Foundation & Auth Gate (14 Days)
* **Goal**: Establish the Postgres database sync router.
* **Tasks**:
  * Set up Supabase Auth client integration with custom provider parameters.
  * Construct the `vault_nodes` database table and enable Row-Level Security (RLS) policies.
  * Write the client-side delta sync algorithm (monitoring last updated timestamps to minimize data transfers).
* **Verification**: Verify that only logged-in users can write to their own path keys via RLS tests.

### Sprint 3: pgvector Semantic Indexing (10 Days)
* **Goal**: Enable semantic search across synced world graphs.
* **Tasks**:
  * Install the `pgvector` extension on Supabase.
  * Write the database trigger function `match_vault_nodes`.
  * Set up client-side embedding computation pipelines so raw text stays client-side.
* **Verification**: Measure Cosine similarity search latency. Target INP < 150ms.

### Sprint 4: Remote Cloud Bench Orchestration (14 Days)
* **Goal**: Spin up transient VM containers to run compilation recipes.
* **Tasks**:
  * Write Dockerfiles for the clean container compilation environment.
  * Build n8n/Node-RED API endpoint triggering container spins.
  * Set up transient S3 bucket listeners that push compiled zip binaries back to the user interface.
* **Verification**: Force runner shut down after exactly 30 minutes of runtime. Assert zero lingering containers.

### Sprint 5: Billing, Credits, & Waitlist Funnels (10 Days)
* **Goal**: Deploy the waitlists, payment gating, and Stripe/Whop webhooks.
* **Tasks**:
  * Redesign the public pricing pages to act as the Founding Circle waitlist.
  * Wire up the waitlist email capture endpoints to register users into Supabase.
  * Design credit tracking hooks that decrement credits upon remote image/video/audio forge actions.
* **Verification**: Verify waitlist insertions and mock credit debit transactions.

### Sprint 6: Hardening, Security Audit, & Release (10 Days)
* **Goal**: Complete E2E audits and deploy to production.
* **Tasks**:
  * Complete full CodeQL security reviews and fix dependencies.
  * Run project-wide typecheck and lint validations.
  * Deploy merged commits to `arcanea.ai` via Vercel integration.
* **Verification**: `pnpm run verify:project-workspaces` runs successfully with zero E2E test failures.
