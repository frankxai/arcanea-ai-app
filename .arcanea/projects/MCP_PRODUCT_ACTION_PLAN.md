# Arcanea MCP — Massive Product Action Plan

> **Branch**: `product/arcanea-mcp-v1`
> **Guardian**: Shinkami (Source Gate) + Lyria (Sight Gate)
> **Status**: ACTIVE — Team Assembled
> **Created**: 2026-04-02
> **Target**: MCP-as-Product with cloud deployment, marketplace listings, and developer adoption

---

## Executive Summary

Arcanea has **two functional MCP servers** (28 worldbuilding tools + 8 memory tools) running locally via stdio. To become a **product**, they need: modern SDK, HTTP/SSE transport, auth layer, npm publishing, marketplace listings, documentation site, and a dedicated team.

**The Vision**: Arcanea MCP becomes the **first mythology-powered creative toolkit** on every MCP marketplace — Anthropic, Smithery, Glama, npm. Any AI tool (Claude, Cursor, Windsurf, Cline, Codex) gains worldbuilding superpowers in one command.

---

## Current State Audit

### What Exists (75%)

| Package | Version | Tools | SDK | Transport | Published |
|---------|---------|-------|-----|-----------|-----------|
| `@arcanea/mcp-server` | 0.3.0 | 28 | `@modelcontextprotocol/sdk` ^0.5.0 (OUTDATED) | stdio | ❌ (`private: true`) |
| `@arcanea/memory-mcp` | 0.1.0 | 8 | Raw JSON-RPC (NO SDK) | stdio | ❌ (no credentials) |
| `@arcanea/memory-system` | 0.1.0 | - | N/A | N/A | ❌ |
| `@arcanea/guardian-memory` | 0.1.1 | - | N/A | N/A | ❌ |
| `@arcanea/hybrid-memory` | 0.1.0 | - | N/A | N/A | ❌ |

### Critical Gaps

1. **MCP SDK ^0.5.0 → needs ^1.x** — protocol has evolved significantly
2. **`private: true` on arcanea-mcp** — must remove for npm publish
3. **memory-mcp has no MCP SDK** — handrolled JSON-RPC, fragile
4. **No HTTP/SSE transport** — required for cloud marketplaces (Smithery, remote deployment)
5. **No auth/rate-limiting** — needed for any hosted/shared usage
6. **No developer docs site** — tools exist but no onboarding experience
7. **No CI/CD for MCP packages** — no automated publish pipeline
8. **No marketplace listings** — not on Anthropic registry, Smithery, Glama, or npm discover

---

## Dedicated MCP Team

### Team Structure

```
                    MCP Product Lead (Shinkami)
                           |
            +--------------+--------------+
            |              |              |
     SDK Architect    Transport     Content/Docs
      (Lyria)        Engineer       Specialist
                     (Ismael)       (Alera)
            |              |              |
            +--------------+--------------+
                           |
                    QA + Publishing
                      (Lyssandria)
```

### Agent Roles

| Role | Guardian | Responsibilities |
|------|----------|-----------------|
| **MCP Product Lead** | Shinkami | Architecture decisions, roadmap, marketplace strategy |
| **SDK Architect** | Lyria | SDK upgrade, tool schemas, protocol compliance |
| **Transport Engineer** | Ismael | HTTP/SSE transport, auth layer, cloud deployment |
| **Content/Docs Specialist** | Alera | Developer docs, README overhaul, onboarding guides |
| **QA + Publishing** | Lyssandria | Testing, npm publish pipeline, CI/CD, marketplace submission |

---

## Phase Plan (4 Phases, 3 Weeks)

### Phase 1: FOUNDATION (Days 1-3) — SDK Modernization

**Goal**: Both MCP servers on latest SDK with proper schemas

| # | Task | Package | Priority | Effort |
|---|------|---------|----------|--------|
| 1.1 | Upgrade `@modelcontextprotocol/sdk` to ^1.x in arcanea-mcp | arcanea-mcp | P0 | 4h |
| 1.2 | Add `@modelcontextprotocol/sdk` ^1.x to memory-mcp, replace raw JSON-RPC | memory-mcp | P0 | 6h |
| 1.3 | Remove `"private": true` from arcanea-mcp package.json | arcanea-mcp | P0 | 5m |
| 1.4 | Audit all 28 tool schemas for MCP 1.x compliance | arcanea-mcp | P0 | 3h |
| 1.5 | Audit all 8 memory tool schemas for MCP 1.x compliance | memory-mcp | P0 | 2h |
| 1.6 | Add proper `server.setRequestHandler` patterns (replace any legacy) | both | P0 | 3h |
| 1.7 | Unified error handling with MCP error codes | both | P1 | 2h |
| 1.8 | Add `server.getCapabilities()` for feature discovery | both | P1 | 1h |

