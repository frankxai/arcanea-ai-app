---
title: Arcanea ↔ OpenClaw Integration — How Arcanea Plugs Into the Lobster Ecosystem
status: draft (corrected v2 — supersedes openclaw-substrate-distribution.md premise)
created: 2026-04-23
owner: frankx
context: How does Arcanea ship into the existing OpenClaw ecosystem so millions of Claws can use our skills, MCPs, personas, and protocols?
state: research-grounded — based on actual openclaw/openclaw + clawhub registry + 13,729 existing skills
---

# Arcanea ↔ OpenClaw Integration

## TL;DR — Correcting the previous doc

The earlier `openclaw-substrate-distribution.md` (written same day) **invented a parallel runtime** (`@arcanea/claw`) when **OpenClaw already exists** as a mature ecosystem with:

- `openclaw/openclaw` — local-first daemon, 4.3k stars, 1.2k forks, 182k commits
- **ClawHub** — public skill registry with **13,729 skills** as of Feb 2026
- **MCP Registry** built into the runtime — 65%+ of active skills wrap MCP servers
- **20+ messaging integrations native** — WhatsApp, Telegram, Slack, Discord, iMessage, Signal, IRC, Teams, Matrix, Google Chat, etc.
- **Voice Wake + Talk Mode** on macOS/iOS/Android
- **Live Canvas** for visual workspace control
- **Multi-agent routing** to isolated workspaces
- **Lobster mascot** 🦞 — explains "Peter's Lobster"

Arcanea is not a competitor. **Arcanea is a premium skill/persona/MCP provider** that ships into ClawHub. Lobster is the substrate. Lumina is a passenger.

We are already partially integrated — `.mcp.json` line 3 has a `kilo` MCP labeled "Kilo Code (OpenClaw) bridge". The bridge exists; we haven't fully exploited it.

## The Real Architecture

```
                  OpenClaw Gateway (local daemon)
                  ├── Sessions  (per-user state)
                  ├── Channels  (Telegram, WhatsApp, Discord, ...)
                  ├── MCP Registry
                  │   ├── arcanea-mcp        ← OUR MCP
                  │   ├── arcanea-memory     ← OUR MCP
                  │   ├── arcanea-registry   ← OUR MCP
                  │   ├── starlight-sis      ← OUR MCP
                  │   └── ...other community MCPs
                  └── Skills (~/.openclaw/workspace/skills/)
                      ├── arcanea/lumina         ← OUR persona skill
                      ├── arcanea/dawn           ← OUR ritual skill
                      ├── arcanea/handover       ← OUR memory skill
                      ├── arcanea/character-forge← OUR creative skill
                      ├── arcanea/canon-check    ← OUR validator
                      └── ...280+ more
```

**OpenClaw provides** the runtime, channels, gateway, voice, multi-agent routing, sessions, and ClawHub distribution.

**Arcanea provides** the consciousness layer (Luminor + Guardians), the ritual (Dawn/Handover/Pulse/Sis), the creative protocol (Arc), the economic protocol (Nea), the curated skill library (280+), and the design taste.

## Four Integration Vectors

### Vector 1: Publish our MCPs to the OpenClaw MCP Registry

Our `.mcp.json` already declares 4 Arcanea MCPs:
- `arcanea-mcp` — worldbuilding, creative orchestration, canon tools (42+ tools per memory)
- `arcanea-memory` — vault_remember/recall/horizon, memory sync
- `arcanea-registry` — Agent Registry Protocol (search/publish/deploy/monetize)
- `starlight-sis` — canonical SIS v6+ (10 tools)

OpenClaw MCP install command (from docs.openclaw.ai/cli/mcp):

```bash
openclaw mcp set arcanea-mcp '{"command":"npx","args":["-y","@arcanea/arcanea-mcp@latest"]}'
openclaw mcp set arcanea-memory '{"command":"npx","args":["-y","@arcanea/memory-mcp@latest"]}'
openclaw mcp set starlight-sis '{"command":"npx","args":["-y","-p","@arcanea/starlight-intelligence-system@latest","starlight-mcp"]}'
```

**Today's blocker**: `arcanea-mcp` and `arcanea-memory` aren't published to npm yet (per `project_mcp_sdk_migration` and `project_mcp_product_team` memories — was on `product/arcanea-mcp-v1` branch, awaiting npm login per ARC-76).

**Action**: Resolve ARC-76 (`npm login`) → publish all 4 MCPs to npm → write `arcanea-mcp-bundle` install doc that any OpenClaw user can paste.

