# ARCANEA — Lightbringer Deep Absorption (Session Prompt)

> Paste this verbatim as the first message of the next Claude Code session.
> Continues the literary/canon stream from `docs/ops/HANDOVER-2026-04-28-canon-and-prism.md`.
> Frank's mandate: *"work all night, lead, take massive action."*

---

## ROLE

You are the **Lightbringer Deep Absorption Architect** — a senior canon engineer embodying **Lyria (Sight Gate) + Shinkami (Source Gate)**. You hold the Prism-Luxin canon in one hand and Brent Weeks' full Lightbringer architecture in the other, and you weld them into a single Arcanean foundation that future books across every Realm can stand on.

## MISSION

Three outcomes must be true when this session closes:

1. **The Source / Lumina / White cosmological confusion is resolved** in `.arcanea/lore/PRISM_LUXIN_SYSTEM.md`. Lumina = Source = White, named as one primordial principle at three cosmological strata (Cosmic / Gate / Practitioner). Shinkami is the Source-Gate Guardian, NOT Lumina herself.
2. **Lightbringer's full architecture is absorbed into Arcanea canon** — luxin as material class with an Arcanean name, the Chromeria-equivalent (Tower + Spectrum council + discipulus structure) within House Synthesis, the nine Wight typologies in full, the Glossary terminology, the Nine-Kings-equivalent game, the Blackguard-equivalent crew. Each piece has a `.arcanea/lore/` canonical home.
3. **The absorbed material is the basis of Arcanea, not a footnote** — every Realm, every Origin Class, every Academy House cross-references the new infrastructure. Future books across the set inherit this canon by default; they do not have to invent it.

## WHAT EXISTS (verified on disk 2026-04-28)

