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
| `plate-01-slate-row-r01` | Slate Row; Chapter 1, *The house that leaned* | Arion in rain before the settling row while Akamoto inspects the joists; human-scale structural urgency without spectacle. | `exec-ee79e601-402e-4d6d-a169-f5fd56143c9f.png`, 1672 × 941 | `20ceba48a7d34c515a1ac6cf80c110431e7ed077d0b8b7b54d3eb5d0a5442e0b` | `../art/plates/plate-01-slate-row.webp`, 1672 × 941 | `fe139ae38cd3da538804b7561b327bc2db0fbb72d9472326c5a29a61bd451f01` | 16:9 master and 4:5 companion selected. |
| `plate-02-rain-record-r01` | The rain record; Chapter 2, *The voice removed from rain* | Mera under the station awning with physical water, blank record tags, and one sealed blue vial kept dry inside her coat. | `exec-af55d4fd-c4d9-4bbd-8d4e-93bc0e445d14.png`, 1536 × 1024 | `6d600a86a3b963559a53979faf32d9339273eca0b36983d377ad64aeb2c32119` | `../art/plates/plate-02-rain-record.webp`, 1536 × 1024 | `bf3a5afce34209b0185f04035eab8e28ae0c0404ce90838f985dcb339eddec98` | 3:2 master and 4:5 companion selected. |
| `plate-03-correct-instrument-r02` | Correct instrument; Chapter 3, *The instrument that passed* | Emilia uses a fine driver on a rough two-screw manual release beside three glass inspection windows; no emitted beam or magical display. | `exec-fc9851fa-b09e-402e-952d-1598b7756e3b.png`, 1536 × 1024 | `db8c1f3785893061bd815df6a7d78ee5084262d0b69971e4507893b8c7381a24` | `../art/plates/plate-03-correct-instrument.webp`, 1536 × 1024 | `aab11871ebf71bc80cc41136ab5cdcdb812fc5f75d431b71722eea39866c60b8` | 3:2 master and 4:5 companion selected. |
| `plate-04-shared-breach-r03` | Shared breach; Chapter 6, *What the instrument saw* | Exactly three hands converge on one severed cable: Arion braces, Mera insulates, Emilia releases; dry copper is separated from diverted water by a raised curb. | `exec-297aa12e-2330-422c-8321-56f7c4f2d70e.png`, 1536 × 1024 | `e9523a7d410eb56a6087bce1d3f7f9204197a34fe2bdf1ab3a59c166d407e7dd` | `../art/plates/plate-04-shared-breach.webp`, 1536 × 1024 | `3bdca7ad280addb32a21426ce73745d89dd030468d1609aff3a7ca9ef4e5d478` | 3:2 master and 16:9 companion selected. |
| `plate-05-beautiful-weight-r01` | Chapter 10, *A beautiful weight* | Exactly twelve adult students beneath an elegant load-sharing ceiling as one pair of boots sinks into warm stone; consequence, not spectacle. | `exec-a51fad08-8fb1-4a84-89a3-01ebe899298c.png`, 1672 × 941 | `46e6ecfc9fd2194d9125a838be8ec20b1821407dd0bffb4479275a978e17d448` | `../art/plates/plate-05-beautiful-weight.webp`, 1672 × 941 | `4bd01f84f793c8d0569f8d20367268b670f5abc78e04e6614a1a7985bbdbed20` | 16:9 master and 4:5 companion selected. |
| `plate-06-manual-door-r01` | Chapter 24, *A manual door* | A real worn timber door opens inward after an immaculate collar is removed; inactive hardware and blank physical wear marks only. | `exec-dbb90311-c257-4254-89b4-5c2b9d2ac202.png`, 1672 × 941 | `c8a37227faf69958a2f967f7d30296b56319e08cf9ca73dfc653322049dfd9dc` | `../art/plates/plate-06-manual-door.webp`, 1672 × 941 | `47d93299e466ad50226a9ed8192b5c28a7fa968047fd0b53fb76bb03461daaa0` | 16:9 master and 3:2 companion selected. |
| `plate-07-borrowed-method-r01` | Chapter 27, *The borrowed method* | Mera stands beyond upright physical water while Emilia covers the brass route line and Arion's splinted, contracted hand meets stone. | `exec-b816a937-b2e1-4a6b-b553-08ea53f08849.png`, 1672 × 941 | `f174518e50d78d4461edde3a01f44b567d62588ac0d40988ee47c2de41ec511e` | `../art/plates/plate-07-borrowed-method.webp`, 1672 × 941 | `0bd9bfe70f5bb4a319b227bdac30b576b780d4eb2715d6ae1ffe6eaebb195780` | 16:9 master and 4:5 companion selected. |
| `plate-08-foundation-holds-r02` | Chapter 31, *Foundation holds* | A wrapped hand lifts over a new mortar seam beside bowed brass, thinning physical water, exactly three separate blank folded records, and one pencil. | `exec-df2a852c-91fd-4852-85ec-435db1c54573.png`, 1672 × 941 | `04b7689e11b631c67e30a08edcccf0f2e537cabddea350a0f75c3ac9657f8818` | `../art/plates/plate-08-foundation-holds.webp`, 1672 × 941 | `0948c8731d54658d7aa9d1c8ec2db89c47924ca4ef0e86a11158d9ede1db7333` | 16:9 master and 4:5 companion selected. |
| `plate-09-final-record-r01` | Final record; Chapter 32, *What no one owns* | Three unlike blank pages, a pencil, bent key, chipped cup, and the blurred trio share one unrepaired table. | `exec-40093e54-cfb5-4f93-a081-a8a9fd49b209.png`, 1536 × 1024 | `2740c2e79aa11a374181f1f3067d45f7c8f648848cfdb604af14e08b1746179a` | `../art/plates/plate-09-final-record.webp`, 1536 × 1024 | `f8dc981ddb67729d9becc9f94a55ad3a1d1f6732526525f6943ec613b82fc0ae` | 3:2 master and 4:5 companion selected. |

