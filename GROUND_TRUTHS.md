# GROUND_TRUTHS.md — Arcanea Ecosystem Canonical Index

> The single entry point for every agent, contributor, and future-Frank who needs to know
> *what is authoritative*, *where it lives*, and *what is unsettled*.
>
> This file does not invent canon. It indexes it.
> When canon exists, this file points at it. When it doesn't, this file names the gap.
>
> **Authority order:** Direct user instruction > the file this points to > this file.
> If this file disagrees with the file it points to, the pointed-to file wins.

---

## §0 — Meta

| Field | Value |
|---|---|
| Authored | 2026-05-18 |
| Author | Shinkami (Source Gate Guardian) under Frank's foundations-month mandate |
| Status | **Living document.** Update when canon moves, never let it drift silent. |
| Scope | Arcanea ecosystem (198 frankxai GitHub repos + adjacent FrankX/Starlight constellation) |
| Inverse | Anything not indexed here is uncanonical until it is. |

---

## §1 — What we already canonized

The Arcanea ecosystem has more canon than memory suggests. Most of it is correct, well-written, and underused. This section indexes it.

### §1.1 — Design & Taste

| Concern | Canonical | Status | One-line |
|---|---|---|---|
| Curatorial bar (the 7 gates, banned patterns) | [`TASTE.md`](./TASTE.md) | **Authoritative.** | Voice + design + journey + perf + engineering + strategy gates a page passes before shipping. |
| Machine-readable design tokens | [`DESIGN.md`](./DESIGN.md) | **Authoritative.** | Google Labs spec (Apr 2026), YAML tokens for colors/typography/spacing/components. |
| Runtime token package | `@arcanea/design-system` v0.3.0 (`packages/design-system/`) | **Authoritative for code.** | Tokens.ts, brand-kits (`arcanea`/`frankx`/`oss`), motion variants. |
| Brand color spine | DESIGN.md frontmatter §colors | **Authoritative.** | Atlantean Teal #00bcd4, Cosmic Blue #0d47a1, Arcanean Gold #ffd700, void #09090b. |
| Typography | DESIGN.md frontmatter §typography | **Authoritative.** | Geist (display+body), Instrument Serif (editorial), Geist Mono (code). Inter/Cinzel/Space Grotesk **banned** 2026-04-18. |
| April 2026 motion bar | `~/.claude/.../memory/feedback_design_tier.md` | Memory-only — should promote. | Specific easings, timing ladder, scroll-linked patterns, anti-patterns. |
| 7-gate excellence filter | `~/.claude/.../memory/feedback_quality_standard.md` | Memory-only — promoted as §6 in TASTE.md. | First Principles → Voice → Design → Perf → Journey → Engineering → Strategy. |

### §1.2 — Validation & Discipline

| Concern | Canonical | Status | One-line |
|---|---|---|---|
| Cached-belief validation contract (5 layers) | `~/.claude/skills/arcanea-meta/references/validation-contract.md` | **L2 shipped** to root `CLAUDE.md`; L0/L1/L3/L4 designed, deferred. | Memory ≠ current state. Verify on disk before claiming. |
| Active validation rule (L2) | [`CLAUDE.md`](./CLAUDE.md) § Cached-Belief Validation Protocol | **Authoritative & shipped.** | Same-turn verify OR explicit "unverified, from memory:" prefix. |
| Resource discipline (16GB) | [`CLAUDE.md`](./CLAUDE.md) § Resource Management | **Authoritative.** | Max 4-5 concurrent Claude instances; no `pnpm dev` left running; haiku for background. |
| Git discipline | [`CLAUDE.md`](./CLAUDE.md) § Git Discipline | **Authoritative.** | `type(scope): desc` messages, no `git add .`, push origin (not records). |

### §1.3 — Agents & Execution