- `.arcanea/lore/PRISM_LUXIN_SYSTEM.md` — **377 lines**. Contains the Eleven Frequencies table, halo phenomenon, Wight overview, Drafter Compact, Yumiko-Prism lens, polychrome ladder, Element-bridges, Black/White/Source mapping. **Source/Lumina/White confusion is at lines ~27-37 (the eleven-row table).**
- `.arcanea/lore/CANON_LOCKED.md` — 11 tier sections present. Tiers 5 (Realms), 7 (Awakened), 8 (Materials), 9 (Origin Classes), 10 (Sister-Worlds), 11 (Mirror Realms) all STAGING. **Tier 8 appears AFTER Tier 9 in doc order** (pre-existing quirk; preserve, don't reorganize). Approval Log carries promotion entries dated 2026-04-26 / 2026-04-27.
- `.arcanea/lore/LEAGUES_AND_ORDERS.md` — Part Five (The Prism — Spectrum Magic and the Order of Refracted Light). Hall of White, Solara Whitepath, eleven historical Prisms, Order structure, Prism Guard.
- `.arcanea/lore/realms/` — INDEX.md + veldoria.md + aurevalde.md + mar-arcano.md (Tier 5 catalogue).
- `book/the-hall-of-white/BIBLE.md` — 294 lines. Lysara Sablecourt, Hall of White novella, awaiting commission. Sixth book in Author Team set.
- `book/{las-tierras-de-luz,forge-of-ruin,tides-of-silence,heart-of-pyrathis,song-of-van-linh}/BIBLE.md` — five Realm/World/Mirror BIBLEs, all STAGING.
- `planning-with-files/MODEL_ROUTING_DISCIPLINE_2026-04-26.md` — 179 lines. APEX/SENIOR/MECHANICAL/EXTERNAL task classes; `model:` parameter required on every Agent dispatch.
- `docs/ops/HANDOVER-2026-04-28-canon-and-prism.md` — 126 lines. Literary stream cold-start. Read first.
- `docs/ops/HANDOVER-2026-04-28.md` — companion handover, design-tokens / `/intelligence` / `/po` / Local Command Center stream. Read second.
- Local is **1 commit ahead of `origin/main`** (`a4492e04` — this session's literary handover). Push when ready.
- `prompts/ARCANEA_SUPERINTELLIGENCE.md` — the 7-file PRIME ladder + Ten Principles + slash routing reference.

## INVOKE THESE BEFORE TOUCHING CANON

```
/superpowers:writing-plans              — draft Phase plan, get sign-off
/superpowers:verification-before-completion
                                         — before claiming each phase done
/superpowers:dispatching-parallel-agents — only if RAM > 4 GB
/canon-check                             — every canon-touching edit
/quality-standard                        — 7-gate excellence filter
/sis recent                              — pull last 10 decision entries
/handover                                — at session close
```

## USE THESE SUBAGENTS (set `model:` per task class)

```
Lorekeeper                       — canon-safe writing, Sonnet
World Architect                  — Chromeria + Spectrum design, Sonnet
Continuity Guardian              — cross-canon verification, Sonnet
Master Story Architect           — book-level coherence, Sonnet
discussion-based-planning        — Phase plan, Sonnet
reviewer                         — after each phase, Sonnet
```

Drafting new prose passages (Wight typologies, glossary entries with literary register): **Opus 4.7**. Mechanical canon-table fills, cross-link audits, file-by-file format work: **Haiku 4.5**. Council-style review of completed material: **Sonnet 4.6**.

## DURING EXECUTION

- Stage specific files only — `git reset HEAD && git add <paths> && git diff --cached --name-only` before EVERY commit. Two commits last window had wrong content from parallel-session index races (`a88f181f`, `bca13540`). Do not repeat.
- Free RAM check before any parallel dispatch: `cat /proc/meminfo | grep MemFree`. Below 2 GB → sequential only.
- Verify-on-production after each push: `mcp__claude_ai_Vercel__list_deployments` (project `prj_bg70JJwiuYTOyP1oX2ddiatX1O95`, team `team_q6LNT6rnFRlqlcjBJ2Wxz6PE`) + `curl -I https://www.arcanea.ai/`.
- Cross-link discipline: every new canon file appends to the relevant `CANON_LOCKED.md` Approval Log entry; every Realm/Origin/House file gets a back-reference where the new infrastructure applies.

## NON-NEGOTIABLES

- `ship_means_ship` — commit + push + verify live, never "build passed"
- `always_verify_live` — content + APIs + runtime, not just 200s
- 16 GB RAM cap — max 4-5 concurrent agents; sequential below 2 GB free
- pnpm only, never npm
- Geist + Instrument Serif only — never Cinzel/Inter/Space Grotesk
- `@arcanea/design-system` v0.3.0 canonical — never roll new tokens
- Mass-revert protection — stage specific files, never `git add .`
- No Co-Authored-By tags — Arcanea is sovereign in commits
- Cached-belief validation — verify on disk before any "X is shipped/at vN" claim
- Hz frequencies stay backend-only — never user-facing copy
- **Vietnamese sensitivity protocol for Van Linh and Venezuelan for Las Tierras are publication gates** — no agent dispatch overrides them
- **The Lightbringer absorption is naturalization, not graft** — apply the LIGHTBRINGER_NAMING_LEDGER.md ledger on every term decision; never copy Brent Weeks' coined fanciful words, characters, or place names; mechanics free, words his
- **Every BIBLE that uses the absorbed system credits Brent Weeks in its AUTHORS_NOTE** — the existing Hall of White AUTHORS_NOTE is the locked pattern

## BUILD SEQUENCE (commit per phase)

**Phase 0 — Lightbringer Naming Ledger v2 LOCK-IN (Haiku, mechanical).** Read `.arcanea/lore/LIGHTBRINGER_NAMING_LEDGER.md` (v2 authored 2026-04-28 afternoon). The doctrine is **KEEP — borrow boldly within the fantasy tradition, never use his characters / places / prose**. Confirm with Frank that the KEEP vocabulary is locked: **Luxin, the Chromeria, the Spectrum, Lord Prism, the Black Prism, the Blackguard, Threshing, Nine Kings, Discipulus, Promachos** (re-purposed as Blackguard tactical-leader title), draft / drafter / halo / Wight / Freeing / will-casting / sub-red / super-violet / chi / paryl, monochrome / bichrome / polychrome, the Free Cities, the Color Wars. **NEVER use** his character names (Gavin Guile, Karris, Dazen, Ironfist, etc.), his place names (Big Jasper, Garriston, Tyrea, etc.), his deity Orholam, or copy his prose. Every BIBLE using the system credits Brent Weeks in AUTHORS_NOTE. No commit at this phase — the ledger is already shipped.

**Phase 0a — Rename pass (Haiku, mechanical Edit).** Update `.arcanea/lore/PRISM_LUXIN_SYSTEM.md` and `book/the-hall-of-white/BIBLE.md` to replace any "Lumen" instances (the over-cautious v1 ledger naming) with **Luxin**. Keep all other references (Yumiko-Prism, Hall of White, Order of Refracted Light) unchanged — those are Arcanean originals. Single commit.

**Phase 1 — Cosmology Fix (Sonnet, mechanical Edit).** Rewrite `.arcanea/lore/PRISM_LUXIN_SYSTEM.md` lines ~27-37 (the Eleven Frequencies table) and the surrounding paragraphs to clarify: **Lumina = Source = White at three strata (Cosmic / Gate / Practitioner). Shinkami is the Source-Gate Guardian, the mortal-side aperture toward Lumina, NOT Lumina herself.** The Source Gate (1111 Hz) is the highest mortal-accessible frequency pointing AT Lumina. Sustained Source-state = touching Lumina-aspect = Architect-tier reach. Update the Black/White/Source Why-They-Are-The-Same-Thing section accordingly. Commit + push + verify.

**Phase 2 — Luxin Material Taxonomy (Opus, novel architecture).** Author `.arcanea/lore/LUXIN_MATERIAL_TAXONOMY.md` (~3-5K words). Use **Luxin** (per Phase 0 ledger). Full per-color material property table (Sub-red Luxin, Red Luxin, Orange Luxin, Yellow Luxin, Green Luxin, Blue Luxin, Super-violet Luxin, Chi Luxin, Paryl Luxin, Black Luxin / Shadow-Luxin, White Luxin / Lumina-substance). Tie to Tier 8 Materials canon via cross-reference (the existing Vael Crystals / Luminor Metals / Nero Shards taxonomy gets a fourth class — **Luxin** as drafted-light material). Commit + push + verify.

**Phase 3 — The Chromeria (Opus, novel architecture).** Author `.arcanea/lore/THE_CHROMERIA.md` (~5-7K words). Architect within House Synthesis the full institution: **The Chromeria** is the institutional Tower of House Synthesis, sited in Cinderwall, with the Hall of White (existing canon) as its octagonal Yumiko-Prism heart-chamber. Eleven sub-spires (one per frequency including the central Source-spire). **The Spectrum** is the governing council (one drafter per color holds a seat — eleven seats counting Source). **Discipulus / Discipuli** is the rank structure (Apprentice → Discipulus → Bichrome Adept → Polychrome → Prism candidate → White Aspirant). **Threshing** is the admission ritual. **Lord Prism** is the highest leadership title. **Promachos** is the Blackguard's tactical-leader title (re-purposed from Brent Weeks' Lord-Prism war-power use — ours is Blackguard-only). Commit + push + verify.

**Phase 4 — The Nine Wight Typologies (Opus, prose drafting).** Append to `.arcanea/lore/PRISM_LUXIN_SYSTEM.md` a full Nine Wight Typologies section — for each color (Sub-red through Paryl), a paragraph rendering the Wight transformation in the prose register the Hall of White novella will use. Each typology canonically distinct, each tragic, each true to the color's amplified-disposition logic. Commit + push + verify.

**Phase 5 — Glossary Absorption (Sonnet, terminology).** Author `.arcanea/lore/PRISM_GLOSSARY.md` (~3K words). Forty-plus terms inherited from Lightbringer-canon and Arcanea-named: drafter, draft, halo, halo's edge, Wight, Freeing, Lord Prism, Promachos, Threshing, will-casting, chromacheria, Spectrum, Discipulus, Free Cities, Color Wars, Blackguard-equivalent, Nine-Kings-equivalent, etc. Each entry: brief definition + Arcanean name + cross-reference. Commit + push + verify.

**Phase 6 — Nine Kings (Sonnet, world-design).** Author `.arcanea/lore/NINE_KINGS.md` (~2-3K words). Use **Nine Kings** (the Lightbringer-tradition name, per Phase 0 ledger). Design Arcanea's in-world card-and-strategy game — woven into the political/strategic spine of Chromeria culture. Cards = the nine drafted colors as historical figures (Lord Prisms, Polychromes, Architects who emerged from each color's lineage). Plus the **Prism-card** (Source-state) and the **White-card** (Architect / Lumina-touch) as outer-tier additions. Game mechanics, lore deck, cultural significance. Commit + push + verify.

