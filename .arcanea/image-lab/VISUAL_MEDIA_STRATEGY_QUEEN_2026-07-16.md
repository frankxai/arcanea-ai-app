# Arcanea Visual Media Strategy — Queen Council Brief
**Status:** OPERATING DECISION (2026-07-16)  
**Owner:** Starlight Queen · Arcanea Creative OS  
**Scope:** How we generate, why this style, ICP, competitors, short/long term, social use  
**Evidence base:** batch1+2 Codex previews · `PROMPTING_SYSTEM_V2.md` · `VISUAL_DOCTRINE.md` · `TASTE.md` · brand-packs/arcanea · market scan 2026  

**Executable OS (run weekly):** [`ARCANEA_VISUAL_OS_OPERATING_MODEL.md`](./ARCANEA_VISUAL_OS_OPERATING_MODEL.md) · [`WEEKLY_RUNBOOK.md`](./WEEKLY_RUNBOOK.md) · [`CONTINUITY_QUEUE.md`](./CONTINUITY_QUEUE.md) · `style-packs/`  

---

## 0. Executive answer (read this first)

| Question | Honest answer |
|----------|----------------|
| Are we on a good angle? | **Yes for world IP / Codex / cinematic heroes.** Not for product chrome. |
| Should we go full anime? | **No as house style.** Anime is a **secondary rail** for specific social/manga experiments only. |
| What is the house style? | **Luxury cosmic myth-tech cinematic** — photoreal *materials + light*, high-fashion heroic people, museum-grade creatures. Villeneuve × high fashion × living crystal (not LARP mud, not isekai glow, not MCU spandex). |
| Why does it feel “weird” sometimes? | Unfiltered photoreal magic + overloaded FX + no **channel packaging**. Fix packaging and rails, not the whole aesthetic. |
| Best long-term system? | **Dual-rail brand:** Lab chrome (TASTE) vs World media (VISUAL_DOCTRINE) + **one canon house style** + optional **prestige-illustrated** secondary + strict crop/use matrix. |
| Social? | Codex still/video = source frames → crop → caption lore → human approve. Never post raw lab dumps. |

**North-star line (use everywhere):**  
> *Arcanea’s world looks like a museum-grade living myth — not a fantasy MMO login screen and not a purple AI wallpaper.*

---

## 1. How we generated (what actually happened)

### Pipeline (batch 1 → batch 2)

```
Canon DNA (CANON_LOCKED + CHARACTER_CORE + godbeast sheets + VISUAL_DOCTRINE)
  → Design card (identity, silhouette, materials, light, beat, prop, motion seed)
  → Compiled prompt (Cast Portrait Bible | Godbeast Hero templates)
  → Still: Grok Imagine Quality @ 2K (xAI OAuth plugin; Hermes FAL offline)
  → Vision QA (score30)
  → I2V: Grok Imagine Video 1.5 · 6s · identity-preserving motion seed
  → media-job.json + evidence.json + lab folder SSOT
```

### Prompting system upgrades (why v2 exists)

| Problem in ad-hoc gen | v2 fix |
|-----------------------|--------|
| Prompt soup / “8K masterpiece” | Design cards → compiled templates |
| Same language for people & beasts | Separate cast vs godbeast grammars |
| Generic fantasy materials | **Material whitelist** from VISUAL_DOCTRINE |
| Weak identity | Age/face/prop/Starlight Mark locks |
| Motion afterthought | Motion seed written with still |
| No quality memory | score30 evidence + ship bar ≥ 28 |

### Style we used (precise name)

**Not** “photorealism” alone.  
**Not** “anime.”  

**Working name:** **Cinematic Myth-Tech Encyclopedia**  
- Photoreal *surfaces* (nacre, jade, starlight metal, living stone)  
- Cinematic *light* (cosmic dusk, gold × cool blue, restrained god-rays)  
- Fashion-editorial *people* (character bible, not cosplay snapshot)  
- Monumental *creatures* (godbeasts as sacred beasts, not humans in suits)  
- Controlled *magic* (one domain effect, not particle spam)

