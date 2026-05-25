# Foundations Month — May 2026

**Date:** 2026-05-06
**Frank's call:** May = foundations + architecture. Gate 0 (€1) deferred to June.
**Working principle:** *Velocity without gates is what got us 5-day red main. A month of pure foundation closes those loops, hardens the substrate, and makes June €1 land with confidence instead of repeating April's silent miss.*

> Read alongside `CURRENT_STATE_2026-05-05.md` (active surfaces), `CURRENT_BACKLOG_2026-05-05.md` (W19 sprint), `DECISION_PACKET_2026-05-06.md` (open decisions). This file is the *architectural roadmap* for the month — it doesn't replace the sprint doc, it gives it a spine.

---

## Operating principles (May only)

1. **Foundations over surfaces.** No new product launches. No new monetization sprints. Existing surfaces get hardened, not multiplied.
2. **Gates over velocity.** Every architecture deliverable lands with a gate (CI check, canon validator, capture pulse, lighthouse threshold) that prevents future regression.
3. **One Lumina/Opus session = swarm queen** (locked in W19). Subagents in worktrees. Honors 16GB RAM ≤5 instances cap.
4. **Disk-first verification.** No claim about current state without same-turn `git`/`Read`/`Bash` confirmation. Memory is historical only.
5. **Proof of ship.** Every foundation track ends in a commit + green CI + test/Lighthouse score, not a doc.

---

## Three must-ship foundational tracks (the spine of May)

These three close the loops that opened today's incidents. Without these, June €1 attempt fails for the same reasons April did.

### F1 — Quality Gate that actually works (Week 1, by 2026-05-10)

**Why now:** main was red 5+ consecutive days from 2026-04-30 → 2026-05-06. Two compounding latent issues from PR #87 + #89 broke through because there was no smoke-test feedback loop. PR #93 fixes the immediate causes; F1 ensures it doesn't happen again.

**Subtasks:**
- [ ] Merge PR #93 (CI fix — sitemap routes + Quality Gate turbo invocation)
- [ ] Fix Validate Web pre-existing red:
  - Relax `--max-warnings=0` → tracked weekly target (start at 4000, target 0 by end of May)
  - Add `@smoke` tag to existing playwright tests OR change workflow grep to a tag that exists
- [ ] Add lockfile-drift detection — CI gate that fails if `package.json` modified but `pnpm-lock.yaml` not (memory `feedback_lockfile_drift_pattern`: twice broken main in 2 days)
- [ ] Add cross-tab branch-lock pattern — `.git/branch-lock` advisory file written before long-running commits, checked before push (memory `feedback_cross_tab_race`)
- [ ] Add **Continuity Guardian** as pre-merge canon-conformance check — would have caught Stream A's Celeste + human-Marisol fracture in Las Tierras Ch 1-6 before merge

**Acceptance:** main has been green 7 consecutive merges. Validate Web warnings under 4000. Lockfile-drift gate has caught at least 1 Dependabot PR. Continuity Guardian has run on at least 1 book PR.

### F2 — Capture pipeline restoration (Week 1, by 2026-05-08)

**Why now:** Capture cold ≥14 days. Today's session started with "were all my prompts tracked?" — answer was honest "no, JSONL exists but not summarized to vault." This blocks every other foundation: without capture, May's lessons don't compound.