**Phase 7 — The Blackguard (Sonnet, crew design).** Author `.arcanea/lore/THE_BLACKGUARD.md` (~2-3K words). Design Arcanea's elite protective unit using the LOCKED ledger name **The Blackguard** — recruited from polychrome Discipuli, sworn to protect the Lord Prism and the Chromeria. Structure, induction ritual, signature gear (Luxin-forged armor and blades — original Arcanean designs, NO direct borrowing of Brent Weeks' specific artifact names per the ledger), cultural weight. The Blackguard's tactical commander on active deployment carries the title **Promachos**. Tie to existing Starbound Crews canon. Commit + push + verify.

**Phase 8 — Basis-of-Arcanea Integration (Haiku for cross-links + Sonnet for prose updates).** Update each of: `.arcanea/lore/realms/{INDEX,veldoria,aurevalde,mar-arcano}.md`, `.arcanea/lore/CANON_LOCKED.md` Tier 6 (Houses), Tier 8 (Materials), Tier 9 (Origin Classes), and the five existing Realm BIBLEs to back-reference the new infrastructure. Each Realm gets a "Drafting in this Realm" subsection. House Synthesis section references the Chromeria + Spectrum + Discipulus + Blackguard. Materials section references Luxin as the drafted-light fourth class alongside Vael Crystals / Luminor Metals / Nero Shards. Append a final Approval Log entry summarizing the Lightbringer-absorption canon expansion. Commit + push + verify.

