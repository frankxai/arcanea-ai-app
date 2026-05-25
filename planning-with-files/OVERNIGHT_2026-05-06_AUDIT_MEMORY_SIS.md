# P6 — Memory & SIS Architecture Audit

**Date:** 2026-05-06 evening
**Scope:** auto-memory at `~/.claude/projects/C--Users-frank-Arcanea/memory/` + SIS at `C:/Users/frank/Starlight-Intelligence-System/`

## Headline numbers

| Metric | Value |
|---|---|
| Memory entries on disk | **172** |
| Memory entries indexed in MEMORY.md | ~134 |
| **Index drift (unindexed entries)** | **~38** |
| Total memory size | 346 KB |
| Files >30 days old | 116 (67%) |
| Files >60 days old | 0 (memory started ~mid-March) |
| Oldest entry | `user_profile.md` (2026-03-20) |
| Newest entry | `MEMORY.md` (2026-05-06) |

### Type distribution
| Type | Count | % |
|---|---|---|
| project | 115 | 66% |
| feedback | 43 | 25% |
| reference | 11 | 6% |
| user | 1 | 0.6% |
| decision | 1 | 0.6% |

## Issues found

### M1 — Index drift (HIGH severity)
38 memory files exist on disk but are not referenced in `MEMORY.md`. Since `MEMORY.md` is the auto-loaded summary that future sessions read, **those 38 entries are functionally invisible** even though they consume disk and were written intentionally. Effective memory loss.

**Fix:** Reconcile. Walk the directory, append index entries for the missing ones, decide whether stale ones should be deleted instead. Likely one-time 30-min job.

### M2 — Type imbalance (MEDIUM)
- 115 `project_*` entries for ~50 days of work = **2.3 project entries/day**. Most are session snapshots like `project_mega_session_2026_03_30_31.md` — useful for retrospection but **NOT durably authoritative** about current state.
- Only **1 decision** entry. Decisions should be the highest-trust permanent record. Either decisions aren't being captured, or they're getting filed as `feedback` instead.
- Only **1 user** entry. Frank's profile/preferences should accumulate more dimension over time (preferred tools, current focus, what he's tired of, what excites him). Currently flat.

**Fix:** Bias future memory toward `decision` and `feedback` types. Treat `project_*` entries as expiring (auto-decay after 14 days unless promoted).

### M3 — No decay protocol (MEDIUM)
Nothing prunes stale memory. After 6 months of compounding, MEMORY.md will exceed the 200-line truncation limit (per planning-with-files skill rules) and entries will silently disappear from the read context.

**Current MEMORY.md is at ~134 lines and growing 2-3/day.** At this rate it hits the truncation threshold within 4-6 weeks, after which newest entries get cut.

**Fix:** Memory decay protocol — every 14 days, project_* entries get auto-archived to `memory/archive/YYYY-MM/` and removed from the index. Keep only `feedback`, `decision`, and `reference` permanently in the live index.

### M4 — Known contradictions (MEDIUM)
Spot checks show drift between memory and current truth:

| Memory claim | Current reality | Source |
|---|---|---|
| "oh-my-arcanea is canonical harness" | NOT canonical — it's a product (Ten Gates overlay for OpenCode) | `.arcanea/audits/2026-05-06-strategic-charter.md` overrides |
| "PR #93 unblocked main 2026-05-06" | NEW PR #92 failing same day | gh CLI just-now check |
| "code installed, needs API keys" (Sentry/PostHog/Supabase OAuth) | Live site shows zero analytics fired | curl on prod arcanea.ai |
| "1,530 uncommitted changes in arcanea-flow" | not directly verified this session, but the strategic charter still flags it as a blocker | Cross-ref `.arcanea/audits/2026-05-06-repo-architecture.md` |

**Fix:** Add a "Known stale-when" footnote convention to memory entries that reference current state. E.g. `**Decays-when:** PR #93 lands or main goes red again`.

### M5 — Vaults broken (LOW-MEDIUM)
The `starlight-vault` skill expects vaults at `~/.starlight/vaults/`. **Directory does not exist.** Either the skill is broken or vaults moved.

SIS itself has no `private/vaults/` subdir at the top level either. The vault concept is referenced by skill metadata but no longer instantiated on disk.

**Fix:** Either create the vault directory and start populating, or update the `starlight-vault` skill to reflect the new location. Without vaults, that skill is non-functional.

### M6 — SIS is freshly active (POSITIVE)
SIS is on `main`, with 25 uncommitted files. Most recent commit `2b6266b` from 2026-05-07 00:11 added "JSON-LD Organization + WebSite + SoftwareSourceCode + alternates.canonical" — this is **directly relevant to the live-site SEO gap** found in P5 (no JSON-LD detected on arcanea.ai). The pattern was just shipped to the SIS site; consider porting it to Arcanea.

**SIS top-level:** agents, cockpit, cockpit-zellij, commands, console, context, core, docs, hooks, integrations, memory, noosphere, notes, packages, platforms — confirms it's the **substrate** layer per the strategic charter.

## SIS true value (what it's meant to be)

Reading the strategic charter + AGENTS.md + cross-referencing memory:

> SIS is the **vendor-agnostic substrate** providing persistent memory, voice operator, context engineering, SIP protocol. Every tool (Claude/Codex/Cursor/Gemini/opencode/internal Arcanea agents) reads from SIS. It's the brain stem; arcanea-flow is the spine; vendor harnesses are the limbs.

The "true value" of SIS is **continuity across vendors and sessions**. It's the only thing in the stack that survives a laptop wipe or a model swap. Currently:

✅ Achieved: persistent memory at file-system level, voice-operator (per memory), SIP protocol, agents/skills shared
⚠️ Partial: vault system referenced but not instantiated (M5)
❌ Not yet: SIS not wired to arcanea-flow (per strategic charter Risk #4 — substrate divergence)

**Recommendation:** Frank's instinct to invest here is correct. SIS is the brand moat for the agent ecosystem because it's vendor-portable. Concrete next steps:

1. **Reconcile vaults**: either restore `~/.starlight/vaults/` or formally deprecate the path and update the `starlight-vault` skill to point to the actual canonical location (likely `Starlight-Intelligence-System/private/vaults/` or similar — needs disk archaeology).
2. **Wire SIS↔arcanea-flow**: once arcanea-flow's 1530-uncommitted is triaged (Phase 2 of the strategic charter), make SIS the explicit memory backend for arcanea-flow. Don't let arcanea-flow re-implement memory.
3. **Memory hygiene as a skill**: new `arcanea-memory-hygiene` skill that, on each session start, reconciles MEMORY.md vs disk and proposes decay candidates. Solves M1+M3 forever.

## Memory protocol upgrades (proposed)

Apply these conventions to future memory writes (per the auto-memory rules in this conversation's session preamble):

1. **Every memory file ends with a `Decays-when:` line** if it cites current state.
2. **`project_*` entries default to 14-day TTL** — auto-archive after.
3. **`decision` and `feedback` entries are the durable layer** — bias toward these.
4. **MEMORY.md must be reconciled at every session-end handover** — handover skill should fail if drift > 5 entries.
5. **Add a `provenance:` line for any claim** — memory should record "I learned this from /audit on 2026-05-06" rather than implying omniscience.

## Status: P6 COMPLETE