**Subtasks:**
- [ ] Frank-hand: `/capture` test from Frank to validate end-to-end flow
- [ ] Fix `daily-brief.md` Slack target `#ops` → `#arcanea` (Sprint W19 task #12, trivial)
- [ ] Build Day-3-silence BLOCKER alert — if capture pipeline produces 0 entries for 3 consecutive days, automated PagerDuty-style ping (Sprint W19 task #13)
- [ ] Wire JSONL session auto-summarization → SIS Vault on session end (currently only manual `/handover` does this)
- [ ] Document the pipeline at `docs/ops/CAPTURE_PIPELINE.md` so future cold periods don't require archaeology

**Acceptance:** 7 consecutive days of capture entries in vault. Day-3 alert fires on test silence. Frank can ask "what did I work on Tuesday" and get an answer from vault, not from JSONL grep.

### F3 — Las Tierras canon repair + book-pipeline gate (Week 2, by 2026-05-15)

**Why now:** Wave 2 analysis on 2026-05-06 found canon fracture in Ch 1-6 (Stream A invented Celeste at blue door + made Marisol a 13yr human, both contradicting BIBLE). This is a literary work going to paid sensitivity readers. Cannot ship to readers in fractured state. Book pipeline needs a gate.

**Subtasks:**
- [ ] Dispatch Wave 2 Path B+ agent (~2h, single literary agent on dedicated branch off green main)
  - Track 1: Ch 1-6 canon repair (Bela at blue door, Marisol as dog, Celeste excised, Ch 3 rewrite)
  - Track 2: 5 specific prose cuts (Ch 2 line 85, Ch 3 line 17, Ch 7 line 199, Ch 9 line 231, Ch 12 lines 189-191)
  - Track 3: raya-spacing typography unification
  - **NOT** Ch 1-6 expansion to 3,000w — Rulfo register defensible once canon is correct
- [ ] Wire **Continuity Guardian agent** as pre-merge gate for any `book/**` PR — reads BIBLE, validates chapter against character/setting/canon claims
- [ ] Engage 2 sensitivity readers (Frank-hand: name + €200-300 honorarium each + 2-week window)
- [ ] Add `/print` route for Las Tierras (per Mädchen pattern at commit `1aaa7826`)

**Acceptance:** Las Tierras Ch 1-12 BIBLE-conformant. Continuity Guardian passes on next book PR. Both sensitivity readers have completed first-pass reads on `/books/drafts/las-tierras-de-luz`.

---

## Two should-ship architecture tracks

### A1 — Multilingual Phase 2 full migration (Week 2-3, by 2026-05-18)

**Why now:** PR #87 landed en+de scaffold for homepage + library + about. Phase 2 full migration is W19 P0.7. Foundation for cross-property locale architecture.

**Subtasks:**
- [ ] Dispatch i18n migration agent on `feature/multilingual-apps-web` worktree
- [ ] Per-locale content slugs across all routes
- [ ] JSON-LD with `inLanguage` + `workTranslation` + `arcanea:aiInvolvement`
- [ ] hreflang + sitemap-per-locale + `/llms.txt` per locale
- [ ] Always-visible language switcher
- [ ] Open PR `feature/multilingual-apps-web` → main
- [ ] Add LICENSE + close 8 reviewer items on `@starlight/multilingual` → publish v0.2.0 to npm
- [ ] Phase 3 plan (es + ja) drafted — execution deferred to June

**Acceptance:** `arcanea.ai/de/*` works for 100% of routes. `pnpm test` green on multilingual package. npm publish complete.

### A2 — Living Worlds activation (Week 3-4, by 2026-05-26)

**Why now:** 12 Supabase tables for Living Worlds shipped 2026-04-03 (memory `project_world_graph_deployed`). This is the core invention. It's deployed but not connected to surfaces. Activation = take it from "deployed" to "live for users."

**Subtasks:**
- [ ] Connect `/worlds` route to live World Graph schema
- [ ] Multi-tenant fork API (per memory `project_world_graph_deployed`)
- [ ] World Graph viewer at `/worlds/[id]/graph` (Three.js — extend Brain Atlas pattern)
- [ ] Author Studio "Save World" → World Graph (Supabase write path)
- [ ] At least 3 reference worlds populated (Veldoria, Pyrathis, Aurevalde)

**Acceptance:** A logged-in user can fork Veldoria, modify a node, and see the graph re-render. World Graph schema documented at `docs/architecture/WORLD_GRAPH.md`.

---

## Two stretch architecture tracks (only if F1-F3+A1-A2 ship)

### S1 — MCP product v1.0 (publishable, marketplace-ready)

**Why now:** Per memory `project_mcp_product_team` + `project_mcp_sdk_migration`: SDK 0.5→1.29 needs migration, 47-case switch must die, HTTP transport, marketplace launch. This is OSS distribution leverage.

**Subtasks:**
- [ ] Migrate from MCP SDK 0.5 → 1.29 (4 breaking changes per memory)
- [ ] Replace 47-case switch with `tool()` API
- [ ] Add HTTP transport
- [ ] Publish `@arcanea/mcp` v1.0.0 to npm
- [ ] Submit to MCP marketplace (smithery.ai, claudia)

**Acceptance:** `npx @arcanea/mcp` works in Claude Code, Cursor, Codex. 1 marketplace submission accepted.

### S2 — Voice/Brain Atlas v2 (presence layer hardening)

**Why now:** A5/A6 substrate ready per memory `project_presence_layer_build`. VOICE-1 / VOICE-3 deferred but unblocked.

**Subtasks:**
- [ ] Frank-hand: SIS voice-operator `:7373` boot (per `VOICE_OPERATOR_BOOT_RUNBOOK_2026-04-30.md`)
- [ ] VOICE-1 — Jarvis tool calling (open_url, git_status, system_status, explain_arcanea, write_note)
- [ ] VOICE-3 — HUD overlay state machine on `/room/jarvis`
- [ ] Apps/web imports switched to `@arcanea/presence/*`
- [ ] Vercel voice keys added (Frank-hand: GROQ, OPENAI, ELEVENLABS, ANTHROPIC)

**Acceptance:** `/room/jarvis` works for non-BYOK visitor on production. HUD overlay flips orb→full Jarvis on ask-action.

---

## Frank-hand foundation work (60 min, this week)

These are not architecture but they unblock everything else. Per `feedback_ops_workflow`: agents cannot do them.

| # | Task | Est | Why now |
|---|---|---|---|
| H1 | Drop concurrent Claude Code instances 21 → ≤5 | 5 min | RAM critical (~9.5 GB at 95%); fork() failed during PR push today |
| H2 | Run `scripts/compact-wsl-admin.ps1` from admin PowerShell | 15 min | Recovers 10-25 GB on C: drive (vhdx uncompacted since Apr 29) |
| H3 | Rotate `.npmrc` plaintext token | 10 min | Security debt since Apr 29 |
| H4 | Wire Vercel "Ignored Build Step" in dashboard | 5 min | Cost bleed continues until done (Sprint W19 task #4) |
| H5 | Working-tree commit-or-revert (2,229 dirty lines) | 30 min | Blocks substrate work; CRLF mirage suspected |

**Total:** 65 min Frank time, unblocks 10x more agent capacity.

---

## Out of scope this month (deferred to June or later)

- **Gate 0 €1 binary push** — moved to early June (Frank's call 2026-05-06)
- **Founding Circle launch** — needs Gate 0 first
- **New product surfaces** (Music IS, Vibeclubs, GenCreator, NFT Forge launch) — all deferred until F1-A2 land
- **Content Intelligence System (CIS)** — belongs in FrankX repo, not Arcanea (memory `project_cis_scope`)
- **i18n Phase 3** (es + ja) — June after Phase 2 settles
- **Author Studio "Publish to Git"** monetization — June
- **Trinity AI engagement** — June supportive-only
- **Streaming swarm trace UI** (PR #47 backend → UI gap) — June
- **`@arcanea/orchestrator-pro` monetization fork** — June
- **Las Tierras audiobook Spanish narration** — separate production track, June+

---

## How this month gets measured

A foundation month succeeds when:
1. main has not been red >2 consecutive hours since F1 lands
2. Capture pipeline has 30 consecutive days of entries by end of May
3. Las Tierras Ch 1-12 is canon-conformant + read by 2 sensitivity readers
4. Multilingual de works for 100% of routes; npm publish complete
5. Living Worlds is end-user-forkable on staging
6. ≥1 stretch track shipped (S1 or S2)
7. Decision packet (`DECISION_PACKET_2026-05-06.md`) D7-D9 closed (canon-drift findings resolved)
8. June Gate 0 binary attempt has a clearly named storefront + warm-contact list

If items 1-4 land, May is a success regardless of stretch tracks. If items 1-2 don't land, we have not earned the right to attempt June €1.

---

## Risk register (what blocks May)

| Risk | Mitigation |
|---|---|
| Frank doesn't close idle Claude instances | Cannot dispatch foundation agents. Hard-blocks F1, F3, A1, A2. **Single biggest risk.** |
| Sensitivity readers not engaged in time | Las Tierras stuck in canon-repaired-but-unverified state at end of May. Mitigation: Frank-hand outreach by 2026-05-10. |
| Capture pipeline diagnose fails | F2 slips, May lessons don't compound to memory. Mitigation: structured runbook + 2nd diagnostic attempt by 2026-05-15 if first fails. |
| Continuity Guardian gate too strict, blocks legitimate creative work | Run as warning-only for first 2 weeks before becoming blocking. |
| WSL2 vhdx storage emergency | Mitigation: H2 runs first week. Fail-safe: archive non-essential repos. |
| Cross-tab race recurs | Branch-lock pattern in F1. If still occurs, manual single-session discipline until lock works. |

---

## Cadence

- **Weekly:** `/dawn` Mon, sprint check Wed, `/repo-triage` Fri, `/handover` end-of-day Sun
- **Daily:** capture entries, gate-status check (passes/fails count)
- **Per merge:** Continuity Guardian on `book/**`, lockfile-drift on `package.json` changes
- **Memory:** every architectural decision saved to memory (per session-end protocol)

---

*This is the architectural spine of May 2026. Files supersede where they conflict — `CURRENT_BACKLOG_2026-05-05.md` P0 reframed: "Gate 0 binary by Wed EOD" → "F1-F3 by end of week 1" + "F1-A2 by end of May."*

*Velocity without gates is what got us here. Gates without velocity is the May antidote. Velocity with gates is what June asks of us.*
