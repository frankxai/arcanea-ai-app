# Arcanea Publishing House Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Arcanea Publishing Intelligence Layer — 5 Managed Agent Claw definitions, Maestro orchestrator upgrade, Notion databases, local SQLite engine, distribution connectors, and blueprint docs.

**Architecture:** Intelligence layer that connects to creators' existing tools via MCP. Dual deploy: local (Claude Code + SQLite) or cloud (Managed Agents + Supabase). Revenue from intelligence IP, not hosting.

**Tech Stack:** TypeScript, Python, Claude Managed Agents API, MCP, Supabase, Pandoc, Notion API

---

### Task 1: Managed Agent Claw Definitions

**Files:**
- Create: `packages/publishing-house/agents/media-claw.json`
- Create: `packages/publishing-house/agents/forge-claw.json`
- Create: `packages/publishing-house/agents/herald-claw.json`
- Create: `packages/publishing-house/agents/scout-claw.json`
- Create: `packages/publishing-house/agents/scribe-claw.json`
- Create: `packages/publishing-house/agents/index.ts`
- Create: `packages/publishing-house/package.json`
- Create: `packages/publishing-house/tsconfig.json`

- [ ] **Step 1:** Create package.json for @arcanea/publishing-house
- [ ] **Step 2:** Create 5 Managed Agent definition JSON files per spec section 3
- [ ] **Step 3:** Create index.ts that exports agent loader + session creator functions
- [ ] **Step 4:** Create TypeScript types for agent configs, sessions, events
- [ ] **Step 5:** Verify package builds: `pnpm --dir packages/publishing-house run build`
- [ ] **Step 6:** Commit: `feat(publishing-house): add 5 Managed Agent Claw definitions`

### Task 2: Maestro Orchestrator — /ao publish command

**Files:**
- Modify: `.claude/skills/arcanea-orchestrator/SKILL.md`
- Create: `packages/publishing-house/orchestrator/maestro.ts`
- Create: `packages/publishing-house/orchestrator/session-manager.ts`

- [ ] **Step 1:** Add `publish` subcommand to /ao skill definition
- [ ] **Step 2:** Create maestro.ts — orchestration logic: detect deploy mode (managed vs local), create sessions, stream events, aggregate results
- [ ] **Step 3:** Create session-manager.ts — wrapper around Managed Agents API (create agent, create environment, create session, send events, stream)
- [ ] **Step 4:** Add fallback path: if no API key, use Claude Code Agent tool for local subagent execution
- [ ] **Step 5:** Verify the skill loads correctly via /ao publish --dry-run
- [ ] **Step 6:** Commit: `feat(ao): add publish subcommand with Managed Agent orchestration`

### Task 3: Local SQLite Engine (Free Tier)

**Files:**
- Create: `packages/publishing-house/db/sqlite.ts`
- Create: `packages/publishing-house/db/schema.sql`
- Create: `packages/publishing-house/db/sync.ts`

- [ ] **Step 1:** Create schema.sql — asset_metadata, publish_log, quality_scores tables (matching Supabase schema)
- [ ] **Step 2:** Create sqlite.ts — better-sqlite3 wrapper with typed queries
- [ ] **Step 3:** Create sync.ts — sync hero assets (TASTE ≥ 80) from SQLite to Supabase
- [ ] **Step 4:** Verify: create test DB, insert asset, query, sync to Supabase
- [ ] **Step 5:** Commit: `feat(publishing-house): add SQLite local engine with Supabase sync`

### Task 4: Notion Publishing Databases

**Files:**
- Create: `packages/publishing-house/notion/setup-databases.ts`
- Create: `packages/publishing-house/notion/templates.ts`

- [ ] **Step 1:** Create setup-databases.ts — uses Notion MCP to create 6 databases (Editorial Board, Asset Library, Distribution Tracker, Translation Queue, Analytics, Client Portal) with proper schemas and relations
- [ ] **Step 2:** Create templates.ts — Notion page templates for onboarding, content briefs, distribution reports
- [ ] **Step 3:** Run setup against Frank's Notion workspace (creates in a "Publishing House" parent page)
- [ ] **Step 4:** Verify all 6 databases exist with correct properties and relations
- [ ] **Step 5:** Commit: `feat(publishing-house): add Notion database setup + templates`

