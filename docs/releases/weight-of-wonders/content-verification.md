# The Weight of Wonders — independent content verification

Verifier: `/root/wonders_verifier`  
Review date: 2026-09-09  
Review scope: six source PNG masters and `Arcanea-The-Weight-of-Wonders.md`  
Release scope: six new works, separate from the existing 36-work Sovereign Depths release

## Verdict

**CONTENT PASS — eligible for integration, with required presentation conditions.**

This is not a release approval. Code, responsive rendering, interactions, reduced-motion behavior, exact source/master SHA checks, CI, production output, and deployment evidence remain unverified.

The packet keeps all six proposals explicitly **EXPERIMENTAL** and does not claim locked canon, a playable or shipped game, tested mechanics, finished manuscripts, published novels, or a completed website deployment. Its new antagonistic forces are bounded social, institutional, mechanical, or ecological conflicts; they do not replace Malachar as locked Arcanea's only true cosmic antagonist. It introduces no deity, Guardian reassignment, new origin class, Nero corruption claim, or change to Malachar's imprisonment.

The encounter and trilogy proposals form one useful causal chain: upstream collectors affect water; the dam's inherited control boundary distributes risk; displaced residents then meet an identity system that trades sanctuary against legal continuity. Objectives, warnings, traversal changes, and consequences arise from those systems rather than arbitrary spectacle. This is coherent concept design. It is not proof that the encounters are playable or that a novel exists, and the public surface must preserve that distinction.

## Required presentation conditions

1. Every gallery card, dossier, API response, and MCP response for these six records must expose `EXPERIMENTAL` status. The six works must remain a distinct collection and data route, separate from the existing Sovereign Depths 36 records; the current dedicated route, collection ID and gallery feature satisfy this condition without requiring cross-collection promotional copy.
2. Do not use language such as “in the game,” “play now,” “published trilogy,” “from the novel,” “official canon,” or any equivalent claim. Encounter text should be framed as a proposal or design concept.
3. Keep image evidence distinct from proposed story/mechanics. In particular:
   - Vesrane's image does not visibly demonstrate that her face is omitted from the water reflection; the reflection is cropped below the face.
   - Qorath's exact sixty-metre span is not established by the image; one near wing is cropped and perspective prevents measurement.
   - The Palace's anomalous route reads as submerged stone at least as readily as a route visible only in reflection.
   - The Orchard image shows active foreground irrigation and does not clearly prove the separate dry-channel or monopolized-water story beat.
4. Preserve the practical-limit note that the City image's trident banners are incidental generated illustration, not approved Arcanea faction heraldry.

## Item-level evidence