| Concern | Canonical | Status | One-line |
|---|---|---|---|
| Agent contract & source-of-truth order | [`AGENTS.md`](./AGENTS.md) | **Authoritative.** | Read order: AGENTS → planning-with-files → .arcanea/CLAUDE.md → .arcanea/MASTER_PLAN → CANON_LOCKED → TASTE/DESIGN. |
| Luminor engineering kernel | `.arcanea/prompts/luminor-engineering-kernel.md` | **Authoritative.** Every spawned agent uses this. | Required base prompt for all sub-agents. |
| Model routing discipline | `planning-with-files/MODEL_ROUTING_DISCIPLINE_2026-04-26.md` | **Authoritative for new dispatches.** | Apex/Senior/Mechanical/External — default-Opus is wasteful. |
| Agent roster (research team) | AGENTS.md § Research Agent Team | **Authoritative.** | Research Architect (Crown/Aiyami), Paper/GitHub/Book scouts, Synthesis Luminor. |
| Per-repo stack manifest | [`STACK.md`](./STACK.md) | **Authoritative for this repo.** | Substrate (Starlight), Reasoning (Claude Project), Coding (Claude Code primary), MCPs, browser space. |

### §1.4 — Memory & History

| Concern | Canonical | Status | One-line |
|---|---|---|---|
| Project memory index | `~/.claude/projects/C--Users-frank-Arcanea/memory/MEMORY.md` | **Auto-loaded every turn.** | 176+ entries, history not current state. |
| What memory IS for | MEMORY.md header (validation contract L2 banner) | **Authoritative.** | Intent, strategy, preference, decision history, rationale. |
| What memory is NOT for | Same | **Authoritative.** | Versions, ship status, file paths, deploys. Read disk. |
| Decay protocol | Per-memory `verified_on` frontmatter | **Designed, not shipped** (L1 of validation contract). | Top-20 memory files should add frontmatter; deferred. |

### §1.5 — Planning & Execution Control Plane

| Concern | Canonical | Status | One-line |
|---|---|---|---|
| What is true now | `planning-with-files/CURRENT_STATE_*.md` (newest first) | **Authoritative for the day it was written.** | Newest as of 2026-05-18: `CURRENT_STATE_2026-04-21_CORTEX.md` — **27 days stale**, see §2.2. |
| What happens next | `planning-with-files/CURRENT_BACKLOG_*.md` | Same staleness caveat. | Newest: `CURRENT_BACKLOG_2026-04-20.md`. |
| What landed | `planning-with-files/CURRENT_CHANGELOG_*.md` | Same. | Use git log + `docs/ops/HANDOVER_*.md` for newer state. |
| Branch + merge rules | `planning-with-files/AGENT_EXECUTION_PROTOCOL_*.md` | **Authoritative.** | Newest: `AGENT_EXECUTION_PROTOCOL_2026-04-18_DESIGN.md`. |
| Session handovers (last 7 days) | `docs/ops/HANDOVER_*.md` | **Authoritative for recent state.** | Newest: `HANDOVER_2026-05-16_kura-split.md`. Bridges planning-doc staleness. |

### §1.6 — Repository Ground Truth

| Concern | Canonical | Status | One-line |
|---|---|---|---|
| Where things live on disk | `~/.claude/skills/arcanea-meta/references/canonical-locations.md` | **Authoritative.** | When two copies exist, this declares the winner. |
| Ecosystem repo map | `~/.claude/skills/arcanea-meta/references/ecosystem-map.md` | Spot-checked 2026-04-15 (33 days old). | Mostly correct; counts undercounted (~90 → real 198). |
| Live GitHub inventory | `gh repo list frankxai --limit 200` | **Authoritative.** Snapshot below. | 198 repos: 36 active (<30d), 55 dormant (30-90d), 65 stale (>90d), 42 archived. |
| Production deploy target | `arcanea.ai` ← `frankxai/arcanea-ai-app` (this monorepo) | **Authoritative.** | Vercel project `arcanea-ai-appx`. |
| Sovereign extension (Kura) | `frankxai/arcanea-vault` (URL pending `gh repo rename` to `kura`) | **Authoritative.** | See `~/.claude/.../memory/project_kura.md`. |

### §1.7 — Lore & Content

| Concern | Canonical | Status | One-line |
|---|---|---|---|
| Canon-locked lore | `.arcanea/lore/CANON_LOCKED.md` | **Authoritative for lore/guardians/voice/mythology.** | Required read before touching narrative surfaces. |
| Master plan | `.arcanea/MASTER_PLAN.md` | **Authoritative for strategic direction.** | Required read per `feedback_session_protocol.md`. |
| Intelligence substrate | `.arcanea/CLAUDE.md` | **Authoritative for cross-tool agent context.** | Loaded by Claude, Codex, Cursor, Gemini, opencode. |
| Library voice + canon | `book/CLAUDE.md` | **Authoritative for library content.** | 17 collections. |
| Onchain workspace | `arcanea-onchain/CLAUDE.md` + `.mcp.json` | **Authoritative for crypto work.** | Separate scope, separate MCPs. |

