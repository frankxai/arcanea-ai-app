# Arcanea Web Excellence — Full-Site Audit + World-Class Plan

**Date:** 2026-07-11 · **Scope:** arcanea.ai live production, all hubs (~70 linked routes / 112 route dirs), benchmarked against Higgsfield.ai · **Method:** live browser audit (desktop 1440×900 + mobile 390×844), scripted breadth-pass over every route, console/error capture, codebase inspection (`apps/web`), Higgsfield homepage + MCP teardown.
**Verdict:** Strong foundation (positioning, hero, Gallery/Guardian art, honest Live/Preview labeling, 45-tool MCP, 19 CI workflows) held back by five fixable classes of defect. None require a redesign — they require **enforcement, assets, and editing**.

---

## 0. The Ideal User Profile (design target)

**"The Worldsmith"** — a sophisticated prosumer creator (novelist, game designer, filmmaker, creative technologist) who:
- already pays for 2–4 AI tools (Midjourney/Higgsfield/Suno/Claude) and is tired of stateless chats
- builds **persistent IP** (a universe, a saga, a brand), cares about ownership, consistency, canon
- is comfortable with BYOK and agent tooling, allergic to hype and broken details
- **judges in 60 seconds** by: output quality shown (not claimed), a working path to first artifact, and zero trust-breakers (no "0 public repos", no contradictory numbers, no stale dates)

Secondary ICP: the **agent-native developer** adopting via MCP/CLI/skills.

---

## 1. What is already excellent (protect these)

| Surface | Why it works |
|---|---|
| Hero (`/`) | Prompt-first, cinematic armillary art, 4 action chips, honest stat chips, clean nav. Higgsfield-class. |
| Artifact cards section | Real key art per lane (Realm Gate, Draconis Bond, Portal Trailer…) — "every prompt becomes a connected artifact" is the thesis, shown. |
| `/gallery` | Best page on the site. Specimen-sheet companion cards (Solara, Nerith, Kaelen, Velouria) are a **distinctive, ownable aesthetic**. |
| `/mcp` | Clear dev story, shot-list visual, "43+ tools", agent-handoff framing. |
| `/pricing` | "Sovereign by default. SaaS by choice." $0/$12/$39 — the counter-position to Higgsfield's credit pressure. |
| Honesty system | Live/Preview/Guide/Roadmap badges — rare and trust-building. Keep the system, fix the voice (below). |
| Engineering scaffolding | 19 GH workflows incl. `lighthouse.yml`, `design-fence.yml`, `canon-lint.yml`; JSON-LD on homepage; skip-to-content link; real content-derived stats in `page.tsx`. |
| Design doctrine | `DESIGN.md`: "restrained AI-lab premium… Mythology lives in the content; the chrome stays calm." Correct doctrine — currently under-enforced. |

---

## 2. Findings (evidence-backed)

### Class A — Internal voice leaking into public copy (CRITICAL, copy-only fix)
1. **Homepage "Where each door should point"**: "The homepage now treats readiness as part of the product experience. Creators get a working next step; builders get preview doors; future commerce stays framed as roadmap." + "Frame as builder preview… should be **sold as** hands-on preview until setup, export, and generation are fully tight." → This is a design memo rendered to customers.
2. **Stack section**: "The homepage **should** send builders into clear status paths, not mystery doors."
3. **Engine section**: "…**guide creators** into a stateful universe with working paths today and preview doors marked honestly."
4. `/studio` banner: "The design is final; the ingestion + transformation plumbing lands through **Q2 2026**" — internal roadmap voice **and stale** (Q2 2026 has passed).
5. `/pricing` badge: "PATH C HYBRID ARCHITECTURE" — internal decision label. Tier copy cites "pgvector semantic query database" — engineering-speak.
6. Homepage voice-room cards: "Custom GLSL · 4096-particle shell · sticky-mounted WebGL" — dev changelog as marketing copy.