| Asset | Source SHA-256 | Visual verdict | Evidence and limits |
|---|---|---|---|
| `wow-b01` / Orvess | `24072f1e328dd9f34ea650e176fba41de85fac3851f7906d01a1ad62642c2875` | PASS | Monumental load and action read immediately. The open chest conduit, bronze/ceramic separation, sediment flood, bracing limbs, engineer, and inhabited structures establish a working protector at civic scale. The recessed head is not independently legible and the amber hip leak is a small cue; neither should carry explanatory copy alone. |
| `wow-b02` / Vesrane | `35cac2fe7351686de2f240131cacf2bd908955ddc5b6af9ea6b8bea1cdc180fe` | PASS | Mature specific face, grounded stance, weighted clothing, offered mask, taut thread, recipient, worn shoe, water, and receding registry architecture support intimate institutional danger. The claimed missing-face reflection is outside the visible reflected crop and remains story text rather than image proof. |
| `wow-b03` / Qorath | `e01c9558c38bb0c3c72217480bd35e60ea6f797d3e1f412b35b57643b7571288` | PASS | Two-wing/two-leg avian anatomy, bearded-vulture face, rust breast, separated primaries, coherent petal/grass/cloak wake, orchard keeper, winch, smaller distant bird, and eggshell create a specific territorial animal rather than a monster pose. The near wing is cropped; exact wingspan and flight feasibility remain unproved. |
| `wow-d01` / City That Holds Its Breath | `1a9abb8cefd1b13825813be4aa3f9ab36e9b26292741e3ef70e7e549c11f50de` | PASS | Spiral stair, occupied market bridge, lower basin/quay, boats, repair benches, chains/counterweight, gated water conduit, and exterior colossal limb make the pressure-city relationship unusually clear. The trident banners are conspicuous generated heraldry and require the non-canon practical limit above. |
| `wow-d02` / Palace of Unreturned Names | `7bafa576d0c48359fedbb1113a3a5aa9b59e14f244f4bec09c2ea1256f03392a` | PASS | Side-gallery viewpoint, sparse masks and empty niches, registration counter, refugee group, water, silk wall, and layered civic scale support the registry premise without gore or throne imagery. The route anomaly is evocative but visually ambiguous between reflection and submerged path; it cannot prove a tested navigation rule. |
| `wow-d03` / Orchard Above the Storm | `352cd07f476e6971efd5694cb460ae41375a44242a782661fb0961fbcfabfdb1` | PASS | Specific fruit, old tree, gardener, reed screen, active runnels, terraces, bedrock-rooted homes/bridges, people, pack animals, nest, secondary bird, and storm depth make a cultivated lived landscape. The image demonstrates working water; the shortage and allocation conflict remain narrative proposals. |

## Source integrity

All six packet provenance entries were recomputed from the local source masters. Each SHA-256, byte size, and pixel dimension matches the authoritative packet:

| Asset | Dimensions | Bytes | SHA result |
|---|---:|---:|---|
| Orvess | 1536 × 1024 | 3,212,750 | match |
| Vesrane | 1024 × 1536 | 2,492,645 | match |
| Qorath | 1536 × 1024 | 3,223,016 | match |
| City | 1672 × 941 | 2,888,495 | match |
| Palace | 1672 × 941 | 2,334,530 | match |
| Orchard | 1672 × 941 | 3,154,688 | match |

## Pending release gates

- Verify that the implementation adds exactly six records and does not mutate or present them as part of the existing Sovereign Depths 36 collection.
- Verify exact SHA checks from source masters through emitted image assets and rendered data dependencies.
- Review source and built output for experimental/canon/game/novel claims across gallery, dossiers, API, MCP, metadata, structured data, sitemap, and generated bundles.
- Inspect 1440px desktop, 375px mobile, interaction, and reduced-motion captures; mobile must preserve full-art access and readable practical limits.
- Verify keyboard order, focus, accessible names, image alternative text, links, console, contrast, reflow, image loading, and performance evidence.
- Verify typecheck, lint, tests, build, production URL/commit correspondence, post-deploy checks, and rollback before a release verdict.

## Integrated content and derivative review

Reviewed `work/wow-changes/apps/web/lib/visual-encyclopedia/weight-of-wonders.json`, the six delivery WebPs, `art-provenance.json`, the copied creative packet, and the schema/loader on 2026-09-09.

**Verdict: PASS with the same presentation conditions.** The integrated model contains exactly six unique records, three reciprocal boss/dungeon pairs, an `EXPERIMENTAL` literal at collection and item level, two story seeds and a four-beat session kit for every item, and three phases plus three materially different persistent endings for every boss. Session prompts explicitly call the setting experimental, the concepts proposals, and locked identities immutable. The Qorath history correctly states that exact span and flight feasibility are unproved.

The three ending sets are useful because none collapses into a cost-free “good” branch. Repair, witness return, and nesting restoration preserve more of the system while creating compensation, adjudication, or harvest obligations. Destruction/severing/killing produces immediate tactical relief with displaced, exposed, or ecologically affected people. Withdrawal/bargain/retreat preserve unresolved pressure for a later scene. These are credible story consequences, not cosmetic selector labels.

