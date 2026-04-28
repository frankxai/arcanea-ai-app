---
title: Arcanea Author Studio — Unified Design Spec
date: 2026-04-29
status: DRAFT (awaiting Frank approval to start Phase 0)
author: Shinkami (Claude Opus 4.7)
related:
  - apps/web/app/books/drafts/
  - apps/web/app/books/[bookId]/
  - .claude/skills/design-gods.md
  - .claude/skills/ui-ux-pro-max/
  - .claude/skills/infogenius/
  - .claude/skills/arcanea-nft-pfp/
  - .arcanea/CANON_LIGHTBRINGER_NAMING_LEDGER_v2.md (borrow boldly doctrine)
---

# Arcanea Author Studio — Unified Design Spec

> One product. Six surfaces. Six phases. Borrow boldly, ship fast, compound forever.

## 1. Vision

**Arcanea Author Studio** is the public-facing creator surface for the Open Library — the place where Frank, future authors, and AI agents *co-create* books in the open. Readers see drafts evolving. Creators see a forge canvas where every chapter becomes a multimedia node (text + NB2 image + infographic + Suno track + mindmap link). Authors and world-builders get profile pages that double as portfolios *and* dashboards.

Today we have ~243 lines of drafts hub and ~519 lines of draft detail. Both work but feel like documentation. After this spec executes, they feel like a creative platform.

**North-star user:** A creator lands on `arcanea.ai/authors/frankx`, sees their books, picks "Forge of Ruin", drops into the chapter forge, pastes a Suno link, generates an NB2 image with one click, opens the book mindmap, links a new character node to chapter 3, and publishes — all in one session.

## 2. The Six Surfaces (one product, six routes)

| # | Route | Purpose | Phase |
|---|---|---|---|
| **A** | `/books/drafts/` (hub) | Reader entry — discovery + filter | **0–1** |
| **A** | `/books/drafts/[slug]/` (detail) | Book overview + Outline / Storybook / Map view toggle | **0–1** |
| **D** | `/books/drafts/[slug]/[chapter]/forge` | Creator chapter canvas (NB2 + infogenius + Suno + drops) | **3** |
| **B** | `/authors/[slug]/` | Author profile + their books + capabilities + drops | **2** |
| **C** | `/worlds/[slug]/` | World/universe hub + lore + linked books + map | **2** |
| **E** | `/books/drafts/[slug]/map` | Mindmap (React Flow) — characters, locations, arcs | **4** |
| **F** | `/books/drafts/[slug]/read` | Storybook immersive reader (page-flip, full-bleed images) | **5** |

All seven URLs are wired in Phase 0 as stub routes with "Coming Soon" panels — no dead links anywhere from day one.

## 3. Borrow boldly — the source kit

Per Lightbringer Naming Doctrine v2 (committed 2026-04-28: "borrow boldly, doctrine fix"), we **scaffold from proven open templates and refit them to Arcanea tokens**. We do not invent foundations.

| Need | Borrow from | Why |
|---|---|---|
| Drafts hub layout | **Vercel Platforms Starter** + **shadcn/ui** | Battle-tested multi-tenant content grid. Already aligned with our stack. |
| Hero / sections | **Aceternity UI** (Spotlight, BackgroundBeams), **Magic UI** (Marquee, ShimmerCard) | MIT, ports cleanly to our token system. |
| Author/world profile | **v0 prompt** → "creator portfolio profile with cover, stats, work grid" | Fastest to a working v1, then refit to design-gods palette. |
| Chapter rich text | **Tiptap v3** (already planned per `project_author_studio_strategy` memory) | Block-based, AI-extension-friendly. |
| Mindmap canvas | **React Flow** (xyflow/xyflow, MIT) | Industry standard for graph editors. |
| Storybook reader | **react-pageflip** (MIT) + Tailwind for spreads | One library, one weekend. |
| Real-time co-creation (Phase 6) | **Liveblocks** (free tier, optional) | Add only when we have ≥2 active co-authors per book. |
| Suno embed | Suno's official `<iframe>` embed code | Zero-cost, sanctioned. |
| NB2 image gen | `mcp__fal__generate_image` with `gemini-3.1-flash-image-preview` | Our default per `feedback_nb2_default`. |
| Infographic gen | `/infogenius` skill (existing) | 11 style presets, 5 Guardian directors. |
| NFT PFP for characters | `/arcanea-nft-pfp` skill (existing) | Reuse, do not re-invent. |
| Design judgment | `/design-gods` (single-file at `.claude/skills/design-gods.md`), `/ui-ux-pro-max`, `/frontend-design`, `design-architect` subagent | Already in repo. |

**On `/design-thinking`:** does not exist locally. Recommendation — skip. `/design-gods` + `/ui-ux-pro-max` + `/frontend-design` + `design-architect` already cover the territory. If you want it later, port from a frankx repo as a follow-up; not blocking.

## 4. Data architecture