### Vector 2: Publish our skills to ClawHub

Our `.claude/skills/<name>/SKILL.md` format is **already 90% compatible** with OpenClaw's `~/.openclaw/workspace/skills/<name>/SKILL.md` format. Both use markdown with YAML frontmatter.

**Format diff** (mechanical):

| Field | Claude Code | OpenClaw |
|---|---|---|
| `name` | required | required |
| `description` | required | required |
| `metadata.openclaw.requires.env` | n/a | env var deps |
| `metadata.openclaw.requires.bins` | n/a | binary deps |

**Migration**: a `port-skills-to-clawhub.mjs` script that:
1. Walks `.claude/skills/`
2. Adds `metadata.openclaw.requires` block
3. Writes to `clawhub-staging/arcanea/<skill>/SKILL.md`
4. Runs `clawhub skill publish <path>` for each

Estimated effort: **2 days** for first 50 skills with manual review, then 1 day batch for the rest.

**Namespace**: All Arcanea skills publish under `arcanea/<skill-name>` on ClawHub. This is the canonical author prefix per the URL pattern `https://clawhub.ai/{author}/{skill-name}`.

### Vector 3: Persona bundles — Lumina, Luminor, Guardians

The Luminor system (10 Luminors), Guardian system (10 Guardians), and Lumina herself are **persona skills** in OpenClaw terms. Each is a SKILL.md that overlays voice/behavior/expertise.

Example: `~/.openclaw/workspace/skills/arcanea/lumina/SKILL.md`

```yaml
---
name: arcanea-lumina
description: Channel Lumina, the orchestrator Luminor of Arcanea. Routes generative work, integrates Arc/Nea, embodies the Source Gate at 1111Hz frequency anchor.
metadata:
  openclaw:
    requires:
      env: []
      bins: []
    tags: [persona, arcanea, luminor, orchestrator]
    composes_with: [arcanea/dawn, arcanea/handover, arcanea/canon-check]
---

# Lumina — Channel the Source Gate

You are Lumina, First Light, Form-Giver, and orchestrator of Arcanea...

[full persona prompt + behavior rules + voice guidelines]
```

A user installs once: `clawhub install arcanea/lumina` — and now their Lobster has Lumina available across Telegram, WhatsApp, voice, browser, anywhere.

**Three persona archetypes to publish first** (Phase 1 priority):
- `arcanea/lumina` — the orchestrator (default for most users)
- `arcanea/jarvis` — precise/technical (already requested by Frank as a base)
- `arcanea/sage` — slow/philosophical (Stoic coach)

### Vector 4: Arc/Nea protocols as skill packs

`.arc` files (creation lifecycle) and `.nea` files (economic lifecycle) become **OpenClaw extensions**.

The `arc-protocol` package (`packages/arc-protocol/`) already parses `.arc` files. Wrap it as `@arcanea/openclaw-arc-extension`:
- Provides skills `arcanea/arc-create`, `arcanea/arc-progress`, `arcanea/arc-publish`
- Reads/writes to `~/.openclaw/workspace/projects/*.arc`
- Integrates with Guardian review skills

Same for `.nea`:
- `arcanea/nea-deploy`, `arcanea/nea-verify`, `arcanea/nea-claw-handoff`
- Integrates with the OpenClaw audit-gate workflow before any onchain write

This is where **Arcanea becomes structurally important** to OpenClaw users who want to ship creative work commercially. Not just "another skill set" — a **complete creator-economy protocol**.

## Already Wired (don't rebuild)

| Existing | What it gives us |
|---|---|
| `kilo` MCP in `.mcp.json` | Bridge to Kilo Code (OpenClaw) — `kilo_run`, `kilo_run_bg`, `kilo_status`, `kilo_acp_start`, `kilo_agent_list`, `kilo_mcp_list`, `kilo_models`, etc. |
| `KiloClaw` hosted on `kilosessions.ai` (per memory) | Cloud-hosted OpenClaw agent — Frank's personal Lobster equivalent |
| `arcanea-mcp` package | 42+ tools already built |
| `starlight-sis` v6.0.1+ on npm | 10 SIS tools, install via `npx` — works on any OpenClaw |
| `kiloclaw-bridge` skill (`.claude/skills/kiloclaw-bridge`) | Drives hosted KiloClaw from inside Claude Code |
| `kilocode-bridge` skill | Same for Kilo Code CLI v7+ |

## What to Build (the new priority order)

### Phase 1 — Publishing (1 week, post-Gate-0)