### Class B — Trust-breaking micro-defects
1. **NumberTicker SSR bug** (`components/motion/number-ticker.tsx`): starts at 0, animates on `useInView`. SSR HTML/crawlers/slow devices see **"0 public repos", "0K+ words of canon", "0 published refs"** — directly contradicting adjacent copy ("6 public on GitHub"). Fix: render final value in SSR, animate as progressive enhancement.
2. **Claim drift across surfaces**: 13 agents (home, /chat, pricing) vs **16 Luminors** (/luminors) vs 7 (voice section); "42 tools" (/developers) vs "43+" (/mcp) vs 45 registered in `packages/arcanea-mcp`; "6 public repos" vs "15 active" vs "27 repos" (/developers); "80 skills" (stack card) vs "42 skills" (/showcase).
3. **Metadata template broken site-wide**: titles render "… Arcanea | Arcanea" (dup suffix); `/academy/courses` → "Academy — Arcanea | Academy"; `/chat` titled "Create"; `/studio/author`, `/studio/image`, `/chat/lumina` have **no brand suffix at all** (3 coexisting title patterns). `/games` = bare "Arcanea | Arcanea", **no h1**; `/roadmap` and `/room/*` missing h1.
4. **Jammed headlines in SSR text** (split-span headline component drops spaces): "What are **youmaking** today?", "Build **onArcanea**", "The **FiveElements**", "**ContactArcanea**", "Install once.**Create** forever.", "Insights & **Storiesfrom** Arcanea" — screen readers and search engines read broken words.
5. **Console errors in prod**: `[signal] Cannot update signal value directly within React component` (on /chat, /gallery), `appendChild … Invalid or unexpected token`, **broken PWA icon** (`icon-192.png` invalid → manifest error).
6. **Zero-state social proof**: /worlds prints "0 Forks · 0 Stars"; world cards show gradient placeholders. Publishing zeros reads as abandonment.
7. **Guardian cards leak generation metadata** onto the art ("SUBJECT: IGNIS… RENDER: 8K PHOTOREALISTIC COMPOSITE…") at illegible size; name/quote text nearly invisible at rest (sub-AA contrast).
8. Sticky nav is translucent without sufficient backdrop → section eyebrows collide with nav links mid-scroll (seen at Creator Stack + /worlds).
9. Mobile: hero placeholder clips mid-word; stat chips overflow; number-input spinners visible in prompt box.

### Class C — Missing assets where the product must show, not tell
1. `/imagine` style rail (Guardian Portrait, Godbeast Summon, Gate Vision, …) — **every style card is an empty dark box**. A visual style picker with no previews is the single biggest conversion leak on the create path.
2. `/imagine` Discover feed: empty. `/worlds`: 3 first-party worlds with gradient covers. `/studio`: ~80% empty viewport with invisible stat labels (Formats/Sources/Storage/Search — no values).
3. Homepage "invisible diagram" on /worlds hero (floating labels "Supabase tables / Elements / Connected lore" with no rendered artwork) — and "Supabase tables" is engineering-speak on a creative surface.

