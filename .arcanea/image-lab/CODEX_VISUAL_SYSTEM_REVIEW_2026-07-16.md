# CODEX Visual System Review — Arcanea Image Lab
**Date:** 2026-07-16  
**Class:** Strict engineering audit (Codex-grade)  
**Scope:** Prompt OS · style packs · dual-rail · quality gates · direction board · CI for media-jobs  
**Repo:** `arcanea-ai-app` (toplevel verified)  
**Companions:** `GENERATION_STANDARD_V1_LOCKED.md` · `ARCANEA_VISUAL_OS_OPERATING_MODEL.md` · `PROMPTING_SYSTEM_V2.md` · `style-packs/*` · `visual-direction-board-2026-07-16/` · `VISUAL_DOCTRINE.md` · `TASTE.md`  
**Cross-system:** `starlight-design-intelligence/brand-image-system/runtime/`

---

## 0. Verdict (one screen)

| Area | Status | One-line judgment |
|------|--------|-------------------|
| **Strategy / house decision** | **PASS** | House = Cinematic Myth-Tech Encyclopedia; anime not house; dual-rail correct. |
| **Prompt OS v2 design** | **PASS (design) / FAIL (ops)** | Templates + design cards are franchise-grade; not promoted, not machine-enforced. |
| **Style packs** | **PASS (files) / FAIL (enforcement)** | Four packs exist and are coherent; jobs still ship without pack validation. |
| **Dual-rail doctrine** | **PASS (law) / FAIL (execution samples)** | Rails are clear; D2 product marketing still weak; no automated rail lint. |
| **Quality gates (score30)** | **PASS (rubric) / FAIL (rigor)** | Rubric exists; missing breakdown, doctrineLint, human-approve audit fields. |
| **Direction board evidence** | **PASS (useful) / mixed ship** | A1/A2 strong; B1 secondary-ready; C dilutes; D2 weak; **E2 doctrine fail (glyphs)**. |
| **CI / media-job validation** | **FAIL** | Prose gates only. No schema check in image-lab; multi-brand schema lacks Arcanea fields. |
| **Identity OS (masters / Soul)** | **FAIL (not started)** | No face bible, no masterRef chain, no Soul IDs after face approve. |

**Overall system grade:** **B- design / D+ enforcement**  
Direction and documents are strong enough to lock. **Shipping pipeline is not yet safe** without CI gates + doctrine lint + master-still discipline.

**Lock recommendation:** Treat `GENERATION_STANDARD_V1_LOCKED.md` + this review’s §8–§11 as **non-negotiable for all future world gens**. Do not open a fifth house look. Do not promote anime. Repair E2-class fails before social ship.

---

## 1. Evidence base audited

| Artifact | Path | Used for |
|----------|------|----------|
| Queen strategy | `.arcanea/image-lab/VISUAL_MEDIA_STRATEGY_QUEEN_2026-07-16.md` | ICP, house decision, stop/start |
| Operating model | `.arcanea/image-lab/ARCANEA_VISUAL_OS_OPERATING_MODEL.md` | Dual-rail, engines, weekly loop |
| Gen standard | `.arcanea/image-lab/GENERATION_STANDARD_V1_LOCKED.md` | Locked pillars + media-job CI shape |
| Prompt OS v2 | `.../codex-encyclopedia-preview-batch2-.../PROMPTING_SYSTEM_V2.md` | Templates, design cards |
| Style packs | `.arcanea/image-lab/style-packs/*.json` | Pack contract |
| Direction board | `visual-direction-board-2026-07-16/{INDEX,prompts,ledger}.json` | A–E rail previews |
| Batch2 evidence | `codex-encyclopedia-preview-batch2-.../{media-job,evidence}.json` | Real scores + provenance gaps |
| Registry | `registry/arcanea-media-registry.json` | Ship-candidate graph |
| Doctrine / taste | `.arcanea/lore/VISUAL_DOCTRINE.md` · root `TASTE.md` | Authority surfaces |
| Multi-brand | `starlight-design-intelligence/.../media-job.schema.json` · `brands/arcanea/brand-pack.json` | Cross-estate contract gap |

**Queen vision notes (accepted as board ground truth):**

| ID | Verdict | Engineering implication |
|----|---------|-------------------------|
| **A1 House Mera** | Strong house cast | Keep as house baseline; still needs Soul/master lock |
| **B1 Prestige Mera** | Warmer / emotional | Secondary rail pilot only; labeled |
| **C1 Anime Mera** | Dilutes house if promoted | Experiment pack only; never face bible / Soul training |
| **A2 House Otome** | Excellent silhouette / I2V | Priority video hero form |
| **D2 Lab + frame** | Concept right; empty canvas + low-poly bird weak | Rebuild with **real approved Codex still** inside frame |
| **E2 9:16 Otome hook** | Social hook powerful; **musical notation glyphs** | Doctrine hard-fail; lint + re-gen before any social use |

