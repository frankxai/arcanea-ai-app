# Arcanea Visual OS — Operating Model

**Status:** OPERATING (2026-07-16)  
**Role:** Concrete system Frank (and Queen agents) run weekly for image + video.  
**Complements:** `VISUAL_MEDIA_STRATEGY_QUEEN_2026-07-16.md` (why) · this file (how)  
**SSOT repos:**  
- World IP lab: `arcanea-ai-app/.arcanea/image-lab/`  
- Multi-brand contracts: `starlight-design-intelligence/brand-image-system/runtime/`  
- Local binaries cache: `C:\Users\frank\brands\image-system\` (jobs mirror only — never second law)  
**Canon inject:** `CANON_LOCKED.md` · `VISUAL_DOCTRINE.md` · `CHARACTER_CORE.md` · `TASTE.md` (product chrome only)

---

## 0. One-screen map

```
                    ┌─────────────────────────────────────┐
                    │         DUAL RAILS (hard)            │
                    │  RAIL-P: Product UI (TASTE lab)      │
                    │  RAIL-W: World media (VISUAL_DOCTRINE)│
                    └───────────────┬─────────────────────┘
                                    │
         brand pack + style pack + workflow pack
                                    │
                         media-job.json (validated)
                                    │
              ┌─────────────────────┼─────────────────────┐
              ▼                     ▼                     ▼
        Engine route A        Engine route B        Engine route C
        Grok Imagine 2K       NB2 / Nano Banana     Deterministic
        flagship stills       fast variants / NFT   HTML·Satori·Playwright
        + I2V loops           bulk explore          exact text / Codex cards
              │                     │                     │
              └─────────────────────┼─────────────────────┘
                                    ▼
                     crops · evidence score30≥28 · human approve
                                    ▼
              asset registry + usedIn · social pack · site consume