This matches brand-pack DESIGN mood: *Denis Villeneuve + refined mythic fantasy + Refik Anadol data-poetry* — and VISUAL_DOCTRINE “luxury cosmic myth-tech.”

---

## 2. Why this style exists (brand alignment)

Arcanea is **two surfaces that must not collapse into one**:

| Surface | Authority | Correct visual |
|---------|-----------|----------------|
| **Product chrome** (app, dashboards, settings, BYOK, OSS) | `TASTE.md` | **AI-lab premium** — Anthropic / Linear / Vercel. *“Never fantasy-game.”* Cosmic myth lives in content, not chrome. |
| **World media** (Codex, cast, Godbeasts, books, trailers, social world posts) | `VISUAL_DOCTRINE.md` + brand DESIGN | **Luxury cosmic myth-tech** cinematic encyclopedia |

Frank’s unease (“realism mix feels weird”) is usually **rail collision**:
- Putting full Godbeast key art as the **product homepage hero chrome** → feels LARPy next to lab UI.  
- Putting **lab-minimal abstract** as the **only** world look → kills franchise soul.

**Alignment rule:**  
- Landing / app shell → TASTE lab chrome + *one* controlled world still as *content*, framed like a museum card.  
- Codex / lore / social world → full myth-tech cinematic.  
- GenCreator product marketing → frameworks first; Arcanea art is *amplification*, not the product’s own chrome language.

---

## 3. ICP — who this is for (and who it isn’t)

### Primary ICP (pay / stay / build)

1. **AI-native creators & worldbuilders** — want their own worlds to feel *serious*, ownable, publishable (not disposable Midjourney wallpaper).  
2. **Premium myth / franchise aspirants** — care about continuity, cast, bestiary, encyclopedia (World Anvil grade ambition + better media).  
3. **Sovereign builders** — BYOK, export, craft, Chosen Responsibility (not gacha dopamine teens).

### Secondary ICP

4. **Readers / lore browsers** — Codex cards, short motion loops.  
5. **Design-aware founders** — respect lab chrome + myth content separation.

### Not primary

- Pure isekai/gacha anime fans as *the* ICP (huge market, wrong moat for Arcanea’s product promise).  
- Generic “AI art dump” Instagram (race to free noise).

**Expectation:** primary ICP expects **premium, consistent, lore-grounded** visuals — closer to **prestige IP key art** and **encyclopedia plates** than to TikTok anime filter packs. Anime can *touch* them as a *secondary* format; it should not own the brand.

---

## 4. Market / competitors (what “good” looks like in 2026)

| Cluster | Examples | Visual habit | Lesson for Arcanea |
|---------|----------|--------------|--------------------|
| **Worldbuilding tools** | World Anvil, Storyflow, Campfire, Obsidian vaults | Wiki + maps + *reference* art; rarely one house cinematic style | Win by **visual canon + Codex media**, not another note app |
| **AI image generalists** | Midjourney (moodboard/photoreal), Niji (anime), Leonardo | Style fragmentation is the default | **House style + identity locks** is the moat |
| **Fantasy AI platforms** | NovelAI (stylized), Inkarnate (painterly maps) | Strong niche styles | Don’t copy NovelAI anime as product DNA |
| **Prestige game→screen IP** | Riot *Arcane* (Fortiche 2D/3D hybrid) | Painterly, cinematic, **not** pure anime, **not** pure live-action | Best *emotional* reference for *secondary* “prestige illustrated” rail |
| **Premium social brands** | Polished short film / key art loops | Quality > volume; repurpose one flagship | Codex still → 6s loop → crops is correct pattern |

Market truth: **photoreal and anime both sell** — but tools that try to be *every* style read as *no* brand. Arcanea’s product is *sovereign creative intelligence + a specific living world*. Specificity wins.

---

## 5. Style options ranked (council matrix)