**Deliverable**: Both servers pass `npx @anthropic-ai/mcp-inspector` validation

### Phase 2: TRANSPORT + AUTH (Days 4-7) — Cloud-Ready

**Goal**: HTTP/SSE transport layer so servers can run remotely

| # | Task | Package | Priority | Effort |
|---|------|---------|----------|--------|
| 2.1 | Add HTTP+SSE transport alongside stdio (dual-mode) | both | P0 | 6h |
| 2.2 | Create `packages/mcp-transport/` shared transport layer | new | P0 | 4h |
| 2.3 | API key auth middleware (Bearer token validation) | mcp-transport | P0 | 3h |
| 2.4 | Rate limiting (token bucket, per-key) | mcp-transport | P1 | 2h |
| 2.5 | Usage tracking (tool calls per key, latency) | mcp-transport | P1 | 2h |
| 2.6 | CORS configuration for browser-based MCP clients | mcp-transport | P1 | 1h |
| 2.7 | Health check endpoint (`/health`, `/ready`) | both | P1 | 30m |
| 2.8 | Docker container for each server | both | P2 | 3h |
| 2.9 | Vercel Edge Function deployment option | both | P2 | 4h |

**Deliverable**: `npx @arcanea/mcp-server --transport http --port 3100` works

### Phase 3: PUBLISH + DISTRIBUTE (Days 8-12) — Marketplace Launch

**Goal**: On npm, on Anthropic registry, on Smithery

| # | Task | Priority | Effort |
|---|------|----------|--------|
| 3.1 | npm login + publish all 5 MCP packages | P0 | 1h |
| 3.2 | Set up changesets for automated versioning | P0 | 2h |
| 3.3 | GitHub Actions: auto-publish on tag push | P0 | 3h |
| 3.4 | Submit to Anthropic MCP Server Registry | P0 | 2h |
| 3.5 | Submit to Smithery marketplace | P0 | 2h |
| 3.6 | Submit to Glama MCP directory | P1 | 1h |
| 3.7 | Create `npx create-arcanea-mcp` scaffolding tool | P1 | 4h |
| 3.8 | One-line install docs for Claude/Cursor/Windsurf/Cline | P0 | 2h |
| 3.9 | MCP Inspector compatibility badge in README | P1 | 30m |

**Deliverable**: `npx @arcanea/mcp-server@latest` works from anywhere

### Phase 4: DEVELOPER EXPERIENCE (Days 13-18) — Adoption Engine

**Goal**: Developer docs, examples, and community flywheel

