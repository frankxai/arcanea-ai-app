# Short Status And Handover — 2026-04-10

## What Landed on main

- **3 complete book drafts** deployed to arcanea.ai:
  - The Forge of Ruin (45K words, 4 chapters, Logan co-author)
  - The Tides of Silence (35K words, 3 chapters, Mina Aranicki co-creator)
  - The Heart of Pyrathis (25K words, 2 chapters)
- **Open Library reading system** — multi-book drafts hub + dedicated per-book pages at `/books/drafts/[slug]/`
- **Publishing showcase blog** at `/blog/arcanea-publishing/` with 10 NB2-generated images (noindex)
- **`/arcanea-book-cover` skill** — 5-phase method with Chip Kidd/Mendelsund/Bickford-Smith principles, NB2 default routing, genre-specific heuristics, 8-point validation checklist
- **v2 covers** for Tides of Silence and Heart of Pyrathis using the new skill
- **16→12 Luminor roster update** with domain-role names (separate thread)
- **`book.yaml` manifest format** established for first 3 books with author attribution + AI transparency
- **Publishing House v0.2.0** — 7-gate excellence pass merged

## What Changed This Session

- `book/forge-of-ruin/` — full book architecture + 4 chapters
- `book/tides-of-silence/` — full book architecture + 3 chapters
- `book/heart-of-pyrathis/` — full book architecture + 2 chapters + world bible
- `apps/web/app/books/drafts/page.tsx` — multi-book hub (reads book.yaml)
- `apps/web/app/books/drafts/[slug]/page.tsx` — dedicated per-book showcase
- `apps/web/app/blog/arcanea-publishing/page.tsx` — ecosystem blog (noindex)
- `apps/web/public/images/books/` — 5 book covers (3 books × v1/v2 comparison)
- `apps/web/public/images/blog/publishing/` — 10 showcase images
- `~/.claude/skills/arcanea-book-cover/SKILL.md` — new skill (NOT yet in OSS repo)
- Memory: `feedback_nb2_default.md`, `project_open_library_publishing.md`, `project_forge_of_ruin_book.md`
- Uncommitted (separate thread): Luminor 16→12 roster changes

**Total output this session:** ~120,000 words, 9 polished chapters, 3 novel architectures, 18 images.

## Current Blockers

| Blocker | Owner | Notes |
|---------|-------|-------|
| Supabase Storage buckets exist but `book_covers` table not yet created | Frank | Migration ready to design, not yet built |
| `/arcanea-book-cover` skill lives only in `~/.claude/skills/` — not synced to OSS repo | Frank | Needs decision on location strategy |
| Arcanea skill marketplace is *conceptual only* — no registry API, no install flow, no discovery UI | Frank | Strategic decision needed |
| Community author publishing flow is *not built* — no PR template, no CI quality gate, no contributor guide for books | Frank | Platform-readiness requirement |
| 13 modified files uncommitted from Luminor 16→12 thread | Frank | Separate session, needs its own handover |

## Architectural Question Answered: Skill Location

**Decision framework:**

| Skill Type | Lives In | Synced To |
|------------|----------|-----------|
| **Private workflow** (personal ops, local tooling) | `~/.claude/skills/` only | — |
| **Arcanea-specific public** (book-cover, author, infogenius) | `~/.claude/skills/` AND `oss/skills/arcanea/` | OSS repo at `frankxai/arcanea` |
| **Universal public** (framework-agnostic) | `oss/skills/community/` | OSS repo + skill marketplace |

**Recommendation for `/arcanea-book-cover`:**
→ Move to `oss/skills/arcanea/book-cover/SKILL.md` + keep symlink or copy in `~/.claude/skills/`
→ Part of Arcanea brand skills, canonical source = OSS repo
→ Other creators installing Arcanea get this skill automatically

## Status: Arcanea Plugin + Skill Marketplace