---

## 2. Pass / fail checklist

Legend: **PASS** = locked and usable · **PARTIAL** = designed but incomplete · **FAIL** = must fix before volume / public.

### 2.1 Prompt OS

| # | Check | Result | Notes |
|---|-------|--------|-------|
| P1 | Design card schema defined | **PASS** | entity, silhouette, materials, prop, motion_seed, etc. |
| P2 | Separate Cast vs Godbeast templates | **PASS** | Portrait Bible + Encyclopedia Hero |
| P3 | Materials whitelist from doctrine | **PASS** | Matches VISUAL_DOCTRINE core set + Vael crystals |
| P4 | Light law (gold × cosmic blue) | **PASS** | In pack + templates |
| P5 | Ban list as positives (not “no X” spam) | **PARTIAL** | Stated in v2; direction-board prompts still lean “No text” lists |
| P6 | Motion seed written with still | **PASS** (batch2) / **FAIL** (board) | Board items lack motion_seed |
| P7 | Prompt OS SSOT path (not only job pin) | **FAIL** | Still only under batch2 folder; not `prompt-os/` promotion |
| P8 | Every job has structured design cards (YAML/JSON) | **PARTIAL** | Batch2 prose cards; board is flat `prompt` only |
| P9 | Prop lock string mandatory | **PARTIAL** | Good in batch2 Mera/Emilia; not schema-required |
| P10 | FX budget = 1 enforced in compile | **FAIL** | Documented in Gen Standard; not in compiler or lint |
| P11 | Noise tokens banned (`masterpiece`, `8K best quality`) | **PASS** (policy) / **PARTIAL** (no scanner) | Pack forbids; no pre-gen greppable gate |
| P12 | Prestige templates exist as named compile paths | **FAIL** | Pack references `cast-portrait-bible-prestige` — **not defined** in v2 |

### 2.2 Style packs

| # | Check | Result | Notes |
|---|-------|--------|-------|
| S1 | `house-myth-tech` exists, `house: true` | **PASS** | Ship bar 28, engines, forbidden list |
| S2 | Prestige pack labeled secondary | **PASS** | `house: false`, pilot status |
| S3 | Product lab pack RAIL-P | **PASS** | TASTE authority, no character gens |
| S4 | Anime pack experiment-only | **PASS** | Folder label required |
| S5 | Every media-job declares registered `stylePackId` | **FAIL** | Batch2 `media-job.json` has **no** `stylePackId` / `rail` |
| S6 | Only registered pack IDs allowed | **FAIL** | Board uses `house-myth-tech+deterministic-frame-concept` and `house-myth-tech-social-crop` — **not in** `style-packs/` |
| S7 | Pack inject into compile (materials/forbidden) | **FAIL** | Human discipline only |
| S8 | Pack schema version + validator | **FAIL** | JSON files only; no JSON Schema / CI |
| S9 | Fifth unofficial look blocked | **PARTIAL** | Policy yes; tooling no |

### 2.3 Dual-rail

| # | Check | Result | Notes |
|---|-------|--------|-------|
| R1 | RAIL-P vs RAIL-W authorities documented | **PASS** | TASTE vs VISUAL_DOCTRINE |
| R2 | Landing: lab shell + ≤1 framed Codex | **PASS** (policy) | Must be enforced in site PRs separately |
| R3 | World art not used as unframed chrome | **PARTIAL** | D2 concept correct; execution weak product marketing |
| R4 | `rail` field on every job | **FAIL** | Missing on batch2 media-job |
| R5 | Experiment rail isolated folders | **PASS** (board structure) | `03-anime-experiment/` labeled |
| R6 | Brand-pack dualRails aligned with image-lab | **PARTIAL** | Aligns conceptually; brand-pack still carries purple accent conflict with TASTE teal chrome |
| R7 | Weirdness diagnostics used before restyle | **PASS** (docs) | Must stay policy: fix packaging, not pivot house to anime |

### 2.4 Quality gates / evidence