### Class D — Information architecture & rhythm
1. **Homepage = 21,662px, 20 sections** — it tries to be the entire product tour. Sophisticated visitors never reach sections 12–20. Higgsfield's logged-out homepage is ~3 screens of product.
2. **70+ routes linked from the homepage; 112 route dirs in prod** including `v3/`, `v4/`, `design-lab/`, stubs (`/games`). Navigation sprawl + stale experiments shipped.
3. **Naming drift**: nav "Factions" → page "The Eight Origins"; `/studio/image` h1 "Image Forge" vs title "Image Studio"; `/templates` = "Blueprints"; `/books` h1 claims "The Library of Arcanea" (that's `/library`). One thing, one name.
4. **Section monotony**: every homepage section = italic-serif eyebrow + giant two-tone gradient headline + grey subcopy; and the gradient hue drifts per section (cyan→blue, purple→blue, yellow→cyan, yellow→green) against the one-family doctrine.
5. Insider lore density without on-ramps ("Vael crystals, raw Luminor ore, Nero shards" unexplained on first scroll).

### Class E — Performance & quality-gate enforcement
1. `/models` ships **557KB of HTML** (server-rendered benchmark tables); `/ecosystem` 296KB; `/books` 237KB.
2. WebGL orb + heavy motion: on a loaded machine the homepage stalled screenshot capture ~30s — main-thread pressure; needs lazy-mount, offscreen pause, `prefers-reduced-motion` audit.
3. **Blanket eslint-disable header** (16 rule families incl. `jsx-a11y/alt-text`, hooks rules) on every inspected file — lint exists but is silenced; this is *how* Classes B & D ship. `lighthouse.yml`/`design-fence.yml` exist but clearly don't block.
4. Low-contrast text throughout (30%-opacity labels, dim card text) — a11y + premium-feel cost.

---

## 3. Higgsfield teardown — what to absorb, what to reject

**Absorb (they've earned it):**
1. **Homepage = product, not brochure.** Launch carousel, capability cards, every tile opens a tool. ~3 screens.
2. **Evidence density**: every card is a real output (video thumbs, faces, motion); every app card shows **views + credits consumed** — social and economic proof at the card level.
3. **Launch cadence as content**: model drops staged like game releases (Seedream 5.0 Pro × ByteDance co-brand, Seedance 2.0 4K CRT frame), "New/Trending" badges, countdowns, $100K MCP app contest with deadline — the site radiates momentum.
4. **MCP adoption UX**: hosted remote endpoint (`mcp.higgsfield.ai/mcp`), copy-paste 3-step + OAuth, per-client tabs (Claude/ChatGPT/Cursor/OpenClaw/Hermes), MCP|CLI|Skill switcher, "if using Claude Code, use the CLI" guidance. Zero-install first-minute.
5. **Ecosystem flywheel**: apps built on their platform get homepage distribution; contest pays builders; MCP turns every agent into a distribution channel.
6. **Prompt/recipe transparency** on outputs (recipe cards) — Arcanea accidentally has this (metadata leak) — make it deliberate: hover reveals the world-grounded prompt recipe.

**Reject (off-brand for Arcanea):**
- Discount-banner pressure, "30% OFF" pill in nav, credit-anxiety UI, ad-cookie wall. Arcanea's counter-position is calm sovereignty ("your keys, your IP, no lock-in") — keep chrome calm, keep trust loud.

**MCP capability parity (their ~70 tools vs Arcanea's 45):**
- Higgsfield spans generate (image/video/audio/3D/dubbing/explainer) → edit (upscale/outpaint/reframe/remove-bg/motion-control) → package (shorts studio, clipper, marketing cards) → distribute (website/game create+deploy+publish) → commerce (credits, plans, contests) → intelligence (video analysis, virality predictor, models_explore) + voices/characters/soul-ID.
- Arcanea's 45 span the **stateful layer they don't have**: world-intelligence, world-persistence, creation-graph, council, library-search, visual-prompts, validate, vault.
- **Position: "Higgsfield generates media. Arcanea remembers worlds."** Parity plan = add the missing generation/distribution lanes via BYOK routing, keep the canon moat.

---

## 4. The Plan

### P0 — Trust repairs (Week 1, mostly copy + one component)
1. Rewrite the 3 homepage strategy-leak sections + /studio banner + "PATH C" badge in user voice. (Half-day of editing; largest single credibility win available.)
2. Fix `NumberTicker`: SSR renders final formatted value; motion enhances after hydrate.
3. Create `content/facts.ts` — single source for every public number (agents, tools, repos, words, skills, collections); import everywhere; extend `canon-lint.yml` to fail on hardcoded drift. Decide canon: 13 vs 16 Luminors, one number.
4. Metadata sweep: one title template ("%s — Arcanea"), unique h1 on every route (roadmap, games, rooms), fix split-headline space loss (`<span>` + proper whitespace or `aria-label`).
5. Fix `icon-192.png`, the React signal error (/chat, /gallery), appendChild error.
6. Route curation: noindex or remove `v3/`, `v4/`, `design-lab/`, `/games` stub from prod; public-route manifest requiring title+h1+OG.
7. Nav: solid/backdrop-blur background past 40px scroll; z-index audit.
8. Zero-state policy: never print 0 stars/forks — show "New" badge instead.
9. Update all stale dates; state shipped-vs-next honestly (the badge system already does this well).

### P1 — Asset uplift: "show, don't tell" (Weeks 2–3)
1. **Style previews on /imagine**: generate 12–16 style reference thumbs with the in-house pipeline (each = one Arcanea canon subject rendered per style). This is the highest-leverage visual fix on the create path.
2. **World key art**: covers for the 3 flagship worlds + seed 20–40 template worlds by running the World Engine itself (dogfooding = content pipeline). Weekly "New realms" drop cadence thereafter.
3. **Seed Discover/Gallery** with 100+ curated generations, each with a **recipe card** (style, gate, prompt skeleton) — turn the metadata-leak bug into the transparency feature.
4. Guardian cards: move generation metadata to hover-reveal recipe; raise at-rest text contrast to AA.
5. One motion signature: a 12–18s "world graph forming" ambient loop for the engine section (replaces the invisible diagram); WebGL orb lazy-mounted, paused offscreen, reduced-motion honored.

### P1 — Homepage + IA restructure (Weeks 2–4, parallel)
1. Homepage 21.6k px → **≤9k px, 9 sections**: Hero (keep) → Artifact cards (keep) → Living Worlds Engine w/ live graph demo → Guardians/Gallery strip → Comparison (add legend) → Creator paths (Live/Preview honesty, user voice) → MCP/builder door → Pricing teaser → Final CTA. Everything else moves to its hub.
2. Nav = 4 doors: **Create / Explore / Build / Learn** (+ Pricing). Footer keeps the long tail.
3. Break section monotony: alternate full-bleed art, split layouts, live demo, gallery strips; **one gradient family** (teal→aquamarine; gold = accent only) per `DESIGN.md`.
4. Nomenclature table in design-system; canon-lint enforces (Factions≠Eight Origins etc.).
5. Insider-lore on-ramp: first mention pattern — "Vael crystals (stateful world relics)".

### P2 — Product-experience deepening (Weeks 4–8)
1. **The 60-second magic path**: land → one sentence → world graph streams into existence (nodes appearing live) → 4 artifacts (map, character sheet, opening scene, cover) → export/claim. Make this the hero demo; account required only to save. (Higgsfield's equivalent: generate before signup.)
2. `/imagine` v2: style rail with thumbs, BYOK model routing UI, history grid, remix-from-output.
3. `/worlds`: fork/star loops + featured weekly drops; genre filters only after >24 worlds.
4. Studios (cinema/music): one **worked flagship example** each (shot-list → rendered trailer; artist world → EP) — brief-first, honest preview, but never an empty room.
5. Voice: consolidate 7 `/room/*` into one Presence surface with agent switcher.
6. Convenience tier alignment: BYOK stays the sovereign core; $12 tier gets **hosted generation** so non-technical Worldsmiths skip key setup. "Sovereign by default, SaaS by choice" — make product match pricing.

### MCP parity+ track (parallel, Weeks 2–6)
1. **Hosted remote MCP**: `mcp.arcanea.ai` + OAuth, copy-paste onboarding; keep open-core local install as the sovereign lane.
2. `/mcp` page: 3-step per-client tabs (Claude / Claude Code / Cursor / Codex / ChatGPT) × (MCP | CLI | Skill), mirroring the pattern that works.
3. Fill generation lanes via BYOK routing: image (live), audio (live-ish), video-brief→render adapters (Runway/Veo when keys present); editing verbs (upscale/outpaint/rembg) via routed providers.
4. **Moat tools** (the "and more"): `world_compile`, `canon_check`, `character_sheet`, `lore_query`, `saga_plan`, `handoff_export` — stateful tools Higgsfield cannot copy without becoming Arcanea.
5. Skills distribution: `npx skills add frankxai/arcanea` must work and match the advertised skill count.
6. Flywheel: MCP-made creations get `/gallery` distribution with recipe cards; later, a small themed build contest (their $100K play, right-sized).

### Engineering doctrine (continuous)
1. **Make gates bite**: lighthouse budget (LCP <2.5s mobile, homepage HTML <120KB, `/models` paginated/virtualized), design-fence extended to token/gradient drift, canon-lint for numbers/names, all **blocking** on deploy-web.
2. Remove the blanket eslint-disable header; re-enable rule families progressively (a11y + hooks first); fix-or-ticket, never silence.
3. Playwright visual-regression suite: 8 key routes × 3 viewports on every deploy (this audit's script is the seed).
4. A11y pass: AA contrast floor (kill 30%-opacity body text), focus-visible everywhere, alt text (currently lint-disabled!).
5. Observability: Sentry (present) + define the funnel (land → prompt → artifact → signup → world saved → D7 return) and instrument before redesigning, so every change is measured.
6. Content ops: public numbers only from `facts.ts`; dates only relative-to-shipped ("Shipping now / Next / Later"), reviewed monthly.

---

## 5. Hub scorecard (today)

| Hub | Grade | One-line |
|---|---|---|
| `/` hero + artifact cards | A− | World-class top; keep. |
| `/` sections 3–20 | C+ | Strategy leaks, monotony, length, counters. |
| `/chat` | B | Solid app shell; title bug, signal error, clipped banner. |
| `/imagine` | B− | Right architecture, zero style previews, empty feed. |
| `/worlds` (+create) | C+ | Good bones; empty multiverse, gradient covers, zeros. |
| `/gallery` | A− | Best-in-class cards; clipped titles, z-fight w/ FAB. |
| `/library` /lore | B | Real content depth; broken counters, heavy pages. |
| `/luminors` | B− | Strong hero; **16 vs 13** contradiction. |
| `/mcp` /developers | B+ | Strong story; hosted endpoint missing, tool-count drift. |
| `/pricing` | B+ | Great positioning; jargon badge, mascot, engineering-speak. |
| `/studio` (+author/image) | C | Mostly empty; stale Q2 date; naming drift. |
| `/academy` /voice /rooms | B− | Coherent; fragmented (7 rooms), missing h1s. |
| `/games` | D | Stub in production. |
| Footer/nav system | B | Clean IA; translucent-nav collisions. |

**North star:** every hub at A− within 8 weeks, measured by the gate suite + funnel metrics — with the differentiated thesis everywhere: *Higgsfield generates media; **Arcanea remembers worlds.***

---

*Method note: screenshots captured to `~/home-*.jpeg`, `~/hub-*.jpeg`, `~/hf-*.jpeg` during this session. Console logs in `~/.playwright-mcp/`. Side finding (different property): several frankx.ai blog hero images 404 (`best-ai-browser-2026-hero-v6.jpg`, others) — fix separately.*