```

**North star:** *Museum-grade living myth as content; AI-lab premium as chrome. Never collapse the two.*

---

## 1. Dual rails (anti “too weird for landing page”)

| Rail | Authority | Surfaces | Generator default | Banned |
|------|-----------|----------|-------------------|--------|
| **RAIL-P Product UI** | `TASTE.md` + `DESIGN.md` + `@arcanea/design-system` | App shell, dashboards, settings, BYOK, marketing chrome, empty states | Code/tokens first; optional abstract lab stills | Full Godbeast key art as chrome; purple fantasy gradients; fantasy-game UI |
| **RAIL-W World media** | `VISUAL_DOCTRINE.md` + house style pack | Codex encyclopedia, cast/godbeast, book plates, trailers, world social | Grok Imagine Quality @ 2K + Prompt OS v2 | Product chrome language; invent-a-verse; isekai glow as house |

### Landing / homepage rule (non-negotiable)

1. Shell = RAIL-P only (Geist, glass cards, teal/cosmic tokens).  
2. At most **one** RAIL-W still above the fold — and only **framed as Codex content** (museum card chrome, not full-bleed LARP wallpaper).  
3. Prefer: *small Codex plate* + product CTA, not “MMO login splash.”  
4. If a world still fails the “would Anthropic put this in chrome?” test → move to Codex/social, keep landing lab.

### Weirdness diagnostics (use before restyling the house)

| Symptom | Root cause | Fix |
|---------|------------|-----|
| Landing feels LARPy | Rail collision (world art as chrome) | Frame or remove; keep TASTE shell |
| Social feels random | No Codex packaging / multi-entity dumps | One subject + deterministic name/gate card |
| Uncanny cast | Face drift / no identity lock | Approve face bible → Soul ID before volume |
| Cartoon slip | Literal symbols (heart portals, sheet music) | Forbidden list + one repair pass |
| FX overload | Magic density too high for cold audience | Tighter crop on eyes/scale; lower particle density in prompt |

**Do not** pivot house style to full anime because of rail collision. Fix packaging and rails.

---

## 2. Style packs

Machine-readable packs live in `.arcanea/image-lab/style-packs/`. Every media job declares `stylePackId`.

| ID | Role | When |
|----|------|------|
| `house-myth-tech` | **HOUSE** — Cinematic Myth-Tech Encyclopedia | All official cast, Godbeasts, Codex heroes, book key art |
| `prestige-illustrated` | **Rail B secondary** | Prestige/emotional middle (*Arcane*-adjacent); labeled; never mixed unlabeled into house ledger |
| `product-lab-chrome` | **RAIL-P** | Product UI / abstract lab mood; almost never generative characters |
| `anime-social-experiment` | **Experiment only** | Explicit social A/B; separate folder; never house SSOT |

### Pack contract (required fields)

```yaml
id: house-myth-tech
version: "2026-07-16"
rail: world | product | experiment
house: true|false
look_name: "Cinematic Myth-Tech Encyclopedia"
materials_whitelist: [...]   # from VISUAL_DOCTRINE
light_law: "warm gold × cool cosmic blue; cosmic dusk"
forbidden: [...]
prompt_templates: [cast-portrait-bible, godbeast-encyclopedia-hero]
engines_preferred: [grok-imagine-quality-2k]
engines_allowed: [nb2-explore, higgsfield-soul]
identity_mode: design-card | soul-id | face-ref-chain
ship_bar_score30: 28
```

**Drift control:** new jobs must load the pack + inject materials/forbidden. Agents may not invent a fifth unofficial “look” without a new pack file + Queen decision log.

---

## 3. Prompt OS (v2 — elevated to shared OS)

**Canonical templates:**  
`image-lab/codex-encyclopedia-preview-batch2-2026-07-16/PROMPTING_SYSTEM_V2.md`  
(Promote edits into that file or `prompt-os/PROMPTING_SYSTEM_V2.md` when versioning; job folders may pin a copy.)

### Loop

```
1. Continuity queue (CONTINUITY_QUEUE.md)
2. Design card (yaml fields — never skip)
3. Compile via Cast Portrait Bible OR Godbeast Encyclopedia Hero
4. Generate still → local materialize → vision QA
5. I2V with motion seed written WITH the still
6. Crops + Codex card overlay (if social/site)
7. evidence.json score30 → human gate
```

### Design card (minimum)

`id, entity_class, name, role, gate/domain, silhouette, materials, palette, light, environment, camera/crop, pose_beat, prop, identity_lock, forbidden, motion_seed, stylePackId, rail`

### Compile rules (hard)

1. Identity first (name — role).  
2. Form → materials → light → environment → camera.  
3. Materials **whitelist only** (VISUAL_DOCTRINE).  
4. Ban list as **positives** (“clean encyclopedia crop”) not spam “no bad hands.”  
5. **No text / UI / watermark / logo** in gen for world heroes.  
6. Cast default portrait ~3:4; Godbeast landscape 16:9.  
7. Motion seed preserves identity (slow, readable).

---

## 4. Engine routing — Grok vs NB2 vs deterministic

| Need | Engine | Model / path | Notes |
|------|--------|--------------|-------|
| **Flagship Codex still** | **Grok** | `grok-imagine-image-quality` @ **2k** via `XAIImageGenProvider` | Proven batch1+2. Primary house path. |
| **Flagship I2V** | **Grok** | `grok-imagine-video-1.5`, ~6s, from approved still | Cast 9:16 / beast 16:9 as needed |
| **Fast explore / NFT bulk / trait matrix** | **NB2** | Gemini Nano Banana 2 / Pro (repo `.nano-banana-config.json`) | Not house flagship until score≥28 + face lock |
| **Soul-locked face volume** | **Higgsfield Soul** | Soul ID after face approval | Identity-faithful variants |
| **Exact public text, claims, Codex name/gate card, charts, logos** | **Deterministic** | HTML/CSS + Satori/Playwright (Creative OS) | Never trust gen for legal/claim text |
| **Hybrid** | Gen base + deterministic overlay | Grok/NB2 plate → Codex card template | Default for social packaging |
| Hermes `image_generate` FAL fail | **Route-switch** | xAI OAuth plugin (not stop) | Max one FAL failure then switch |

### Decision tree (agents)

```
if surface in product chrome / app UI:
  → RAIL-P; code/tokens; stop (no Godbeast gen)
if exact text/claims/UI diagram:
  → deterministic (or hybrid with text on top)
if official cast/godbeast/Codex hero:
  → house-myth-tech + Grok quality 2k + design card
if approved face + need many angles:
  → Soul ID / face refs
if bulk NFT / explore only:
  → NB2, labeled non-ship until gate
if anime experiment:
  → anime-social-experiment pack + separate job folder
