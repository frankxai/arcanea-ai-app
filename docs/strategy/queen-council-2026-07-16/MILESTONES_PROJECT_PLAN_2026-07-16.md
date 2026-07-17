# Arcanea Project Plan — Milestones, Goals, Success Criteria
**Date:** 2026-07-16 · **Owner:** Frank (human gates) + Starlight Queen (execution)  
**Companion:** `ARCANEA_ULTIMATE_STRATEGY_AND_ROADMAP_2026-07-16.md`  
**CSV (Excel):** `MILESTONES_PROJECT_PLAN_2026-07-16.csv`  
**Classification:** PRIVATE

---

## Value we intend to provide (locked)

| Audience | Value |
|----------|--------|
| **Creators / worldbuilders** | First-session emotional ownership of a world; continuity that survives months; media that matches lore |
| **Authors / IPs** | Flagship Arcanea as proof; exportable books/codex; anti-drift agents |
| **Developers** | MCP + open tools that enforce quality; BYOK sovereignty |
| **Fans** | Museum-grade encyclopedia & serial attachment (not wiki sludge) |
| **Frank (solo founder)** | MoR payments, capped COGS, self-serve support, no copyright landmines, measurable activation |

**North-star metric (NSM):** weekly new visitors who **create + keep** a proof-artifact in first session.

---

## Phase 0 — Production honesty (Days 0–14)
**Goal:** Live site tells the truth and serves reviewed code.

| ID | Milestone | Owner lane | Deliverable | Success criteria | Value |
|----|-----------|------------|-------------|------------------|-------|
| M0.1 | Vercel identity decision | Platform + Frank | Single canonical project owns `arcanea.ai` | Domain on reviewed project; duplicates labeled non-canonical | Trust / no deploy chaos |
| M0.2 | Reviewed production promote | Product Loop | Green build → promote | Live commit SHA == approved release candidate | Users see real product |
| M0.3 | Soft-404 purge | Product Loop | `/genesis` `/method` `/status` core routes | 0 soft-404s on core activation path | Activation unblocked |
| M0.4 | Waitlist fail-closed | Product Loop | DB + API | Forced DB error returns non-200; no silent drop | Lead capture integrity |
| M0.5 | Legal baseline | Legal + Frank | Terms, Privacy, AUP | Pages live; link in footer | Headache reduction |
| M0.6 | Honest counters | GTM | Remove fake stats | No “0K words / 0 repos” lies | Brand trust |
| M0.7 | CI cost gates | Platform | Draft PR skips heavy jobs | Concurrency + paths + draft gate | <$ bill control |

**Phase 0 exit:** Production honesty checklist 100% true.

---

## Phase 1 — Activation loop (Days 7–35)
**Goal:** Genesis → proof artifact is the product.

| ID | Milestone | Owner lane | Deliverable | Success criteria | Value |
|----|-----------|------------|-------------|------------------|-------|
| M1.1 | Genesis UX | Product Loop | ≤ guided steps to first world | Median time to first world measured; target ≤10 min (stretch ≤3) | Core JTBD |
| M1.2 | Proof artifact | Product Loop | Keepable card/export | `proof_created` + `proof_kept` events fire | NSM live |
| M1.3 | Instrumentation | Platform | PostHog (or equiv) consented | Funnel report: visit → genesis → keep | Decisions evidence-led |
| M1.4 | BYOK vault UX | Product Loop | Settings + deep links | First-time key setup guided; no dead-end 503 without CTA | Power users convert |
| M1.5 | Hosted lite path | Product + Frank | Capped free generations OR demo mode | New user can complete proof **without** API keys | Mainstream UX |
| M1.6 | Taste dual-rail QA | Fable 5 | Chrome vs world media | No world art as product chrome; score gates pass | Premium feel |

**Phase 1 exit:** NSM > 0 for 2 consecutive weeks; support tickets/day < 5 (manual).

---

## Phase 2 — First revenue (Days 21–50)
**Goal:** Money with MoR; no undeliverable promises.

| ID | Milestone | Owner lane | Deliverable | Success criteria | Value |
|----|-----------|------------|-------------|------------------|-------|
| M2.1 | MoR choice | Frank | Polar (rec.) or LS/Paddle | Written decision in strategy pack | Tax/legal simplicity |
| M2.2 | Polar (or MoR) integration | Platform | Products + webhooks + entitlements | Test purchase → Supabase entitlement true | First $ path |
| M2.3 | Offer A: Packs | GTM + Product | $9–19 World Pack / premium Genesis | ≥10 preorders or purchases in 14 days after launch | Demand signal |
| M2.4 | Founding Circle | GTM | Waitlist + lifetime discount promise | ≥100 verified emails (or frank-set target) | Audience asset |
| M2.5 | Pricing page honesty | GTM | Single price table | Matches goals OS; no fake Upgrade | Trust |
| M2.6 | Self-serve support | Ops | FAQ + status + email | No chat promise; AI FAQ answers top 20 | Low support load |

**Phase 2 exit:** First real revenue OR clear pack demand test; refund process documented.

---

## Phase 3 — Continuity moat (Days 35–75)
**Goal:** Worlds stay coherent; paid sync makes sense.

| ID | Milestone | Owner lane | Deliverable | Success criteria | Value |
|----|-----------|------------|-------------|------------------|-------|
| M3.1 | World entities UI | Product | Characters/locations/rules CRUD | User manages ≥5 entities in session | Moat vs chat-only |
| M3.2 | Canon inject on gen | Product + Canon | Prompts pull entity DNA | Drift rate down (manual sample ≥10 gens) | Quality |
| M3.3 | Registry + alias ledger | Canon Steward | Machine-readable canon registry | CI fails on forbidden aliases | Agent safety |
| M3.4 | Write-gate on LOCKED | Canon Steward | PR rules / CI | Cannot silent-edit CANON_LOCKED without label | IP integrity |
| M3.5 | Cloud Sync tier | Platform | ~$12/mo entitlement | Cross-device restore works for 3 test accounts | Recurring revenue |
| M3.6 | Provenance records | Product | Asset/job metadata | Every shipped asset has rights + prompt ref | Legal + brand |

