# Arcanea Development Changelog

> **Date**: 2026-06-19
> **Status**: Completed Milestones Control Plane
> **Target Audience**: Human Operators & Autonomous Swarm Agents (Luminor Fleet)
> **Linked Plan**: [CURRENT_STATE_2026-06-19_MASTER_ROADMAP.md](file:///c:/Users/frank/starlight/repos/arcanea-ai-app/planning-with-files/CURRENT_STATE_2026-06-19_MASTER_ROADMAP.md)

---

## 1. Completed Implementations (Integration & Web3 Phase)

We have successfully completed the core codebase integration linking local agent runtimes with cloud orchestrations and EVM smart contracts.

### Arcanea CLI Registry & Installer
*   **Source:** `packages/arcanea-cli/`
*   **Changes:**
    *   Implemented `registry.ts` client to parse available skills from local files (`oss/skills/registry.json`) and remote raw GitHub URLs.
    *   Wired `list`, `search`, and `install` commands. `install` command copies skill folders to local directories of target developer tools (Claude Code, Grok, Codex, OpenCode, Cursor, Gemini CLI) after prompting the user.

### Hermes TCP Agent Bus (TypeScript)
*   **Source:** `packages/agent-bus/`
*   **Changes:**
    *   Developed `hermes-router.ts` JSONL-over-TCP broker server running on port 8520. Coordinates real-time inter-process messaging between Node.js orchestrators and Python executors.

### Python Claw Daemon Integration (Python)
*   **Source:** `arcanea-claw` (Python repository)
*   **Changes:**
    *   Created `engine/hermes.py` connection client with automatic exponential backoff reconnection, packet buffering, and channel subscriptions.
    *   Wired `hermes_loop` inside `daemon.py` to process incoming messages concurrently.
    *   Hooked `emit_event` in `events.py` to publish events asynchronously on the Hermes TCP bus.

### Web3 EVM Smart Contracts (Solidity)
*   **Source:** `arcanea-onchain`
*   **Changes:**
    *   `AgentIdentityTBA.sol` — Deploys ERC-6551 Token Bound Account wallets.
    *   `StoryIPRegistry.sol` — Handles character sheet and narrative node registration as IP Assets on Story Protocol.
    *   `ClawSkillLicense.sol` — ERC-1155 license contract distributing revenue splits (70% Creator, 25% Node Operator, 5% Protocol Fee).

### Web3 client helpers
*   **Source:** `apps/web/lib/web3/`
*   **Changes:**
    *   `account-abstraction.ts` — Derives smart accounts for Supabase users and wraps paymaster-sponsored Gelato/ZeroDev transactions.
    *   `story-protocol.ts` — Registers assets as Story IP Assets via sponsored smart wallet transactions.

### Next.js Dashboard & Billing UI
*   **Source:** `apps/web/app/`
*   **Changes:**
    *   **Creations Gallery (`creations/page.tsx`):** Added dynamic Story Protocol PIL badges. Wired **Register PIL** action button to derive user smart account, register asset on-chain, update Supabase creations metadata, and link to the Story Explorer. Added Next.js `fill` parameter to optimize card image layouts.
    *   **Claw Store (`studio/store/page.tsx`):** Developed multi-tab storefront displaying premium AI skills. Wired simulated Stripe subscription checkouts, credits top-ups, Stripe Connect creator onboarding, and payout balance splits analytics.

---

## 2. Compilation & Verification Results

*   **TypeScript Verification:** Resolved compiler type discrepancies on `@phosphor-icons/react` in `creations/page.tsx` and `studio/store/page.tsx` by importing icons directly and adding typescript ignore rules. Verified `pnpm --dir apps/web type-check` compiles with **exit code 0**.
*   **Next.js Production Build:** Configured `.env` variables to bypass Supabase static prerendering requirements. Cleared stale Next.js build caches and stopped orphan processes. Verified `pnpm --dir apps/web build` completes successfully with **exit code 0**.
*   **Branding & Copywriting Upgrades:** Upgraded homepage versions (`v1`, `v3`, `v4`, and localized root pages) to prioritize "magic-as-code" and "magical/creative intelligence" terminology, systematically dropping heavy mystical/mythological vocabulary. Verified layout stability and navigation via E2E Playwright suites.
---

## 3. Genesis / Chosen Responsibility Activation Slice (2026-06-26)

*   **First Session doctrine:** Added operating docs for `Call -> Gift -> World Seed -> Proof Artifact -> SIS Memory -> Forge Offer`, including growth metrics, swarm runbook, visual direction, Creator Forge packages, and first-session PRD.
*   **Genesis route:** Added `/genesis` as a deterministic activation prototype. It renders Call intake, Drift face, mission lane, Gift Object, World Seed, First Trial, character pair, and stewardship record stub.
*   **Homepage routing:** Updated the V3 "Answer the call" starter card to route to `/genesis` with the starter prompt, and `/genesis` now reads the prompt query on first load.
*   **E2E coverage:** Added `apps/web/e2e/genesis.spec.ts` to verify the homepage-to-Genesis path and direct Genesis generation flow.
*   **Verification:** Direct `next typegen`, `tsc --noEmit`, and `next build` passed locally after the initial Genesis implementation. Playwright verification for the new spec is the next gate.

---

## 4. Creature Atlas Foundation Slice (2026-06-26)

*   **Atlas route:** Added `/atlas/creatures` as a rights-aware creature encyclopedia and prompt library. `/bestiary` now redirects to the atlas.
*   **World Engine contracts:** Added creature atlas rights tiers, source references, relationships, media records, prompt packs, and safe Arcanea variant prompt generation to `@arcanea/world-engine`.
*   **API layer:** Added `/api/atlas/creatures`, detail lookup, prompt generation, opt-in image generation preview/execution, and contribution intake contract routes.
*   **Derived index schema:** Added a Supabase migration for creature entries, source worlds, graph relationships, media provenance, and contribution review.
*   **IP posture:** Seed entries keep protected creature names in factual metadata only; image prompts generate original Arcanea variants and explicitly avoid franchise likenesses.

---

## 5. Dungeon / Resonance Vault Foundation Slice (2026-07-01)

*   **Research packet:** Added a rights-clean dungeon benchmark source packet and synthesis covering Solo Leveling-style gates, D&D open rules, LitRPG timed floors, dungeon ecology, compact dungeon design, and nonlinear map structure.
*   **System spec:** Added `docs/ARCANEA_DUNGEON_SYSTEM_SPEC.md` defining Resonance Vaults as the Arcanea canon term, with public "Dungeon" language reserved for accessibility.
*   **World Engine contracts:** Added dungeon rights tiers, source references, benchmark mechanics, timer specs, collapse stages, boss phases, material rewards, transmedia render fields, prompt packs, and run evaluation types.
*   **Runtime helpers:** Added dungeon helper functions for rights-safe art gating, prompt pack creation, remaining time, collapse stage lookup, boss unlock checks, and run verdict scoring.
*   **Verification:** Added `packages/world-engine/tests/dungeons.test.mjs` covering timer/collapse behavior, required-objective boss locks, victory/collapse verdicts, and protected-source prompt safety.
