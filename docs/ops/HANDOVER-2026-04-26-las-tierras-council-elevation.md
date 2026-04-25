# Handover — 2026-04-26 — Las Tierras Council Elevation + Author Team

> **Companion to `HANDOVER-2026-04-26.md`** (Frank's parallel session — design-system token migration). This handover covers the literary/Author-Team work stream that ran in parallel.
>
> Cold-start briefing. Read end-to-end before doing anything.

## Situation

You are inheriting the literary half of the Arcanea operation cold. Two prior sessions (2026-04-25 and 2026-04-26) shipped a complete first-draft literary novel (**Las Tierras de Luz** by FrankX, with Ana Cancino, with the Arcanea Author Team) and brought it through two full 5-agent council passes. The book is at 9/10 across all 12 chapters per Deep Fiction Master's estimate. The website at `arcanea.ai/books/las-tierras-de-luz` serves the manuscript live with 12 chapters / ~40,866 words. A new `/about` route surfaces AUTHORS_NOTE + GLOSSARY for any book that has them. The Arcanea house pattern for AI-assisted literary work is established (book.yaml + BIBLE + AUTHORS_NOTE + GLOSSARY + clean prose) and propagated to 4 sister books.

Your job is to lead what comes next — canon promotion of Veldoria/Aurevalde to the Realms tier, sister-book BIBLE generation, model-routing discipline, cross-CLI delegation via `/arco`, and the human Venezuelan beta-reader gate that is non-negotiable before publication.

## What's Done — this arc

### Manuscript
- **12 chapters complete and council-elevated.** Live at `arcanea.ai/books/las-tierras-de-luz/<chapter-slug>`.
- All 5 spiritual beats land: Distinction (Ch 1) · Loneliness (Ch 2-6) · Wrong Move (Ch 7-9) · First Contact (Ch 10-11) · Sufficiency (Ch 12).
- `book/las-tierras-de-luz/AUTHORS_NOTE.md` (Tolkien-lineage, Frank's voice).
- `book/las-tierras-de-luz/GLOSSARY.md` (Realms / fauna / address / three notes).
- `book/las-tierras-de-luz/BIBLE.md` (Dialogue Style locked, Council summary).
- `book/las-tierras-de-luz/book.yaml` (Ana Cancino as co-writer, ai_transparency block).

### Council passes
- **Ch 1-3 council** (prior session): 5 agents, 13 surgical elevation edits applied.
- **Ch 4-12 council** (this session): 5 agents (Consciousness FM, Deep FM, Sensitivity Reader, Character Psychologist, World Architect), 11 surgical cuts + Estanque del Acuerdo scene added to Ch 11.
- The convergent #1 cut across 3 reviewers was Ch 7's closing editorial block ("That was the danger") — applied.
- The Estanque del Acuerdo (seasonal pool in el bosquecillo where Mira sees Chispa from outside her own body for the first time) was World Architect's #1 recommendation — applied.

### Skills
- **39 phantom-deleted skills restored** from the 2026-03-11 mass revert (`073bc640^`).
- Verified on disk: `.arcanea/skills/creative/dialogue-mastery/SKILL.md` v2.0 present, all 8 creative skills present (`dialogue-mastery, scene-craft, voice-alchemy, world-build, character-forge, story-weave, revision-ritual, bestiary-nav`), 8 arcanea-core, 15 arcanea/, 2 source-gate, 6 standalone.

### Sister-book pattern
- **AUTHORS_NOTE.md** propagated with customized content per book: Forge of Ruin (with Logan, grimdark register), Tides of Silence (with Mina Aranicki, Le Guin × Ghibli), Heart of Pyrathis (solo, genre mashup), Song of Van Linh (solo, Vietnamese mythology + cultural protocol).

### Live infrastructure
- `apps/web/app/books/[bookId]/about/page.tsx` — new route renders AUTHORS_NOTE + GLOSSARY via ChatMarkdown
- `apps/web/app/books/[bookId]/page.tsx` — adds "Behind the book" link
- `apps/web/app/books/[bookId]/[chapterId]/page.tsx` — defensive `gray-matter` frontmatter parser

### Plan of record
- `planning-with-files/LAS_TIERRAS_REWRITE_PLAN_2026-04-25.md` — 13-section locked plan (Wrong Move design, First Contact design, Academy connection, sensitivity protocol, all decisions on record).

## What's Not Done — pending priorities (ordered)

### Priority 1 — Canonize Veldoria + Aurevalde + Realms tier
**Status: gap surfaced, not yet built.**
`.arcanea/lore/` has Gods, Godbeasts, Guardians, Factions, Leagues, Starbound Crews — but **no `realms/` directory**. Veldoria and Aurevalde exist only in the book's local BIBLE, not in canon. CANON_LOCKED.md has Tier 5 Seven Academy Houses but no Realms tier. Future books that want to draw on these Realms have to discover them book-by-book.

**Action:**
- Create `.arcanea/lore/realms/INDEX.md` (Realms tier of canon, Settling history, corridor mechanics)
- Create `.arcanea/lore/realms/veldoria.md` (Second Settling, Fifth Gate, three regions, destellos cosmology in canon-vocab form)
- Create `.arcanea/lore/realms/aurevalde.md` (Third Gate / Fire-Solar, piedra roja, lost corridor)
- Create `.arcanea/lore/realms/mar-arcano.md` (multi-Realm sea, La Que Espera)
- Update `.arcanea/lore/CANON_LOCKED.md` to add a new Tier (between Tier 4 Dark Lord and Tier 5 Academy Houses) for **Realms of the Kingdom of Light**.

### Priority 2 — Venezuelan beta-reader gate (NON-NEGOTIABLE)
Per AUTHORS_NOTE.md and Sensitivity Reader: two paid Venezuelan women readers with diaspora experience and aligned spiritual formation must read the full manuscript before publication. Their feedback is heard as primary, not vetted. Names appear in next edition. **HUMAN task — agents cannot substitute.**

### Priority 3 — Sister-book BIBLEs
Forge of Ruin, Tides of Silence, Heart of Pyrathis, Song of Van Linh have AUTHORS_NOTE + book.yaml but **no BIBLE.md**. One book per session. Logan looped in for Forge of Ruin. Mina Aranicki for Tides of Silence. Sensitivity protocol pre-staged for Song of Van Linh (Vietnamese readers, parallel to Las Tierras pattern).

### Priority 4 — Model-routing discipline
This session burned Opus 4.7 on tasks that should have routed to Sonnet 4.6 or Haiku 4.5. Council reviewers should be Sonnet (review is reasoning, not new prose). Mechanical edits, frontmatter audits, build verification should be Haiku. Opus reserved for: literary prose drafting, synthesis across many sources, novel architecture decisions.

**Action:** Next agent dispatches must use `model: 'sonnet'` or `model: 'haiku'` parameter on the Agent tool. Document the pattern in the plan as discipline.

### Priority 5 — Cross-CLI delegation via `/arco`
Arco v1.2.0 is installed. Routes to Claude (Max sub), Codex (BYOK GPT-5), Gemini (BYOK), OpenCode (Zen free). **Not yet leveraged for book work.**

**Strategic uses:**
- **Gemini 2M context** for one-pass full-manuscript canon-consistency check (one window holds full manuscript + BIBLE + CANON_LOCKED simultaneously — finds cross-chapter inconsistencies that 5 separate Claude agents cannot)
- **Codex (GPT-5)** for editorial second opinions from a different model lineage
- **OpenCode (Zen free)** for routine work that should not burn Max sub credits

### Priority 6 — Active skill loading
The 39 restored skills sit on disk passively. Agent dispatches don't auto-load them. Next council pass should explicitly load `.arcanea/skills/creative/dialogue-mastery/SKILL.md` etc. into agent briefs to actually steer the work.

### Priority 7 — Frontmatter consistency
Ch 1-3 of Las Tierras have YAML frontmatter (restored by user during this session). Ch 4-12 do not. The defensive frontmatter parser handles both, but the inconsistency should be reconciled. Decide: add frontmatter to Ch 4-12 or remove it from Ch 1-3.

## Critical Context

- **Cached-Belief Validation Protocol** (CLAUDE.md): any claim about CURRENT state requires same-turn verification. Memory is authoritative for intent/strategy/decisions, NEVER for current state of code/deploys.
- **Mass-revert protection**: stage specific files, never `git add .`. The 2026-03-11 incident (`073bc640`) nuked 4,517 files. Do not repeat.
- **Push to `origin` (arcanea-ai-app), never `records`.**
- **NEVER add Co-Authored-By** claude-flow / ruvnet / etc. Arcanea is sovereign.
- **Parallel sessions:** Frank often runs multiple Claude Code instances simultaneously. Files written by one session can appear in another's git status. Coordinate via commit boundaries — stage specific paths only.
- **CLAUDE.md was modified this week** to reference TASTE.md and DESIGN.md as new top of the source-of-truth ladder. Read the current version, not memory.
- **16GB RAM machine, 4-5 max concurrent Claude instances.** Check RAM before parallel agent dispatches (`cat /proc/meminfo | grep MemFree`). If < 2GB free, work sequentially.
- **Vercel auto-deploys on push to main.** Project `prj_bg70JJwiuYTOyP1oX2ddiatX1O95`, team `team_q6LNT6rnFRlqlcjBJ2Wxz6PE`, prod URL `arcanea.ai`. Verify state via `mcp__claude_ai_Vercel__list_deployments`.
- **Today's date is 2026-04-26.**

### Frank's locked editorial preferences
- Dialogue convention for Las Tierras: Spanish raya throughout, no brackets, no inline translation. McCarthy/García Márquez/Cisneros lineage.
- Author-Team manifest claim is now true across all 12 chapters (after this session's Ch 4-12 council pass closed the gap).
- Author credit hierarchy: FrankX (creator-and-director), Ana Cancino (co-writer), Arcanea Author Team (multi-agent draft team). Cover when published: "By FrankX, with Ana Cancino." Agents in colophon, never on cover.
- "The percentages do not interest me. The decisions were mine and Ana's."

## Next Actions (ordered)

1. Read this handover + Frank's parallel `HANDOVER-2026-04-26.md` (design-system stream)
2. Read the canonical protocol stack — verify current versions on disk: root `CLAUDE.md`, `.arcanea/CLAUDE.md`, `book/CLAUDE.md`, `apps/web/CLAUDE.md`
3. Read `.arcanea/MASTER_PLAN.md` (per memory `feedback_session_protocol` — non-negotiable before any work)
4. Read `planning-with-files/LAS_TIERRAS_REWRITE_PLAN_2026-04-25.md`
5. Read `book/las-tierras-de-luz/BIBLE.md` + `AUTHORS_NOTE.md` + `GLOSSARY.md`
6. Verify live state: fetch `arcanea.ai/books/las-tierras-de-luz/about` (renders AUTHORS_NOTE + GLOSSARY) and `arcanea.ai/books/drafts` (shows 12 chapters / ~40K words for Las Tierras)
7. Decide priority with Frank: canon Realms tier, OR Gemini full-manuscript canon-check via `arco`, OR first sister-book BIBLE (Forge of Ruin with Logan)
8. Apply model-routing discipline on all dispatches: Sonnet for review, Haiku for mechanical, Opus for prose only

## Files to Read First (literary stream)

- `docs/ops/HANDOVER-2026-04-26-las-tierras-council-elevation.md` — this file
- `docs/ops/SHORT_STATUS_AND_HANDOVER_2026-04-25-las-tierras-complete.md` — yesterday's handover, deeper context
- `planning-with-files/LAS_TIERRAS_REWRITE_PLAN_2026-04-25.md` — book plan
- `book/las-tierras-de-luz/BIBLE.md`
- `book/las-tierras-de-luz/AUTHORS_NOTE.md`
- `book/las-tierras-de-luz/GLOSSARY.md`
- `book/las-tierras-de-luz/chapters/01-12-*.md` — manuscript
- `.arcanea/lore/CANON_LOCKED.md` — note absence of Realms tier
- `.arcanea/skills/creative/dialogue-mastery/SKILL.md` — restored, currently passive

## Repo Map

| Repo | Purpose | State |
|---|---|---|
| `frankxai/arcanea-ai-app` (origin) | Production Next.js site → `arcanea.ai` via Vercel | Live, healthy. HEAD: `4b654c89` (Frank's error-boundaries). Last manuscript commit: `59a6fdc0` (Ch 4-12 council pass + Estanque). |
| `frankxai/arcanea` (oss) | OSS ecosystem | Tracked via `oss` remote |
| `frankxai/arcanea-records` (records) | Music studio | NEVER push here |
| `~/Starlight-Intelligence-System` | SIS canonical, v6.0.0 (2026-04-16) | External |

## Memory pointers

- `feedback_session_protocol` — read MASTER_PLAN.md before ANY work
- `feedback_mass_revert_protection` — git diff scope discipline
- `feedback_arcanea_flow_usage` — claude-flow MCP + Agent tool together
- `feedback_no_coauthor_contamination` — Arcanea is sovereign in commits
- `feedback_ship_means_ship` — "put on website" = commit + push + deploying
- `feedback_dependabot_guardrails` — never batch major version bumps
- `feedback_quality_standard` — 7-gate excellence filter
- `feedback_dialogue_lock` (this session) — raya + glossary + no inline translation

## Closing note

The book exists. The pattern is set. The infrastructure surfaces it. Las Tierras de Luz at 12 chapters / 9-of-10 council-elevated is the largest single creative artifact this operation has produced — and it sits inside the larger Arcanea world that has not yet been told it has a new Realm.

Promote Veldoria. Continue. Lead.

— Handover prepared 2026-04-26 by Opus 4.7 in the closing turn of the session that completed and elevated the manuscript.
