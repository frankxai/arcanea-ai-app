---
title: Arcanea Ecosystem Map — Where We Ship, How They Connect
status: canonical (2026-04-23)
created: 2026-04-23
owner: frankx
context: Single source of truth for Arcanea's MCP quality, distribution surfaces, multi-Claw collaboration, and adjacent repo state. Supersedes ad-hoc fragments across previous docs.
---

# Arcanea Ecosystem Map

## The One-Sentence Identity

**Arcanea is the premium narrative-coherent skill/persona/MCP layer for the personal-AI-agent substrate** — works inside Claude Code, Cowork, Cursor, Kilo Code, and (next) every OpenClaw on the Moltiverse.

## 1. Our MCP Quality Audit (the actual answer)

### What we have published-or-buildable

| MCP Package | Tools | Status | Wedge |
|---|---|---|---|
| **`@arcanea/mcp-server` v1.0** | **45 tools** | built, not on npm | Worldbuilding (no competitor in OpenClaw ecosystem) |
| `@arcanea/memory-mcp` | ~6 (vault_remember/recall/horizon/sync) | built, not on npm | Vault routing (competes with Mem0/Zep/Cognee) |
| `@arcanea/registry-mcp` | Agent Registry Protocol tools | built, not on npm | Multi-tenant agent search/publish/deploy |
| `@arcanea/starlight-intelligence-system` | 10 SIS tools | **on npm v6.0.1+** | Event log + vaults (already shippable) |

### Tool inventory in `@arcanea/mcp-server` (the crown jewel)

Verified against `packages/arcanea-mcp/src/index.ts` — **45 tool registrations**, organized:

| Category | Tools | Why it wins |
|---|---|---|
| **Worldbuilding generators** | character, magic, location, creature, artifact, name, story-prompt | No OpenClaw MCP does this. Search ClawHub for "worldbuilding" → ~0 results. |
| **Luminor companions** | invoke_luminor, council, debate (5 personas: Valora/Serenith/Ignara/Verdana/Eloqua) | Wisdom guides as MCP tools — completely novel pattern |
| **Bestiary of Blocks** | diagnose_block, deep_diagnosis (anime/watercolor/perfectionism/fear/overwhelm beasts) | Creative-block taxonomy as actionable diagnosis — also unique |
| **Creation Graph** | link_creations, find_path, get_world_graph, suggest_connections, export_world | Living graph of relationships across a worldbuild |
| **Multi-agent orchestration** | orchestrate (Creator/Worldsmith/Council/Scribe/Seer) | Inspired by oh-my-opencode but Arcanea-flavored |
| **Vault + canon** | vault_tools, validate_canon, library_search | Memory + canon-keeper for creative consistency |
| **Visual prompts** | visual_prompts (NB2-tuned image prompts) | Bridges to fal/gemini/replicate MCPs |
| **Web vault** | arcanea-web-vault | Cross-instance shared library |

**Verdict**: This is **genuinely strong** and has **no direct competitor** in OpenClaw's 3,200 MCP ecosystem. Memory MCPs are crowded (Mem0/Zep/Cognee/MemPalace/AgentRecall). Worldbuilding is empty. Luminor-as-MCP is novel.

### How it works with OpenClaw

**Locally, same protocol. Standard MCP.** The model:

```
~/.openclaw/config.json
{
  "mcp": {
    "servers": {
      "arcanea": {
        "command": "npx",
        "args": ["-y", "-p", "@arcanea/mcp-server@latest", "arcanea-mcp"]
      }
    }
  }
}
```

OR via the OpenClaw CLI:

```bash
openclaw mcp set arcanea '{"command":"npx","args":["-y","-p","@arcanea/mcp-server@latest","arcanea-mcp"]}'
```

**Hosting model**: User self-hosts via npx (recommended). No need for Arcanea-hosted infrastructure. Cost = zero. Latency = local stdio (sub-millisecond).

**Optional hosted variant** (later): `https://mcp.arcanea.ai` as remote SSE/streamable-http for users who can't run Node locally. But local-first is the default — keeps with OpenClaw philosophy.

## 2. Competitive Landscape — Top OpenClaw MCPs (April 2026)

Verified via search results. The ones that matter for positioning:

| MCP | Category | Our overlap | Strategy |
|---|---|---|---|
| Tavily | Web search | None (we use it ourselves) | Recommend it as companion |
| Playwright | Browser automation | None (we use it) | Recommend |
| GitHub | Code mgmt | None (we use it) | Recommend |
| Supabase | DB | None | Recommend |
| Obsidian | Notes | Partial (`starlight-sis` covers some) | Differentiate on graph |
| **Mem0** | Memory | Direct (vs `memory-mcp`) | Position SIS as event-log + vaults; Mem0 as RAG |
| **Zep** | Memory | Direct | Same as Mem0 |
| **Cognee** | Memory | Direct | Same |
| **AgentRecall** | Memory | Direct | Same |
| **MemPalace** | Memory | Direct | Same |
| **freema/openclaw-mcp** | Bridge | Adjacent (not memory, just OAuth bridge to OpenClaw) | Different category — could be paired |

