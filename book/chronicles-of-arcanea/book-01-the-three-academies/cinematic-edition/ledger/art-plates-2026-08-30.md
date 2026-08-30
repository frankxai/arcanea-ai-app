---
title: Cinematic plate generation ledger
edition: book-01-cinematic
visibility: private-production
status: protected-staging
generated: 2026-08-30
---

# Cinematic plate generation ledger

This receipt records the nine selected narrative plate candidates for the founding cinematic edition. The tracked WebP files are protected staging derivatives, not public edition art, commercial-final assets, or canon identity. The lossless generated PNG masters remain in the owned generation receipt store and are identified here by receipt filename and SHA-256 rather than by a private machine path.

## Shared production record

- **Generator:** OpenAI image generation through the Codex imagegen workflow. The tool did not surface the exact backend model, so the ledger does not reconstruct one.
- **Owned references:** `ART_DIRECTION.md` and `BOOK_BIBLE.md` as present at branch commit `05fc3959b`, plus the protected-staging cover study `cover-held-interval-preview-r03` for material and casting continuity. P03 and P08 also used their earlier owned plate candidate as an edit reference. No third-party visual reference was supplied.
- **Generation method:** scene-specific owned prompt, bounded visual/canon review, and targeted regeneration or edit when a must-fix remained.
- **Tracked conversion:** FFmpeg `libwebp`, quality 90, compression level 6, `picture` preset; source pixel dimensions preserved.
- **Rights:** pending current provider-terms review and human approval before commercial use.
- **Canon:** staging-safe only. Human canon and character-casting approval remain open.
- **Visual quality:** protected-staging PASS from a verifier separate from the image maker. See `../reviews/art-plates-staging-qa-2026-08-30.md`.

## Selected assets