| Component | Status | Notes |
|-----------|--------|-------|
| **OSS repo** (`frankxai/arcanea`) | LIVE | 27+ skills, 40+ agents, 5 CLI integrations |
| **Skill directory structure** | EXISTS | `oss/skills/arcanea/*` with 10 skills |
| **npm package `arcanea`** | EXISTS | Referenced in OSS README badge |
| **Skill discovery / search** | NOT BUILT | No registry, no API, no UI |
| **Skill install flow** | MANUAL | Users clone repo and copy files |
| **Version management** | NOT BUILT | No semver, no updates, no deprecation |
| **Marketplace UI** | NOT BUILT | `arcanea.ai/skills` doesn't exist as marketplace yet |
| **Author submissions** | NOT BUILT | No PR template, no review flow |
| **Analytics / usage tracking** | NOT BUILT | — |

**Verdict:** We have a skill *library* (OSS repo), not a skill *marketplace*. The marketplace is the gap.

---

## Recommended Next Stack

Ordered by dependency — execute top to bottom.

### SPRINT 1 — Foundation (estimated 1 session)

**1. Sync `/arcanea-book-cover` skill to OSS repo**
- Copy `~/.claude/skills/arcanea-book-cover/SKILL.md` → `oss/skills/arcanea/book-cover/SKILL.md`
- Add to `oss/README.md` skill catalog table
- Commit + push to `oss` remote
- Establishes pattern: Arcanea-branded skills live in OSS repo as source of truth

**2. Build Phase 2 database migration (community-ready)**
Create `supabase/migrations/20260410000001_open_library.sql`:
- `books` table (slug, title, tier, status, authors JSONB, ai_metadata JSONB, cover_id)
- `book_authors` junction (many-to-many with profiles)
- `book_covers` table (versioned, storage_tier: git|supabase, generation metadata, approval chain)
- `book_chapters` table (for DB-backed chapters alongside git chapters)
- `book_ratings` (community stars + reviews)
- `guardian_reviews` (5-dimension editorial ratings)
- RLS policies: public read for published, authors write their own, editors approve
- Do NOT apply yet — stage in migrations/ folder, apply when Logan/Mina first publish