## Alternate-composition receipts

These are generated companion compositions, not automatic crops. Their prompt summaries preserve the same scene action while reordering the visual hierarchy for the required aspect ratio.

| Crop asset ID | Prompt summary | Source receipt and dimensions | Source SHA-256 | Tracked derivative | Derivative SHA-256 |
|---|---|---|---|---|---|
| `plate-01-slate-row-4x5-r01` | Arion anchors the mobile frame; connected damaged homes rise behind him while Akamoto inspects the roof structure. | `exec-15388376-0cbc-4300-a9b8-33f8d44894d2.png`, 1122 × 1402 | `0f83ee91032c25c5cbc697a7449582db286c5f7f7baf962fe7bb75ae92e55c6a` | `../art/plates/plate-01-slate-row-4x5.webp` | `a47b78aa2967e6bd085b1975f306bfa0bf878c18a072dd2f106b6840e1d5009a` |
| `plate-02-rain-record-4x5-r02` | Mera, one dry blue vial, physical rain, evidence vessels, and completely blank paper/tag surfaces share the portrait frame. | `exec-a272bd91-d1b9-426e-8208-5c5e2d1c75fd.png`, 1122 × 1402 | `4958bf1220b4e0b06ba47b90aae2f41de42d562a5d245e1bc202bd171f1ea985` | `../art/plates/plate-02-rain-record-4x5.webp` | `6f339ad330c35315eb5176e0c58475b1c8ed97758992922614e87fe916070568` |
| `plate-03-correct-instrument-4x5-r02` | Emilia, yellow cuff, driver, manual side plate, and exactly three passive neutral inspection windows remain mobile-legible. | `exec-ac19727b-5cda-4f59-be3b-9e50f964d332.png`, 1122 × 1402 | `69aa6430430741833b19df43da8deb474aa86d66cc07091d8c7f6dc8f71307e6` | `../art/plates/plate-03-correct-instrument-4x5.webp` | `e2f7fb7a0531e0120364df702a4dae39a8ea92df6f1f76c5d003c5086dd6cc0e` |
| `plate-04-shared-breach-16x9-r01` | The wider frame preserves exactly three hands at one dry breach and makes the raised-curb water separation explicit. | `exec-985254c6-84a5-4a72-8709-ed2d139202dc.png`, 1672 × 941 | `f7e793d7ab99e72150c77a41b69519156e989f2ab4a9d1ce8c2e975069ae74f4` | `../art/plates/plate-04-shared-breach-16x9.webp` | `a78db46703b3fee7b906dffcc9aa426d820ce828e17bb9ed41a6a66d524e3c5d` |
| `plate-05-beautiful-weight-4x5-r01` | The ceiling dominates above exactly twelve adults while only the central pair of boots sinks into warm stone. | `exec-0ff75c63-71bd-4225-81b7-4f4690872139.png`, 1122 × 1402 | `5f851a4e6146d750562e89e2e82f214e3e26541d590385f8352d6b18f5b8daf6` | `../art/plates/plate-05-beautiful-weight-4x5.webp` | `ab90ed4e34ac7f7388fea9dca4438d00c42dc95650f9a4d1dc1d512c9d34824f` |
| `plate-06-manual-door-3x2-r01` | The full timber leaf, ordinary threshold, inert removed collar, manual latch, and physical corridor daylight share the 3:2 frame. | `exec-4e792526-977f-41d1-b21b-e4d5727cd3d9.png`, 1536 × 1024 | `e9bc9f342bdc121127f72440e278ac4e41046d3ff7cb25483fcde376c1d82813` | `../art/plates/plate-06-manual-door-3x2.webp` | `a931037a309826e0b31104aa889b51d87c0e67ad4be748e400791e5eb17d8f2d` |
| `plate-07-borrowed-method-4x5-r01` | Arion's splinted contracted hand, Emilia's covered route mechanism, and Mera beyond framed physical water remain vertically connected. | `exec-f55e3fda-4749-45d5-ad8c-3ca381cbf0cd.png`, 1122 × 1402 | `aca2e8dbbf38ed7d03b77bf67d8b7afcae187b1cc411ef7b54cfa1d2949403e1` | `../art/plates/plate-07-borrowed-method-4x5.webp` | `04d3625d266a0d072b01b026637d838ab133b743757e30df612d704b83f861dc` |
| `plate-08-foundation-holds-4x5-r01` | The wrapped hand, fresh mortar, three dry blank folds, one pencil, bowed brass, and physical water form a single vertical evidence chain. | `exec-242aaed0-7950-41f6-9061-739f7d39b372.png`, 1122 × 1402 | `837cf92887be22459660b7fb9fde74b2172ea170877cd6b92c44d0e009de0b2e` | `../art/plates/plate-08-foundation-holds-4x5.webp` | `6a778fdd83893d94dff493acef9399f272d621fa59f72a1fbad5c24c1bc5ea18` |
| `plate-09-final-record-4x5-r01` | Three blank pages, pencil, bent key, chipped cup, unrepaired seam, and the blurred trio close the portrait still life. | `exec-8d4a8b07-3703-4a1f-9bda-ba723871a1ba.png`, 1122 × 1402 | `e2fa0050e2fc918c1639eb1a2c459412336d283bc3721019eda70c205e104919` | `../art/plates/plate-09-final-record-4x5.webp` | `a26281ac560415ab7555d57f31633ff3a79e544728ea556fbf265cf24710aa03` |

## Editorial history

- P01, P02, P05, P06, P07, and P09 passed their first selected-candidate review.
- P03 was revised because a violet reflection initially read as an emitted beam. The selected revision removes that implication and makes the manual release physical.
- P04 was fully re-staged after earlier candidates failed to make three methods visibly converge on one dry breach. The selected revision closes the hand-count, shared-action, and water-separation failures.
- P08 was locally revised because the folded-record count was ambiguous. The selected revision shows exactly three separate blank folds and one pencil.
- Failed or superseded candidates remain private production material and are not part of the edition-value claim.

## Open human and delivery gates

1. Human creator approval of character casting, canon identity, and image rights.
2. Current provider-terms review for commercial use.
3. Placement-safe-zone and trim checks in the final reader and artbook layouts; automatic center crops remain prohibited.
4. Alt text and scene captions checked against the released prose.
5. Print-safe color, shadow detail, and proof-page review with the final artbook layout.
6. Public placement only after the edition release gate is approved.
