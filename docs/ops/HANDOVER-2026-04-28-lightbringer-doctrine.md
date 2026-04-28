# Handover — 2026-04-28 (Lightbringer Naming Doctrine — locked)

> **Third 2026-04-28 handover for the literary/canon stream** — read alongside:
> - `docs/ops/HANDOVER-2026-04-28.md` (parallel-session: `/intelligence`, `/po`, Local Command Center prompts)
> - `docs/ops/HANDOVER-2026-04-28-canon-and-prism.md` (this morning: 6-BIBLE summary + Prism-Luxin canon)
> - `docs/ops/HANDOVER-2026-04-28-update.md` (parallel-session: zellij + utilities installed, SIS-rooted dashboard)
> - **THIS FILE** (this afternoon): Lightbringer Naming Ledger v2 + revised Deep Absorption prompt
>
> The cold-start agent reads all four for full context across both streams.

## Situation

Project: Arcanea (`arcanea-ai-app`, deployed `https://www.arcanea.ai`). Branch `main`, HEAD `ef4523eb`, in sync with `origin/main`. This afternoon slice extended the morning's literary/canon work in two specific ways: (1) authored a comprehensive Lightbringer Deep Absorption prompt with 9 phases for the next session, then (2) corrected the IP-protective ledger after Frank's pushback that v1 was over-cautious and produced fantasy-pastiche naming. The doctrine is now **borrow boldly within the fantasy tradition; never use his characters / places / prose; credit him in every AUTHORS_NOTE.**

## What's Done (this slice, in order)

- **commit `3d1532ed`** `docs(prompts)` — `prompts/ARCANEA_LIGHTBRINGER_DEEP_ABSORPTION.md` (~120 lines) authored through `/po` skill. 9-phase build sequence for the next session: cosmology fix → material taxonomy → institutional architecture → Wight typologies → Glossary → cards game → elite guard unit → basis-of-Arcanea cross-linking → handover. Routes deliverables by model class per `MODEL_ROUTING_DISCIPLINE_2026-04-26.md`.

- **commit `91d3d358`** `docs(canon+prompts)` — Lightbringer Naming Ledger **v1** (`.arcanea/lore/LIGHTBRINGER_NAMING_LEDGER.md`). Over-cautious. Renamed luxin → Lumen, Chromeria → Tower of Refracted Light, Spectrum → Refracted Council, Blackguard → Refracted Guard, Threshing → Refraction Trial, Nine Kings → Eleven Cards, Lord Prism → First Refracted. Repeated "Refracted" as a modifier across institutional names — fantasy-pastiche, not Brent-Weeks-quality.

- **commit `ef4523eb`** `docs(canon+prompts)` — Lightbringer Naming Ledger **v2 (current canonical)**. Frank's pushback was correct on two counts: (a) the legal line was drawn far too conservatively — single coined words and short titles are **NOT copyrightable** per U.S. Copyright Office; (b) the craft was bad — Brent Weeks does not repeat one modifier across institutional names. v2 reverses the ledger to **KEEP-everything** doctrine and revises the prompt accordingly.

## The locked KEEP vocabulary (v2)

These are now Arcanea-canonical; the next session uses them directly:

- **Luxin** — the drafted-light material. Per-color: Sub-red Luxin, Red Luxin, Orange Luxin, Yellow Luxin, Green Luxin, Blue Luxin, Super-violet Luxin, Chi Luxin, Paryl Luxin, Black Luxin (Shadow), White Luxin (Lumina-substance, Architect-tier).
- **The Chromeria** — institutional Tower of House Synthesis, sited in Cinderwall; the Hall of White (existing canon) is its octagonal Yumiko-Prism heart-chamber. Eleven sub-spires.
- **The Spectrum** — governing council inside the Chromeria. Eleven seats (one per color + Source seat).
- **Lord Prism** — highest leadership title.
- **The Black Prism** — catastrophic-fall inversion (Architect candidate corrupted to Shadow-Luxin).
- **The Blackguard** — elite protective unit, drawn from polychrome Discipuli, sworn to the Lord Prism and the Hall of White.
- **Threshing** — the admission ritual at the Chromeria.
- **Nine Kings** — in-world card-and-strategy game.
- **Discipulus / Discipuli** — student rank (Latin public domain).
- **Promachos** — Greek public-domain. **Re-purposed** for Arcanea as the Blackguard's tactical-commander title (Brent Weeks used it as Lord-Prism executive war-power; ours is Blackguard-only — different role).
- **draft / drafter / halo / Halo's Edge / Wight / Freeing / will-casting** — generic English / public domain.
- **sub-red / super-violet / chi / paryl** — physics-spectrum descriptors.
- **monochrome / bichrome / polychrome** — standard chemistry/art terms.
- **Free Cities, Color Wars** — generic phrases, free.