### Task 5: Scribe Claw — Publishing Pipeline

**Files:**
- Create: `packages/publishing-house/claws/scribe/format.ts`
- Create: `packages/publishing-house/claws/scribe/distribute.ts`
- Create: `packages/publishing-house/claws/scribe/translate.ts`

- [ ] **Step 1:** Create format.ts — reads Markdown source, calls Pandoc to generate EPUB, PDF, DOCX variants, stores in asset library
- [ ] **Step 2:** Create distribute.ts — connectors for Leanpub API, arcanea.ai (Vercel deploy), social queue. Each connector: validate → upload → verify → log
- [ ] **Step 3:** Create translate.ts — source text → Claude/DeepL translation → quality check → output in target language
- [ ] **Step 4:** Test: format a book chapter from book/ directory into EPUB
- [ ] **Step 5:** Commit: `feat(scribe-claw): publishing pipeline — format, distribute, translate`

### Task 6: Herald Claw — Social Marketing

**Files:**
- Create: `packages/publishing-house/claws/herald/draft.ts`
- Create: `packages/publishing-house/claws/herald/schedule.ts`

- [ ] **Step 1:** Create draft.ts — generates platform-optimized social posts from content (X thread, IG caption, LinkedIn article), uses Canva MCP for visual assets
- [ ] **Step 2:** Create schedule.ts — writes to social_queue in Supabase, supports time-zone-aware scheduling
- [ ] **Step 3:** Test: generate social campaign for an existing book chapter
- [ ] **Step 4:** Commit: `feat(herald-claw): social marketing pipeline — draft + schedule`

### Task 7: Quality Gate Integration

**Files:**
- Create: `packages/publishing-house/quality/taste-gate.ts`

- [ ] **Step 1:** Create taste-gate.ts — runs TASTE 5D scoring (Canon Alignment, Design Compliance, Emotional Impact, Technical Fit, Uniqueness), returns pass/fail with score and detailed feedback
- [ ] **Step 2:** Integrate with maestro.ts — quality gate runs between creation and distribution. Score ≥ 80 = hero (auto-approve). Score 60-79 = gallery (manual review). Score < 60 = revision loop.
- [ ] **Step 3:** Test: score an existing book chapter, verify scoring logic
- [ ] **Step 4:** Commit: `feat(quality): TASTE gate integration for publishing pipeline`

### Task 8: Railway Deploy Template

**Files:**
- Create: `packages/publishing-house/deploy/railway.toml`
- Create: `packages/publishing-house/deploy/Dockerfile`
- Create: `packages/publishing-house/deploy/docker-compose.yml`

- [ ] **Step 1:** Create Dockerfile — Node 20 + Python 3.11 + Pandoc, runs Claw daemon
- [ ] **Step 2:** Create docker-compose.yml — claw service + optional Supabase local
- [ ] **Step 3:** Create railway.toml — one-click deploy config
- [ ] **Step 4:** Verify: docker build succeeds
- [ ] **Step 5:** Commit: `feat(deploy): Railway + Docker templates for self-hosted Publishing House`

### Task 9: License Gate + Stripe

**Files:**
- Create: `packages/publishing-house/billing/license.ts`
- Create: `packages/publishing-house/billing/tiers.ts`

- [ ] **Step 1:** Create tiers.ts — defines Free, Pro ($29), Fleet ($99), Enterprise (custom) with feature flags per tier
- [ ] **Step 2:** Create license.ts — checks tier against Stripe subscription status, gates premium features (Fleet, Translation, Distribution beyond 1 platform)
- [ ] **Step 3:** Test: verify free tier works without Stripe, pro tier gates correctly
- [ ] **Step 4:** Commit: `feat(billing): license gate with tier-based feature flags`

### Task 10: Blueprint Documentation

**Files:**
- Create: `packages/publishing-house/docs/BLUEPRINT.md`
- Create: `packages/publishing-house/docs/QUICKSTART.md`

- [ ] **Step 1:** Write BLUEPRINT.md — "Fork This Publishing System" guide covering architecture, setup, customization, deployment options
- [ ] **Step 2:** Write QUICKSTART.md — 5-minute setup: clone, configure, run first publish
- [ ] **Step 3:** Commit: `docs(publishing-house): blueprint + quickstart for community`