| # | Check | Result | Notes |
|---|-------|--------|-------|
| Q1 | score30 10 dimensions defined | **PASS** | Gen Standard §5 |
| Q2 | Ship ≥28 / iterate 22–27 / restart ≤21 | **PASS** | Consistent across docs |
| Q3 | Per-item scoreBreakdown (10 dims) recorded | **FAIL** | evidence.json has only total + notes |
| Q4 | Vision inspected (not score-from-prompt fantasy) | **PARTIAL** | Batch2 notes look vision-based; no `inspected: true` + agent/time |
| Q5 | Doctrine lint (glyphs/text/hearts/FX) | **FAIL** | E2 glyph leak; Laeylinn heart portal; Mera pillar runes |
| Q6 | Human approve actor + timestamp | **FAIL** | Registry `ship-candidate` without approver |
| Q7 | Local paths (not CDN-only done) | **PASS** (batch2) | Materialized on disk |
| Q8 | Crops matrix for flagships | **FAIL** | No `crops/` on batch2 or board |
| Q9 | Contact sheet / multi-candidate pick logged | **FAIL** | Single-shot lottery still default |
| Q10 | Akamoto 27 not auto-shipped as approved | **PASS** | decision `iterate` — keep this honesty |

### 2.5 Direction board / production readiness

| # | Check | Result | Notes |
|---|-------|--------|-------|
| B1 | Fair A/B/C on same subjects | **PASS** | Mera + Otome held constant |
| B2 | House A recommended as Codex SSOT | **PASS** | Matches Queen + Gen Standard |
| B3 | Anime C blocked from house/Soul | **PASS** (policy) | Must stay kill-list |
| B4 | D2 product marketing ship-ready | **FAIL** | Empty chrome + weak framed bird |
| B5 | E packaging ship-ready | **FAIL** | E2 glyphs = doctrine hard fail |
| B6 | Board ledger has score30 + decision | **FAIL** | Only bytes/path/status ok |
| B7 | Board prompts compiled from templates | **PARTIAL** | House-like soup; not design-card structured |

### 2.6 Identity / continuity

| # | Check | Result | Notes |
|---|-------|--------|-------|
| I1 | Master still path per entity | **FAIL** | `masterRef` null everywhere |
| I2 | Face bible folder populated | **FAIL** | Not created |
| I3 | Soul ID after face approve only | **PASS** (policy) / **N/A** (runtime) | Correct sequencing stated |
| I4 | Godbeast silhouette DNA locks | **PARTIAL** | Otome excellent; Kaelith golem-lean noted; no form master sheet |
| I5 | Continuity queue current | **PASS** | Next ordered list is clear |
| I6 | Registry `usedIn` on publish | **PARTIAL** | Schema present; always `[]` |

### 2.7 CI / tooling

| # | Check | Result | Notes |
|---|-------|--------|-------|
| C1 | Image-lab media-job JSON Schema | **FAIL** | Does not exist under image-lab |
| C2 | Validator CLI / CI job | **FAIL** | No `pnpm`/`node` gate for media-jobs |
| C3 | Forbidden token scanner | **FAIL** | Manual only |
| C4 | stylePackId ∈ style-packs registry | **FAIL** | Not checked |
| C5 | Multi-brand schema covers Arcanea world jobs | **FAIL** | `media-job.schema.json` lacks `rail`, `stylePackId`, `doctrineLint`, `designCard`, `scoreBreakdown` |
| C6 | Promotion blocked if score &lt; 28 or lint fail | **FAIL** | Registry accepts ship-candidate without automated gate |

---

## 3. Ranked risks (highest first)

| Rank | Risk | Severity | Likelihood | Blast radius | Mitigation (mandatory) |
|------|------|----------|------------|--------------|------------------------|
| **1** | **Doctrine glyph / text leaks (E2 class)** | Critical | Proven | Social shame + brand “AI slop” | Pre-ship doctrineLint; reject musical notes/letters; re-gen E2 before any public use |
| **2** | **No master still / Soul chain → face & form drift** | Critical | High | Franchise unrecognizable at volume | After first ≥28 human approve: masterRef required on all subsequent gens |
| **3** | **stylePackId / rail not on jobs → silent house pollution** | High | Proven (batch2) | Anime/prestige bleed into Codex SSOT | CI reject missing/unknown pack; ban ad-hoc pack IDs |
| **4** | **Anime promoted or trained as identity** | High | Medium (social temptation) | Loses VISUAL_DOCTRINE moat | Kill-list: no Soul training, no book masters, labeled folders only |
| **5** | **score30 without breakdown / fake approve** | High | Medium | Quality theater; ships 24–27 as “good enough” | Require 10-dim breakdown; block `approved` if total &lt; 28 |
| **6** | **Rail collision on landing / product marketing (D2 class)** | High | Medium | “Too weird / LARP” product perception | Product jobs must use `product-lab-chrome`; framed world still must be real approved master |
| **7** | **FX budget overflow (“weird” photoreal magic)** | Medium-High | High | Cold audience bounce | FX budget=1 + ambient; score dim7 anti-slop hard fail on spam |
| **8** | **Prompt OS only pinned in job folder** | Medium | High | Agents invent new soup | Promote to `image-lab/prompt-os/PROMPTING_SYSTEM_V2.md` + version pin |
| **9** | **Multi-brand schema divergence** | Medium | High | Dual systems, dual truths | Extend Arcanea world job schema or bridge fields into BIS runtime |
| **10** | **Literal cartoon architecture (heart portals)** | Medium | Proven (Laeylinn) | Doctrine slip in Heart Gate set | Forbidden architecture list; repair queue item #1 |
| **11** | **No crops/overlays → social re-roll lottery** | Medium | High | Identity drift + cost waste | Master + 1:1 + 9:16 + OG required for flagship ship |
| **12** | **Registry ship-candidate without human actor** | Medium | High | Audit gap | `humanApprove: { by, at, decision }` required for public |

