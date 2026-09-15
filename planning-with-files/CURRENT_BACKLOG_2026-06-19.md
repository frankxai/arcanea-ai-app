# Arcanea Active Development Backlog

> **Date**: 2026-06-19  
> **Status**: Active Backlog Control Plane  
> **Target Audience**: Human Operators & Autonomous Swarm Agents (Luminor Fleet)  
> **Linked Plan**: [CURRENT_STATE_2026-06-19_MASTER_ROADMAP.md](file:///c:/Users/frank/starlight/repos/arcanea-ai-app/planning-with-files/CURRENT_STATE_2026-06-19_MASTER_ROADMAP.md)

---

## 1. Immediate Action Items (Sprint 1: Hardening & Local Integration)

The following items are designated for the immediate development cycle to prepare the local-first execution plane for production.

### CLI & local tool updates
- [ ] **Linear Sync & telemetry loops:** Connect `packages/arcanea-cli` to a local logging server to store model performance metrics.
- [ ] **keystore verification:** Build simple secure CLI prompts to store local private keys for smart wallet signing (encrypted locally).
- [ ] **clawhub.json manifest verification:** Add JSON schema validator inside the CLI to check third-party plugin configurations before installing.

### Agent-Bus (Hermes TCP Router)
- [ ] **SSL/TLS sockets:** Update `packages/agent-bus` to allow encrypted TCP socket connections using local self-signed certificates.
- [ ] **Replay buffers:** Add packet memory buffers in `hermes-router.ts` to retry sending packets if the Python Claw daemon drops connection.

### Python Claw engine
- [ ] **Concurrency throttle:** Implement custom execution queue sizes in `arcanea-claw` to prevent WSL2 and local CPU/GPU out-of-memory errors during swarm runs.
- [ ] **Local CLI packaging:** Configure python setup script to compile and install Claw daemon globally via `uv` or `pip`.

---

## 2. Web3 & Stripe Integration Backlog (Sprint 2: Beta Launch)

These items focus on linking our Next.js frontend to real financial and on-chain infrastructure.

### Smart Wallets & ERC-6551
- [ ] **ZeroDev SDK installation:** Replace mock wallet derivation in `apps/web/lib/web3/account-abstraction.ts` with the official `@zerodev/sdk` or `@safe-global/protocol-kit`.
- [ ] **Paymaster API Key setup:** Configure Base Sepolia Gelato/ZeroDev paymaster integration keys inside the server environment.

### Story Protocol & IPFS
- [ ] **Story Protocol SDK Client:** Upgrade mock contract calls in `apps/web/lib/web3/story-protocol.ts` to utilize the `@story-protocol/core-sdk`.
- [ ] **IPFS Storage integration:** Connect Creations gallery to dynamic Pinata / Web3.Storage gateways for media asset pinning.

### Stripe payments
- [ ] **Stripe Connect onboarding:** Wire real API callback handlers in `apps/web/app/api/stripe/payout` to track developer withdrawal splits.
- [ ] **Credits Top-up Webhooks:** Update the checkout webhook parser in `apps/web/app/api/stripe/webhook` to dynamically credit user profile wallets.

---

## 3. Verification & Testing Backlog

- [ ] **Foundry unit tests:** Write smart contract tests verifying that `ClawSkillLicense.sol` splits payout percentages exactly (70% Developer, 25% Node Operator, 5% Protocol Fee) under multi-payment inputs.
- [ ] **Playwright E2E store test:** Create automated user flow test checking store page, credit balance, wallet derivation, mock purchase, and gallery badge rendering.
- [ ] **Pytest loops:** Validate `hermes.py` connection loops with direct mock TCP socket feeds.

---

## 4. Genesis Activation Backlog (Added 2026-06-26)

- [ ] **Genesis backend endpoint:** Add `/api/genesis/generate` or evolve `/api/worlds/generate` to return Gift Object, Right Use Gate, World Bible, first trial, visual DNA, and proof metadata.
- [ ] **Proof Ledger persistence:** On Genesis save, create/link a project and memory records for intent, Gift, cost, right use, trial, source/rights, and canon effect.
- [ ] **World Repo export:** Convert Genesis output into the repo-canonical `world.arcanea.json` shape defined in `arcanea-ecosystem/docs/WORLD_REPO_STANDARD.md`.
- [ ] **Dashboard reframing:** Replace generic return state with active Gift, world seed, proof artifacts, rights status, and next mission.
- [ ] **Genesis visual QA:** Capture desktop/mobile screenshots of `/genesis`, score with the 30-point visual gate, and iterate on layout/media before preview deployment.

---

## 5. Creature Atlas Backlog (Added 2026-06-26)

- [ ] **Genesis 100 expansion:** Grow the seed atlas from the initial curated set to 100 reviewed entries with citations, rights tiers, graph links, and Arcanea-safe variant prompts.
- [ ] **Repo indexer:** Add a content-pack indexer that reads `content.creatures` from world repos and rebuilds the `creature_*` derived Supabase tables.
- [ ] **Contribution persistence:** Wire `/api/atlas/contributions` to Supabase plus GitHub issue/PR creation after rights-review validation.
- [ ] **Generated media QA:** Add visual QA evidence capture for creature images; only mark `creature_media.status = approved` after the 30-point gate passes.
- [ ] **Graph UI upgrade:** Replace the first-pass relationship list with an interactive neighborhood graph using the existing world graph visual language.

---

## 6. Dungeon / Resonance Vault Backlog (Added 2026-07-01)

- [ ] **Seed corpus:** Add 20 rights-clean benchmark records and 10 original Arcanea Resonance Vault records using the new dungeon contract.
- [ ] **Atlas route:** Add `/atlas/dungeons`, `/atlas/dungeons/[slug]`, `/api/atlas/dungeons`, and a `/dungeons` redirect after source/canon review.
- [ ] **Author export:** Render a dungeon entry as game mission JSON, anime beat sheet, fantasy chapter outline, and author pack markdown.
- [ ] **Derived index:** Add a Supabase dungeon atlas migration only after the seed corpus stabilizes.
- [ ] **L99 media loop:** Generate key art, boss silhouettes, room plates, and material swatches only through prompt packs, visual QA, and evidence.