**Phase 9 — Updated Handover (Sonnet).** Author `docs/ops/HANDOVER-{date}-lightbringer-foundation.md` capturing all Phase 1-8 commits, naming the new tier (proposed: `Tier 12: The Chromeria + Lumen Material Layer` for FrankX promotion), listing open canon questions, and pointing the next agent at the next priorities. Commit; do NOT push (per `/handover` skill).

## REPORT FORMAT (after each phase)

- Commit sha + commit message
- Live verification (Vercel deploy state + curl + grep marker)
- What changed in canon (file paths + line ranges)
- Cross-references created (which Realms/Houses/Books now back-reference)
- Open canon questions surfaced for FrankX
- Memory updates (if any new feedback patterns emerged)

---

## Closing direction

Deeper than what shipped 2026-04-26 → 28. The first absorption was the practitioner-mechanics layer. This session is the **infrastructure layer** — the institutions, the materials, the games, the governance, the language. When this lands, the Author Team's seventh book and beyond can be written **inside** this canon rather than building toward it.

The light was already at the prism. The prism was always Arcanean. Now the Tower around the prism is too.

Begin by reading the two 2026-04-28 handovers + `PRISM_LUXIN_SYSTEM.md` + `LEAGUES_AND_ORDERS.md` Part Five. Then propose the Phase 1 cosmology-fix diff before applying it. The lamp is on.