| Rank | Option | Fit to brand | Franchise durability | Social virality | Product chrome fit | Recommendation |
|------|--------|--------------|----------------------|-----------------|--------------------|----------------|
| **1** | **A — Cinematic Myth-Tech Encyclopedia** (current house) | Excellent (VISUAL_DOCTRINE) | High if Soul IDs + silhouettes lock | Medium-high (hooks = scale + beauty + lore) | Poor if used as chrome; excellent as *content frame* | **HOUSE STYLE** |
| **2** | **C — Dual-rail: House A + Prestige Illustrated B′** | Excellent if governed | Highest (Arcane-class secondary) | High | Keeps chrome clean | **STRATEGIC SECONDARY** |
| **3** | **B — Full anime / manhwa house** | Weak vs TASTE + doctrine bans (isekai glow) | Medium (crowded, hard IP distinctness) | High short-term | Bad next to lab UI | **Experiments only** |
| **4** | **D — Lab-minimal abstract only** | Good for chrome | Low for world IP | Low for lore fandom | Excellent chrome | **Chrome only, not Codex** |

### Honest verdict on current batch

- **Mera / Emilia / Otome / Kaelith:** on-brand, franchise-grade direction.  
- **Laeylinn heart portal:** doctrine slip (cartoon literalism) — process issue, not style failure.  
- **“Too weird” risk:** mostly (1) magic density, (2) no frame/context on social, (3) putting world art where chrome should be.  
- **Do not pivot house style to anime.** That would abandon locked visual doctrine and the premium museum position without gaining a defensible product moat.

If emotional warmth or “less uncanny” is needed, prefer **prestige illustrated** (hand-painted 3D/2D hybrid language — *Arcane*-adjacent) as **Rail B**, not Niji isekai.

---

## 6. How to think about image + video generation

### Mental model: **Source frames → Products → Channels**

1. **Source frames** (Codex lab): highest quality stills + short I2V loops. Expensive, rare, score-gated.  
2. **Products**: encyclopedia page, book illustration plate, trailer beat, NFT optional later, Soul ID reference.  
3. **Channels**: social crops, carousels, Reels, thumbnails — *derived*, not re-invented each time.

### Generation principles

1. **Canon before pixels** — no invent-a-verse silhouettes.  
2. **One house style** for official cast/godbeasts until a formal Rail B pack ships.  
3. **Identity locks** before volume (Soul ID / face bible after face approval).  
4. **score30 ≥ 28** ship; <22 restart; 22–25 one repair.  
5. **Human approve** before public.  
6. **Motion preserves identity** — slow encyclopedia loops, not morph chaos.  
7. **Text never in gen** for public claims — hybrid overlays if needed.

### Tool routing (practical)

| Need | Route |
|------|--------|
| Flagship Codex stills | Grok Imagine Quality @ 2K (proven path) |
| Character consistency later | Soul ID / face refs after approval |
| Fast social variants | Edit/outpaint from approved stills, not new random seeds |
| Exact text / charts | Deterministic HTML/Satori (Creative OS hybrid law) |
| Prestige illustrated experiments | Separate style pack + folder; never mix into house ledger without label |
| Product UI | Code + tokens; almost never raw gen as chrome |

---

## 7. Social media system (how these assets get used later)

### Asset → channel matrix

| Source | Crop / form | Channel | Caption job |
|--------|-------------|---------|-------------|
| Godbeast 16:9 still | 1:1 + 9:16 + OG | IG/X/LinkedIn | “Who is Kaelith?” + one lore fact + Codex CTA |
| Godbeast 6s loop | 9:16 native | Reels/TikTok/Shorts | Silent-first: scale → eye → one line title |
| Cast portrait | 4:5 + 9:16 | IG / stories | Character vow / wound beat (CHARACTER_CORE) |
| Cast + still side-by-side | Carousel 3–5 | IG/LinkedIn | Encyclopedia plate: Role / Gate / Prop / Quote |
| Process | Contact sheet | X / FrankX optional | “How we lock canon visuals” (builds trust) |

### Social packaging that reduces “weird”

1. **Frame it as Codex** — museum card UI (deterministic overlay): name, gate, one sentence.  
2. **One subject per post** — no multi-entity collage dumps.  
3. **Lower FX density for cold audiences** — crop tighter on face/eyes for cast; wider awe for beasts.  
4. **Separate accounts/lanes if needed** — Arcanea world vs Arcanea product.  
5. **Never auto-post lab folders** — only `approved/` + human gate.

### Funnel role (cross-brand)