---

## 4. Mandatory prompt techniques missing (must adopt)

These are **not optional research** — they are gaps between current docs and a production-safe generator. Aligns with Gen Standard §2; elevated here as **engineering requirements**.

| # | Technique | Why missing hurts | Required implementation |
|---|-----------|-------------------|-------------------------|
| 1 | **Canon master still + img2img / ref chain** | Seed lottery = new faces each batch | `masterRef` path; after first approve, gen without master = **invalid job** |
| 2 | **Face bible / turnaround (3+ angles)** | Soul ID cannot start | `approved/face-bible/<slug>/{front,tq,profile}.png` |
| 3 | **Prop lock string (compile-time field)** | Identity fails when face soft | Design card `prop` required non-empty for cast |
| 4 | **Silhouette one-liner + 50px reject rule** | Weak thumbnails, weak I2V | Design card `silhouette`; QA dim2 hard fail if unreadable |
| 5 | **FX budget = 1 domain effect** | Magic spam = “weird” | Compile inject: “single domain effect + restrained ambient particles only” |
| 6 | **Doctrine lint pre-prompt + post-vision** | E2 notes still leaked | Forbidden tokens list + vision checklist (glyphs, letters, hearts-as-architecture) |
| 7 | **Contact sheet (2–4 candidates)** | No comparative pick | `candidates/` + `selectedId` in evidence |
| 8 | **Edit chain over re-roll** | Consistency cost | Prefer edit/outpaint/upscale from winner |
| 9 | **Crop matrix as deliverable** | Social unfit masters | master + square + story + og paths required for flagship |
| 10 | **Deterministic Codex overlay** | Gen text is lies | Name/Gate/line via HTML/Satori only; empty label band in gen |
| 11 | **I2V motion grammar lock** | Morph / limb invent | Slow push-in, material pulse, no new anatomy |
| 12 | **Negative-as-positive compile** | Models ignore long “no X” | Replace ban spam with “clean encyclopedia crop, abstract resonance rings as light geometry” |
| 13 | **Prestige template definition** | Pack references missing templates | Add prestige compile blocks to Prompt OS or remove template IDs |
| 14 | **scoreBreakdown object** | Un-auditable totals | 10 keys × 0–3 always written |
| 15 | **stylePackId inject at compile head** | Drift | First line of system: pack lookName + lightLaw + materialsWhitelist |

### Forbidden tokens / patterns (hard reject if present in prompt **or** vision)

**Prompt greylist (fail CI if found in compiled prompt for house/prestige world jobs):**

```
masterpiece, best quality, 8k, 8K, ultra detailed, trending on artstation,
sheet music, musical notes, musical notation, staff lines, treble clef,
readable text, logo, watermark, UI mockup, lorem ipsum,
isekai, niji, chibi cast bible, spandex, mud-medieval, neon cyberpunk,
purple gradient wallpaper, heart-shaped portal, heart architecture,
emoji magic, multi-character collage flagship
```

**Vision hard-fails (any one = doctrineLint fail → cannot ship public):**

1. Legible letters / numbers / logos / watermarks  
2. Musical notation glyphs / staff / clefs  
3. Cartoon hearts as architecture or portals  
4. Godbeast rendered as armored humanoid “origin”  
5. Product-chrome job containing full-bleed Godbeast wallpaper  
6. FX chaos: ≥3 concurrent domain spectacle systems  
7. Multi-hero collage sold as single encyclopedia plate  

**Positive replacements (compile inject):**

| Instead of | Write |
|------------|--------|
| “no musical notes” | “concentric harmonic light rings as abstract geometry only” |
| “no text” | “clean museum crop; empty caption band if framed; no inscriptions” |
| “no heart portal” | “healing ground bloom and self-sealing jade micro-cracks; no heart-shaped architecture” |
| “no bad hands” | “coherent anatomy, readable prop grip, fashion-editorial hands” |