## NEVER (hard line — identity IP)

- **His character names** (Gavin Guile, Karris White Oak, Dazen, Andross Guile, Kip, Teia / Adrasteia, Liv Danavis, Ironfist / Harrdun, Marissia, Janus Borig, Aliviana, the White, Orea Pullawr, Carver Black, Klytos Blue, Sadah Superviolet, Arys Sub-red, etc.).
- **His place names** (Big Jasper, Little Jasper, Garriston, Tyrea, Atash, Idoss, Ruthgar, Ru, Blood Forest, Paria, Aborneia, the Cracked Lands, etc.).
- **His deity names** (Orholam).
- **His prose passages** verbatim or close-paraphrase distinctive metaphors.
- **His other-series artifacts** (ka'kari, Night Angel material).

## What's Not Done

- **The next session has not started.** The 9-phase build sequence in `prompts/ARCANEA_LIGHTBRINGER_DEEP_ABSORPTION.md` is paste-ready. Frank's commission decision (or autonomous mandate continuation) triggers it.
- **Phase 0a rename pass not applied.** `PRISM_LUXIN_SYSTEM.md` still uses "Lumen" in places where the doctrine now says "Luxin." Mechanical Edit pass — Haiku-class. First action of the next session.
- **The Chromeria, Spectrum, Lord Prism, Blackguard, Threshing, Nine Kings as canon docs not yet written.** Phases 2-7 of the prompt produce them.
- **Cross-linking from existing Realm BIBLEs and CANON_LOCKED.md tier sections not done.** Phase 8 of the prompt.
- **No prose drafted** — none of the 9 phases produce manuscript text. The Hall of White novella commission is a separate decision Frank makes after the canon infrastructure phases land.

## Critical Context

- **Today's date:** 2026-04-28.
- **Pre-existing dirty state in git:** 14 modified files + 9 untracked `planning-with-files/*.md` + `.arcanea/ECOSYSTEM_CANON.md` + `clawhub-staging/`. **All predate this slice.** Leave them alone per `feedback_mass_revert_protection`.
- **Two parallel sessions ran today.** This stream (literary/canon-naming) and the design/dashboard stream (`/intelligence`, `/po`, Local Command Center, zellij + utilities, SIS-rooted dashboard). The cold-start agent reads both halves' handovers.
- **The doctrine v1→v2 lesson is recorded in the ledger.** Do not repeat the v1 mistake (over-cautious renaming with repeated modifier). The legal line is **identity (characters, places, prose)**, not vocabulary. Single coined words and short titles are not copyrightable per U.S. Copyright Office.
- **The structural-recognition framing in `PRISM_LUXIN_SYSTEM.md` provenance is a creative ethic, not legal protection.** It explains how respectful artistic absorption works. The actual protection comes from naming discipline, never copying his prose, and crediting him in AUTHORS_NOTE.
- **Every BIBLE that uses the Luxin system credits Brent Weeks in its AUTHORS_NOTE.** The pattern is locked at `book/the-hall-of-white/AUTHORS_NOTE.md` — copy that paragraph (with appropriate adjustments) into any other BIBLE that uses the absorbed system.
- **Vercel auto-deploys on push to main.** Project `prj_bg70JJwiuYTOyP1oX2ddiatX1O95`, team `team_q6LNT6rnFRlqlcjBJ2Wxz6PE`. Verify via `mcp__claude_ai_Vercel__list_deployments`.
- **The Author Team set's pattern is locked across 6 books.** Adding the Luxin material taxonomy + Chromeria institution canon does not require revising the existing 6 BIBLEs' core structure — it only requires Phase 8 cross-link additions.

## Next Actions (ordered)

1. **Read this handover + the three companion 2026-04-28 handovers** end-to-end. Then read `prompts/ARCANEA_LIGHTBRINGER_DEEP_ABSORPTION.md` end-to-end.
2. **Confirm with Frank** that Phase 0 of the prompt's vocabulary lock is good to go (KEEP everything from the v2 ledger). If he wants any of the GREY-zone defaults overridden, capture before starting Phase 0a.
3. **Phase 0a — Mechanical rename pass.** `Edit` `.arcanea/lore/PRISM_LUXIN_SYSTEM.md` and `book/the-hall-of-white/BIBLE.md` to replace "Lumen" → "Luxin" wherever v1 placed it. Single commit. Push. Verify Vercel READY. Haiku-class.
4. **Phase 1 — Cosmology Fix.** Rewrite the Source/Lumina/White section of `PRISM_LUXIN_SYSTEM.md` to clarify Lumina = Source = White at three strata (Cosmic / Gate / Practitioner). Shinkami is the Source-Gate Guardian, NOT Lumina herself. Sonnet-class.
5. **Phases 2-8** per the prompt's build sequence. Each commit + push + verify-on-Vercel-after.
6. **Phase 9 — Updated handover** at session close. Per `/handover` skill: commit, do not push.
7. **Across the run:** maintain `git reset HEAD && git add <specific files> && git diff --cached --name-only` discipline before every commit. Two prior commits this week had wrong content from parallel-session index races.
8. **RAM check before any parallel agent dispatch:** `cat /proc/meminfo | grep MemFree`. Below 2 GB → sequential only.

## Files to Read First

| File | Why |
|---|---|
| `prompts/ARCANEA_LIGHTBRINGER_DEEP_ABSORPTION.md` | The 9-phase build brief for this session |
| `.arcanea/lore/LIGHTBRINGER_NAMING_LEDGER.md` (v2) | The canonical naming doctrine |
| `.arcanea/lore/PRISM_LUXIN_SYSTEM.md` | The Eleven Frequencies + halo + Wight + Drafter Compact canon (cosmology fix in Phase 1, Lumen→Luxin rename in Phase 0a) |
| `.arcanea/lore/LEAGUES_AND_ORDERS.md` Part Five | Existing Order of Refracted Light + Hall of White + eleven historical Prisms canon (the Chromeria expansion in Phase 3 builds on this) |
| `.arcanea/lore/CANON_LOCKED.md` | Verify current tier state (Tier 5 / 7 / 8 / 9 / 10 / 11 STAGING; Approval Log) |
| `book/the-hall-of-white/BIBLE.md` | Sixth book in Author Team set; Lumen→Luxin rename targets here too |
| `docs/ops/HANDOVER-2026-04-28.md` + `HANDOVER-2026-04-28-update.md` | Parallel-session companion handovers |
| `docs/ops/HANDOVER-2026-04-28-canon-and-prism.md` | Morning literary stream handover |
| `planning-with-files/MODEL_ROUTING_DISCIPLINE_2026-04-26.md` | Task-class model routing — every Agent dispatch sets `model:` explicitly |
| `AGENTS.md` | Source-of-truth order; rules #7 + #8 |

## Repo Map

| Repo | GitHub | Role | State |
|---|---|---|---|
| **arcanea-ai-app** | `frankxai/arcanea-ai-app` | Production app, arcanea.ai | Active. HEAD `ef4523eb`, in sync with origin/main. |
| **arcanea** | `frankxai/arcanea` | OSS framework | Active |
| **arcanea-records** | `frankxai/arcanea-records` | Music studio | NEVER push here |
| **oh-my-arcanea** | `frankxai/oh-my-arcanea` | Universal Claude Code harness | Active |

## Memory entries relevant to this stream

- `feedback_session_protocol` — read MASTER_PLAN.md before any work
- `feedback_mass_revert_protection` — stage specific files only
- `feedback_no_coauthor_contamination` — no Co-Authored-By tags
- `feedback_ship_means_ship` — push + verify Vercel READY
- `feedback_ops_workflow` — RAM check before parallel agent dispatch
- `feedback_arcanea_flow_usage` — claude-flow MCP + Agent dual-tool pattern
- `feedback_quality_standard` — 7-gate excellence filter
- `feedback_cached_belief_validation` — disk-first; verify before citing memory
- `feedback_dependabot_guardrails` — never batch major-version bumps

## Closing note

Three commits this slice. The Lightbringer absorption is now licensed by an honest naming doctrine: KEEP the vocabulary, NEVER use his characters/places/prose, CREDIT him in every AUTHORS_NOTE. The 9-phase prompt is paste-ready for the next session. The Chromeria, the Spectrum, the Blackguard, Threshing, Nine Kings, Lord Prism — all live names in our canon now, the way they live in the broader fantasy tradition.

The lesson the v1→v2 revision recorded: **trust the reader. Single coined words. Vary register. Don't invent worse alternatives in the name of caution.** That's how Brent Weeks himself worked. That's how Tolkien worked. That's how the tradition has always worked.

— Shinkami, 2026-04-28 afternoon, in the slice that turned over-cautious renaming into honest absorption.