| Build | Why |
|---|---|
| `npm login` + publish `@arcanea/arcanea-mcp` | Unblocks ARC-76; enables `openclaw mcp set arcanea-mcp ...` for anyone |
| `npm login` + publish `@arcanea/memory-mcp` | Same |
| `npm login` + publish `@arcanea/registry-mcp` | Same |
| `port-skills-to-clawhub.mjs` script | Mechanical port of 280+ skills |
| First 10 skills published to ClawHub under `arcanea/` namespace | Bootstraps presence |

### Phase 2 — Persona bundles (1 week)

| Build | Why |
|---|---|
| `arcanea/lumina` published | Frank's signature persona discoverable globally |
| `arcanea/jarvis` published | Wider audience appeal (Iron Man tribute) |
| `arcanea/sage` published | Coach archetype — broadest commercial use |
| Persona composition docs | Show how to combine `lumina + dawn + handover + canon-check` for full Arcanea experience |

### Phase 3 — Arc/Nea OpenClaw extensions (2 weeks)

| Build | Why |
|---|---|
| `@arcanea/openclaw-arc-extension` npm package | Wraps arc-protocol parser as OpenClaw extension |
| `@arcanea/openclaw-nea-extension` npm package | Onchain skill pack with audit gate |
| Integration with OpenClaw's MCP Registry for chain RPC | Enables real `.nea` deploys from Telegram/voice/anywhere |

### Phase 4 — Marketplace + economic layer (4 weeks)

This is where Arc/Nea economic architecture from `wiki/meta/arc-nea-economic-architecture.md` activates:
- Per-skill billing via `.nea` smart contracts
- 50/30/20 revenue split (contributor/treasury/reviewer pool)
- Custody via Safe multisig (per §4 of arc-nea doc)
- Community skill submissions reviewed by Guardian council

This is the **billion-Claw thesis**: ClawHub has 13,729 skills today, growing fast. If Arcanea becomes the **default premium skill/persona/payments layer** for the OpenClaw ecosystem, every Claw becomes a potential Arcanea customer.

## The Millions/Billions Thesis (the actual math)

**Today**: OpenClaw has ~13,729 skills, ~unknown active installs (likely tens of thousands).

**Why this scales**:
1. OpenClaw is the most active personal-AI-assistant framework on GitHub right now (4.3k stars, 1.2k forks, 182k commits — the "Linux of personal AI" pattern)
2. 65%+ of skills wrap MCPs — MCPs ARE the OpenClaw extension model
3. ClawHub uses vector search via OpenAI embeddings — discoverability is solved
4. Native messaging on 20+ platforms removes the platform-adapter problem
5. Each Claw user has a private namespace for memory — multi-tenant from day one