| Asset ID | Story / chapter anchor | Owned prompt summary | Source receipt and dimensions | Source SHA-256 | Tracked derivative | Derivative SHA-256 | Crop status |
|---|---|---|---|---|---|---|---|
| `plate-01-slate-row-r01` | Slate Row; Chapter 1, *The house that leaned* | Arion in rain before the settling row while Akamoto inspects the joists; human-scale structural urgency without spectacle. | `exec-ee79e601-402e-4d6d-a169-f5fd56143c9f.png`, 1672 × 941 | `20ceba48a7d34c515a1ac6cf80c110431e7ed077d0b8b7b54d3eb5d0a5442e0b` | `../art/plates/plate-01-slate-row.webp`, 1672 × 941 | `fe139ae38cd3da538804b7561b327bc2db0fbb72d9472326c5a29a61bd451f01` | 16:9 master selected; intentional 4:5 derivative pending. |
| `plate-02-rain-record-r01` | The rain record; Chapter 2, *The voice removed from rain* | Mera under the station awning with physical water, blank record tags, and one sealed blue vial kept dry inside her coat. | `exec-af55d4fd-c4d9-4bbd-8d4e-93bc0e445d14.png`, 1536 × 1024 | `6d600a86a3b963559a53979faf32d9339273eca0b36983d377ad64aeb2c32119` | `../art/plates/plate-02-rain-record.webp`, 1536 × 1024 | `bf3a5afce34209b0185f04035eab8e28ae0c0404ce90838f985dcb339eddec98` | 3:2 master selected; intentional 4:5 derivative pending. |
| `plate-03-correct-instrument-r02` | Correct instrument; Chapter 3, *The instrument that passed* | Emilia uses a fine driver on a rough two-screw manual release beside three glass inspection windows; no emitted beam or magical display. | `exec-fc9851fa-b09e-402e-952d-1598b7756e3b.png`, 1536 × 1024 | `db8c1f3785893061bd815df6a7d78ee5084262d0b69971e4507893b8c7381a24` | `../art/plates/plate-03-correct-instrument.webp`, 1536 × 1024 | `aab11871ebf71bc80cc41136ab5cdcdb812fc5f75d431b71722eea39866c60b8` | 3:2 master selected; intentional 4:5 derivative pending. |
| `plate-04-shared-breach-r03` | Shared breach; Chapter 6, *What the instrument saw* | Exactly three hands converge on one severed cable: Arion braces, Mera insulates, Emilia releases; dry copper is separated from diverted water by a raised curb. | `exec-297aa12e-2330-422c-8321-56f7c4f2d70e.png`, 1536 × 1024 | `e9523a7d410eb56a6087bce1d3f7f9204197a34fe2bdf1ab3a59c166d407e7dd` | `../art/plates/plate-04-shared-breach.webp`, 1536 × 1024 | `3bdca7ad280addb32a21426ce73745d89dd030468d1609aff3a7ca9ef4e5d478` | 3:2 master selected; intentional 16:9 derivative pending. |
| `plate-05-beautiful-weight-r01` | Chapter 10, *A beautiful weight* | Exactly twelve adult students beneath an elegant load-sharing ceiling as one pair of boots sinks into warm stone; consequence, not spectacle. | `exec-a51fad08-8fb1-4a84-89a3-01ebe899298c.png`, 1672 × 941 | `46e6ecfc9fd2194d9125a838be8ec20b1821407dd0bffb4479275a978e17d448` | `../art/plates/plate-05-beautiful-weight.webp`, 1672 × 941 | `4bd01f84f793c8d0569f8d20367268b670f5abc78e04e6614a1a7985bbdbed20` | 16:9 master selected; intentional 4:5 derivative pending. |
| `plate-06-manual-door-r01` | Chapter 24, *A manual door* | A real worn timber door opens inward after an immaculate collar is removed; inactive hardware and blank physical wear marks only. | `exec-dbb90311-c257-4254-89b4-5c2b9d2ac202.png`, 1672 × 941 | `c8a37227faf69958a2f967f7d30296b56319e08cf9ca73dfc653322049dfd9dc` | `../art/plates/plate-06-manual-door.webp`, 1672 × 941 | `47d93299e466ad50226a9ed8192b5c28a7fa968047fd0b53fb76bb03461daaa0` | 16:9 master selected; intentional 3:2 derivative pending. |
| `plate-07-borrowed-method-r01` | Chapter 27, *The borrowed method* | Mera stands beyond upright physical water while Emilia covers the brass route line and Arion's splinted, contracted hand meets stone. | `exec-b816a937-b2e1-4a6b-b553-08ea53f08849.png`, 1672 × 941 | `f174518e50d78d4461edde3a01f44b567d62588ac0d40988ee47c2de41ec511e` | `../art/plates/plate-07-borrowed-method.webp`, 1672 × 941 | `0bd9bfe70f5bb4a319b227bdac30b576b780d4eb2715d6ae1ffe6eaebb195780` | 16:9 master selected; intentional 4:5 derivative pending. |
| `plate-08-foundation-holds-r02` | Chapter 31, *Foundation holds* | A wrapped hand lifts over a new mortar seam beside bowed brass, thinning physical water, exactly three separate blank folded records, and one pencil. | `exec-df2a852c-91fd-4852-85ec-435db1c54573.png`, 1672 × 941 | `04b7689e11b631c67e30a08edcccf0f2e537cabddea350a0f75c3ac9657f8818` | `../art/plates/plate-08-foundation-holds.webp`, 1672 × 941 | `0948c8731d54658d7aa9d1c8ec2db89c47924ca4ef0e86a11158d9ede1db7333` | 16:9 master selected; intentional 4:5 derivative pending. |
| `plate-09-final-record-r01` | Final record; Chapter 32, *What no one owns* | Three unlike blank pages, a pencil, bent key, chipped cup, and the blurred trio share one unrepaired table. | `exec-40093e54-cfb5-4f93-a081-a8a9fd49b209.png`, 1536 × 1024 | `2740c2e79aa11a374181f1f3067d45f7c8f648848cfdb604af14e08b1746179a` | `../art/plates/plate-09-final-record.webp`, 1536 × 1024 | `f8dc981ddb67729d9becc9f94a55ad3a1d1f6732526525f6943ec613b82fc0ae` | 3:2 master selected; intentional 4:5 derivative pending. |

## Editorial history

- P01, P02, P05, P06, P07, and P09 passed their first selected-candidate review.
- P03 was revised because a violet reflection initially read as an emitted beam. The selected revision removes that implication and makes the manual release physical.
- P04 was fully re-staged after earlier candidates failed to make three methods visibly converge on one dry breach. The selected revision closes the hand-count, shared-action, and water-separation failures.
- P08 was locally revised because the folded-record count was ambiguous. The selected revision shows exactly three separate blank folds and one pencil.
- Failed or superseded candidates remain private production material and are not part of the edition-value claim.

## Open human and delivery gates

1. Human creator approval of character casting, canon identity, and image rights.
2. Current provider-terms review for commercial use.
3. Intentional crop files for every required aspect ratio; automatic center crops are prohibited.
4. Alt text and scene captions checked against the released prose.
5. Print-safe color, shadow detail, and proof-page review with the final artbook layout.
6. Public placement only after the edition release gate is approved.