**Phase 3 exit:** Sync tier purchasable; ≥1 paying sync user or 25 pack buyers unlock rule from goals OS.

---

## Phase 4 — Media OS / “Higgsfield for worlds” (Days 40–90)
**Goal:** Ultra visual + interconnected portal without becoming a model zoo.

| ID | Milestone | Owner lane | Deliverable | Success criteria | Value |
|----|-----------|------------|-------------|------------------|-------|
| M4.1 | Style packs SSOT | Media OS | House + secondary rails | Style pack used on 100% Codex gens | Brand consistency |
| M4.2 | Multi-provider router | Media OS | Fal/Gemini/Grok/Higgsfield jobs | Failover works; cost logged | Reliability |
| M4.3 | Studio Bench tier | Product | ~$39/mo + credits | Hard caps; no unlimited surprise bills | Margin protection |
| M4.4 | Portal dashboard | Product | Worlds/characters/assets/jobs | Single next-gen dashboard IA | Interconnection |
| M4.5 | Codex weekly cadence | Creative + GTM | Still → I2V → social crops | ≥1 human-approved ship/week | Distribution |
| M4.6 | Encyclopedia surfaces | Creative | Flagship Codex pages | Public encyclopedia quality bar | Franchise proof |

**Phase 4 exit:** Studio Bench live or explicitly deferred with reason; Codex pipeline repeatable without Frank in loop for drafting (approve only).

---

## Phase 5 — Open core wedge (Days 50–100)
**Goal:** External developers adopt MCP; free magnet.

| ID | Milestone | Owner lane | Deliverable | Success criteria | Value |
|----|-----------|------------|-------------|------------------|-------|
| M5.1 | world-mcp rename/publish | Open Core | `@arcanea/world-mcp` | Tests green; npm or GitHub release | Clarity |
| M5.2 | gen-mcp git + publish | Open Core | `@arcanea/gen-mcp` | External install > 0 | Adoption wedge |
| M5.3 | arcanea.dev docs | Open Core | Docs site or /docs | Quickstart < 5 min | Dev UX |
| M5.4 | Pattern Codex v0 | Legal-safe Open | Public domain + patterns only | No third-party franchise dumps | Innovation without risk |
| M5.5 | Skill portfolio prune | Agents | Free vs gated packs | Pass rate ≥0.9 audit | Quality signal |
| M5.6 | Claude/Codex/Hermes adapters | Agents | Shared MCP + kernel | One tool surface, three harnesses | Ops leverage |

**Phase 5 exit:** At least one external MCP caller measured weekly.

---

## Phase 6 — Academy & community light (Days 75–120)
**Goal:** Education without empty domains.

| ID | Milestone | Owner lane | Deliverable | Success criteria | Value |
|----|-----------|------------|-------------|------------------|-------|
| M6.1 | Proof Lab course #1 | Academy | One complete course | Completions > 0 | Human education |
| M6.2 | Domain decision | Frank | academy/community DNS | Only if content ready | Brand clarity |
| M6.3 | Gallery as community v0 | Product | Share + follow light | No full social network | Network effects cheap |
| M6.4 | Origin quiz (optional) | GTM | Identity viral loop | Share rate measured | Top-of-funnel |
| M6.5 | Guided contrib rails | Community | Staging → review | Zero open cosmology rewrites | Canon safety |

**Phase 6 exit:** Academy content exists before domain marketing; community ≠ free-for-all lore.

---

## Parallel standing work (all phases)

| Stream | Cadence | Success |
|--------|---------|---------|
| Canon freeze / promote-demote | Weekly | STAGING landfilled items closed |
| Visual OS runbook | Weekly | CONTINUITY_QUEUE cleared or deferred |
| Truth loop | Weekly | No public unmeasured numbers |
| Storage gate | Per swarm | Free space not CRITICAL before fanout |
| Supersede banners | When editing | Old price tables point here |

---

## Risk register (top)

| Risk | Severity | Mitigation |
|------|----------|------------|
| Strategy sprawl / conflicting prices | High | This pack is operating SSOT; banners on old docs |
| Vercel multi-project chaos | High | One domain owner; Frank gate |
| Hosted gen cost overrun | High | Hard caps, abuse detection, BYOK default after trial |
| Copyright “brand index” temptation | Critical | Pattern library only; counsel for public datasets |
| Agent invent-a-verse | High | Project path + write-gates + quarantine universe |
| Support explosion | Med | Self-serve, MoR, no SLA until ARR |
| License dirty studio | Med | Private / re-derive |
| Disk TIGHT on Yogabook | Med | No worktree fanout; C940 for heavy |

---

## Visual roadmap (text Gantt)

```
Week:  1    2    3    4    5    6    7    8    9   10   11   12
P0 Production honesty  ████████
P1 Activation loop        ████████████
P2 First revenue               ████████████
P3 Continuity moat                ████████████████
P4 Media OS                         ████████████████
P5 Open core                           ████████████
P6 Academy light                              ████████
```

---

## Definition of done for “blitz scale, low headache”

1. New user can get a kept world without Frank.  
2. Money flows through MoR without tax paperwork from Frank.  
3. Agents cannot silently rewrite LOCKED canon.  
4. Media jobs are capped and provenance-logged.  
5. Public claims are measured.  
6. Support is FAQ + email.  
7. One product domain does 80% of traffic.

---

*Queen Council 2026-07-16*