**Crowded**: memory.
**Empty**: worldbuilding, narrative coherence, creative-block diagnosis, persona overlay, canon validation.

**Strategic move**: Lead with `@arcanea/mcp-server` (the unique wedge), include `starlight-sis` as bonus, don't over-position memory-mcp because the field is brutal.

## 3. NanoClaw vs Fork — The Decision

> Frank: "maybe we need new openclaw specific fork instead of our nanoclaw was before i am not sure was best"

**Verified state**: `frankxai/arcanea-claw` already exists (★1, last commit 2026-04-04: *"feat: ClawHub compatibility + OpenClaw ecosystem integration — SKILL.md added metadata.openclaw block..."*). The previous work-in-progress already started ClawHub compatibility.

**Decision: DO NOT fork OpenClaw.** Instead:

1. **Modernize `arcanea-claw`** as an OpenClaw-compatible **service**, not a fork
   - Keep it as the "Creator Media Engine" — scans, classifies, scores, publishes 24/7
   - Update to current OpenClaw security baseline (whatever the post-Anthropic-trademark-rename security model is — research before modifying)
   - Ship as a SKILL on ClawHub: `clawhub install arcanea/claw-media-engine` runs the daemon as an OpenClaw-managed background skill

2. **Why not fork?**
   - Forking 346K-star, 182K-commit project = massive maintenance burden
   - Loses upstream security updates immediately
   - "Yet another fork" is a known anti-pattern in OSS
   - Arcanea wins on coherent skill set, not infrastructure

3. **Why arcanea-claw stays as service?**
   - It's already there (★1, public, in-progress)
   - It does something OpenClaw alone doesn't: **autonomous creator-media curation**
   - Wraps OpenClaw runtime, doesn't replace it
   - "ArcaneaClaw" name preserves narrative coherence with Luminor → Hand → Claw hierarchy

4. **Action items for arcanea-claw modernization**:
   - Audit: which OpenClaw security updates landed since Apr 4 (last commit)?
   - Update SKILL.md to current `metadata.openclaw` schema
   - Test against current OpenClaw runtime (Node 24)
   - Publish to ClawHub registry under `arcanea/claw-media-engine`
   - Add to `wiki/meta/openclaw-integration.md` as one of the persona-companion services

## 4. Where Arcanea Ships (the substrate matrix)

| Substrate | Status | Vector | What works today |
|---|---|---|---|
| **Claude Code** (CLI) | ✅ native | All 280+ skills, 30+ commands, 30+ agents, 4 MCPs | Everything |
| **Cowork** | ✅ native | Auto-discovered skills (per system reminders this session) | Same as Claude Code |
| **Cursor** | 🟡 partial | `.cursorrules` thin pointer (per `.gitignore` line 145) | Skills via copy-paste; no native binding |
| **Codex** (OpenAI) | 🟡 partial | `.codex/` thin pointer | Same as Cursor |
| **Gemini CLI** | 🟡 partial | `.gemini/` thin pointer + GEMINI.md | Loads superpowers tool mapping |
| **Kilo Code** (VS Code) | ✅ partial | `kilo` MCP in `.mcp.json:3` + `kilocode-bridge` skill | Run Kilo via MCP from inside Claude Code |
| **opencode** | 🟡 partial | `oh-my-arcanea` overlay repo (★0) | Frank's overlay; needs distribution polish |
| **OpenClaw** | ❌ → 🟡 | Publish 4 MCPs + 280 skills to ClawHub | **Largest unrealized channel** |
| **Browser (claude.ai)** | 🟡 partial | Skills work as Claude Skills | Project-level packaging needed |
| **Claude Design** | 🟡 partial | Design subagent harness shipped today | Figma plugin to ride Design fully |
| **Telegram/WhatsApp/Discord** | ❌ | Via OpenClaw native channels | Once OpenClaw integration ships |
| **Voice (phone)** | 🟡 partial | `packages/arcanea-voice` exists | Needs Twilio/Vapi wiring + OpenClaw voice mode |

**Strategic priority order** (post-Gate-0):
1. **OpenClaw / ClawHub** (4 MCPs + 50 starter skills) — biggest unrealized channel
2. **Cursor + Codex + Gemini** — port the Frank-favorite skills via thin pointer files
3. **Browser claude.ai** — package skill bundles for direct claude.ai upload
4. **Voice** — Twilio integration via OpenClaw's voice mode