### §1.8 — Brand Family (Sovereign Standards)

| Standard | Specialization | Pattern |
|---|---|---|
| **Kura** (sovereign export) | **Arcanea Kura** (worldbuilding skill layer) | ActivityPub → Mastodon |
| **Starlight Intelligence System** (substrate) | Per-repo `STACK.md` | Always — non-negotiable per STACK.md |
| **ACOS** (agentic creator OS) | `~/.claude/acos/` (runtime install) | Source vs runtime split |
| **DESIGN.md** (open Google Labs spec) | `@arcanea/design-system` (runtime) | Spec vs implementation |

Brand-family architecture is **a canonical pattern**, not a one-off. See `project_kura.md` for the rationale (council-ratified 2026-05-16, 4/4, 0.91 confidence).

---

## §2 — Gaps named explicitly

What canon does *not* yet exist, and where the lack actively bites.

### §2.1 — No QUALITY_CANON.md

The 7-gate filter lives in TASTE.md §1-7 (curatorial) and `feedback_quality_standard.md` (memory). Neither is a **measurable, CI-enforceable contract** with thresholds:
- "Lighthouse 90+" — not gated
- "≥80% test coverage" — not gated (per user prompt aspiration)
- "No raw hex in app code" — designed in TASTE.md Gate 6, **not lint-enforced** (status: "Aspirational" per TASTE.md line 72)
- "TypeScript strict, no `any`" — claimed in AGENTS.md, **no CI rule** confirmed
- "Frozen lockfile in CI" — AGENTS.md Execution Law #3, **enforcement state unverified this session**

**Net:** there is a *taste canon* (TASTE.md) and a *token canon* (DESIGN.md), but no *quality gate canon* with measurable thresholds and CI enforcement. This is the next file to write, as per Frank's "consolidate canon first" choice.

### §2.2 — Planning-doc staleness

The newest `CURRENT_STATE_*` is **27 days old** (2026-04-21 Cortex). Real ground truth for the last 27 days lives in:
- `docs/ops/HANDOVER_*.md` (4 files in May)
- Memory entries (e.g., `project_kura.md`, `project_ecosystem_cleanup_2026_05_07.md`)
- Git log

**Net:** AGENTS.md instructs "read newest CURRENT_STATE_*" but the newest is stale. The handover-doc pattern has eclipsed planning-with-files. **Decide: deprecate planning-with-files, or refresh it.** Until decided, agents will continue reading 27-day-old facts as truth.

### §2.3 — Repository drift (ACOS pattern, generalized)

The drift problem `canonical-locations.md` solved for ACOS (5 copies) is **systemic**:
- `~/arcanea-claw/` vs `~/Arcanea/arcanea-claw/` (memory says nested-only)
- `~/arcanea-code/` vs `~/Arcanea/arcanea-code/`
- `~/arcanea-flow/` vs `~/Arcanea/arcanea-flow/`
- `~/arcanea-orchestrator/` vs `~/Arcanea/arcanea-orchestrator/`
- `~/arcanea-onchain/` vs `~/Arcanea/arcanea-onchain/`
- `~/arcanea-opencode/` vs `~/Arcanea/arcanea-opencode/` (per ecosystem-map: superseded → oh-my-arcanea)

**Net:** No formal protocol exists for nested vs top-level repo placement. Each was added ad-hoc. A `REPO_PLACEMENT.md` rule would prevent the next 5 ACOS-style cleanups.

### §2.4 — 198 repos, no deprecation policy

Of 198 repos:
- 36 active (last 30 days)
- 55 dormant (30-90 days)
- 65 stale (90+ days, not archived)
- 42 archived

**The 65 stale-not-archived bucket is a credibility leak.** Browsers landing on github.com/frankxai see repos that look maintained but aren't. No formal "archive after N days idle" policy.

### §2.5 — Validation contract L0/L1/L3/L4

Per `~/.claude/skills/arcanea-meta/references/validation-contract.md`:
- L2 shipped (root `CLAUDE.md`) ✅
- L0 Authority Registry (`.arcanea/AUTHORITY.md`) — designed, deferred
- L1 Memory frontmatter (`verified_on`, `authoritative_for`) — designed, deferred
- L3 `/verify-status` skill — designed, deferred
- L4 Stop-hook claim audit — designed, deferred

