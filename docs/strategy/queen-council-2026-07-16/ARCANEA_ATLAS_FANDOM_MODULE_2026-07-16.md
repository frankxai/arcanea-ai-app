# Arcanea Atlas / Fandom Module

**Date:** 2026-07-16 · **Classification:** PRIVATE  
**Parent SSOT:** `ARCANEA_ULTIMATE_STRATEGY_AND_ROADMAP_2026-07-16.md`  
**Governance:** `docs/strategy/STRATEGY_OPERATING_SYSTEM.md`  
**Session origin:** Fandom mechanics research + Arcanea estate fit (Hermes)  
**Status:** **Module accepted as *surface strategy*** — **not** a replacement of Path C / NSM

---

## 0. Purpose

Capture how Fandom.com works (mechanics, money, hosting, content quality), how Arcanea should and should **not** replicate it, and how this maps onto the already-written Queen Council product direction.

---

## 1. Fandom mechanics (facts agents must not invent)

| Dimension | Fandom reality |
|-----------|----------------|
| Entity | For-profit media conglomerate (TPG-backed); not Wikimedia nonprofit |
| Product | Multi-tenant **wiki farm** + social features on heavily modified **MediaWiki** |
| Scale | ~250k wikis, ~40M+ pages, ~300–350M MAU (order-of-magnitude public claims) |
| Content labor | **Volunteer fans unpaid**; company keeps ad revenue |
| Licenses | User text often copyleft-style; platform monetizes distribution |
| Revenue | Ads (~majority / multi-layer), commerce (Fanatical), media brands (GameSpot, Metacritic, TV Guide…), some subs, data/intent (FanDNA), sponsorships |
| Hosting | Central free hosting under `*.fandom.com` paid by **attention + ads** |
| Quality density | 20y SEO flywheel + obsessive fans + acquired editorial brands + image volume (rights often messy) |
| Alternatives | wiki.gg (gaming, editor-first), Miraheze (nonprofit ad-free), self-host |

**Do not copy:** ad-slop UX, zero contributor share, Hotel-California lock-in, MediaWiki-as-flagship UX, “scrape all living franchise characters” as product data.

---

## 2. Arcanea angles (ranked)

| ID | Angle | When | Relation to L1 roadmap |
|----|-------|------|-------------------------|
| **A** | **Arcanea Atlas** — public encyclopedia of *owned + partner* worlds | Phase 4.6 / parallel franchise proof after activation | **Primary** public surface |
| **B** | **Agentic World OS** — World Repo → entities → approve → publish | Phases 1–3 core product | **Already the product spine** |
| **C** | Premium multi-tenant wiki farm (indie games/TTRPG) | Phase 5–6+ only if A+B work | Optional expansion |
| **D** | B2B white-label official atlas | Sales-led later | Optional |
| **E** | Federated “GitHub for worlds” | Civilizational vision | Vision, not Q3 execution |
| **F** | Editorial + affiliate lite | After SEO density | GTM support |
| **G** | MediaWiki import tools | Only if C | Later |

**Default stack for Atlas:** Next.js + Vercel ISR/SSR + Postgres + object storage + agent draft/approve — **not** MediaWiki-first. MediaWiki = import/export interop only.

---

## 3. Overlap vs divergence vs existing strategy

### 3.1 Overlaps (reinforce — do not open a second strategy)

| Theme | Already in estate | Atlas/Fandom module |
|-------|-------------------|---------------------|
| World Creation OS / Living Universe Engine | Queen council L1, ecosystem `ARCANEA_STRATEGY_2026`, World Engine vision | Atlas is the **public proof + SEO** face of that OS |
| Continuity + world graph + entities | Path C, WORLD_GRAPH_SPEC, Phase 3 milestones | Encyclopedia pages = projected graph |
| Franchise as living proof (not the only world) | Council: “franchise proves product” | Atlas densifies **Arcanea IP first** |
| Encyclopedia / Codex surfaces | Goals OS Creative suite; M4.6 | Same deliverable renamed “Atlas/Codex” |
| Higgsfield as **provider**, not identity | Council § Higgsfield | Atlas uses media OS; is not a gen marketplace |
| Pattern Codex legal-safe knowledge | Council § Pattern Library | Anti-Fandom-IP-dump; abstract patterns only |
| Agent draft + human gate | Canon Steward / Lore Guardian | Exact Fandom-volunteer substitute with better rights |
| Open core / MCP | Phase 5 | World tools feed Atlas generation quality |
| Museum-grade not wiki sludge | Visual OS Jul 16; Fable 5 | Explicit UX bar vs Fandom ads |
| Path C hybrid money | Free craft + paid sync/bench | Atlas free to read; convert to Genesis/Studio |

### 3.2 Divergences (resolve now — official rulings)

