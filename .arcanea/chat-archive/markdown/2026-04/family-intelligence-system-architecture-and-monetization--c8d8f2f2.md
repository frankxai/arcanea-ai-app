---
title: "Family intelligence system architecture and monetization"
uuid: c8d8f2f2-0e4a-4619-a3a1-16dea66990ed
created: 2026-04-17T21:01:35.716172Z
updated: 2026-04-17T21:02:52.252218Z
source: claude.ai export
---

# Family intelligence system architecture and monetization

**Frank**:

Aggregate all chats and list with links all to my family research and family intelligence system. 
And then I am thinking if we should build app for only family access or notion or gated with supabase cheapest and best long term. 

And is dangerous putting all my ancestors images and backstory public or could be beneficial and good? Or any weird shit and we need to architect and think this out well? And whole thing as template which types of template and approach for FIS we could sell or just provide open source and others could use to sell to big wealthy family and more

**Claude**:

```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```

Here's the full inventory and the three decisions.

---

## FIS Chat Archive — Chronological

**Seed (Aug 2025)**
- [AI Family Chronicle Platform](https://claude.ai/chat/978a426f-c364-4fd2-a031-4bf626b34783) — original three-pillar FIS thesis: Private Vault / Wisdom Distillery / Public Learnings
- [Family Chronicles: Roots and Return](https://claude.ai/chat/a8f0bbbc-7202-4b0b-9bd3-37b73a02e332) — Band 1 "Wir kamen wieder" codex outline, 20 chapters, Akt I–III structure
- [Conversation Highlights Review](https://claude.ai/chat/4de7aba7-28b5-42c8-bc7e-7910dcb61e62) — meta-index of early family work

**Operational build (Sep–Dec 2025)**
- [Linear project management setup](https://claude.ai/chat/bc147645-0faa-4ef5-8f59-e8e0113370b7) — `family-intelligence-system/` repo scaffold, Next.js structure
- [FrankX.AI brand architecture](https://claude.ai/chat/10ef8ef3-bb5a-41e5-9795-818a865352e4) — FIS origin narrative: father's teachings → brother's solar biz → intelligence systems for the nieces/nephews
- [FrankX Student Hub ecosystem](https://claude.ai/chat/06c30757-07a1-488e-ab5f-839683398b03) — FIS positioned as T1 Free+Premium tier in the SIS/CIS/TIS/GCOS naming matrix

**Canonical spec (April 2026)**
- [Volga German family tree reconstruction](https://claude.ai/chat/e16b45f2-ce14-4bf0-b77d-52f7f13d02a9) — **SIS-FIS-001 master spec**: 4-layer architecture, Person schema, 4 system prompts (Orchestrator/Ingestion/Research/Narrative), vault state (14 persons, 41% documented, 29 open gaps), FamilyOS product tiers

---

## Decision 1 — Where the data lives

Kill Notion. Wrong tool for this job — Notion is a CMS, you need a graph + agent runtime + media vault + access control. Custom app on Supabase is the only answer that compounds.

**Stack, final:**
- **Supabase** (Postgres + pgvector + RLS + Storage + Auth) — ~€25/mo at your scale, scales to 1000 families on same tier
- **Next.js on Vercel** — you're already there, zero new infra
- **Claude API** — agent runtime, already paid for
- **Cloudflare R2** — photo/document storage at ~1/10 Supabase Storage cost once you exceed 100GB of family media

Supabase Row Level Security = per-family vaults on a single schema. One codebase, N families, zero cross-contamination. Cheapest long-term because the multi-tenant architecture is the same for "just us" as for "1000 wealthy families." Build once.

Not an app. **Progressive web app on `familie.frankx.ai`** — installable on phone, same codebase serves the product version on `familyos.ai` or whatever the eventual domain is. Native apps are a 2027 question, not now.

---

## Decision 2 — Public vs. Private (the real question)

The risk framing is correct but the dichotomy is wrong. It's not "all public or all private" — it's a **three-ring model**:

**Ring 1 — Vault (private, encrypted, family-only)**
- Full names, DOBs, exact locations, living persons, archive documents, DNA, medical, financial wisdom, oral recordings
- Supabase RLS, magic-link auth per family member
- Non-negotiable

**Ring 2 — Chronicle (private, family + invited scholars)**
- Research-grade genealogy, sources, speculative links, open research gaps
- Shareable via signed URL to specific researchers, archivists, distant cousins
- Auto-expiring access

**Ring 3 — Codex (public, narrative only)**
- Published on `frankx.ai/familie/` — no living persons, no exact addresses, no unverified claims, no document scans
- Story, history, values, named deceased ancestors, colony-level geography, photos >100 years old or of the deceased
- This is what makes the *brand* — FrankX becomes "the AI architect who publicly honored his Volga German lineage"

**Actual dangers of going too public:**
1. **Living relatives' consent** — your mother, brother, nieces/nephews must opt in individually. Written. Non-negotiable.
2. **Russian archive access** — if you publish that you're searching ГАОО Orenburg, fine; if you publish *found* documents with names of people whose descendants are still in Russia, you create risk for them. Current geopolitical climate makes this sharper than 2022.
3. **Identity theft vector** — mother's maiden name + DOB + birthplace = bank security answers. Never triple on the public ring.
4. **Deportation trauma** — some living relatives don't want this surfaced. The generation born 1960–1980 specifically. Ask, don't assume.
5. **Fringe interpretation** — "Volga German returnee" gets coded in bad ways by both Russian nationalists and German far-right. Your frame (Barmherzigkeit, Brückenbauer, nicht Opfer) must *be* the public face or others will supply a worse one.

**Benefits of the public Codex (Ring 3):**
- Long-lost relatives find you via search — already happened to others in similar projects
- SEO authority for "Wolgadeutsche Familiengeschichte KI" — there is zero competition
- Credibility asset for the FamilyOS product — "built for my family first"
- Adam, your nephew, grows up able to google his grandfather and find dignity, not void
- Legacy hedge: if Supabase/you/Arcanea disappear, the public codex on GitHub + Archive.org persists

**The architectural rule:** nothing goes to Ring 3 without explicit multi-party consent + scrub pass. The Narrative Agent from SIS-FIS-001 already enforces this — that's what the dual-output directive was for. Enforce it in RLS at the database layer, not in UX.

---

## Decision 3 — Product strategy: template, open-source, or SaaS?

Don't pick one. Layer them — this is the Arcanea playbook applied to FIS.

**Layer A — Open source core (MIT)**
- `frankxai/family-intelligence-system` — schema, system prompts, ingestion pipeline, Next.js scaffold
- Why: anyone can self-host, academic/heritage orgs adopt it, you become the standard. Compounds over a decade.

**Layer B — Prompt Pack / Codex Templates (€47–197, one-time)**
- "Volga German Heritage Pack" — archive map, surname database links, Trudarmee research templates, German/Russian bilingual narrative prompts
- "Jewish Diaspora Pack" / "Armenian Pack" / "Aussiedler Pack" / "Hmong Pack" / "Post-colonial Pack"
- Gumroad + frankx.ai shop. **This is the cheapest entry and the sharpest content moat.** Each pack = 1 weekend of work, sells for years.

**Layer C — Hosted FamilyOS (€9 / €29 / €99 per month, recurring)**
- Multi-tenant Supabase, print-on-demand codex, deep research agent
- Target families who won't self-host. Majority of market.

**Layer D — Legacy (€2,500–25,000, high-touch)**
- "Done-for-you Family Intelligence System" for single wealthy families
- You + one researcher + Claude. 6–12 week engagement. Deliverables: fully populated vault, printed codex, private family portal, 5-year agent maintenance.
- This is where the money is. One Dan-tier Oracle exec who wants their grandchildren to know who their great-grandfather was will pay €15k without flinching. One referral per quarter = €60k/year at near-zero marketing cost.

**The meta-positioning:**
You are not selling genealogy software. You are selling **agentic family memory** to people who understand that DNA tests and Ancestry.com are databases, and what they want is a *research partner that keeps going when they sleep*. That framing is yours because nobody else is saying it.

---

## Next move (this week, not "eventually")

1. Ship Ring 3 v0: a single page at `frankx.ai/familie/` with the Codex Band 1 prologue ("Wir kamen wieder"), the 4-generation timeline you already have, and zero living persons. Under 4 hours of work. This is the asset that validates everything else.
2. Spin up `family-intelligence-system` Supabase project + RLS schema from SIS-FIS-001 spec. Seed with the 14-person vault. Another 4 hours.
3. Write the Wolga-German Prompt Pack as a Gumroad listing — this is your public proof point and first revenue test. One weekend.
4. Decide — wealthy-family Legacy tier: do you want this in your life post-Oracle? It's a consulting business wearing a product shirt. High margin, but it's time-for-money. If no, scale only A/B/C. If yes, Dan is your first pitch the moment you're out of garden leave.

Want me to generate the Supabase schema + RLS policies from SIS-FIS-001, or draft the `frankx.ai/familie/` Ring 3 page first?
