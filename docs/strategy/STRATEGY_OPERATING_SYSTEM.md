# Arcanea Strategy Operating System

**Status:** Living · **Created:** 2026-07-16 · **Classification:** PRIVATE  
**Repo SSOT:** `frankxai/arcanea-ai-app` (private) · local `C:\Users\frank\starlight\repos\arcanea-ai-app`  
**Purpose:** End strategy sprawl. Define *where* strategy lives, *what wins* on conflict, and *how* new ideas (Atlas/Fandom, media, GTM) enter the control plane without inventing repos or rewriting canon.

---

## 0. One-sentence rule

**Private product strategy lives in this repo under `docs/strategy/`. Execution state lives in `planning-with-files/CURRENT_*`. Ops scorecards live in Queen reports. Lore is `.arcanea/lore/`. Public site gets a thin roadmap only. No new home folders. No second “planning GitHub org.”**

---

## 1. Layered SSOT (read order on conflict)

| Priority | Layer | Path | Owns | Does **not** own |
|----------|--------|------|------|------------------|
| **L0** | **Canon / IP** | `.arcanea/lore/CANON_LOCKED.md` (+ FACTIONS, VISUAL_DOCTRINE) | Mythology truths, cast locks | Product pricing, GTM, stack |
| **L1** | **Operating strategy (NOW)** | `docs/strategy/queen-council-2026-07-16/` | What we do next 90 days; Path C; prices; NSM; Fandom/Atlas module | Detailed code PRs |
| **L2** | **Business architecture** | `docs/strategy/ARCANEA_BUSINESS_STRATEGY.md` + `PATH_C_*` | Hybrid sovereign / legal shape | Weekly sprint tickets |
| **L3** | **Goals scorecard** | `starlight/queen/reports/arcanea/ARCANEA_GOALS_AND_METRICS.md` | NSM, suite metrics, anti-scope | Full narrative strategy |
| **L4** | **Execution plane** | `planning-with-files/CURRENT_STATE_*`, `CURRENT_BACKLOG_*`, `CURRENT_CHANGELOG_*` | What is true in code this week; next tickets | Multi-year vision essays |
| **L5** | **Vision archive** | Other `docs/strategy/*.md`, ecosystem `ARCANEA_STRATEGY_2026.md`, `WORLD_CREATION_ENGINE_*` | Historical thesis / depth | **Not** auto-authoritative if conflicts with L1 |
| **L6** | **MASTER_PLAN** | `.arcanea/MASTER_PLAN.md` | Apr 2026 orchestrator snapshot | **Stale for operating priority** until refreshed to point at L1 |
| **L7** | **Public** | Thin `/roadmap` or `PUBLIC_ROADMAP_THIN_*.md` | Themes + shipped only | Pricing internals, legal structure, unshipped bets |

**Conflict rule:** L0 > L1 > L2 > L3 > L4 for *direction*. L4 wins for *“is it in production code?”*. L5–L6 never silently override L1; add a **supersede banner** when editing old files.

---

## 2. Where general strategy is saved (answer to “private repo?”)