---

## 5. Direction board engineering scores (Codex)

Queen vision + system fit. Not a redo of aesthetic taste — ship readiness.

| ID | stylePackId (declared) | System fit | Ship? | Action |
|----|------------------------|------------|-------|--------|
| **A1 House Mera** | `house-myth-tech` | Excellent cast house | **Yes as master candidate** | Human face approve → face bible seed |
| **A2 House Otome** | `house-myth-tech` | Best silhouette/I2V proof | **Yes as form master candidate** | Prefer for social video after glyph-safe crop path |
| **B1 Prestige Mera** | `prestige-illustrated` | Strong emotional secondary | **Pilot only** | Labeled folder; do not replace house shelf |
| **B2 Prestige Otome** | `prestige-illustrated` | Secondary creature | **Pilot only** | Same |
| **C1 Anime Mera** | `anime-social-experiment` | Viral, low uniqueness | **No house / no Soul** | A/B social only if explicit |
| **C2 Anime Otome** | `anime-social-experiment` | Same | **No house** | Same |
| **D1 Lab shell** | `product-lab-chrome` | Chrome mood OK | **Mood only** | Prefer real code UI screenshots for marketing when possible |
| **D2 Lab + frame** | `product-lab-chrome` | Concept PASS / pixels FAIL | **No** | Rebuild: real A1/A2 master inside frame + denser restrained UI |
| **E1 Hybrid Codex card** | *invalid ad-hoc pack id* | Packaging direction correct | **Iterate** | Fix pack id; empty band OK; then deterministic text |
| **E2 Social 9:16 Otome** | *invalid ad-hoc pack id* | Hook strong / **doctrine FAIL** | **No** | Re-gen with glyph ban + FX budget; use house pack id |

---

## 6. Prompt OS engineering review

### What is solid

- Layered **design card → compile** beats prompt soup.  
- Cast vs Godbeast grammar split is correct for franchise IP.  
- Materials whitelist + light law are doctrine-aligned.  
- Batch2 compiled prompts (Mera, Emilia, Otome) prove the template can hit 28–29.  
- Motion seeds co-authored with stills are the right I2V pattern.

### What is broken / incomplete

1. **Not a real OS path** — still a batch pin. Agents will not find it.  
2. **No compiler** — humans paste templates; packs’ `promptTemplates` are names without implementations for prestige.  
3. **Direction board skipped cards** — flat prompts; missing structured fields (`rail`, `motion_seed`, `forbidden`, `identity_lock`).  
4. **Inconsistent ban style** — still heavy “No text no watermark” tails; should be positive encyclopedia constraints + short forbidden block.  
5. **No FX budget line** in template skeletons.  
6. **No masterRef branch** in compile rules.  
7. **Hz in prompts** (174, 528, 417) — TASTE says Hz are backend-only for product UI; world encyclopedia may keep Hz as lore, but product chrome and social captions must not dump raw Hz without context. Prefer “Foundation Gate” over “174 Hz” on cold social.

### Required Prompt OS promotion layout

```
.arcanea/image-lab/prompt-os/
  PROMPTING_SYSTEM_V2.md          # SSOT
  templates/
    cast-portrait-bible.md
    godbeast-encyclopedia-hero.md
    cast-portrait-bible-prestige.md
    godbeast-prestige-hero.md
  forbidden-tokens.json
  materials-whitelist.json
  design-card.schema.json
```

Job folders **pin version** (`promptOsVersion: "2026-07-16"`), not fork forever copies without note.

---

## 7. Style packs engineering review

### Pack matrix (locked)

| ID | rail | house | Public Codex | Product chrome | Soul training |
|----|------|-------|--------------|----------------|---------------|
| `house-myth-tech` | world | **yes** | **yes** | **no** | **yes** (after face approve) |
| `prestige-illustrated` | world | no | pilot only | no | face-ref only, labeled |
| `product-lab-chrome` | product | no | no | **yes** | n/a |
| `anime-social-experiment` | experiment | no | **no** | **no** | **no** |

### Pack defects

1. **No schema** — free-form JSON; fields differ (`lookName` vs yaml `look_name` in docs).  
2. **Ad-hoc IDs on board** violate “declare pack” rule. Packaging is not a new style pack — use `house-myth-tech` + `workflow: hybrid-codex-card` / `workflow: social-crop`.  
3. **Prestige materials whitelist too thin** — should still allow nacre/vial identity materials or identity collapses.  
4. **Anime pack engines** list `niji-class-if-available` — fine for experiment; never default route.  
5. **No `fxBudget` field** on packs.  
6. **No `forbiddenTokens` machine list** separate from prose `forbidden[]`.