```

### Cost / quality tiers

| Tier | Use | Engine |
|------|-----|--------|
| **A Flagship** | Codex shelf, book plate, trailer still | Grok 2k + score≥28 + human |
| **B Production** | Social repurpose from A, slight outpaint/crop | Edit from A; optional NB2 only if identity holds |
| **C Explore** | Form tests, rejected sketches | NB2 / standard; never auto-promote |
| **D Blocked** | Invent-a-verse, chrome LARP, gen-text claims | Do not generate |

---

## 5. Channel crops & packaging

### Master → derived (never re-roll random seeds per channel)

| Source | Masters | Derived crops |
|--------|---------|---------------|
| Cast still | 3:4 portrait | 1:1, 4:5 (1080×1350), 9:16 story, OG 1200×628 |
| Godbeast still | 16:9 hero | 1:1 center, 9:16 vertical awe crop, OG |
| I2V loop | 6s mp4 | 9:16 native for Reels/TikTok/Shorts; 1:1 cut if needed |
| Codex card | Deterministic overlay | Same four social crops as Creative OS `social-static` |

### Creative OS four-crop standard (social-static)

- square 1080×1080  
- portrait 1080×1350  
- og 1200×628  
- story 1080×1920  

World jobs may keep masters in image-lab and write social packs under:

```
.arcanea/image-lab/<jobId>/
  masters/
  crops/
  overlays/          # Codex name/gate cards
  media-job.json
  evidence.json
  prompts.json
```

Mirror approved social packs also to:

`C:\Users\frank\brands\image-system\jobs\YYYY-MM-DD\<jobId>\`  
when promoting to multi-brand registry.

### Social packaging that reduces weirdness

1. Frame as **Codex** (name · gate · one sentence) — deterministic overlay.  
2. **One subject** per post.  
3. Cold audience: tighter face/eye crop (cast) or single scale moment (beast).  
4. Silent-first video: scale → eye contact → title card (overlay, not baked gen text).  
5. Only `approved/` + human gate ships.

---

## 6. Quality gates (score30)

### Ship bar

| Score | Action |
|-------|--------|
| ≥ 28 | Eligible for human approve → registry |
| 22–25 | One repair pass (prompt + optional ref) |
| < 22 | Restart; do not iterate forever |
| Cartoon/literal doctrine slip | One targeted repair or reject |

### 10 dimensions (3 pts each = 30)

1. Identity lock (face/prop/species)  
2. Silhouette (50px readable)  
3. Materials luxury (whitelist)  
4. Light law (gold × cosmic blue)  
5. Composition / thumbnail  
6. Lore place / realm  
7. Anti-slop (no plastic, isekai, neon, mud)  
8. Motion readiness (I2V-safe)  
9. Franchise distinctness  
10. Crop usability (safe zones)

### Extra gates before public

- [ ] Rail correct (P vs W)  
- [ ] Style pack declared and not mixed  
- [ ] No gen text for claims  
- [ ] Paths on disk (not CDN-only)  
- [ ] Vision inspected (not score-from-prompt fantasy)  
- [ ] Human approval recorded  

Honest scores only (batch2 Laeylinn 26 → optional repair; Akamoto 27 → iterate — pattern to keep).

---

## 7. Soul IDs (identity OS)

### When

Only after **human face approval** of house stills for that character.

### Order (core cast)

1. Arion (batch1)  
2. Mera · Emilia · Akamoto (batch2)  
3. Later: Ismael / others only if public center  

Godbeasts: **silhouette + material DNA + master still refs** (not human Soul face models). Use reference chaining for beasts.

### Procedure

1. Promote approved masters to `image-lab/approved/face-bible/<slug>/` (5–15 angles preferred over time).  
2. Train Higgsfield Soul (`higgsfield-soul-id`) or equivalent face-lock — store `soulRefId` in registry, never only chat.  
3. Downstream: all volume gens must pass `--soul-id` or `reference_image_urls` from approved masters.  
4. Reject any new “pretty face” that fails silhouette/face match vs bible.  
5. Logo ≠ character: product mark stays vector chrome.

### Anti-drift

- No parallel “v2 face” without retiring old Soul + registry note.  
- Weekly: spot-check one cast still against face bible.  
- Silhouette uniqueness for siblings/mascots if multi-brand cast expands.

---

## 8. Asset registry & long-term DAM

### Layers

| Layer | Path | Role |
|-------|------|------|
| Lab SSOT | `arcanea-ai-app/.arcanea/image-lab/` | Jobs, prompts, evidence, masters |
| Approved | `image-lab/approved/` | Face bible + shippable masters |
| Multi-brand registry | `brand-image-system/runtime/asset-registry.json` | Cross-brand `usedIn` |
| Arcanea registry | `image-lab/registry/arcanea-media-registry.json` | World IP graph (entity → assets) |
| Local cache | `brands/image-system/jobs/` | Binaries mirror |
| Site consume | `apps/web/public/...` or Vercel Blob | Only after approve |
| Browse later | Eagle (desktop) → Immich projection | Not SSOT |

### Registry entry (minimum)

```json
{
  "id": "arcanea-2026-07-16-mera-tidecrest-v1",
  "brandId": "arcanea",
  "rail": "world",
  "stylePackId": "house-myth-tech",
  "entity": "mera-tidecrest",
  "entityClass": "cast",
  "jobId": "codex-encyclopedia-preview-batch2-2026-07-16",
  "score30": 28,
  "soulRefId": null,
  "files": { "master": "...", "crops": {}, "video": "..." },
  "decision": "approved",
  "usedIn": []
}
```

`usedIn` updated on every post/site placement. No fabricated paths.

---

## 9. Social pipeline (weekly-ready)

```
Source frames (Codex lab)
  → approve masters
  → hybrid Codex card overlay (deterministic)
  → 4 crops + optional 6s loop
  → caption pack (lore fact + CTA; CHARACTER_CORE beat)
  → approval packet → #social-approvals (or brand channel)
  → schedule (Postiz / human) — never auto raw lab dump
  → registry usedIn receipt
