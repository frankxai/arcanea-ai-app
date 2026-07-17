# Arcanea Ultimate Strategy & Roadmap — Queen Council Synthesis
**Date:** 2026-07-16  
**Council:** Starlight Queen · Fable 5 (taste/governance) · Product/CPO · GTM/CMO · Legal/Risk · Tech/Platform · Creative IP · Open-Core · Competitive Intel  
**Models used in synthesis:** estate dual audits (Claude + Codex 2026-07-15), goals OS (2026-07-06), live market scan 2026-07-16, Polar/Higgsfield/worldbuilding tool landscape  
**Classification:** **PRIVATE** (do not publish full file; public slice = thin roadmap only)  
**SSOT workspace:** `C:\Users\frank\starlight\repos\arcanea-ai-app` (`frankxai/arcanea-ai-app`, private)  
**Canon SSOT:** `.arcanea/lore/CANON_LOCKED.md` — **never** `C:\Users\frank\universe\` (quarantined)

---

## 0. Executive answer (read this first)

### What Arcanea is (one line)
> **The definitive creator OS for building, tracking, and emotionally inhabiting premium original worlds — proven first through Arcanea itself; franchise proves product; product strengthens franchise.**  
> (Consensus 2026-07-15 dual audit + Queen goals OS.)

### What Arcanea is *not*
- Not “another Midjourney / Higgsfield clone” (pure gen marketplace).
- Not “biggest fantasy wiki” or open community rewrite of cosmology.
- Not pure BYOK desk app with no network/UX (Path B alone).
- Not traditional SaaS that hosts raw UGC + GPU bills + support hell (Path A alone).

### The winning path (already designed — reaffirm & execute)
**Path C — Hybrid Sovereign Sync Engine** (`docs/strategy/ARCANEA_BUSINESS_STRATEGY.md` + PATH_C_*):

| Layer | Promise | Why it fits solo-founder “least headache” |
|-------|---------|-------------------------------------------|
| **Sovereign free** | Local-first + BYOK, full craft loop | $0 COGS, privacy story, power-user magnet |
| **Paid convenience** | ZK/encrypted cloud sync, multi-device, search | High margin, low support, MoR-friendly |
| **Paid creation scale** | Hosted “Studio Bench” credits for image/video | Optional compute; caps risk; competes with Higgsfield *as a feature*, not as identity |
| **Open core** | MCP, skills, templates, gen tools | Distribution + community without support ticket economy |
| **IP + Codex media** | Governed Arcanea franchise + encyclopedia | Brand moat competitors cannot fork |

### Honest current state (2026-07-16)
| Surface | Reality |
|---------|---------|
| **Product ambition** | Extremely high; docs/strategy sprawl is a liability |
| **Franchise nucleus** | Real & strong (Lumina/Nero, Gates, Godbeasts, flagship cast) |
| **Problem class** | **Governance/drift + production identity**, not idea scarcity |
| **Production** | Vercel project identity drift; domain/prod may not serve reviewed code; soft-404s historically |
| **Monetization** | Doctrine exists (Gift → Packs → Sync → Bench); Polar listed in estate registry as MoR option; Stripe also in monorepo deps; LemonSqueezy in older docs — **needs one MoR decision** |
| **BYOK** | Correct legal/COGS shield; **incomplete UX** for mainstream (keys = friction) |
| **Repos score** | Codex audit ~6.1/10 pre-consolidation; high upside, high drift |
| **Disk / ops** | Yogabook free space ~39 GiB (**TIGHT/CRITICAL**) — no worktree fanout; text-first only this pass |

### Single north-star metric (do not dilute)
**Weekly new visitors who create + keep a proof-artifact in first session**  
(`proof_created` activation — instrument before inventing growth claims.)

---

## 1. What we already have that is good (keep / harden)

### 1.1 Product & engineering assets
- Monorepo `arcanea-ai-app`: Next.js `apps/web`, Turbo/pnpm, design-system package, MCP packages, voice, auth scaffolding, world graph schema history.
- **Luminor Engineering Kernel** + agent surface (Claude/Codex/Cursor/Gemini) under `.arcanea/`.
- **Taste dual-rail:** `TASTE.md` (lab chrome) vs `VISUAL_DOCTRINE.md` (world media) — correct 2026-07-16 Queen visual OS.
- Image lab operating model (prompt cards, score30, continuity queue, style packs) — Jul 16.
- Dual strategy audits + consensus (2026-07-15): freeze cosmology inflation; registry + write-gates.
- Path C / hybrid sovereign design docs (legal + UX intent already written).
- Queen goals & metrics OS (`queen/reports/arcanea/ARCANEA_GOALS_AND_METRICS.md`) — correct anti-scope (kill route spam, skill count vanity, credits theater, onchain freeze).

### 1.2 Franchise / IP
- Locked mythos core: Lumina/Nero, Five Elements, Ten Gates + Guardians + Godbeasts, Malachar, Luminor rank.
- Flagship public cast center: Arion, Mera, Emilia, Akamoto; Mamoru STAGING only.
- Books + worldbuilding depth; visual encyclopedia direction (Codex still → I2V loops).
- Competitive hold patterns (Marvel continuity, school belonging, bond cost, system legibility) **without** copying marks.

### 1.3 Estate / open-core constellation (GitHub `frankxai`)
| Repo | Role | Disposition |
|------|------|-------------|
| **arcanea-ai-app** (PRIVATE) | Canonical product + lore brain | KEEP flagship |
| **arcanea** (public mirror) | Public face / marketing clone risk | Keep thin; no private strategy |
| **arcanea-chat-template** | BYOK chat template | KEEP as adoption wedge |
| **arcanea-mcp-starter** / world-mcp / gen-mcp | MCP wedge | PROMOTE after rename/publish hygiene |
| **arcanea-studio** | Gen surface | **Private; re-derive** if upstream license dirty |
| **arcanea-academy** (private) | World Proof Lab front door | KEEP as education surface later |
| **arcanea-ecosystem / orchestrator / claw / onchain** | Stale / experimental | FINISH-OR-ARCHIVE / ARCHIVE per goals OS |
| **arcanea-agent*, publishing-house, templates, nft-forge** | Adjacent | Selective; no multi-repo product sprawl |
| **starlight-*** + **SIS** | Substrate, not Arcanea product UI | Use as OS, don’t rebrand as Arcanea |
| **dino-life-commons / blue-life** | Encyclopedia pattern reuse | Absorb *process*, not brand |

### 1.4 Skills / agent workflows that work
- `canon-first-arcanea-expansion`, `arcanea-universe-expander` (anti-invent + CANON_LOCKED).
- `starlight-queen`, `todo-discipline`, `agent-workspace-bootstrap`, Phone Link search ban.
- `higgsfield-starlight-os` + higgsfield-* for *production media infrastructure* (not product identity).
- Design Taste Kernel / Premium Web OS / brand-image-system for public surfaces.
- Dual CLI audits (Claude + Codex) pattern for strategy.

### 1.5 What needs upgrades (agent / skill layer)
| Gap | Upgrade |
|-----|---------|
| Strategy doc sprawl (MASTER_PLAN Apr + monetization Apr + Path C + goals Jul conflict on prices) | **One living PRIVATE roadmap** (this pack) + supersede banners on old docs |
| Skills bloat / dupes (`arcanea-agent-skills`) | Prune D/F; package free vs gated via skill-portfolio-ops |
| No hard canon write-gate in CI/MCP | Registry + lint + Frank approval token |
| Coding agents invent lore when project path wrong | Project always on `arcanea-ai-app`; ban universe |
| Claude Agent SDK / Cowork / Codex / Hermes not one “production agent contract” | Thin adapter layer: MCP tools + kernel prompt; don’t rebuild three agent frameworks |
| Polar not wired as single MoR in code | Decide Polar (or Paddle/LS) once; kill dual Lemon+Stripe+Polar stories |
| Instrumentation of NSM | PostHog/events: genesis → proof_kept |

---

## 2. Multi-agent council deep positions (Fable 5 + specialists)

### 2.1 Product / CPO — “What are we selling?”
**Sell the loop, not the mythology encyclopedia as the product.**

**Job-to-be-done:**  
“I need my original world to stay coherent across chat, images, books, and months of work — without stitching ChatGPT + World Anvil + Midjourney + Google Drive.”

**Product spine (in order):**
1. **Genesis (≤3 min):** first world + proof artifact you emotionally own.
2. **Continuity OS:** characters, places, rules, memory, provenance, project graph.
3. **Creation rails:** text, image, short video, encyclopedia plates — **canon-injected**.
4. **Codex / public proof:** shareable gallery cards (opt-in).
5. **Agent surface:** MCP + Luminors that refuse garbage / drift.
6. **Franchise showcase (Arcanea IP):** marketing + emotional demo of the OS, not the only world allowed.

**Pricing story (lock this; supersede older $19/$49-only and infinite marketplace fantasies):**  
Per Queen goals OS (live doctrine):

| Offer | Price | Charge for |
|-------|-------|------------|
| **Sovereign** | Free | BYOK craft loop, local keep, base packs, open MCP core |
| **World Packs / premium Genesis** | $9–19 one-time | First paid unit; artifact ownership |
| **Cloud Sync** | ~$12/mo | Multi-device + encrypted continuity |
| **Studio Bench** | ~$39/mo | Hosted gen credits (Higgsfield-class *compute*, Arcanea *orchestration*) |
| **Founding Circle** | waitlist → lifetime discount | Trust + early capital, not fake “Upgrade now” |

**BYOK vs hosted — refined UX (critical):**
- **Default path for new users:** *Hosted lite* credits for first wow (you pay COGS, hard caps, abuse gates) **OR** one-click “Connect provider” with deep links + saved vault (not raw localStorage only).
- **Power path:** full BYOK / OpenRouter / multi-provider (zero markup on tokens; charge for intelligence layer).
- **Never** force API key paste as the *only* path to first proof — that is why conversion dies.
- **Never** become pure GPU SaaS without caps — that recreates support + margin hell.

### 2.2 GTM / CMO — “Why buy / why now?”
**Comprehension problem > differentiation problem.**  
Arcanea is not “AI fantasy chat.” Position as:

> **World Creation OS** — continuity + media + agents for original universes.  
> Arcanea the franchise is the living proof.

**Competitive map (2026):**

| Cluster | Players | Arcanea stance |
|---------|---------|----------------|
| **Wiki / org** | World Anvil, LegendKeeper, Campfire, Obsidian | Absorb wiki depth *later*; win **media + agent continuity** first |
| **Prose AI** | Sudowrite, NovelAI, Novelcrafter (BYOK) | Partner pattern or “export to”; don’t out-prose Sudowrite day one |
| **Gen suites** | Higgsfield, Midjourney, Runway, Leonardo | Use as **providers**; Arcanea owns **world graph + style locks + portal** |
| **General LLMs** | ChatGPT, Claude | Upstream brains; Arcanea is the *project brain* |
| **Open multi-tool pain** | Everyone juggles 4 tools | **Primary GTM narrative** |

**GTM sequence (solo-founder, low headache):**
1. **Ship honest loop on arcanea.ai** (reviewed deploy + no soft-404s).
2. **One primary conversion:** Founding Circle waitlist *or* Pack preorder — not both shouting.
3. **Content engine:** Codex still → 6s loop → social crops (human-gated). Faction/origin quiz when loop works.
4. **Open-core wedge:** publish gen-mcp / world-mcp with TASTE gates → installs as top-of-funnel.
5. **Academy** only after proof lab content exists (no empty academy site).
6. **No** vanity multi-domain launch until NSM > 0.

**Channels:** X + Instagram/TikTok for myth media; frankx.ai for founder authority; Discord later; **do not** build a full social network until retention exists. Own feed can be **gallery + Codex**, not Twitter clone.

### 2.3 Legal / Risk — “Zero founder legal nightmares”
**Non-negotiables:**
1. **MoR for digital products** (Polar recommended for developer/MoR simplicity vs Stripe Tax DIY): Polar handles global sales tax as Merchant of Record — critical for NL solo/BV headache reduction.  
   - Starter: free platform, ~5% + 50¢ (post May 2026 orgs); grandfathered Early Member rates if org pre-dates.  
   - Alternative: Lemon Squeezy / Paddle same class. **Pick one MoR.** Stripe only if you accept tax ops.
2. **UGC policy:** users own their worlds; ToS = user warrants rights; we host ciphertext / metadata; DMCA process if we ever host public media.
3. **ZK / local-first** reduces (does not eliminate) content liability — still need ToS, privacy policy, age gates, abuse reporting for *public* surfaces.
4. **Copyright / trademark knowledge layer (fantasy & gaming brands):**
   - **Allowed:** original analysis of *public domain* myths; original taxonomies; fair-use commentary in *private research notes*; style *patterns* (school, bond, continuity) without marks.
   - **Forbidden as product data:** scraped character bibles of Disney/Wizarding World/Nintendo/Riot/etc.; training sets of copyrighted novels/scripts; trademarked names as entities in public MCP/datasets; “official” encyclopedias of living IP.
   - **Safe innovative path:** **Pattern Library** (mechanics, structure, naming *patterns*, world-architecture frameworks) + **user-supplied** private corpora (BYO lore files) + **public domain / CC** corpora. Always: “User is responsible for rights of materials they import.”
5. **arcanea-studio unlicensed upstream:** keep private / re-derive before public ship.
6. **Human gates:** pricing live changes, production domain attach, external sends, legal, brand identity — Frank only.

### 2.4 Tech / Platform — production stack (best path)
**Core production (already aligned):**
- **App:** Next.js monorepo `apps/web` on **Vercel** (canonical project `arcanea-ai-app` / prj_90… — **resolve app vs appx identity**).
- **Data/auth:** Supabase (Postgres + RLS + optional pgvector).
- **Payments:** **Polar.sh** (MoR) → webhooks → entitlements in Supabase.  
- **Analytics:** PostHog (consented) for NSM only — no vanity.
- **Observability:** Sentry.
- **Media gen providers (orchestration, multi-provider):** Fal, Gemini/NB2, Replicate, Grok Imagine, **Higgsfield** (CLI/MCP for flagship media), OpenRouter for LLMs.
- **Agent interface:** MCP (world + gen + memory) primary; Claude Agent SDK / Codex / Hermes as *operator harnesses*, not three product backends.
- **Not required for v1 production:** onchain, Cloudflare Stream, full custom social, enterprise ADK multi-language stack.

**Claude Agent SDK / Google ADK / OpenAI Agents:**
- Use **Claude Agent SDK** where you want Code-grade tool loops for *internal* Arcanea ops and optional “Arcanea in Claude.”
- Use **OpenAI Agents / Codex** as operator lane (already in estate).
- Use **Google ADK** only if enterprise multi-runtime becomes a deal — not v1.
- **Product truth** remains: Next.js + Supabase + MCP tools + entitlement checks.

**Vercel discipline:** one project, draft PRs, no deploy races, root/build contract already documented (`SYSTEM.md` + `ARCANEA_VERCEL_ROUTE_CONTRACT`).

### 2.5 Creative IP / Encyclopedia — “Higgsfield for world creation”
**Absorb from Higgsfield:**
- Premium visual language, multi-model suite *feel*, credit packs, board/workflow packaging, mobile create IA.
- Soul/identity consistency patterns for cast.
- Credit economy *for hosted compute only*.

**Do not absorb:**
- Being a generic model zoo as brand identity.
- Volume-first social dump culture.
- Credit theater without a world graph.

**Arcanea “Ultra Visual” architecture:**
1. **World graph** (entities, relations, approvals, aliases).
2. **Style packs + Soul/identity locks** (house style: Cinematic Myth-Tech Encyclopedia).
3. **Provider router** (Higgsfield / Fal / Gemini / Grok / …).
4. **Portal / dashboard:** manage books, worlds, characters, assets, jobs, provenance.
5. **Encyclopedia products:** Arcanea Codex (first-party IP) + **user world encyclopedias** (exportable).
6. **Open pattern MCP:** worldbuilding primitives + public-domain/pattern packs — not scraped franchise DBs.

### 2.6 Open core / community domains
| Domain | Role | When |
|--------|------|------|
| **arcanea.ai** | Product + Genesis loop + Codex + pricing honesty | **Now — single flagship** |
| **arcanea.dev** | Docs, MCP, CLI, API, changelog | After MCP publish |
| **arcanea.academy** | Human + agent education (Proof Lab) | After 3 courses / gates exist |
| **arcanea.community** | Gallery, forums, showcases | After activation; start as `/gallery` on .ai |
| Public GitHub | Templates, MCP starter, chat template, skills free tier | Continuous, thin |

**Community doctrine:** guided contribution, not open cosmology. Staging → Frank lock.

### 2.7 Fable 5 / Taste — what must never ship
- Purple AI wallpaper chrome; emoji icon systems; fantasy MMO UI on product shell.
- Soft-404 marketing pages; fake counters (“0K+ words”).
- Pricing CTAs that charge for undeliverable features.
- Anime as *house* style (secondary rail only).
- Invent-a-verse foundations; Sacred Wound as forced cosmic law.
- Skill-count / repo-count vanity as progress.

---

## 3. What is going well vs what is broken

### Going well
- Clear **north star** and Path C legal/UX thesis.
- Real franchise **nucleus** better than most indie IP.
- Visual OS decision quality (Jul 16) is production-grade.
- Dual-agent strategy consensus (governance before generation).
- Deep monorepo and agent contracts.
- Open-core imagination + MCP direction matches 2026 agent market.

### Broken / dangerous
- **Strategy inflation:** too many plans, conflicting prices, MASTER_PLAN stale vs goals OS.
- **Production identity:** domain not reliably on reviewed Vercel project.
- **Activation unmeasured.**
- **BYOK-only friction** vs mainstream creators.
- **Repo sprawl** (studio license, claw, onchain, multiple orchestrators).
- **Canon drift risk** from agent volume without write-gates.
- **Support/scale risk** if Studio Bench ships without hard credit caps + self-serve docs.
- **Trademark fantasy:** any plan to “index all best fantasy brands’ characters” as product data = legal landmine.

---

## 4. Refined GTM narrative (use this)

**For creators:**  
Build a living world that stays consistent — characters, lore, art, and agents that remember — in one portal. Keep it free with your keys; upgrade when you need sync and studio power.

**For developers:**  
MCP tools that refuse canon garbage. Open core. Bring your stack.

**For fans / culture:**  
Explore Arcanea’s museum-grade living myth (Codex). Then build *yours*.

**Against Higgsfield:**  
Higgsfield is best-in-class **media generation suite**. Arcanea is **world operating system** that *routes* generation (including Higgsfield) through continuity, identity, encyclopedia, and publishing.

---

## 5. Technology production checklist (solo-friendly)

### Must-have for “in production”
1. Vercel identity + `arcanea.ai` on reviewed commit.
2. Supabase auth (Google/GitHub) E2E.
3. Waitlist / Founding Circle **fail-closed**.
4. Polar products + webhook → entitlements (or temporary waitlist-only if payments not ready — *honest*).
5. Genesis → proof_kept event instrumentation.
6. BYOK vault UX + optional starter hosted credits (hard cap).
7. Canon registry v0 + CI lint on LOCKED files.
8. Public legal pages: Terms, Privacy, Acceptable Use, DMCA.
9. Status page honesty (`/status` real metrics).
10. Support: AI FAQ + email only; no promise of 24/7 human chat.

### Nice-to-have (phase 2)
- ZK sync full Path C.
- Studio Bench multi-provider job queue.
- Academy LMS.
- Community Discord bot + gallery social graph.
- Claude Agent SDK hosted “Luminor in Claude.”
- Desktop Tauri wrapper.

### Explicitly later / avoid
- Onchain economy, NFT-first GTM, full social network, 12 marketplaces, multi-BV complexity, building own foundation model.

---

## 6. Pattern Library / MCP knowledge — smart legal innovation

**Product name suggestion:** **Arcanea Pattern Codex** (open) + **Private Lore Vault** (user).

| Layer | Contents | Rights posture |
|-------|----------|----------------|
| L0 Public domain | Folklore motifs, classical structures | Free |
| L1 Pattern schemas | “Mentor death cost,” “school houses,” “bond contracts” as *abstract* schemas | Original |
| L2 Arcanea canon | First-party IP | Owned |
| L3 User import | Their notes, PDFs, wikis | User warranty |
| L4 Research notes | Private competitive analysis | Never productized as “character dumps” |

**MCP tools:** `pattern_search`, `world_validate`, `entity_alias_resolve`, `generation_with_canon_inject`, `rights_check_stub` (flags trademark-like tokens).

---

## 7. Where docs live (private vs public)

| Content | Location | Visibility |
|---------|----------|------------|
| **This full strategy + milestones** | `docs/strategy/queen-council-2026-07-16/` in **private** `arcanea-ai-app` | Private |
| Queen ops scorecard | `starlight/queen/reports/arcanea/` | Private (estate) |
| Canon | `.arcanea/lore/*` | Private repo; selective public excerpts on site |
| Public roadmap | Thin page on arcanea.ai `/roadmap` or GitHub Discussions | Public: themes + shipped, **no** unshipped pricing/legal/finances |
| Cross-domain portfolio plans | `starlight-agent-config` Business OS | Private |
| Public OSS | dedicated public repos only | Public |

**Recommendation:** Do **not** create a separate “arcanea-product-planning” GitHub repo yet. Use:
- **Private SSOT:** `arcanea-ai-app/docs/strategy/` + `planning-with-files/CURRENT_*`
- **Estate coordination:** Queen reports
- Optional later: private monorepo section or Notion-export if non-git stakeholders appear

---

## 8. 90-day program (phases) — summary

See companion files:
- `MILESTONES_PROJECT_PLAN_2026-07-16.md`
- `MILESTONES_PROJECT_PLAN_2026-07-16.csv` (Excel-compatible)

| Phase | Name | Success criteria |
|-------|------|------------------|
| **0** | Production honesty | Live commit = reviewed; waitlist fail-closed; soft-404s = 0 on core routes |
| **1** | Activation loop | Measured `proof_created` > 0; ≤10 min median (stretch ≤3) first world |
| **2** | First revenue | Pack preorders ≥10 or Founding Circle ≥100 real emails; Polar wired |
| **3** | Continuity moat | Sync tier live or ZK beta; world graph entities CRUD in UI |
| **4** | Media OS | Style packs + multi-provider jobs + Codex weekly ship cadence |
| **5** | Open wedge | MCP published; external install > 0 |
| **6** | Academy light | One Proof Lab course; domain only if content ready |

---

## 9. Agent swarm operating model (how we run this)

**Permanent lanes (from dual audit + Queen):**
1. **Canon Steward** — registry, aliases, LOCKED freeze  
2. **Continuity Editor** — books, staging promote/demote  
3. **Product Loop** — Genesis UX, entitlements, instrumentation  
4. **Media OS** — image-lab, Higgsfield/Fal, score30  
5. **Open Core** — MCP publish, templates  
6. **GTM** — waitlist, social crops, frankx cross-post (human gate)  
7. **Platform Ops** — Vercel, Supabase, CI cost, disk  

**Harness map:** Hermes Queen orchestrates; Claude Code + Codex dual for hard design; Grok/Higgsfield media; no parallel invent-lore agents.

**Skills upgrade backlog:**
1. Patch monetization skill/docs with **single price table** + Polar.  
2. Add `arcanea-activation-loop` skill (instrument + verify).  
3. Canon-lint MCP skill.  
4. Rights-safe pattern library skill.  
5. Skill portfolio prune for arcanea-agent-skills.

---

## 10. Decisions for Frank (human-gated)

1. **Confirm Path C + price ladder** (Sovereign / Packs / Sync $12 / Bench $39) as sole public story.  
2. **Pick MoR: Polar (recommended) vs Lemon Squeezy vs Paddle.**  
3. **Vercel project identity:** attach `arcanea.ai` to canonical `arcanea-ai-app` only.  
4. **Hosted lite credits budget** (monthly max loss for free wow).  
5. **Public roadmap:** ship thin page or keep private-only for 30 days.  
6. **Archive list:** onchain, claw, duplicate orchestrator — approve kill list.  
7. **Trademark counsel** (one hour) before any “brand pattern dataset” public launch.

---

## 11. One-sentence board summary

**Arcanea wins by being the continuity OS for original worlds with museum-grade media and agent rails — free to craft (BYOK), paid for sync and studio compute (MoR + credits), open at the MCP edge, franchise-proven, legally boring, and ruthlessly focused on first-session proof artifacts.**

---

*Generated by Starlight Queen multi-perspective council 2026-07-16. Supersedes conflicting public claims in older monetization decks for *operating priority*; does not auto-delete history — add supersede banners when editing old files.*