### Enforcement rule (lock)

```
valid stylePackId ∈ keys(style-packs/*.json)
workflowId ∈ { codex-encyclopedia, social-crop, hybrid-codex-card, product-marketing, experiment-ab }
stylePackId must not encode workflow with "+" or suffix hacks
```

---

## 8. Dual-rail engineering review

### Law (PASS — lock forever)

```
RAIL-P  authority = TASTE.md + DESIGN.md + @arcanea/design-system
RAIL-W  authority = VISUAL_DOCTRINE.md + house-myth-tech
RAIL-E  authority = experiment pack + labeled folder only
```

**Collapse of rails is a product bug, not an aesthetic preference.**

### Landing / product marketing (non-negotiable)

1. Shell = RAIL-P only.  
2. ≤1 RAIL-W still above fold, **framed as Codex content**.  
3. D2-class marketing stills must embed a **real approved master**, not a low-poly stand-in.  
4. Prefer hybrid: **code UI chrome** + framed master over generative fake dashboards with legible-looking nonsense (board D1 correctly bans readable text).

### Failure modes observed

| Symptom | Root | Fix |
|---------|------|-----|
| “Landing feels LARPy” | World as chrome | Frame or remove |
| “Photoreal weird” | FX density + no packaging | FX budget + Codex card |
| “Anime would be easier social” | Virality ≠ moat | Hooks from A+E, not house pivot |
| Brand-pack purple accent | Token drift vs TASTE teal | Prefer TASTE tokens for chrome; purple world-optional only |

---

## 9. Quality gates — score30 dimensions (canonical)

**Use this exact table for every flagship still/video.** Total = sum. Ship only if total ≥ 28 **and** no hard doctrine fail.

| # | Dimension | 0 | 1 | 2 | 3 |
|---|-----------|---|---|---|---|
| 1 | **Identity lock** | Wrong entity / face lottery | Generic pretty | Prop or face weak | Face+prop+mark match bible/card |
| 2 | **Silhouette / thumbnail** | Unreadable at 50px | Soft shape | Readable | Instant icon (Otome-class) |
| 3 | **Materials luxury** | Plastic/mud/spandex | Mixed kitsch | Mostly whitelist | Full doctrine materials |
| 4 | **Light law** | Neon/flat gray | Partial | Gold×blue present | Cosmic dusk + domain secondary, restrained rays |
| 5 | **Composition / crop** | Clutter / cut off | Weak | Clean | Encyclopedia plate + safe zones |
| 6 | **Lore place / beat** | Nowhere generic | Vague | Correct realm | Place + pose beat narrative |
| 7 | **Anti-slop / anti-glyph** | Glyphs/text/hearts/FX spam | Mild slop | Clean | Museum restraint |
| 8 | **Motion readiness** | Morph chaos | Busy | OK I2V | Slow identity-preserving loop |
| 9 | **Franchise distinctness** | Generic AI fantasy | Soft Arcanea | Clear | Only-Arcanea reading |
| 10 | **Channel fit** | Wrong aspect/use | Stretch risk | Stated crop OK | Master + social safe |

**Auto decision:**

| Total | Decision |
|-------|----------|
| ≥ 28 and lint clean | `eligible` → human approve |
| 22–27 | `iterate` (one repair) |
| ≤ 21 | `restart` |
| Any vision hard-fail | `blocked` regardless of total |

**evidence.json minimum per item:**

```json
{
  "id": "05-mera-tidecrest",
  "score30": 28,
  "scoreBreakdown": {
    "identity": 3,
    "silhouette": 3,
    "materials": 3,
    "light": 3,
    "composition": 3,
    "lore": 3,
    "antiSlop": 2,
    "motion": 3,
    "franchise": 3,
    "channel": 2
  },
  "doctrineLint": {
    "glyphs": false,
    "text": false,
    "heartArchitecture": false,
    "godbeastHumanoid": false,
    "fxBudgetOk": true
  },
  "inspected": true,
  "inspectedBy": "agent|human",
  "notes": "..."
}
```

---

## 10. CI-style gates for media-jobs (implement next)

### 10.1 Required fields (image-lab world flagship)

Jobs missing any **required** field are **invalid** and must not enter registry / social queue.