FrankX signal → GenCreator framework → **Arcanea world amplify (these assets)** → Starlight scale distribution.  
Arcanea social should make people feel *a world is alive* and *you can build with intelligence* — not “download another image model.”

---

## 8. Short-term plan (30 days)

**Goal:** lock house style + finish first Codex shelf + social packaging proof.

1. **Freeze house style** as Cinematic Myth-Tech Encyclopedia (this doc).  
2. **Finish Godbeast set** (Yumiko, Vaelith, Kyuro, Source) + optional Laeylinn repair (no heart portal).  
3. **Cast bible** — approve Mera/Emilia/Akamoto/Arion faces; reject drift; prepare Soul ID candidates.  
4. **Ship packaging templates** — deterministic Codex card overlay (name/gate/line) for 1:1 and 9:16.  
5. **One social pilot pack** (human-gated): 3 posts (Mera, Emilia, Otome) + 1 reel (Kaelith). Measure save/share, not vanity likes.  
6. **Landing rule** — homepage uses TASTE chrome; *one* framed Codex still max above fold if any.  
7. **Log every job** under `.arcanea/image-lab/` + Creative OS evidence pattern.

---

## 9. Long-term plan (12 months)

**Goal:** Arcanea becomes the **visual memory of a living franchise**, not a folder of pretty gens.

| Quarter | Outcome |
|---------|---------|
| Q1 | Full Ten Godbeasts + public cast center in Codex; style pack v1 YAML; Soul IDs for core cast |
| Q2 | Prestige Illustrated **Rail B** pilot (3–5 shots) for anime/prestige-curious audience — labeled secondary |
| Q3 | Encyclopedia product surface (Codex) with media graph + appears-in; social flywheel automated but human-approved |
| Q4 | Multi-format: book plates, trailer assembly, partner world demos (other creators’ worlds under same *system*, not same aesthetic chaos) |

**Moat stack:** canon continuity + house style + identity locks + packaging OS + product memory — *not* “we generate faster.”

---

## 10. What to stop / start / continue

### STOP
- Full **anime house-style pivot**  
- Posting raw gen dumps without Codex frame  
- Using world key art as product chrome  
- Prompt soup without design cards  
- Literal cartoon symbols (giant hearts, music notation glyphs)  
- Inventing Godbeast forms outside lab + lore sheet update  

### START
- Explicit **Style Pack** files (`house-myth-tech`, optional `prestige-illustrated`, experimental `anime-social`)  
- **Channel crops + overlays** as first-class deliverables  
- **Soul ID / face bible** after human face approval  
- Competitive **visual QA checklist** (weirdness = FX density + rail mismatch)  
- Weekly **1 flagship still + 1 loop + 3 crops** cadence  

### CONTINUE
- VISUAL_DOCTRINE materials + light law  
- Prompting System v2  
- Grok Imagine Quality @ 2K for flagships  
- score30 gate + evidence.json  
- Canon-first generation  

---

## 11. Decision log (Queen)

| Decision | Choice | Rationale |
|----------|--------|-----------|
| House style | Cinematic Myth-Tech Encyclopedia | Matches VISUAL_DOCTRINE + brand DESIGN; durable IP; distinct from NovelAI/Niji flood |
| Anime | Secondary experiment only | High virality, low brand uniqueness for Arcanea product |
| Prestige illustrated | Planned Rail B | *Arcane*-class emotional middle ground without isekai |
| Product chrome | TASTE lab | Protects “AI-lab premium / never fantasy-game” |
| Social | Derive from Codex sources | Quality + consistency > volume |
| Current batch | Keep / repair Laeylinn | Direction correct; packaging next bottleneck |

---

## 12. Immediate next actions for Frank

1. **Approve or amend** this house-style decision (one sentence is enough).  
2. Choose next production slice: **(a)** remaining Godbeasts, **(b)** Laeylinn repair, **(c)** Codex card overlay + 3 social pilots.  
3. When faces approved → Soul ID training for Mera/Emilia/Arion/Akamoto.

---

*Produced under Starlight Queen mandate · multi-agent council requested (strategy / franchise / systems) · market scan 2026 · grounded in Arcanea SSOT and batch2 evidence.*