**3. Create `book-covers` Supabase Storage bucket**
- Add to `20250101000003_storage_buckets.sql` or new migration
- Public read, RLS-gated write (authors upload to their own book folder)
- 10MB file limit, image/* MIME types
- URL pattern: `book-covers/{book-slug}/v{n}.{ext}`

### SPRINT 2 — Cover Resolver + API (estimated 1 session)

**4. Build `lib/books/cover-resolver.ts`**
- `getBookCover(slug)` returns URL — checks DB first, falls back to git convention
- `registerCover(slug, file, metadata)` uploads to Supabase + writes to `book_covers` table
- `setActiveCover(slug, version)` promotes a version
- Replaces hardcoded `COVER_MAP` in drafts pages

**5. API route `/api/books/covers`**
- `POST` generates + uploads cover (uses the book-cover skill server-side or pre-generated upload)
- `GET` lists all covers for a book (version history)
- `PATCH` approves a cover (editor role required)
- Rate-limited per author (10 generations / 24h)

**6. Update drafts pages to use resolver**
- `apps/web/app/books/drafts/page.tsx` — use `getBookCover` instead of COVER_MAP
- `apps/web/app/books/drafts/[slug]/page.tsx` — same
- Backfill: write git-tier entries for Forge/Tides/Pyrathis into `book_covers` table

### SPRINT 3 — Community Contributor Flow (estimated 2 sessions)

**7. Write `CONTRIBUTING-BOOKS.md`**
- Step-by-step: how to publish a book to Arcanea
- `book.yaml` schema reference
- Directory structure requirements
- Quality gate criteria (what CI will check)
- Attribution requirements
- Review process (community → featured promotion)
- Save to `docs/community/publishing-guide.md` AND `oss/CONTRIBUTING-BOOKS.md`

**8. Build CI quality gate for book PRs**
- `.github/workflows/book-quality-gate.yml`
- Runs on PR touching `book/*/`:
  - Validate `book.yaml` against schema
  - Anti-slop scan (delve/tapestry/nestled density check)
  - AI metadata completeness check
  - License declared
  - Minimum word count per chapter (500+)
  - No orphan chapters (filenames match pattern)
  - No secrets, no binaries outside allowed paths
- PR blocker if gate fails, auto-label if passes

**9. PR template for book contributions**
- `.github/PULL_REQUEST_TEMPLATE/book.md`
- Author attribution
- AI transparency declaration
- Guardian rating self-assessment
- Checklist: manuscript, cover, `book.yaml`, acknowledgments

### SPRINT 4 — Skill Marketplace MVP (estimated 2-3 sessions)

**10. Create `/skills` marketplace page at arcanea.ai**
- `apps/web/app/skills/page.tsx` — browse all skills from OSS repo
- `apps/web/app/skills/[slug]/page.tsx` — skill detail with README, install instructions, metadata
- Source of truth: `oss/skills/` pulled at build time (ISR) or via GitHub API
- Search, filter by category, sort by popularity
- Install instructions per tool (Claude Code, OpenCode, Cursor)

**11. Skill metadata schema** (`skill.yaml`)
- Standardize frontmatter + optional `skill.yaml` for marketplace fields
- Fields: name, description, version, author, category, tool_compatibility, dependencies, license, install_command, usage_examples
- Backfill existing 27 OSS skills

**12. Skill install CLI**
- `npx arcanea install book-cover`
- Pulls from OSS repo, copies to correct location per tool
- Tool detection: detects Claude Code vs OpenCode vs Cursor vs Codex
- Updates `~/.claude/skills/` or equivalent
- Add to npm `arcanea` package

### SPRINT 5 — Ratings + Reviews + Launch (estimated 2 sessions)

**13. Community star ratings**
- `book_ratings` table already in Phase 2 migration
- API: `POST /api/books/[slug]/rate` (auth required, 1 rating per user)
- UI: star widget on book pages, review text area
- Display average + review list

**14. Guardian Intelligence Ratings automation**
- `guardian_reviews` table already in Phase 2 migration
- Background job: when book is submitted for Featured tier, run 5-Guardian LLM pipeline
- Each Guardian scores 0-10 on their dimension, writes brief assessment
- Composite determines badge: Luminor (8.0+) / Master (6.0+) / Apprentice (4.0+)
- Display radar chart on book page

**15. Public launch**
- Promote `/blog/arcanea-publishing/` to indexed (remove noindex)
- Publish to HackerNews, Twitter, Reddit
- Open `arcanea.ai/books/drafts/` for public community submissions
- Invite 3-5 authors to seed the community tier

---

## Build Order Decision (Frank's Call)

The user requested: **"build Phase 2 and Phase 3 before community arrives"**

**Translation:** Build Sprints 1-3 now, defer Sprint 4-5 until first community author is actually waiting.

**Rationale:**
- Sprints 1-3 give Logan and Mina a fully functional publishing path via PR
- Sprint 4 (marketplace UI) requires real usage data to design well — premature without traffic
- Sprint 5 (ratings) requires readers — premature without books they haven't read yet

**Recommended execution:** Sprints 1-3 in next dedicated session (estimated 3-4 hours of focused build time).

---

## Verification Evidence

- `pnpm --dir apps/web run build` — PASSING (3× verified today: drafts hub, v2 covers, skill integration)
- `/books/drafts/` route — LIVE, renders 3 books
- `/books/drafts/forge-of-ruin` — LIVE with v1 cover
- `/books/drafts/tides-of-silence` — LIVE with v2 cover (updated 2026-04-10)
- `/books/drafts/heart-of-pyrathis` — LIVE with v2 cover (updated 2026-04-10)
- `/blog/arcanea-publishing/` — LIVE (noindex)
- NB2 model validated: 3 book covers generated at $0.02 each, portrait-native, best typography of tested models
- Skill auto-activation confirmed: `arcanea-book-cover` appears in system-reminder skill list

---

## Memory Updates This Session

- `feedback_nb2_default.md` — NB2 as default image model
- `project_open_library_publishing.md` — 3-tier publishing architecture
- `project_forge_of_ruin_book.md` — First Open Library book

Still to write after Sprint 1-3:
- `project_book_covers_table.md` — when migration applied
- `reference_community_publishing_guide.md` — when CONTRIBUTING-BOOKS.md shipped
- `feedback_skill_location_strategy.md` — OSS repo as source of truth for branded skills

---

## Next Session Entry Point

Start with: `/ao status` → read this file → execute Sprint 1 items in order.

The Phase 2 migration is the most important deliverable. Everything downstream depends on it. Do that first.