```
book/<slug>/                 ← source of truth (markdown, manifest, chapters)
├── BIBLE.md
├── book.yaml
└── chapters/01-*.md

apps/web/app/books/drafts/   ← reads book/ at request time (force-dynamic) — KEEP

Supabase tables (existing + new):
  book_reviews       (existing — keep)
  book_ratings       (existing — keep)
  book_attachments   (NEW — chapter_id, type=suno|image|link, url, label)
  book_mindmap_nodes (NEW — book_slug, node_type, label, x, y, refs)
  book_mindmap_edges (NEW — from_id, to_id, edge_type, label)
  authors            (NEW — slug, display_name, bio, cover, links, capabilities[])
  worlds             (NEW — slug, name, summary, cover, palette, primary_book)
```

**Principle:** Markdown stays the canon. Supabase only holds *interaction layer* (reviews, mindmap positions, drops, attachments). Wipe Supabase tomorrow → site still works at full reader fidelity.

## 5. Design system (locked, no debate)

Per `CLAUDE.md` + `design-gods.md` + `feedback_design_taste.md`:

- Primary **Atlantean Teal** `#00bcd4` · Secondary **Cosmic Blue** `#0d47a1` · Accent **Gold** `#ffd700`
- Background `#09090b`, glass cards `bg-white/[0.03] border-white/[0.06] backdrop-blur-sm`
- **Geist** display+body, **Instrument Serif** editorial accent, **JetBrains Mono** code
- **Never** Cinzel, Space Grotesk, Inter
- Framer Motion: `domAnimation` not `domMax`, `expoOut` easing, 60ms stagger, one hero moment per page
- Hz frequencies are backend-only — no Hz numbers visible in the UI (per `feedback_hz_identity`)

All raw hex must come from `@arcanea/design-system` tokens. The `design-verifier` subagent will catch violations on PR.

## 6. Phased plan

### Phase 0 — Scaffold + Stubs (this session, ~60–90 min)
**Goal:** No dead links. Every surface has a route. Drafts hub + detail get a "View as: Outline / Storybook / Map" toggle (Storybook + Map are stubs). Authors/Worlds routes return a "Coming Soon" panel using existing `coming-soon.tsx` component.

**Deliverables:**
1. `app/authors/[slug]/page.tsx` — stub with cover, name, "Books by this author" pulled from `book/*/book.yaml` author match
2. `app/worlds/[slug]/page.tsx` — stub with cover, name, primary book link
3. `app/books/drafts/[slug]/map/page.tsx` — stub
4. `app/books/drafts/[slug]/read/page.tsx` — stub
5. `app/books/drafts/[slug]/[chapter]/forge/page.tsx` — stub, **auth-gated** (Supabase auth check)
6. Drafts detail page: add view-mode toggle UI, links to author/world/map/read
7. Drafts hub: add "Browse by Author" + "Browse by World" sidebar
8. **No new Supabase tables yet** — Phase 0 is pure routing + UI shell.

**Verification:** Existing e2e tests stay green. New `e2e/open-library/author-stub.spec.ts` and `world-stub.spec.ts` confirm 200 + heading.

### Phase 1 — Drafts revamp (week 1)
- Drafts hub: hero, filter chips (status, world, author, tag), Magic UI ShimmerCard grid, "Forge of Ruin" featured slot
- Draft detail: Aceternity Spotlight hero, AI-transparency badge, GuardianReport in liquid-glass card, chapter list with read-time bars
- design-architect → design-generator → design-motion → design-imagery → design-verifier subagent chain
- Lighthouse target: ≥85 mobile, ≥95 desktop

### Phase 2 — Authors + Worlds (week 2)
- `authors` + `worlds` Supabase tables
- `/authors/[slug]/` reads from Supabase, falls back to derived data from `book/*/book.yaml`
- `/worlds/[slug]/` shows linked books, world bible excerpt, lore tags
- **Capabilities chip strip** on author profile: "World-builder · Concept artist · Suno producer · NFT character designer" — each chip is a filter into their drops

### Phase 3 — Chapter Forge canvas (week 3) — *the core unlock*
- `/books/drafts/[slug]/[chapter]/forge` (auth-gated)
- Three-column layout: chapter text (Tiptap, left) · drops gallery (center) · AI tools rail (right)
- **Drops:** paste-Suno-link → live embed; paste-image-URL → preview + save to `book_attachments`; "Generate NB2" button → fal MCP call → save URL
- **AI tools rail:** "Infographic this scene" (`/infogenius`), "Character PFP" (`/arcanea-nft-pfp`), "Worldbuild this location" (canon-check + lore pull)
- Save is autosave to Supabase; markdown stays read-only canon (forge writes to overlays, not the book/ files — humans merge to canon manually)

### Phase 4 — Book Map / mindmap (week 4)
- React Flow canvas at `/books/drafts/[slug]/map`
- Auto-seed nodes from chapter list + character roster (parsed from `book/<slug>/worldbuilding/`)
- Drag-position persists to `book_mindmap_nodes`
- Edge types: appears-in, located-at, descended-from, conflict-with

### Phase 5 — Storybook reader + Universe Map (week 5)
- `/books/drafts/[slug]/read` — react-pageflip immersive mode, NB2 chapter images full-bleed, audio-on-page-turn (optional Suno track per chapter from drops)
- `/worlds/[slug]/map` — cross-book mindmap, links characters/locations across all books in a world

