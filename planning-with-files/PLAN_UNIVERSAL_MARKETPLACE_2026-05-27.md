---
title: PLAN — Universal Agentic Marketplace + May-2026 Model Refresh
status: planning (NOT executing — awaits Frank ratification)
operator: Claude Opus 4.7 + WebSearch research pass
generated: 2026-05-27
supersedes: Earlier MULTI_RUNTIME.md scaffold in claude-skills-library (which was cosmetic + Claude-centric — see Honest Acknowledgment below)
---

# Universal Agentic Marketplace — Plan

> Plan-first. No commits, no PRs, no renames until Frank ratifies.
> Acknowledgment: my earlier sweep shipped narrow Claude-centric stuff without researching the 2026 ecosystem. This doc corrects that.

---

## 🔴 Honest Acknowledgment

Earlier today I shipped:
1. `claude-skills-library/MULTI_RUNTIME.md` + 6 per-runtime guides (commit `f1b614b`)
2. Multiple models.yaml refreshes (PRs #136, #137 merged)

**Both were premature.** The gaps:

| Gap | What I did | What I should have done |
|---|---|---|
| **Repo name** | Treated `claude-skills-library` as the marketplace home | Frank's marketplace is universal; "claude-skills-library" is Claude-locked + skills-only |
| **Scope** | Skills-only framing in MULTI_RUNTIME.md | Marketplace should house plugins, agents, commands, hooks, MCPs, workflows, personas — not just skills |
| **Research** | Used training-data assumptions about Gemini 3 / runtime formats | Should have WebSearched for May-2026 ground truth |
| **Standards** | Wrote a custom "universal" guide | `agentskills.io` is the existing OPEN STANDARD (Anthropic-originated, OpenAI/Cursor/Copilot/Codex/CLI all adopted) — should conform, not reinvent |
| **Models** | Updated to Gemini 3 Flash | Gemini 3.5 Flash is now GA (released May 19 2026 at Google I/O), 3.5 Pro arrives June 2026 |
| **Runtime intel** | Referred to "Gemini CLI" | Gemini CLI is DEPRECATED; `agy` (Antigravity CLI) is the successor with `plugins` surface |

This plan corrects all six and asks Frank to ratify the path forward.

---

## 🌐 Live state — verified by WebSearch 2026-05-27

### Gemini 3.5 — landed May 19 2026

- **Gemini 3.5 Flash** GA at Google I/O 2026 (2026-05-19)
- 76.2% Terminal-Bench 2.1 · 83.6% MCP Atlas · 84.2% CharXiv Reasoning
- 4× faster than other frontier models · 40% cheaper input/output than Gemini 3.1 Pro
- **Default model for `agy` CLI**
- **Gemini 3.5 Pro** arriving June 2026

### Antigravity ecosystem — May 2026

- `agy` is the **official successor to Gemini CLI** (deprecation announced by Google)
- "Extensions" renamed to "**plugins**" — industry standard convergence
- `agy plugin import gemini` migrates Gemini CLI extensions non-destructively
- Native VS Code + JetBrains integration via Code Assist
- Antigravity 2.0 desktop + Antigravity IDE both shipped at I/O 2026
- Slash commands: `/goal`, `/schedule`, parallel subagents

### Anthropic Claude Code plugin spec — May 2026

- **`.claude-plugin/plugin.json`** is the canonical manifest
- Plugin layout: `skills/`, `commands/`, `agents/`, `hooks/`, `mcps/`, `lsps/`, `monitors/` (top-level — NOT inside .claude-plugin)
- Themes + monitors moved under `experimental:` in 2026 manifest update
- Plugins include: skills, custom agents, hooks, MCP servers, LSP servers, background monitors

### agentskills.io — the open standard

- **Spec authored by Anthropic, late 2025** — released as open standard
- Repo: [github.com/agentskills/agentskills](https://github.com/agentskills/agentskills)
- Spec lives at `agentskills.io`
- **Adopted by**: OpenAI, Cursor, GitHub Copilot, OpenClaw, Codex CLI, Gemini CLI / Antigravity, ~32+ tools
- Format: `SKILL.md` with YAML frontmatter, folder structure (scripts/templates allowed)

### MCP universal protocol — May 2026

- **MCP.so**: 21,469 MCP servers indexed
- Cross-platform: Claude Code, Claude Desktop, Cursor, Windsurf, VS Code (Copilot), Cline, Zed, Replit, Continue.dev — all speak MCP
- **MCP servers are client-agnostic** — one server, all clients
- Evolution from simple fetch tools to full orchestration layers (Kubernetes, codebase analysis, infra navigation)

### Claude Code marketplace ecosystem (verified)

- **`anthropics/claude-plugins-official`** — Anthropic-managed directory
- **claudemarketplaces.com** — community-curated, 170,000+ devs/month
- **netresearch/claude-code-marketplace** — explicitly portable across Claude Code, Cursor, Copilot, Codex, Gemini CLI, 30+ agents
- **affaan-m/everything-claude-code (ECC)** — universal harness for Claude Code, Codex, OpenCode, Cursor
- Frank already has `~/.claude/plugins/marketplaces/agentic-creator-skills/` with 8 plugin categories — this is the existing foundation

---

## 🎯 The strategic question

Frank's marketplace shouldn't try to be **a new infrastructure**. It should be **opinionated curation + ACOS positioning** layered on top of:
1. **agentskills.io** for skill format
2. **`.claude-plugin/plugin.json`** for Claude Code plugin spec
3. **MCP** for universal tool-calling
4. **Per-runtime adapters** auto-generated from canonical source

The MOAT is curation + Frank's brand + multi-runtime sync infrastructure. NOT the spec.

---

## 🏛️ Architecture options

### Option A — Rename + restructure `claude-skills-library`

Keep the existing repo, rename it, restructure to follow agentskills.io + plugin spec.

**Pros:**
- Existing GitHub stars / forks / URLs preserved (via repo rename redirects)
- 98 skills already in place — pure reorg, no content migration

**Cons:**
- Repo rename is irreversible-ish (URL changes propagate)
- "library" suffix still implies it's a passive collection, not a living marketplace

**Name candidates:**
- `acos-marketplace` (Agentic Creator OS Marketplace — Frank's existing brand)
- `agentic-creator-os` (already exists — consolidation)
- `arcanea-marketplace` (Arcanea-anchored)
- `creator-stack` (descriptive, no brand lock-in)

### Option B — Consolidate into `agentic-creator-os` repo

Frank already has `agentic-creator-os` (the ACOS umbrella). Move `claude-skills-library` content INTO ACOS, retire the standalone repo.

**Pros:**
- One canonical home — clearer brand story
- ACOS already has structure (departments, adapters, etc.) suggesting it's the rightful umbrella
- "ACOS" is Frank's invented term — defensible positioning

**Cons:**
- ACOS may already have its own conflicting structure — needs audit before consolidation
- "Move" is harder than "rename" — content migration + git history

### Option C — Multi-repo, single brand

Keep `claude-skills-library` (rename to `acos-skills`), keep `agentic-creator-os` (the substrate code), add `acos-plugins`, `acos-agents`, `acos-mcps` as separate repos. All published under the `acos.dev` domain (or similar).

**Pros:**
- Each primitive type evolves independently
- Easier for contributors (smaller scoped repos)
- Mirrors how npm/PyPI work (one package per repo possible)

**Cons:**
- More repos = more sync burden
- Frank's policy is consolidation (per repo-cleanup tracks in memory)

### Option D — All three layered (RECOMMENDED)

1. **`agentic-creator-os`** = canonical home + meta-marketplace (manifests + adapters + docs)
2. **`acos-skills`** (renamed from `claude-skills-library`) = the skill content (agentskills.io compliant)
3. **`acos-agents`**, **`acos-mcps`**, **`acos-workflows`** = follow-on repos when content volume justifies split
4. **`arcanea-marketplace`** = the public-facing landing page + browse UX (on arcanea.ai/marketplace or its own subdomain)

This is the **layered architecture** that fits Frank's existing structure and the May-2026 ecosystem.

---

## 🏗️ Recommended path — Option D, phased

### Phase 0 — Audit + decisions (this week, before any commits)

- Audit `~/agentic-creator-os/` disk state (deferred from prior sweep)
- Frank ratifies naming (`acos-skills` vs alternatives)
- Frank ratifies repo consolidation strategy
- Frank ratifies brand domain (acos.dev? arcanea.ai/marketplace?)

### Phase 1 — Marketplace foundation (after ratification)

- Add `.claude-plugin/marketplace.json` at root of new canonical marketplace repo
- Add `.claude-plugin/plugin.json` to each existing plugin category (the 8 in agentic-creator-skills)
- Convert existing skills in `claude-skills-library/free-skills/` to agentskills.io spec (most already conform — verify frontmatter)
- Document the import flow per runtime via real adapter scripts (not just docs)
- Single sync CLI: `acos install <plugin-name>` works in any runtime (detects + writes to right path)

### Phase 2 — Multi-runtime adapter generation

- MCP wrapper template + generator script (one source → MCP server for any runtime)
- Codex adapter: AGENTS.md generator
- Antigravity adapter: `.antigravity/plugins/` writer
- Gemini CLI adapter: deprecated but still works for migrations
- Cursor adapter: SKILL.md → .mdc rule converter

### Phase 3 — Public-facing surface

- Landing page on `arcanea.ai/marketplace` (or own subdomain)
- Browse UI showing plugin categories, search, install commands
- Submit/contribute flow (PR-based)
- Star/rating/usage metrics (optional)

### Phase 4 — models.yaml comprehensive refresh

After research:
- `arcanea-gemini-pro`: `gemini-3.1-pro-preview` → `gemini-3.5-pro` (when GA June 2026; preview-tag for now)
- `arcanea-gemini-flash`: `gemini-2.5-flash` → `gemini-3.5-flash` (GA May 19 2026 — confident bump)
- Image generation: add `gemini-3.5-flash-image` if released (verify)
- legacy_defaults openrouter + google: → `gemini-3.5-flash`

---

## 📋 Decision asks — explicit, ordered

### D1. Repo strategy — Option A, B, C, or D?

**My recommendation:** D (layered architecture, but start with just A — rename existing repo — and grow into D as content scales).

### D2. New repo name for `claude-skills-library`?

**My ranked recommendation:**
1. `acos-skills` (lowest friction; "acos-" prefix unifies with existing ACOS naming)
2. `agentic-skills` (no brand lock; more SEO-friendly)
3. `arcanea-skills` (Arcanea brand consolidation; pairs with arcanea.ai/marketplace)
4. `creator-stack-skills` (positioning around "creator stack" terminology)

### D3. Should existing `agentic-creator-os` repo become the canonical marketplace umbrella?

If yes: I'd audit its disk state next, then plan the consolidation. If no: it stays as the substrate code repo and we don't touch it.

### D4. models.yaml — bump Gemini 3.5 Flash to gateway primary + legacy_defaults now?

This is a tight win — 3.5 Flash is GA, 4× faster, 40% cheaper. Should I ship as a focused PR (similar to #136, #137)?

### D5. Should I open a `WIP` PR to claude-skills-library that **reverts** my earlier `f1b614b` MULTI_RUNTIME.md commit, OR keep it as v0.1 documentation while we plan v1.0?

Three sub-options:
- (a) Revert the commit — clean slate before proper restructure
- (b) Keep as v0.1, label as such, plan v1.0 cleanly on top
- (c) Edit it in place to reframe as "this is interim" pointer to agentskills.io

### D6. Where should Frank's marketplace LIVE on the web?
- `arcanea.ai/marketplace`
- `acos.dev` (new domain)
- `marketplace.arcanea.ai` (subdomain)
- `frankx.ai/stack`

### D7. Should I research deeper before ratification?

I covered: Gemini 3.5, agentskills.io, Anthropic plugin spec, MCP marketplace, Antigravity CLI. Open questions:
- Codex specific plugin format (researched only via Claude Code spec — need direct OpenAI Codex docs check)
- Cursor `.mdc` rule format details (researched at surface level)
- What does `affaan-m/ECC` and `netresearch/claude-code-marketplace` look like internally? Worth deeper inspection as prior art.

---

## 🧠 First-principles framing — what is Frank's marketplace?

A marketplace is **3 things**:
1. **A canonical source of truth** for primitives (skills, plugins, agents, MCPs)
2. **An opinionated curation layer** (Frank's taste + battle-tested patterns)
3. **A multi-runtime distribution layer** (one source → 6+ runtimes)

The infrastructure for (1) and (3) is **mostly solved** by 2026:
- agentskills.io for skill format
- Claude Code plugin manifest for plugin format
- MCP for universal tool-calling
- Per-runtime native discovery mechanisms

**The MOAT is (2) — curation.** What's IN the marketplace + how it's organized + the brand voice. That's what no one else can copy.

This means: don't waste effort reinventing infrastructure. Adopt the open standards. Pour energy into curation + positioning.

---

## 🚀 What I'm NOT doing until you ratify

- NO repo renames
- NO consolidation moves
- NO new commits to `claude-skills-library`
- NO models.yaml Gemini 3.5 bump (despite confidence — it's part of the plan ratification)
- NO arcanea.ai/marketplace landing page work
- NO revert of `f1b614b` (yet)
- NO further multi-runtime documentation until format is decided

---

## ✅ What landed earlier today (kept for record)

These already merged + can't be reverted easily — surfaced as carry-forward:

| Change | State | Plan implication |
|---|---|---|
| PR #135 (planning docs) | ✅ merged main | Keep, refresh for v1 if naming changes |
| PR #136 (Opus 4.7 in 3 places) | ✅ merged main | Keep — Opus 4.7 still correct |
| PR #137 (legacy_defaults: Gemini 3 Flash, Sonnet 4.6, GPT-5 mini) | ✅ merged main | Bump to Gemini 3.5 Flash in next refresh |
| PR #134 (ecosystem foundation) | 📝 draft, conflicts | Independent of this plan, parallel track |
| `claude-skills-library/f1b614b` (MULTI_RUNTIME.md + 7 runtime docs) | ✅ pushed main | Can revert or reframe per D5 |
| `arcanea-flow/feat/namespace-migration` | ✅ pushed origin | Independent of this plan |

---

## 📚 Sources verified

- [Gemini 3.5 Flash launch — Google Blog](https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-3-5/)
- [Gemini 3.5 Flash specs — llm-stats.com](https://llm-stats.com/blog/research/gemini-3.5-flash-launch)
- [Antigravity CLI deep dive — agentpedia](https://agentpedia.codes/blog/antigravity-cli-deep-dive)
- [Gemini CLI → Antigravity transition — Google Developers](https://developers.googleblog.com/an-important-update-transitioning-gemini-cli-to-antigravity-cli/)
- [Agent Skills open standard — github.com/agentskills/agentskills](https://github.com/agentskills/agentskills)
- [Agent Skills explainer — Agensi](https://www.agensi.io/learn/agent-skills-open-standard)
- [Claude Code plugin spec — Anthropic docs](https://code.claude.com/docs/en/plugins)
- [Claude Code marketplace ecosystem — claudemarketplaces.com](https://claudemarketplaces.com/)
- [Anthropic official directory — anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official)
- [Universal marketplace — netresearch/claude-code-marketplace](https://github.com/netresearch/claude-code-marketplace)
- [MCP ecosystem 2026 — Scopir](https://scopir.com/posts/mcp-servers-guide-2026/)
- [MCP.so directory (21,469 servers)](https://mcp.so/)

---

*Plan v1 — 2026-05-27, by Claude Opus 4.7 after WebSearch + first-principles pass. Awaiting Frank ratification on D1–D7 before any execution.*