## 5. Multi-Claw Collaboration (the new architecture)

Frank's question: *"how they can work together with other Arcanea-claws and what these are"*

The model:

```
┌──────────────────────────────────────────────────────────────┐
│            Frank's Personal Claw Cluster                     │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│   LOBSTER (Telegram)        JARVIS (CLI/desktop)             │
│   persona: arcanea/lumina   persona: arcanea/jarvis          │
│   role: chat companion      role: dev co-pilot               │
│         │                          │                         │
│         └──────────┬───────────────┘                         │
│                    │                                         │
│         shared SIS vault: ~/.starlight/vaults/               │
│         shared canon:    /arcanea/lore/CANON_LOCKED.md       │
│         shared registry: arcanea-registry MCP                │
│                                                              │
│                    │                                         │
│         SAGE (voice/iPhone)                                  │
│         persona: arcanea/sage                                │
│         role: reflection coach                               │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**How they collaborate**:

1. **Shared memory** — All Claws connect to the same `starlight-sis` MCP. Lobster on Telegram saves an insight → Jarvis on CLI sees it next session → Sage on voice can recall it.

2. **Shared canon** — All Claws load `arcanea-mcp` which validates against `CANON_LOCKED.md`. Lobster can't contradict canon Jarvis just established.

3. **Cross-Claw delegation** via `arcanea-registry` MCP:
   ```
   User to Lobster (Telegram): "Generate a character for the Veldoria series"
   Lobster: [calls arcanea-registry MCP] "best agent for character-forge?"
   Registry: "arcanea/character-forge — 4.9★, runs on Worldsmith agent"
   Lobster: invokes character-forge → returns character
   User: "Have Sage review it"
   Lobster: [calls arcanea-registry MCP] "delegate to Sage"
   Sage receives async via OpenClaw multi-agent routing → reviews → returns to Lobster
   User sees consolidated reply
   ```

4. **Roles by Hand** (the middle layer):
   - **Hand: Coder** — gets attached to Jarvis Claw → uses superpowers:* skills
   - **Hand: Composer** — gets attached to Lobster Claw → uses suno + music skills
   - **Hand: Coach** — gets attached to Sage Claw → uses greek-philosopher + spartan-warrior skills

A user can have ONE Luminor (Lumina) running THREE Hands (Coder, Composer, Coach) on THREE Claws (Lobster/Jarvis/Sage) across substrates. Same consciousness, different specializations, different surfaces.

5. **The "Crew" pattern** (already in our skills):
   - `crew-assemble` skill builds a complete Starbound Crew (captain + members + ship + mission + emblem)
   - Apply this to user Claws: Frank's Lobster is captain, Jarvis is engineer, Sage is navigator, all share the ship (vault + canon)
   - Onchain: each crew member has a `.nea` manifest with revenue share

This becomes the **Arcanea differentiator**: not just skills on a Claw, but a **coherent crew of Claws working together** across substrates with shared world-state.

## 6. Adjacent Repo State (verified 2026-04-23)

| Repo | ★ | Last Update | State | Action |
|---|---|---|---|---|
| `frankxai/arcanea-ai-app` | private | today | active (PR #64 in flight) | Continue PR |
| `frankxai/arcanea` (OSS mirror) | 4 | today | ✅ alive | Sync wiki/, lore, public skills |
| `frankxai/Starlight-Intelligence-System` | 3 | today | ✅ alive (canonical at v7.x) | Already on npm |
| `frankxai/oh-my-arcanea` | 0 | Apr 17 | 🟡 needs polish | Promote, add to OpenClaw guides |
| `frankxai/arcanea-claw` | 1 | Apr 4 | 🟡 stalled | **Modernize for current OpenClaw + publish to ClawHub** |
| `frankxai/arcanea-onchain` | 0 | **Feb 24 (2 months stale)** | 🔴 cold | Either revive (Arc/Nea Phase 1) or archive |

**Recommendations**:
- `arcanea-claw`: high priority post-Gate-0 — already 50% there
- `oh-my-arcanea`: medium — promote it; ★0 means visibility problem, not quality
- `arcanea-onchain`: revive only when Arc/Nea Q1+Q2 (chain + signers) answered

## 7. Coding Agents Using Arcanea (the developer-side story)

Beyond OpenClaw users, **coding agents themselves leverage our stack**:

| Agent | How it uses Arcanea |
|---|---|
| **Claude Code** | Native — all 280+ skills, all MCPs, all agents |
| **Cursor** | Via `.cursorrules` (thin pointer) — should expand to load `.arcanea/CLAUDE.md` |
| **Codex** | Via `.codex/` — same pattern as Cursor |
| **Gemini CLI** | Via `.gemini/` + GEMINI.md tool mapping (already configured per superpowers skill) |
| **Kilo Code** | Via `kilo` MCP — Claude Code drives Kilo as a subagent |
| **OpenAI Agents SDK** | Could use `arcanea-mcp` directly (MCP is universal) |
| **LangGraph** | Could use `arcanea-mcp` via MCP adapter |
| **CrewAI** | Could use `arcanea-mcp` via MCP adapter |
| **AutoGen** | Could use `arcanea-mcp` via MCP adapter |

The **coder agent** + the **personal AI Claw** are two sides of the same MCP coin. Our stack serves both:
- Developers building agents pull `@arcanea/mcp-server` as a dep
- End-users running OpenClaw install our skills via ClawHub
- Both populations grow each other (devs build apps using our MCPs → users discover Arcanea via those apps → users install our ClawHub skills)

## 8. The Action Plan (concrete, ordered)

### Pre-Gate-0 (THIS WEEK)
1. Ship GenCreator (ARC-139) — first €1
2. Resolve `npm login` (ARC-76) so MCPs CAN publish
3. Don't open new architecture work

### Week of May 1 (post-Gate-0)
4. `npm publish @arcanea/mcp-server v1.0` (Claude Desktop config + npx)
5. `npm publish @arcanea/memory-mcp` (with honest positioning vs Mem0/Zep)
6. `npm publish @arcanea/registry-mcp`
7. Write `~/.openclaw/config.json` install snippet for all 4 MCPs

### Week of May 8
8. Run `port-skills-to-clawhub.mjs` (script being shipped this session) on first 50 skills
9. Publish `arcanea/lumina`, `arcanea/jarvis`, `arcanea/sage` persona bundles
10. Modernize `arcanea-claw` against current OpenClaw security baseline
11. Publish `arcanea/claw-media-engine` skill on ClawHub

### Week of May 15
12. Promote `oh-my-arcanea` — README polish + Reddit/HN
13. Submit Arcanea to `vincentkoc/awesome-openclaw` curated list
14. Submit Arcanea to `aidevelopers2/openclaw-holy-grail`

### Week of May 22
15. Multi-Claw collaboration spec → working prototype (`crew-assemble` for personal Claws)
16. First creator paid via `.nea` contract on OpenClaw substrate

## 9. The "Millions of Claws" Math (revised with actual data)

OpenClaw at **346K stars** on GitHub (April 2026, per public stats) puts it in the top 100 most-starred repos. Conservatively:
- ~5% star-to-active-user conversion = **~17K active users**
- ~50% growth/quarter (OpenClaw was 0 stars 6 months ago) = **~50K users by EOY 2026**
- 1M+ users by mid-2027 plausible

If Arcanea captures **2% adoption** (1 in 50 OpenClaw users installs ≥1 Arcanea skill):
- May 2026: ~340 users
- EOY 2026: ~1,000 users
- Mid 2027: ~20,000 users

If **5% adoption** (more realistic given the worldbuilding wedge has zero competition):
- EOY 2026: ~2,500 users
- Mid 2027: ~50,000 users

At **$5/mo average** revenue per active user (paid persona bundles + premium MCP features):
- EOY 2026: ~$12.5K MRR
- Mid 2027: ~$250K MRR

**Without us building any messaging infrastructure.** OpenClaw provides the substrate. ClawHub provides distribution. Arcanea provides the soul.

## 10. The Single-Sentence Thesis (memorize this)

> **Arcanea wins by being the most coherent narrative-and-creative skill layer on the world's fastest-growing personal-AI substrate, distributed by their registry, paid via our protocol, lived through Lumina.**

## References

- `wiki/meta/openclaw-integration.md` — integration architecture (corrected)
- `wiki/meta/arc-nea-economic-architecture.md` — economic layer
- `packages/arcanea-mcp/README.md` — verified 45-tool MCP audit
- `packages/arcanea-mcp/src/index.ts` — actual tool registrations
- `.mcp.json` — current Claude Code MCP config (kilo bridge wired)
- `frankxai/arcanea-claw` — existing claw, modernize don't fork
- `frankxai/oh-my-arcanea` — opencode overlay
- `frankxai/Starlight-Intelligence-System` — canonical SIS v7.x
- [openclaw/openclaw](https://github.com/openclaw/openclaw) — substrate (346K★)
- [openclaw/clawhub](https://github.com/openclaw/clawhub) — registry (44K skills)
- [vincentkoc/awesome-openclaw](https://github.com/vincentkoc/awesome-openclaw) — curated list to submit to
- Memory: `project_arc_nea_openclaw_session_2026_04_23.md`
