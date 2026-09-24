# Arcanea: Meridian — Transmedia and Release Strategy

## Principle

One canon, four native experiences. The novel owns interiority; the vertical comic owns scroll-time and reveal; anime owns performance, sound, and simultaneous motion; Arcanea.ai owns participation, continuity, and return visits. No medium is a reduced advertisement for another.

## Release ladder

### Phase 0 — Proof of world (0–8 weeks)

- Launch `/sagas/meridian` as the world-entry root candidate.
- Launch `/sagas/meridian/chapter-zero` as the cinematic reader.
- Release five relic records over five weeks, each paired with one short character scene and one sound motif.
- Test world-entry against story-entry via `/sagas/meridian/enter`.
- Success gate: Chapter Zero starts per exposed visitor, then 90%-scroll completion and return visits.

### Phase 1 — Reader formation (2–6 months)

- Publish a polished Book I sample: Chapter Zero plus three sequential chapters.
- Release Webtoon Season 1 in three production batches to protect cadence.
- Publish a 60–90 second anime proof film centered on the first five-way “yes,” not a generic battle montage.
- Open relic conversations on Arcanea.ai with strict spoiler tiers and canon-source links.

### Phase 2 — Collection conversion (6–18 months)

- Complete and release Book I.
- Bundle webtoon season arcs into premium digital volumes.
- Use reader cohorts, completion data, saves, and relic affinity to sequence—not rewrite—the release plan.
- Build an anime pitch package only after the novel and vertical adaptation prove repeat engagement.

## Vertical webtoon: Season One

**Length:** 48 episodes  
**Cadence target:** weekly only when 8–12 finished episodes are banked  
**Episode grammar:** 45–70 mobile panels, one emotional turn, one visual set-piece, one irreversible final beat.

### Four 12-episode movements

1. **The Name Theft (1–12):** Orison rises; Elyon hears five voices; Mirae's truth condition establishes the consent engine.
2. **Five Refusals (13–24):** each relic gets a refusal episode; Cael saves civilians by severing flame from fuel.
3. **The Honest Enemy (25–36):** PALINODE speaks; Elyon's hidden memory cost fractures the accord; Great Severance becomes plausible.
4. **The Sea Rose (37–48):** five individual yeses, the first Meridian, Sera's face lost, Cael preserves the stolen names.

### Native visual grammar

- Repeat a five-panel vertical motif when the relics disagree; break the grid only when consent aligns.
- Use long negative-space drops for Seyr and pressure-compressed panels for Orun.
- Let Mirae's memory scenes appear beneath the “surface” of the main scroll.
- Render Nhal's possibilities as mutually exclusive panel branches that rejoin only after Elyon chooses.
- Reserve full-bleed elemental convergence for earned consent, preventing spectacle inflation.

Official platform notes should be validated before upload. WEBTOON CANVAS positions itself as a creator publishing and audience-growth platform, while Tapas currently specifies square episode thumbnails at 300×300 and under 2 MB. GlobalComix supports both vertical-scroll and traditional layouts, useful for repackaging without forcing one master format.

Sources: [WEBTOON CANVAS](https://www.webtoons.com/en/creators101/webtoon-canvas), [Tapas publishing guide](https://help.tapas.io/hc/en-us/articles/1260802028970-Series-Basics-How-to-publish-a-comic-episode-on-Tapas), [GlobalComix publishing](https://globalcomix.com/publish).

## Anime development: Season One

**Format:** 13 × 24-minute episodes  
**Adaptation scope:** Book I as a complete season  
**Music thesis:** five imperfect motifs become harmonic only after independent entrances.

### Episode spine

1. The Day the Sea Rose
2. Five Sealed Cases
3. Mirae Requires a Truth
4. A Map With an Exit
5. Khar and the Unkept Oath
6. The Weight of Every Home
7. PALINODE
8. The Cost He Hid
9. Cael's Mercy
10. The Great Severance
11. Five Refusals
12. Five Yeses
13. The Face in the Water

The proof film should stage Episode 12's consent sequence: minimal dialogue, one distinct vocal or instrumental signature per relic, and a final silence when Elyon's memory disappears. It proves the property’s unique dramatic mechanism better than a montage of powers.

## Arcanea.ai living-world experience

### Information architecture

- **World entry:** hero, five clickable relics, story engine, antagonist, collection map.
- **Story mode:** distraction-light reader, chapter progress, art and music synchronized to narrative beats.
- **Relic archive:** canon dossier, relationship state, material provenance, appearances, spoiler level.
- **Character graph:** human, Awakened, relic, location, vow, memory, and source relationships.
- **Release room:** current chapter/episode, creator notes, art drops, soundtrack, next canonical date.

### AI boundaries

- Conversations are framed as interpretive performances grounded in retrieved canon, not new canon.
- Every generated answer links to source records and carries a spoiler tier.
- A generated claim cannot update lore; only editorial promotion from staging can.
- Relics may refuse questions in-character, but the interface must distinguish refusal from technical failure.
- No fan interaction changes a published character's consent history, wound, or major choice.

## Entry experiment

### Variants

- **World (selected/default):** relic sidebar; optimizes platform comprehension and relic interaction.
- **Story:** five-panel cinematic hero; optimizes Chapter Zero starts.

### Traffic and attribution

- Shared experiment URL: `/sagas/meridian/enter`.
- Server assigns 50/50, stores a 30-day HTTP-only cookie, and redirects to an explicit `entry` query.
- QA overrides: `/sagas/meridian/enter?variant=world` and `?variant=story`.
- Exposure event: `meridian_experiment_viewed`.
- Intent events: `meridian_relic_opened`, `meridian_cta_clicked`.
- Conversion events: `meridian_chapter_started`, `meridian_chapter_completed`.

### Decision rule

Primary metric is unique Chapter Zero starts divided by unique experiment exposures. Secondary metrics are relic-open rate, 90%-scroll completion, return visit within seven days, and eventual account/email conversion. Guardrails are mobile LCP, CLS, bounce, and error rate.

Run until each arm has at least 500 unique exposures and a full seven-day cycle. Promote World to the site root if its Chapter Zero start rate is no worse than 10% relative to Story and it produces at least 25% more relic interactions. Otherwise preserve World as the saga hub and use Story for high-intent reading campaigns.

Vercel Flags can later replace the lightweight assignment endpoint with weighted string variants and environment controls after dependency review. Relevant official references: [Flags overview](https://vercel.com/docs/flags), [Vercel Flags](https://vercel.com/docs/flags/vercel-flags), and [A/B test guidance](https://vercel.com/docs/flags/vercel-flags/cli/run-ab-test).