| Need | Put it here | Visibility |
|------|-------------|------------|
| **General Arcanea product + GTM + monetization + 90d roadmap** | **This private repo:** `docs/strategy/queen-council-YYYY-MM-DD/` | Private GitHub `frankxai/arcanea-ai-app` |
| **Fandom / Atlas / encyclopedia / multi-world public surface** | Module under same pack: `ARCANEA_ATLAS_FANDOM_MODULE_*.md` | Private |
| **Business Path C / legal architecture** | `docs/strategy/ARCANEA_BUSINESS_STRATEGY.md`, `PATH_C_*` | Private |
| **Weekly scorecard / Queen ops** | `C:\Users\frank\starlight\queen\reports\arcanea\` | Estate private (not product git) |
| **Cross-brand portfolio (GenCreator + Starlight + Arcanea lanes)** | `starlight-agent-config` Business OS | Private estate |
| **Ecosystem / multi-repo coordination** | `arcanea-ecosystem` (public) — **thin pointers only**, no secret prices | Public OK if no secrets |
| **Public marketing roadmap** | Site page or thin MD only | Public |
| **New private “arcanea-strategy-only” GitHub repo** | **Do not create yet** | Duplicates SSOT; only if non-git stakeholders force it later |

**GitHub truth:** `frankxai/arcanea-ai-app` is already **private** and is the correct flagship for full strategy. Public `frankxai/arcanea` is a thin mirror — never dump full strategy there.

---

## 3. How we manage product direction (operating loop)

### Weekly (Queen / Hermes)

1. Read L1 pack README + L3 goals scorecard.  
2. Update or create `planning-with-files/CURRENT_STATE_YYYY-MM-DD.md` (what is true).  
3. Update `CURRENT_BACKLOG_*` only for **this week’s ship list** (max 7 active).  
4. Truth-loop: no public number unless measured.  
5. Human gates: money, domain, legal, brand, production attach.

### When a new big idea arrives (e.g. “become Fandom”)

1. **Classify:** module (surface), path change (architecture), or lore (L0).  
2. **Write a dated module** under the active council pack (or new pack if >30 days drift).  
3. **Overlap/divergence section** vs L1 north star — required.  
4. **Promotion rule:** idea becomes operating priority only if it maps to NSM / Phase 0–4 milestones or Frank promotes it.  
5. **Do not** open a parallel MASTER_PLAN rewrite in chat only.

### When agents disagree with docs

- Code + measured metrics > chat.  
- Dual audit (Claude + Codex) for hard strategy.  
- Canon agents cannot invent L0; product agents cannot invent L0 either.

### Branch / ownership note

- Product code lanes may be Codex-owned (`codex/*` branches).  
- Strategy docs may land on the active product branch as `docs:` commits, or a short `docs/strategy-*` branch — **pathspec only**, never `git add .` at estate root.  
- Prefer draft PRs; `[skip ci]` for pure markdown when policy allows.

---

## 4. Living pack index (2026-07-16)

| Document | Role |
|----------|------|
| `queen-council-2026-07-16/ARCANEA_ULTIMATE_STRATEGY_AND_ROADMAP_2026-07-16.md` | Full multi-agent synthesis (operating L1) |
| `queen-council-2026-07-16/MILESTONES_PROJECT_PLAN_2026-07-16.md` + `.csv` | Phases, success criteria |
| `queen-council-2026-07-16/PUBLIC_ROADMAP_THIN_2026-07-16.md` | Optional public |
| `queen-council-2026-07-16/ARCANEA_ATLAS_FANDOM_MODULE_2026-07-16.md` | Fandom mechanics → Atlas product module |
| `STRATEGY_OPERATING_SYSTEM.md` (this file) | How strategy is governed |
| `ARCANEA_BUSINESS_STRATEGY.md` + Path C PRDs | Legal/architecture backbone |
| Queen: `ARCANEA_GOALS_AND_METRICS.md` | Scorecard |
| Queen: `queen-arcanea-strategy-council-2026-07-16.md` | Session receipt |

---

## 5. Anti-patterns (already burned us)

| Anti-pattern | Fix |
|--------------|-----|
| 40+ strategy MD files all claiming “canonical” | L1 pack wins; banners on old files |
| Chat-only strategy with no path | Write to private `docs/strategy/` |
| New repo for every idea | Module file in flagship private repo |
| `MASTER_PLAN` Apr still treated as live GTM | Point agents to L1 first |
| Public dump of full pricing/legal | Thin public only |
| “Index all fantasy brand characters” as product | Pattern Codex only (see council pack § legal) |
| Build multi-tenant Fandom farm before first-session proof | Atlas **after** activation / as franchise proof surface, not Phase 0 product |

---

## 6. Frank’s human gates (strategy class)

1. Promote/demote L1 packs.  
2. MoR (Polar vs LS vs Paddle).  
3. Vercel / domain identity.  
4. Hosted lite credit budget.  
5. Publish public thin roadmap Y/N.  
6. Archive kill list (onchain/claw/dupes).  
7. Any third-party IP dataset public launch.

---

*Part of Arcanea private strategy control plane. Pair with Queen goals OS and Path C.*
