# Arcanea Image Night Run Oversight

Started: 2026-06-26

## Current Mode

Built-in `image_gen` is the active generation path. The local script ingests outputs and keeps the run observable.

Native unattended generation is blocked in this session because no Codex recurrence/wakeup tool is exposed, and the built-in image tool cannot be invoked from PowerShell. CLI fallback is available only after explicit confirmation and a local `OPENAI_API_KEY`.

## Quality Bar

2026-06-26 correction: the original 8.x/9.x scores were too generous. They described prompt usefulness, not studio-final quality. The active gate is now the 30 point generated asset score:

- 26-30: approved, with surface/crop notes.
- 22-25: concept keeper; iterate once with targeted prompt or edit.
- 0-21: restart from brief and references.

Ship candidates score 8.5+ when they satisfy:
- Canon fidelity: five elements, Gates, Houses, Origin Classes, Realms, and materials are not contradicted.
- Arcanea taste: AI-lab premium, restrained, sovereign, not fantasy-game chrome.
- Use fit: site/social/book/product/infographic intent is obvious at thumbnail size.
- Originality: inspired by elemental bending as an archetype, but not visually derivative of any franchise.
- Text discipline: only large labels in generated images; detailed explanation belongs in Markdown/HTML.

## Foundation Batch Recap

Batch `batch-000` created the first four images:

1. Arcanean Avatar full hero state.
2. Arion, Mera, Emilia, Akamoto, and dragon crew.
3. Premium Arcanea books and luminous codex.
4. Grand Convergence infographic.

Overall: strong franchise spine. The best image is the Avatar hero state because it makes bending, dragon myth, and Confluence responsibility immediately legible. The weakest constraint remains generated text, especially in dense infographics. Next infographic passes should use fewer labels and bigger hierarchy.

## Next Improvements

- Make bending more physical: stance, breath, hands, posture, attention.
- Keep product/UI visuals restrained; myth belongs in content, not app chrome.
- Create social campaign assets in 4:5 and 1:1 variants.
- Separate lore-canon images from marketing images in the ledger.
- Prefer one clear title over many small labels inside generated images.

## Run Log

- `batch-000`: 4 generated, ingested, scored. Foundation concept set: Avatar hero, crew, books, Grand Convergence infographic.
- `batch-001`: 4 generated, ingested, scored. Best asset: Eight Origin Classes social poster at 9.0. Strong site/product/social coverage.
- `batch-002`: 4 generated, ingested, scored. Best asset: Seven Academy Houses crest sheet at 9.1. Strong Malachar key art and materials board. Ten Gates map needs a cleaner no-secondary-text pass.
- `batch-003`: 4 generated, ingested, scored. Best asset: Pyrathis world-dragon vista at 9.3. Thal'Maris and Starbound Crews are both usable campaign assets. Van Linh is respectful and graceful; next pass should abstract architecture further to avoid postcard shorthand.
- `batch-004`: 4 generated, ingested, scored. Best asset: Emilia prism-tech character plate at 9.3. Arion and Mera are franchise-ready character plates. Akamoto is strong but should receive a more practical field-mentor version next.
- `batch-005`: 2 generated, ingested, scored. Mobile homepage hero is usable for site exploration. Photoreal creator studio image is a strong production/storytelling asset for making-of posts, blog heroes, and social proof.

## Latest 10-Image Run

Generated 10 additional images across lore, character, site, social, and photoreal production needs:

1. Thal'Maris undersea memory-water city.
2. Pyrathis world-dragon vista.
3. Van Linh Mirror Realm concept art.
4. Starbound Crews reveal poster.
5. Arion character plate.
6. Mera character plate.
7. Emilia prism-tech character plate.
8. Headmaster Akamoto mentor plate.
9. Arcanea mobile homepage hero.
10. Photoreal creator studio editorial desk.

Strongest outputs:
- Pyrathis: best pure worldbuilding vista.
- Emilia: best character-system bridge, because magic reads as toolmaking.
- Photoreal studio desk: best practical marketing asset.
- Arion: strongest flagship protagonist plate.

Next run should generate:
- Individual Starbound Crew posters.
- Practical field-gear variants for Mera and Akamoto.
- Horizontal blog/site crops of the photoreal studio desk.
- Cleaner social/story crops from Pyrathis and Thal'Maris.

## Loop Fix

The first watcher dry run revealed a double-ingest edge case: manually ingested source images were not yet in `.state/known-source-images.txt`. The operator loop now merges the state file with `ledger.csv` source paths before deciding what is new. Duplicate `batch-003` copies were removed and batch-003 was restored to queued.