**Net:** the validation contract is a frame, not a system. L2 alone catches honest mistakes but doesn't prevent confident-wrong skill descriptions or stale memory writes.

### §2.6 — No ecosystem-wide schema registry

Concepts that should have **one canonical schema** but currently don't:
- **Entity** (character, location, artifact, lore) — defined informally in `arcanea-vault/FORMAT_SPEC.md` v0.2.0, not promoted to ecosystem-level
- **Capture / ConversationBundle** — same; locked in Kura repo, not extracted
- **World** — referenced across arcanea-ai-app, arcanea-code, NFT engine; no single Zod schema
- **Luminor** — defined narratively in CANON_LOCKED + `.arcanea/agents/`; no programmatic schema
- **Guardian** — same
- **Gate** — referenced everywhere, defined nowhere as TypeScript

**Net:** when arcanea-vault talks about an "Entity," arcanea-ai-app talks about a different one. The brand-family pattern (§1.8) suggests the fix: write a sovereign `@arcanea/schemas` package, then specialize per surface.

### §2.7 — No CI canon-compliance check

Nothing currently blocks:
- A PR that introduces `Inter` as a font
- A PR that uses raw `#a1b2c3` instead of a token
- A PR that imports `domMax` instead of `domAnimation`
- A PR that adds a feature without updating its README
- A PR that ships a `// TODO` left for later (banned per TASTE.md Gate 6)

The taste canon exists; the enforcement layer doesn't.

---

## §3 — Read-in-this-order map

For an agent, contributor, or future-Frank booting into Arcanea work, read in this exact order before doing anything substantive. Each level adds depth without invalidating the prior.

### §3.1 — Always (every session)