The extended Mara opening is ready for an experimental “opening fragment” treatment. Its ordinary pressure rhythm, neighbor's trunk, covered district map, and “Permitted to flood” reveal place the political harm in physical evidence. The final apprenticeship decision gives the fragment an action rather than ending on atmosphere. The rendered heading must not call it a published-novel excerpt, and Mara's provisional status must remain available in the public context.

The machine data is internally coherent. A subsequent content revision added one `artNote` to each record. The six notes accurately distinguish visual evidence from proposed scale, motion, hydraulics, reflection behavior, traversal rules, or water politics; the City note explicitly classifies its generated banners as unapproved faction emblems. This closes the content-model gap. Runtime verification must still prove that the dossier renders each note legibly.

### Delivery evidence

- The content-PR `creative-packet.md` has SHA-256 `5923546f24edacfcdedab054703fbbfa1906fe6259290c3ab342cd9193a51dfe`. A unified diff against authoritative `Arcanea-The-Weight-of-Wonders.md` (`e095ecda8ce9a86e7a153268e8f151314ba8574f0753758821238cf5a19c33ad`) shows only Prettier's Markdown table alignment in the visual-direction and source-provenance tables. Text, numbers, URLs, prompts, and prose are semantically unchanged.
- All six provenance source byte counts and SHA-256 values match the original PNG masters.
- All six delivery files decode as WebP at the original source dimensions.
- Delivery byte counts and SHA-256 values match both `weight-of-wonders.json` and `art-provenance.json` for every item.
- Pixel-array dimensions match exactly. Lossy encoding is consistent with the declared WebP quality-90 derivative: decoded PSNR ranges from 36.70 dB to 41.24 dB and mean absolute RGB error from 1.61 to 2.60 levels. No crop, resize, or reordered asset was detected.

## Inert content merge verdict

**PASS, conditional on the content PR's required CI and exact-head checks.** The reviewed content bundle contains planning/source prose, three direction records, six image files, one collection data file, and one provenance file. It contains no route, loader, import, component, API, MCP, configuration, package, or deployment mutation, so it cannot expose the six works by itself. Its source and derivative hashes are valid; its canon status and production boundaries are truthful.

The updated reported PR 374 head is `a7bf5639e69b5ff5509a1e1a6971a994882d9fb2`. Its reviewed working bundle includes the six `artNote` values and `creator-guide.md`. The guide truthfully classifies phases as unbalanced and unplaytested intent, the public API as a runtime deliverable requiring both opt-in flags, MCP source as distinct from package publication, crossovers as proposals, Mara as provisional, and the trilogy as an outline.

`content-remote-scope.json` records 14 added paths from the remote PR, each with a matching expected Git blob SHA, and `101861` textual diff characters. The listed scope is inert and remains under the task's 120,000-character gate. Thirteen listed blob identities were also recomputed from the local files and match. The content-PR JSON blob was superseded in the working packet by runtime-only editorial/field-placement changes before this local comparison, so its remote blob cannot be recomputed from the current local copy. The remote evidence artifact records it as matched; the verifier has separately reviewed its semantics. CI and the eventual merge SHA remain release-approver evidence.

### Content merge disposition

The conditional content verdict became effective. `content-merge-proof.json` ties the clean, mergeable PR to exact head `a7bf5639e69b5ff5509a1e1a6971a994882d9fb2` and records successful CI Status, Build, TypeScript, Lint, install, exact-head review, conflict-marker, JavaScript/TypeScript analysis, and Vercel checks. The release approver reports the resulting inert squash as `6836e8d55a5e4c6c33dc68a2c5b67d82dcb1a726`. This approves the reviewed content merge only; runtime source at PR 375 head `c05936343370b76fffeb95122852c8d7ede0a1dc` passes independent review, while the runtime release remains blocked pending exact-head rendered/CI and production evidence.