## Batch Update - 2026-06-26T04:52:05 - batch-003

Generated rows now tracked: 0 / 4


## Batch Update - 2026-06-26T13:50:40 - batch-003

Generated rows now tracked: 4 / 4


## Batch Update - 2026-06-26T13:58:59 - batch-004

Generated rows now tracked: 4 / 4


## Batch Update - 2026-06-26T14:03:11 - batch-005

Generated rows now tracked: 2 / 2


## Batch Update - 2026-06-26T14:04:46 - batch-005

Generated rows now tracked: 2 / 2


## Batch Update - 2026-06-26T14:34:07 - batch-005

Generated rows now tracked: 2 / 2


## Quality Recalibration - 2026-06-26T14:34:07

The previous 9.x score interpretation is deprecated. The current 22 generated images were rescored with the 30 point generated asset gate.

- Approved with notes: batch-003-02, batch-005-02.
- Near approval / iterate: batch-001-03, batch-002-02, batch-002-03, batch-004-03.
- Concept keepers needing iteration: most lore, character, and hero assets.
- Restart: generated text-heavy infographics batch-000-04 and batch-002-01.

Primary correction: future batches must optimize for crisp art direction, fewer motifs, modelable material logic, body-led bending, and actual artifact inspection before approval.


## Batch Update - 2026-06-26T16:49:49 - batch-006

Generated rows now tracked: 0 / 4


## Batch Update - 2026-06-26T16:57:57 - batch-006

Generated rows now tracked: 4 / 4


## Batch Update - 2026-06-26T17:23:25 - batch-006

Generated rows now tracked: 4 / 4


## Quality Recalibration - 2026-06-26T17:23:24

The previous 9.x score interpretation is deprecated. The current 26 generated images were rescored with the 30 point generated asset gate.

- Approved with notes: batch-003-02, batch-005-02, batch-006-01, batch-006-03.
- Near approval / iterate: batch-001-03, batch-002-02, batch-002-03, batch-004-03, batch-006-02, batch-006-04.
- Concept keepers needing iteration: most lore, character, and hero assets.
- Restart: batch-000-04, batch-002-01.

Primary correction: future batches must optimize for crisp art direction, fewer motifs, modelable material logic, body-led bending, and actual artifact inspection before approval.


## Batch Update - 2026-06-26T21:24:16 - batch-007

Generated rows now tracked: 0 / 4


## Batch Update - 2026-06-26T21:32:10 - batch-007

Generated rows now tracked: 4 / 4


## Batch Update - 2026-06-26T21:34:09 - batch-007

Generated rows now tracked: 4 / 4


## Quality Recalibration - 2026-06-26T21:34:08

The previous 9.x score interpretation is deprecated. The current 30 generated images were rescored with the 30 point generated asset gate.

- Approved with notes: batch-003-02, batch-005-02, batch-006-01, batch-006-03, batch-007-01, batch-007-02, batch-007-03, batch-007-04.
- Near approval / iterate: batch-001-03, batch-002-02, batch-002-03, batch-004-03, batch-006-02, batch-006-04.
- Concept keepers needing iteration: most lore, character, and hero assets.
- Restart: batch-000-04, batch-002-01.

Primary correction: future batches must optimize for crisp art direction, fewer motifs, modelable material logic, body-led bending, and actual artifact inspection before approval.


## Batch Update - 2026-06-26T21:38:11 - batch-008

Generated rows now tracked: 0 / 4


## Batch Update - 2026-06-26T21:47:19 - batch-008

Generated rows now tracked: 4 / 4


## Batch Update - 2026-06-26T21:50:51 - batch-008

Generated rows now tracked: 4 / 4


## Quality Recalibration - 2026-06-26T21:50:51

The previous 9.x score interpretation is deprecated. The current 34 generated images were rescored with the 30 point generated asset gate.

- Approved with notes: batch-003-02, batch-005-02, batch-006-01, batch-006-03, batch-007-01, batch-007-02, batch-007-03, batch-007-04, batch-008-01, batch-008-02, batch-008-03, batch-008-04.
- Near approval / iterate: batch-001-03, batch-002-02, batch-002-03, batch-004-03, batch-006-02, batch-006-04.
- Concept keepers needing iteration: most lore, character, and hero assets.
- Restart: batch-000-04, batch-002-01.

Primary correction: future batches must optimize for crisp art direction, fewer motifs, modelable material logic, body-led bending, and actual artifact inspection before approval.