```json
{
  "id": "codex-encyclopedia-<slice>-YYYY-MM-DD",
  "brandId": "arcanea",
  "rail": "world | product | experiment",
  "stylePackId": "house-myth-tech | prestige-illustrated | product-lab-chrome | anime-social-experiment",
  "workflowId": "codex-encyclopedia | social-crop | hybrid-codex-card | product-marketing | experiment-ab",
  "assetTier": "A | B | C | D | blocked",
  "subjectIds": ["mera-tidecrest"],
  "entityClass": "cast | godbeast | product | packaging",
  "promptOsVersion": "2026-07-16",
  "masterRef": "path-or-null",
  "designCards": [{ "...design card schema..." }],
  "promptCompiled": ["..."],
  "engine": {
    "still": "grok-imagine-image-quality@2k",
    "video": "grok-imagine-video-1.5 | null"
  },
  "provenance": {
    "harness": "hermes-direct-xai | ...",
    "createdAt": "ISO-8601"
  },
  "paths": {
    "jobRoot": ".arcanea/image-lab/<jobId>/",
    "masters": ["..."],
    "videos": [],
    "crops": { "square": null, "portrait": null, "story": null, "og": null },
    "evidence": "evidence.json"
  },
  "qa": {
    "inspected": true,
    "score30": 28,
    "scoreBreakdown": {},
    "doctrineLint": {
      "glyphs": false,
      "text": false,
      "heartArchitecture": false,
      "godbeastHumanoid": false,
      "fxBudgetOk": true
    },
    "notes": "..."
  },
  "decision": "draft | iterate | restart | eligible | approved | blocked | published",
  "humanApprove": {
    "required": true,
    "approved": false,
    "by": null,
    "at": null
  }
}
```

### 10.2 Gate pipeline (ordered, fail-fast)

```
G0  PATH     jobRoot under .arcanea/image-lab/ ; no universe/ ; local files exist
G1  SCHEMA   JSON Schema validate media-job.json
G2  PACK     stylePackId ∈ style-packs registry; rail matches pack.rail
G3  RAIL     product jobs cannot use house-myth-tech characters as chrome
G4  CARD     designCards present for each subject; required fields non-empty
G5  TOKENS   forbidden-tokens scan on promptCompiled (house/prestige)
G6  MASTER   if entity has approved master → masterRef required (except first master gen)
G7  ENGINE   flagship A tier still must be grok-imagine-image-quality@2k (or documented override)
G8  FILES    masters on disk; byte size > 0; not CDN-only
G9  SCORE    scoreBreakdown sums to score30; score30 ∈ 0..30
G10 LINT     doctrineLint all false/ok; any true fail → decision cannot be approved/published
G11 SHIP     decision approved requires score30≥28 AND humanApprove.approved AND lint clean
G12 CROPS    if workflow social/* → four crop paths required
G13 REG      registry write only after G11; usedIn updates only on publish receipt
```

### 10.3 stylePackId enforcement rules

| Rule | Action |
|------|--------|
| Missing `stylePackId` | **REJECT** |
| Unknown ID | **REJECT** |
| `house: true` pack used with `rail: product` | **REJECT** |
| `anime-social-experiment` with `workflow: codex-encyclopedia` | **REJECT** |
| `anime-social-experiment` as Soul training set | **REJECT** |
| `prestige-illustrated` without folder label / pack id in path | **REJECT** |
| Ad-hoc IDs containing `+` or unregistered suffix | **REJECT** (use `workflowId`) |
| Pack `shipBarScore30` vs job score | Job score must meet pack bar for approve |

### 10.4 Suggested validator location

```
arcanea-ai-app/
  scripts/image-lab/
    validate-media-job.mjs
    forbidden-tokens.json
    media-job.world.schema.json
  package.json script:
    "verify:image-lab": "node scripts/image-lab/validate-media-job.mjs --all"
```

CI: run on PR when `.arcanea/image-lab/**` changes (optional non-blocking until first green week, then **blocking** for `decision: approved|published`).

### 10.5 Bridge to multi-brand schema

Current BIS `media-job.schema.json` is **social-static product** shaped (`jobId` date pattern, no dual-rail). Do **not** force world encyclopedia jobs into that schema unchanged.

**Options (pick one, document):**

1. **Extend** BIS schema with optional `rail`, `stylePackId`, `doctrineLint`, `designCards`.  
2. **Adapter**: image-lab world job → BIS job on social promote only.  
3. **Separate** `media-job.world.schema.json` under image-lab + promote summary to registry.

Until chosen, image-lab remains SSOT for world IP; BIS remains SSOT for multi-brand social-static.

---

## 11. What must be locked for all future gens

### 11.1 Locked decisions (do not reopen without Frank + Queen log)