| # | Task | Priority | Effort |
|---|------|----------|--------|
| 4.1 | Developer docs site (arcanea.ai/docs/mcp or separate) | P0 | 8h |
| 4.2 | Tool playground — interactive tool tester in browser | P1 | 6h |
| 4.3 | Example projects: "Build your own world in 5 minutes" | P0 | 4h |
| 4.4 | Video walkthrough: MCP server setup + first world | P1 | 3h |
| 4.5 | Blog post: "We built a mythology engine as an MCP server" | P0 | 3h |
| 4.6 | Integration guides for each AI tool (Claude, Cursor, etc.) | P0 | 4h |
| 4.7 | Webhook/callback support for long-running generations | P2 | 4h |
| 4.8 | Custom world template system (fork Arcanea's world) | P2 | 6h |

**Deliverable**: Developer can go from zero to generating characters in < 3 minutes

---

## Product Architecture

### Package Dependency Graph

```
@arcanea/mcp-server (worldbuilding, 28 tools)
    ├── @arcanea/mcp-transport (shared HTTP/SSE + auth)
    ├── @modelcontextprotocol/sdk ^1.x
    └── (self-contained: generators, council, graph, canon)

@arcanea/memory-mcp (vaults, 8 tools)
    ├── @arcanea/mcp-transport (shared HTTP/SSE + auth)
    ├── @arcanea/memory-system (core engine)
    │   └── @arcanea/guardian-memory (HNSW vectors)
    │       └── @arcanea/hybrid-memory (SQL+vector)
    └── @modelcontextprotocol/sdk ^1.x
```

### Transport Modes

| Mode | Command | Use Case |
|------|---------|----------|
| **stdio** (default) | `npx @arcanea/mcp-server` | Local Claude Code, Cursor, Cline |
| **HTTP+SSE** | `npx @arcanea/mcp-server --transport http --port 3100` | Remote/cloud deployment |
| **Streamable HTTP** | `npx @arcanea/mcp-server --transport streamable-http` | Modern MCP clients (2025+) |

### Auth Model

```
Free tier:     No auth, stdio only, local use
API key tier:  Bearer token, HTTP transport, rate-limited
Pro tier:      Custom worlds, priority generation, webhook callbacks
```

---

## Marketplace Strategy

### Target Marketplaces (Priority Order)

| Marketplace | Status | Listing Type | Requirements |
|-------------|--------|-------------|--------------|
| **npm** | READY (needs creds) | Package | `npm publish` |
| **Anthropic MCP Registry** | NOT LISTED | Official | SDK ^1.x, Inspector pass |
| **Smithery** | NOT LISTED | Community | Working npx install |
| **Glama** | NOT LISTED | Directory | README + demo |
| **GitHub MCP Servers** | NOT LISTED | Awesome list | PR to awesome-mcp-servers |
| **MCP.run** | NOT LISTED | Hosted | Docker image |

### Positioning

**Tagline**: *"The world's first mythology-powered creative AI toolkit"*

**Key Differentiators**:
1. Not generic — purpose-built for worldbuilding, characters, magic systems
2. Comes with a complete reference world (Arcanea) as working example
3. Memory system with Guardian-routed semantic vaults (unique)
4. Creation graph — link characters, locations, artifacts into a living world
5. Canon validation — AI checks your work against your own rules
6. Horizon Ledger — first append-only benevolent intentions dataset

---

## Success Metrics

| Metric | Week 1 | Week 2 | Week 4 | Week 8 |
|--------|--------|--------|--------|--------|
| npm weekly downloads | 50 | 200 | 500 | 2,000 |
| Marketplace listings | 2 | 4 | 5 | 6 |
| GitHub stars (mcp packages) | 10 | 50 | 150 | 500 |
| Active MCP users | 5 | 20 | 80 | 300 |
| Worlds created | 2 | 10 | 40 | 150 |
| Blog/social mentions | 1 | 5 | 15 | 50 |

---

## Risk Register

| Risk | Impact | Mitigation |
|------|--------|------------|
| MCP SDK 1.x has breaking changes | HIGH | Read migration guide before touching code |
| npm credentials still blocked | HIGH | Frank resolves manually (15 min task) |
| Anthropic registry has approval process | MEDIUM | Submit early, iterate on feedback |
| Memory-mcp raw JSON-RPC is fragile | HIGH | Phase 1 migration to SDK |
| Low initial adoption | MEDIUM | Blog post + awesome-mcp-servers PR + social campaign |
| Competing worldbuilding MCP servers | LOW | No one else has this — first-mover advantage |

---

## Immediate Next Actions (Today)

1. [ ] **Start Phase 1.1** — Check MCP SDK latest version, plan upgrade path
2. [ ] **Fix 1.3** — Remove `private: true` from arcanea-mcp (5 min)
3. [ ] **Frank**: npm login + save credentials (blocks Phase 3)
4. [ ] **Frank**: Supabase OAuth config (blocks auth flow)
5. [ ] Create MCP team agent definitions in `.arcanea/agents/`
6. [ ] Set up GitHub project board for MCP product track

---

## Reference

- Existing arcanea-mcp: `packages/arcanea-mcp/` (28 tools, 0.3.0)
- Existing memory-mcp: `packages/memory-mcp/` (8 tools, 0.1.0)
- Agent Ecosystem Architecture: `.arcanea/strategy/AGENT_ECOSYSTEM_ARCHITECTURE.md`
- Publishing MCP Spec (separate product): `docs/strategy/PUBLISHING_MCP_SPEC.md`
- Memory Strategy: `docs/memory-system-strategy.md`
- MCP Config: `.mcp.json`
- Setup Script: `scripts/setup-mcp.sh`