### Phase 6 — Real-time co-creation (ongoing, gated by demand)
- Liveblocks on Tiptap + React Flow when we have ≥2 active co-authors
- AI agent hand-offs: "Send this chapter to the Continuity Guardian", "Ask the Line Editor for a polish pass"
- Comments + threads on chapter blocks

## 7. Userflows (the canonical paths)

### Reader flow
Lands on `/books/drafts/` → filters by world "Pyrathis" → opens "Forge of Ruin" → toggles "View as: Storybook" → reads chapter 1 with NB2 hero image and Suno track playing → leaves a star rating.

### Creator flow (Frank or future author)
Lands on `/authors/frankx` (their dashboard) → sees 3 books in progress → opens "Forge of Ruin" forge view → opens chapter 4 forge canvas → drafts 800 words in Tiptap → drops a Suno link for the chapter's mood track → clicks "Generate NB2" — picks 1 of 3 → autosaves → opens Book Map → adds a new "Ash-Wraith" character node → links to chapter 4.

### World-builder flow
Opens `/worlds/pyrathis/` → sees 3 books anchored to this world → opens the cross-book Universe Map → drags a "Hall of White" location node, links it to Book #6 chapter 2 and Book #1 chapter 9 → returns to the world hub → adds a lore drop ("the Prism-Luxin chromaturgy system was first documented here").

## 8. Skills + agents — who does what

| Phase | Lead skill / agent | Verification |
|---|---|---|
| 0–1 design | `design-architect` subagent (writes brief) → `design-generator` (3 variants via Magic + v0 MCP) → `design-motion` → `design-imagery` (NB2 via Fal) → `design-verifier` (Playwright + Lighthouse) | `design-verifier` blocks merge |
| 0–1 build | `frankx-website-builder` agent + manual edits | `pnpm build` + e2e |
| Forge backend | `coder` agent + Supabase migrations (review by `reviewer`) | unit + e2e |
| AI gen | `mcp__fal__generate_image` (NB2), `/infogenius`, `/arcanea-nft-pfp` | manual taste pass |
| Canon safety | `/canon-check` skill + `Continuity Guardian` agent | runs on every chapter publish |
| Quality | `/quality-standard` 7-gate filter, `superpowers:requesting-code-review` | required before Phase 1 ship |

## 9. Risks + mitigations

| Risk | Mitigation |
|---|---|
| **Scope creep into Liveblocks/real-time** before Phase 3 ships | Phase 6 is hard-gated on "≥2 active co-authors", do not start sooner |
| **Other tabs editing same files** — current git status shows tests modified for books-draft-detail/hub | I'll touch *only* new routes in Phase 0, no edits to `app/books/drafts/page.tsx` or `[slug]/page.tsx` until tabs sync. View-toggle gets added in Phase 1. |
| **16GB RAM** — never run `pnpm dev` while builds run; use Vercel preview deploys | Per CLAUDE.md, enforced |
| **Markdown vs DB drift** in chapter forge | Forge writes to `book_attachments` overlay, never overwrites `book/` files — human merges to canon |
| **Auth not yet enforced on creator routes** | Phase 0 gates `/forge` route with Supabase auth check; if anonymous, redirect to `/auth/sign-in?next=...` |
| **Co-author contamination** in commits | Per `feedback_no_coauthor_contamination`, no `Co-Authored-By: claude-flow` lines |

## 10. Phase 0 acceptance criteria (the only thing we ship today/tomorrow)

- [ ] 5 new stub routes exist and return 200
- [ ] Each stub uses `<ComingSoon />` from `apps/web/components/ui/coming-soon.tsx`
- [ ] Drafts hub has new "Browse by Author / Browse by World" sidebar (links to stub routes)
- [ ] Drafts detail has new view-mode toggle UI (Outline / Storybook / Map) — only Outline is functional, others link to stubs
- [ ] Two new e2e tests added (author-stub, world-stub) — pass
- [ ] All existing e2e tests still pass
- [ ] `pnpm --dir apps/web run build` succeeds
- [ ] No raw hex outside `@arcanea/design-system` tokens
- [ ] Single commit, single PR, conventional message: `feat(open-library): scaffold author/world/forge/map/read routes (phase 0)`

## 11. Open question for Frank (one decision needed)

Phase 0 ships as **read-only stubs with no Supabase changes**. Phase 1 starts the visual revamp. Do you want me to:

**(i)** Execute Phase 0 now in this session, single commit, single PR — *recommended*. Then write a Phase 1 plan in a separate spec.

**(ii)** Skip Phase 0 stubs and jump to Phase 1 (full drafts revamp) directly — riskier, longer, more visible diff.

**(iii)** Skip Phase 0 + 1 and jump to Phase 3 (chapter forge canvas) — fastest path to the high-leverage creator unlock, but means readers see no change.

My pick: **(i)**. Phase 0 takes 60–90 min, gives you visible navigation to all six surfaces, and makes every later phase a non-blocking enhancement.

---

*Spec end. Awaiting Frank's pick of (i) / (ii) / (iii) before any code lands.*