1. **House style** = `house-myth-tech` / Cinematic Myth-Tech Encyclopedia.  
2. **Anime** = experiment only; never house, never Soul training, never book masters.  
3. **Prestige illustrated** = labeled secondary pilot, not co-house until formal promotion.  
4. **Product chrome** = TASTE / `product-lab-chrome` only.  
5. **Flagship engine** = Grok Imagine Quality @ 2K + Video 1.5.  
6. **Ship bar** = score30 ≥ 28 + doctrineLint clean + human approve.  
7. **Exact public text** = deterministic overlay only.  
8. **Godbeasts are creatures**, never humanoid origin suits.  
9. **FX budget = 1** domain effect + ambient.  
10. **One subject** per flagship frame.

### 11.2 Locked kill list

- Anime house pivot  
- Musical notation / letters / logos in gen  
- Heart-shaped architecture / emoji magic  
- Prompt noise (`masterpiece`, `8K best quality`)  
- World key art as unframed product chrome  
- Raw lab dumps to social  
- New seed lottery after master exists (without ref)  
- Fake approve below 28  
- Invent-a-verse entities without lore sheet update  
- Multi-entity collage as encyclopedia flagship  

### 11.3 Locked production unit (weekly)

**Minimum green:** 1 design card + 1 still on disk + evidence with breakdown + continuity update.  
**Strong week:** still + I2V + crops + human gate.  
**Never:** prompt-only theater, CDN-only done, score-from-prompt fantasy.

### 11.4 Immediate repair queue (ordered)

1. **E2 re-gen** — Otome 9:16, no glyphs, FX budget 1, registered `stylePackId=house-myth-tech`, `workflowId=social-crop`.  
2. **D2 rebuild** — product lab chrome + **real** framed A1/A2 master (code hybrid preferred).  
3. **Laeylinn repair** — remove heart portal architecture.  
4. **Akamoto iterate** — re-score full frame; ship only ≥28.  
5. **Promote Prompt OS** to `image-lab/prompt-os/`.  
6. **Add media-job schema + validator** (§10).  
7. **Face approve** Mera / Emilia / Arion / Akamoto → face bible → Soul candidates.  
8. **Backfill** batch2 media-job with `rail`, `stylePackId`, scoreBreakdown, doctrineLint.  
9. **Invalidate** ad-hoc board pack IDs in any future ledger copies.  
10. **Social pilot** only from approved masters + deterministic Codex overlays.

---

## 12. Batch2 honesty audit (process control)

| Item | score30 | Ship policy | Notes |
|------|---------|-------------|-------|
| Mera | 28 | eligible | Minor rune text → lint dim7 note; fix on next edit |
| Emilia | 29 | eligible | Strong prop lock |
| Akamoto | 27 | iterate | Do not social ship |
| Kaelith | 28 | eligible | Form drift risk — set form master soon |
| Otome | 29 | eligible | Best godbeast template proof |
| Laeylinn | 26 | iterate/repair | Heart portal cartoon slip |

**Process PASS:** honest scores, not fake-28.  
**Process FAIL:** media-job missing rail/stylePackId; no scoreBreakdown; no crops; registry humanApprove empty.

---

## 13. Open engineering work (acceptance criteria)

| Work item | Done when |
|-----------|-----------|
| Prompt OS promotion | `prompt-os/PROMPTING_SYSTEM_V2.md` exists; jobs pin version |
| media-job.world.schema.json | validates batch2 after backfill |
| `verify:image-lab` script | fails on missing stylePackId / forbidden tokens / score&lt;28 approve |
| Face bible v0 | ≥3 angles for Mera + Emilia |
| E2 clean | doctrineLint all green; score≥28 |
| D2 marketing | real framed master; product rail; no low-poly bird |
| Prestige templates | MD templates exist or pack IDs removed |
| BIS bridge decision | written in operating model § |

---

## 14. Final Codex statement

The Arcanea visual system has **crossed the strategy and template threshold**. House style, dual-rail, materials law, and score bar are correct and should be treated as **locked core**.

It has **not** crossed the **engineering enforcement** threshold. Without:

- registered `stylePackId` + `rail` on every job,  
- doctrineLint (especially glyph/text/heart architecture),  
- masterRef after first approve,  
- scoreBreakdown + humanApprove audit,  
- crop/overlay packaging,

…future gens will **re-create E2 and D2 class failures** at scale.

**Do not generate more volume until G0–G11 gates exist at least as a local validator + agent checklist.** Prefer one clean Otome social master and one framed product still over ten ungoverned pretty images.

---

*Codex-class review · 2026-07-16 · grounded in image-lab SSOT, direction board ledger, batch2 evidence, VISUAL_DOCTRINE, TASTE, and brand-image-system runtime contracts.*