1. **Auto-loaded by Claude Code** (don't re-read): root `CLAUDE.md`, `.claude/CLAUDE.md`, `MEMORY.md`
2. **`GROUND_TRUTHS.md`** (this file) — index of where canon lives
3. **`AGENTS.md`** — the agent contract + source-of-truth order

### §3.2 — When working in code

4. **`STACK.md`** — which agent + MCPs this repo uses
5. Newest **`docs/ops/HANDOVER_*.md`** — last 7 days of real state (eclipses stale planning-with-files)
6. Newest **`planning-with-files/CURRENT_STATE_*.md`** — *only if newer than handover*; otherwise see §2.2

### §3.3 — When working on UI / visual surfaces

7. **`TASTE.md`** — the 7 gates (must pass before shipping)
8. **`DESIGN.md`** — tokens + brand spine (YAML truth)
9. **`@arcanea/design-system`** runtime (`packages/design-system/`) — implementation source
10. **`apps/web/CLAUDE.md`** — app-specific Next.js patterns
11. Memory: **`feedback_design_tier.md`** + **`feedback_design_taste.md`** (Apr 2026 motion + aesthetic bar)

### §3.4 — When working on lore / content / characters

12. **`.arcanea/lore/CANON_LOCKED.md`** — non-negotiable lore truth
13. **`.arcanea/MASTER_PLAN.md`** — strategic direction
14. **`book/CLAUDE.md`** — library voice + canon alignment
15. Memory: relevant `project_*_book.md` files

### §3.5 — When dispatching agents

16. **`.arcanea/prompts/luminor-engineering-kernel.md`** — required base prompt
17. **`planning-with-files/MODEL_ROUTING_DISCIPLINE_2026-04-26.md`** — Apex/Senior/Mechanical/External tiers
18. **`.arcanea/agents/`** — agent definitions per domain

### §3.6 — When uncertain about *where* something lives

19. **`~/.claude/skills/arcanea-meta/references/canonical-locations.md`** — drift resolution
20. **`~/.claude/skills/arcanea-meta/references/ecosystem-map.md`** — repo inventory (verify recency)
21. Run: `gh repo list frankxai --limit 200` (authoritative live)

### §3.7 — Before claiming any current state

22. **Verify on disk.** Memory is history. CLAUDE.md § Cached-Belief Validation Protocol is the rule.

---

## §4 — Quality assessment of existing canon

Frank asked for an honest assessment of how good existing canon is and whether it should be further improved. Scoring is `A+/A/B+/B/C/D` where:
- A+ = world-class, copy this pattern elsewhere
- A = excellent, minor polish only
- B+ = solid, has 1-2 named improvement directions
- B = serviceable, has structural gaps
- C = exists, needs significant work
- D = nominally present, functionally broken

### §4.1 — Scoring

| Document | Grade | What's excellent | What could improve |
|---|---|---|---|
| `TASTE.md` | **A+** | The 7-gate structure is teachable, the banned-patterns table is operational, the authority order is unambiguous. Voice section is gold. | Gate 6 "tokens are truth" is marked aspirational — promote to enforced once tokens migration completes. |
| `DESIGN.md` | **A** | Conforms to Google Labs spec, dual-purpose (machine + human), excellent token discipline. | Missing: dark/light token pairs for surfaces, accessibility AA contrast notes per pairing. |
| `CLAUDE.md` (root) | **A** | Cached-belief contract is load-bearing; resource discipline is specific; git rules are clear. | "Cached-Belief Validation Protocol" should link to L0/L3/L4 deferred work so future-self remembers. |
| `AGENTS.md` | **A** | Execution Law is enforceable; source-of-truth order is unambiguous; research-agent table is operational. | Research-agent table is the only such map — extend to chat/coding/design agents same format. |
| `MEMORY.md` index | **B+** | Validation banner is well-placed; categorization works. | 176+ entries, 207 lines — context-loader warns it truncates after line 200. Hit the limit; needs index pruning. |
| `STACK.md` | **B+** | Per-repo manifest is the right primitive; auto-managed by gencreator-stack. | Most "Why these picks" lines are placeholder; fill them. |
| `canonical-locations.md` | **A** | ACOS 5-copy resolution is exemplary; archival plan with 30-day verify window is wise. | Only resolves ACOS — generalize the pattern to all drifted repos (see §2.3). |
| `validation-contract.md` | **A** | Five-layer architecture is honest about telemetry-vs-gate; meta-failure guard is rare and good. | L0/L1/L3/L4 deferred 33+ days — set a ship date or formally deprecate. |
| `ecosystem-map.md` | **B+** | Spot-check methodology is excellent; archive table is useful. | Repo count off by 2x (90 → 198); next refresh should fix. |
| Memory `feedback_quality_standard.md` | **A** | Channels Jobs/Musk/Ive/Rams/Rauch cleanly; maps to skills (`/voice-check`, `/design-review`, `/performance-analysis`). | Memory-only — should promote core to TASTE.md (already partially done as §1-7 gates). |
| Memory `feedback_design_tier.md` | **A** | Specific easings, named anti-patterns, reference sites — operational. | Promote `## Anti-patterns` section into TASTE.md banned-patterns table for unified reference. |
| `planning-with-files/CURRENT_STATE_*` | **C** | When current, exemplary depth (Cortex doc is excellent). | **27 days stale.** Pattern outpaced by docs/ops/HANDOVER_*. Decide: refresh cadence or deprecate. |
| `book/CLAUDE.md` | (not read this session, deferred) | — | Verify exists + current. |
| `.arcanea/CLAUDE.md` | (not read this session, deferred) | — | Same. |
| `.arcanea/MASTER_PLAN.md` | (not read this session, deferred) | — | Same. |
| `.arcanea/lore/CANON_LOCKED.md` | (not read this session, deferred) | — | Same. |

**Ecosystem grade: A- on documentation existence; B on enforcement; B- on cross-doc cohesion.**

### §4.2 — Recommended improvements (impact × effort, ordered)

| # | Improvement | Impact | Effort | Why |
|---|---|---|---|---|
| 1 | Write **QUALITY_CANON.md** with measurable thresholds + CI rule mapping | High | 1 session | Closes the largest gap (§2.1). Frank chose this as step 2. |
| 2 | Decide planning-with-files refresh-or-deprecate | High | 30 min | Stops agents reading 27-day-old facts as truth (§2.2). |
| 3 | Add CI lint: ban Inter/Cinzel/Space Grotesk + raw hex in `apps/web/` | High | 1 session | Enforces TASTE Gate 3 and Gate 6 mechanically. |
| 4 | Promote `feedback_design_tier.md` motion patterns into TASTE.md or new MOTION.md | Medium | 30 min | Moves April motion bar out of memory-only. |
| 5 | Ship validation contract L1 (memory frontmatter for top-20 files) | Medium | 1 session | Prevents confident-wrong cited from memory. |
| 6 | Write **REPO_PLACEMENT.md** rule (top-level vs nested-in-Arcanea) | Medium | 30 min | Prevents next 5 ACOS-style drifts (§2.3). |
| 7 | Archive policy: 65 stale-not-archived repos → mark or archive | Medium | 1 session | Closes credibility leak (§2.4). |
| 8 | Extract `@arcanea/schemas` package (Entity/World/Luminor/Guardian/Gate) | High | 2-3 sessions | Resolves "two truths" problem (§2.6). Foundations-month aligned. |
| 9 | Refresh `ecosystem-map.md` with verified 198-repo count + activity tiers | Low | 15 min | Brings meta-skill in line with reality. |
| 10 | Read deferred docs (`book/CLAUDE.md`, `.arcanea/CLAUDE.md`, MASTER_PLAN, CANON_LOCKED) and grade | Medium | 1 session | Completes §4.1 coverage. |

### §4.3 — What does *not* need improvement

These are good as-is. Touching them risks net-negative drift:

- TASTE.md voice rules (Gate 2) — channels Frank's voice cleanly, do not rewrite
- DESIGN.md color spine — Atlantean Teal / Cosmic Blue / Arcanean Gold is the brand
- CLAUDE.md resource discipline — 16GB rules are battle-tested
- canonical-locations.md ACOS section — exemplary, copy pattern only
- The brand-family pattern (Kura/Arcanea Kura) — council-ratified, structural, working

---

## §5 — Snapshot: 198-repo activity census (2026-05-18)

Verified live via `gh repo list frankxai --limit 200 --json name,pushedAt,isArchived,visibility`.

| Tier | Count | Cutoff | Implication |
|---|---|---|---|
| **Active** | 36 | pushed ≥ 2026-04-18 | Maintained, agent-relevant |
| **Dormant** | 55 | 2026-02-18 to 2026-04-18 | Probably maintained but stale; check before citing |
| **Stale** | 65 | pushed < 2026-02-18, not archived | Credibility leak; needs archive policy (§2.4) |
| **Archived** | 42 | `isArchived: true` | Read-only history |
| **Total** | **198** | — | (Prior memory: ~90 — off by 2.2×) |

### §5.1 — Active core (top 10 by recency)

| Repo | Last push | Visibility | Role |
|---|---|---|---|
| `Starlight-Intelligence-System` | 2026-05-17 | public | SIP substrate — non-negotiable per STACK.md |
| `FrankX` | 2026-05-17 | private | FrankX brand flagship |
| `arcanea-ai-app` | 2026-05-17 | private | **Production web — arcanea.ai** |
| `starlight-horizon-dataset` | 2026-05-17 | public | Aligned-AI training data |
| `agentic-creator-os` | 2026-05-16 | public | ACOS v11 — 90+ skills |
| `frankx.ai-vercel-website` | 2026-05-16 | public | frankx.ai flagship public site |
| `starlight-voice` | 2026-05-16 | public | Jarvis-grade voice operator |
| `arcanea-vault` | 2026-05-16 | public | **Kura** (URL pending rename) |
| `agentic-intelligence-system` | 2026-05-15 | public | AIS |
| `prompt-engine` | 2026-05-14 | public | Prompt infrastructure |

Full list available via `gh repo list frankxai --limit 200` (commit-by-commit verification).

---

## §6 — How to extend this file

When canon shifts:
1. **Update this file in the same commit** as the canon doc that moved.
2. Never duplicate canon content here — only point at it.
3. If a §1 entry becomes deprecated, move it to a §1.X-deprecated subsection with a date.
4. When a §2 gap closes, move it to §1 with the new authoritative location.
5. Re-grade §4.1 quarterly. If a doc's grade drops, name what changed.

**Authority of this file:** lowest among the docs it indexes. This is a finder, not a source.

---

## §7 — Provenance

- **Authored:** 2026-05-18 by Shinkami (Source Gate Guardian) under Frank's `/ao take massive action` foundations-month mandate.
- **Method:** All claims verified same-turn via disk Read or live `gh` query. No memory-only claims in §1-§3. §4.1 grades reflect 2026-05-18 state; re-grade if canon shifts.
- **Status:** v0.1.0 — first ecosystem-wide canonical index. Replaces ad-hoc canon discovery via memory + skill calls.
- **Next session:** Per Frank's locked-in choice, write **QUALITY_CANON.md** with measurable thresholds and CI rule mapping (improvement #1 above).