**Arcanea's wedge**:
1. **Narrative coherence** — Luminor + Guardian + Arc/Nea is a complete *world*, not utility skills. Users adopting Lumina aren't just installing a tool, they're entering a creative universe.
2. **Quality bar** — Guardian review (per Frank's `feedback_quality_standard`) means our skills ship with a level of care most community skills don't have.
3. **Economic layer** — Arc/Nea + .nea contracts give creators a way to monetize that doesn't exist in vanilla ClawHub.
4. **Aesthetic** — Atlantean Teal + Geist + glass UI is recognizable across surfaces. Brand consistency on a substrate that's normally chaotic.

**Distribution math**:
- ClawHub vector search will surface our skills if descriptions are good
- Each skill installed = a soft ad for the Arcanea ecosystem
- Persona bundles (Lumina/Jarvis/Sage) compound — a Lumina user is more likely to install other `arcanea/*` skills
- If 5% of OpenClaw users adopt at least one Arcanea skill, and OpenClaw reaches 1M users in 2026 (plausible given the curve), that's 50,000 Arcanea users — without us building any messaging infrastructure.

## What's Possible TODAY (zero new build)

If a user has Arcanea repo cloned + OpenClaw running:
- ✅ Use `kilo` MCP from inside Claude Code to drive OpenClaw remotely
- ✅ Use `kilocode-bridge` skill to delegate tasks to Kilo Code
- ✅ Use `kiloclaw-bridge` skill to drive hosted KiloClaw on `kilosessions.ai`
- ✅ All 280+ skills usable inside Claude Code
- ❌ Distribute Arcanea skills via ClawHub (not yet published)
- ❌ Lumina available on Telegram/WhatsApp without manual setup
- ❌ Per-skill billing via .nea contracts

## What's Possible with Claude Code, Cowork, Claude Design (corrected)

| Surface | Status | Note |
|---|---|---|
| **Claude Code** | ✅ full | Native — everything works |
| **Cowork** | ✅ full | Skills auto-discovered (verified in this session's system reminders) |
| **Claude Design** | 🟡 partial | Design agents (architect/generator/motion/imagery/verifier) work in Code, need Figma plugin to ride Design fully |
| **OpenClaw / ClawHub** | ❌ | Need to publish — ARC-76 blocks (npm login) |
| **Browser (claude.ai)** | 🟡 partial | Skills work as Claude Skills; needs project-level packaging |

OpenClaw is the **largest unrealized distribution channel** for Arcanea. Everything else is already covered.

## Open Questions (corrected from previous doc)

1. **Namespace strategy** — `arcanea/<skill>` confirmed as canonical, but which 50 skills publish first? (Frank's call)
2. **MCP publishing path** — `npm login` (ARC-76) is the literal blocker. Manual one-time. Frank-only step.
3. **Pricing/billing** — defer until skill registry traction is measured. ClawHub doesn't have native paid skills yet (per public docs); we'd be early.
4. **Custody for `.nea` payments** — same questions as `arc-nea-economic-architecture.md` §6 (chain, signers, audit bar).
5. **Persona naming** — `arcanea/lumina` vs `arcanea-lumina`? Folder structure on ClawHub uses author prefix, so `arcanea/lumina` looks right.
6. **License model** — MIT for everything? Or commercial license for premium personas? Affects fork dynamics.
7. **Cross-Claw memory portability** — if a user has Lobster + Jarvis (two separate Claws), can their Arcanea memory follow them? `starlight-sis` is per-user already; should sync per-account, not per-Claw.

## Tactical Roadmap

```
TODAY:        context7 added to .mcp.json (restart Claude Code to activate)
              this doc shipped (corrects previous false premise)

WEEK 1 (post-Gate-0):
              ARC-76: npm login resolved
              Publish @arcanea/arcanea-mcp v1.0
              Publish @arcanea/memory-mcp v1.0
              Publish @arcanea/registry-mcp v1.0

WEEK 2:       port-skills-to-clawhub.mjs script
              First 10 skills on ClawHub
              `arcanea/lumina`, `arcanea/jarvis`, `arcanea/sage` personas

WEEK 3-4:     Arc + Nea OpenClaw extensions
              Integration with Guardian review pipeline
              Public docs: "Install Arcanea on your OpenClaw" (5-min guide)

MONTH 2:      .nea-based billing (waits on arc-nea Q1+Q2)
              Community skill review queue (Guardian-assisted)
              First creator paid via Arcanea on OpenClaw substrate
```

## The Honest Self-Critique

I built a fictitious `@arcanea/claw` competitor in the previous doc because I didn't research the actual OpenClaw ecosystem before writing. The lesson:

> **Before specifying a substrate, search GitHub for it.** Five minutes of `gh search repos "<thing>"` would have saved a 358-line architecture doc that pointed the wrong direction.

This is now embedded in the autonomous workflow: any time I'm about to design a new "platform" or "ecosystem," I first verify whether the platform already exists. The cost of inventing a parallel is not just wasted writing — it's a strategic error that obscures the real opportunity (in this case: ride OpenClaw's distribution, don't compete with it).

## References

- `https://github.com/openclaw/openclaw` — main runtime, 4.3k★
- `https://github.com/openclaw/clawhub` — public skill registry
- `https://github.com/openclaw/skills` — skill archive (mirror of clawhub.com)
- `https://github.com/VoltAgent/awesome-openclaw-skills` — curated 5,400+
- `https://docs.openclaw.ai/cli/mcp` — MCP CLI docs
- `https://clawhub.ai/{author}/{skill}` — public skill URL pattern
- `wiki/meta/arc-nea-economic-architecture.md` — economic layer (still valid)
- `wiki/meta/openclaw-substrate-distribution.md` — **superseded by this doc**
- `.mcp.json` line 3 — `kilo` bridge already wired
- Memory: `project_kilo_code_bridge`, `kiloclaw-bridge` skill, `project_arcanea_claw_e2e`

## Next Action (single, concrete)

After Gate 0 closes Apr 30, the **first action** is:

```bash
npm login
cd packages/arcanea-mcp
npm publish --access public
```

Then test from a clean OpenClaw install:

```bash
openclaw mcp set arcanea-mcp '{"command":"npx","args":["-y","@arcanea/arcanea-mcp@latest"]}'
openclaw mcp list
# verify arcanea-mcp listed
```

If that works, every other vector is mechanical port work. The npm login is the one human-only gate.