```

### Funnel role

FrankX signal → GenCreator frameworks → **Arcanea world amplify** → Starlight distribution.  
World posts sell *a living world + sovereign craft*, not “another image model.”

### Pilot pack (first ship after approve)

| # | Asset | Channel | Form |
|---|-------|---------|------|
| 1 | Mera | IG/X | 4:5 still + Codex card |
| 2 | Emilia | IG/LinkedIn | Carousel: role / prop / beat |
| 3 | Otome | X/IG | 16:9 → 1:1 awe still |
| 4 | Kaelith | Reels/Shorts | 6s loop + silent title card |

Measure saves/shares and “who is X?” replies — not vanity likes alone.

---

## 10. Weekly operating cadence

### Monday — Continuity & plan (30–45 min)

- [ ] Read `CONTINUITY_QUEUE.md` + last evidence.json  
- [ ] Pick **one** production slice (not five): remaining Godbeast **or** repair **or** social pack **or** face/Soul  
- [ ] Confirm free disk (media is heavy); stop if C: critically low  
- [ ] Open todo list with ship bar explicit  

### Mid-week — Produce (1 flagship unit)

**Default unit:** 1 still + 1 I2V loop + design card + ledgers  

1. Design card → compile prompt (house pack)  
2. Grok quality 2k → materialize under new `image-lab/<jobId>/`  
3. Vision score30  
4. I2V if still ≥ 26  
5. Crops if targeting social this week  

### Friday — Package & gate (45–90 min)

- [ ] evidence.json honest  
- [ ] Codex overlays for anything public-bound  
- [ ] Human approve → `approved/` + registry  
- [ ] Social packet or site PR only if ≥28  
- [ ] Update CONTINUITY_QUEUE  
- [ ] Log decision (ship / repair / hold)  

### Monthly

- [ ] Face bible audit (drift?)  
- [ ] Style pack version bump if doctrine changes  
- [ ] Soul ID train/refresh for approved faces  
- [ ] Rail audit: any world art leaked into chrome?  
- [ ] Promote 3–5 masters into Codex product surface  

### What “done” means each week

**Minimum green week:** 1 new flagship still on disk + evidence + queue updated.  
**Strong week:** still + loop + social pack human-gated.  
**Do not:** prompt-only theater, CDN-only assets, fake score30.

---

## 11. Short-term production plan (30 days)

| Week | Focus | Output |
|------|-------|--------|
| W1 | Freeze OS (this doc) + Laeylinn repair optional + Godbeast **Yumiko** | Job folder + evidence |
| W2 | Godbeasts **Vaelith, Kyuro** | 2 stills + loops |
| W3 | **Source** + **Malachar** portrait | Complete first shelf slice |
| W4 | Social pilot pack (Mera/Emilia/Otome/Kaelith) + Codex card template | Human-gated posts |
| Parallel | Face approve core cast → Soul ID candidates | face-bible/ folder |

Also: landing rule enforced — one framed Codex max; chrome stays TASTE.

---

## 12. Long-term (12 months)

| Horizon | Outcome |
|---------|---------|
| Q1 | Ten Godbeasts + public cast center; style pack v1 locked; Soul IDs core cast; registry usedIn live |
| Q2 | Prestige Illustrated Rail B pilot (3–5 labeled shots); social flywheel from masters |
| Q3 | Codex product media graph (entity ↔ assets); automated crop/overlay; human approve remains |
| Q4 | Book plates + trailer assembly; creator-world demos using *same OS*, not same aesthetic chaos |

**Moat:** canon + house style + identity locks + packaging OS + product memory — not generation speed.

---

## 13. Job folder contract

```
.arcanea/image-lab/<jobId>/
  brief.md                 # optional human brief
  PROMPTING_SYSTEM_V2.md   # pin or symlink note
  prompts.json             # design cards + compiled
  media-job.json           # paths + provenance + stylePackId + rail
  still-ledger.json
  video-ledger.json
  evidence.json            # score30 per item + decision
  NN-slug.png / .mp4
  crops/                   # when social/site
  overlays/