| Temptation | Diverges from L1 | Official ruling |
|------------|------------------|-----------------|
| “Become Fandom” as company identity | L1: World Creation OS, not biggest wiki | **Reject identity.** Atlas is a **surface**, product remains Genesis → proof → continuity |
| Multi-tenant free-for-all farm in Phase 0 | L1 Phase 0–1 production honesty + activation | **Defer farm.** Ship dense Arcanea Atlas after/with activation |
| Host all best games’ fan wikis day one | Legal landmine; support hell | **Partner + original only** until counsel/process |
| Ad-primary revenue | Goals: charge creation/sync/compute | **Ads last**, if ever; affiliate + packs first |
| MediaWiki as core product | Vercel/Next monorepo + design system | **No** MediaWiki flagship |
| Unpaid UGC as only engine | Creator economy / GenCreator | Agents + humans; later **share** if UGC scale |
| Open cosmology rewrites | CANON_LOCKED + guided contrib | Staging → Frank lock forever |
| New strategy GitHub repo | Strategy OS: one private flagship | **No new repo** |
| Compete with World Anvil on wiki depth first | Win media + agent continuity first | Atlas depth on **owned** world first; multi-world later |

### 3.3 Tension with stale docs (do not re-open)

| Stale / parallel doc | Risk | Resolution |
|----------------------|------|------------|
| `.arcanea/MASTER_PLAN.md` (Apr 2026) | Claims single SSOT; page-count vanity | Operating priority = Queen council pack; MASTER_PLAN needs supersede banner |
| Old monetization $19/$49 decks | Price conflict | Goals OS + council ladder wins |
| Ecosystem “Living Universe Engine” one-liner | Compatible | Keep as brand language; execution via L1 phases |
| Author studio “world hub” specs | Compatible | Atlas pages link into author/world hub later |
| `arcanea-ecosystem` public strategy | OK thesis | Secrets stay in private app repo |

---

## 4. Product placement (IA)

```
arcanea.ai
├── / (Genesis / product loop)          ← Phase 0–1 priority
├── /studio or bench                    ← hosted gen (later)
├── /worlds or /atlas                   ← PUBLIC encyclopedia (this module)
│     /w/arcanea/...                    ← flagship IP densification
│     /w/{partner}/...                  ← curated later
├── /gallery                            ← user proofs (opt-in)
└── /roadmap                            ← thin public
```

**Conversion:** every Atlas page CTA → create your world / open in Studio / Founding Circle — not “edit wiki” as primary CTA on day one.

---

## 5. Human + agent operating model (Atlas)

| Role | Human | Agent |
|------|-------|-------|
| Lore Guardian | Approve locks | Diff vs CANON_LOCKED / registry |
| Worldsmith | Voice, intent | Draft entity pages, links |
| Art Director | Taste gate | Image candidates + style packs |
| Archivist | Rights | Provenance, citations, hashes |
| SEO Editor | Strategy | Schema.org, internal links |

Pipeline: **draft (agent) → staging → approve (human) → ISR publish**.

---

## 6. Milestone mapping (do not fork the CSV)

| Milestone (existing) | Atlas work |
|----------------------|------------|
| M1.x Activation | Optional: 3 showcase Atlas pages as *inspiration*, not farm |
| M3.x Continuity | Entity schema = Atlas content model |
| M4.1–M4.5 Media OS | Plates/gallery quality for Atlas |
| **M4.6 Encyclopedia surfaces** | **Primary Atlas MVP scope** |
| M5.4 Pattern Codex | Safe “best fantasy systems” without IP dumps |
| M6.5 Guided contrib | Community edit rails (not Fandom free-for-all) |

**Explicit non-goals until Frank promotes:** multi-tenant wiki.gg competitor, ad stack, FanDNA-style data sales.

---

## 7. Stack (Atlas MVP)

| Layer | Choice |
|-------|--------|
| App | Next.js on Vercel (same monorepo `apps/web`) |
| Content | Structured MD/JSON from World Repo + DB projection |
| DB | Supabase/Neon Postgres |
| Media | R2 / Blob + provenance |
| Agents | Hermes/Queen jobs off request path (C940 for heavy) |
| SEO | ISR + JSON-LD Person/Place/Article |

---

## 8. Money (Atlas-specific)

1. Free read (distribution).  
2. CTA → Packs / Sync / Bench (core Path C).  
3. Affiliate after density.  
4. Optional creator share **only** if third-party worlds host at scale.  
5. Ads: **not** Phase 0–4 plan.

---

## 9. Decisions logged

| # | Decision | Status |
|---|----------|--------|
| D1 | Atlas is a module of World Creation OS, not a Fandom clone company | **Locked (strategy)** |
| D2 | Save full Fandom analysis under private `arcanea-ai-app` council pack | **Done this file** |
| D3 | No new strategy-only GitHub repo | **Locked** |
| D4 | Phase priority remains Production honesty → Activation → Revenue → Continuity → Media/Atlas densify | **Locked** |
| D5 | Third-party franchise character databases as product | **Forbidden** |

---

## 10. Next implementation tickets (when code lane free)

1. Entity content model shared with world graph (schema only).  
2. `/atlas` or `/worlds` route with 30 curated Arcanea entities (human-approved).  
3. Provenance fields on media.  
4. JSON-LD + sitemap.  
5. CTA instrumentation to Genesis.

Do **not** start multi-tenant farm or MediaWiki hosting.

---

*Module of Queen Council 2026-07-16. Parent strategy remains authoritative for pricing, MoR, Path C, and NSM.*