```

`jobId` pattern: `codex-encyclopedia-<slice>-YYYY-MM-DD` or `world-social-<slug>-YYYY-MM-DD`.

Provenance must record engine (still + video), resolution, harness (e.g. `hermes-direct-xai`).

---

## 14. Agent / Hermes playbook

1. Load skills: `agent-workspace-bootstrap` → `brand-image-creative-os` → `arcanea-genius-evolution`.  
2. 4-fact git on `arcanea-ai-app` before write.  
3. Never use `C:\Users\frank\universe\`.  
4. FAL missing → xAI route-switch immediately.  
5. Design card before generate.  
6. Materialize CDN → local.  
7. Honest score30; human gate for public.  
8. Update continuity queue.

---

## 15. STOP / START / CONTINUE

### STOP

- Anime as house style  
- World key art as product chrome  
- Prompt soup without design cards  
- Raw lab dumps to social  
- Literal cartoon symbols  
- CDN-only “done”  
- Fake approve below 28  

### START

- Declare `stylePackId` + `rail` on every job  
- Weekly single-unit cadence  
- Codex card overlays as first-class  
- Soul IDs after face approve  
- Registry `usedIn` on publish  

### CONTINUE

- VISUAL_DOCTRINE materials + light  
- Prompt OS v2  
- Grok quality @ 2k flagships  
- score30 + evidence  
- Canon-first  

---

## 16. Decision log

| Decision | Choice |
|----------|--------|
| House style | `house-myth-tech` Cinematic Myth-Tech Encyclopedia |
| Product chrome | RAIL-P TASTE only |
| Flagship engine | Grok Imagine quality 2k + video 1.5 |
| Explore/NFT bulk | NB2 labeled non-ship |
| Exact text | Deterministic / hybrid |
| Anime | Experiment pack only |
| Prestige illustrated | Secondary pack, labeled |
| Ship bar | score30 ≥ 28 + human |

---

## 17. Related files

| File | Role |
|------|------|
| `VISUAL_MEDIA_STRATEGY_QUEEN_2026-07-16.md` | Strategy / ICP / market |
| `style-packs/*.json` | Machine style contracts |
| `CONTINUITY_QUEUE.md` | What ships next |
| `WEEKLY_RUNBOOK.md` | Checklist only |
| `registry/arcanea-media-registry.json` | World asset graph |
| batch2 `PROMPTING_SYSTEM_V2.md` | Prompt templates |
| brand-image-system `runtime/` | Multi-brand schemas / social-static |
| `TASTE.md` | Product chrome bar |
| `VISUAL_DOCTRINE.md` | World materials & factions |

---

*Arcanea Visual OS · Creative OS engineer lane · 2026-07-16 · executable weekly system, not strategy theater.*
