# Arcanea Visual Encyclopedia — Execution Contract

> Date: 2026-08-10
> Status: Active proposal-production lane
> Branch: `codex/arcanea-gallery-encyclopedia`

## Task contract

Scope: Produce and curate 100 new Arcanea visual proposals; connect the existing 30-piece Resonant Kinforms collection; evolve `/gallery` into a searchable visual encyclopedia with graph and cinema-use context; prepare the masters for the shared Starlight Media Platform while keeping lore and review metadata versioned.

Owner: Codex root agent, single writer in the verified isolated worktree.

Files: `apps/web/app/gallery/**`, `apps/web/components/visual-encyclopedia/**`, `apps/web/lib/visual-encyclopedia/**`, scoped API routes and tests, plus the task-owned visualization production ledger.

Non-goals: No automatic canon promotion; no public unauthenticated destructive controls; no new origin classes; no production-domain reassignment; no NFT mint, rights claim, billing, or database migration in this slice.

Acceptance criteria:

- Exactly 100 named proposal entries across 30 Kinforms, 20 characters, 20 creatures, 15 places, and 15 scenes.
- Every entry carries Gate/Guardian anchors, role, gift, cost, visual DNA, camera, emotion, cinema use, content uses, graph links, review state, provenance, and media state.
- Generated exports are inspected and score 26/30 or higher before approval; 22–25 iterate; below 22 restart.
- Public gallery shows only approved or intentionally visible proposal records and labels proposal state plainly.
- Approve/revise/reject operations reuse authenticated Command Center boundaries. Storage deletion is never exposed to anonymous clients.
- Public delivery keys are deterministic, but the gallery accepts media URLs only from a registry-confirmed publication receipt served by the configured shared media origin.
- Responsive, keyboard, reduced-motion, alt-text, performance, rights, and canon checks pass before preview promotion.

Verification: targeted data-contract tests; web type-check/lint/build when machine preflight permits; visual inspection of actual exports; one Vercel preview after the coherent change set; live URL fetch and console/error check.

Rollback: revert the bounded branch or promote the last verified Vercel deployment. The intake packet is non-mutating; no object, registry row, domain, or credential must be removed to roll it back.

## Current proof

- 100/100 new masters approved: all ten Gate-led batches passed 10/10.
- 111 rendered attempts; eleven failed or superseded continuity studies preserved outside the master set.
- Batch means: Foundation 28.4/30; Flow 28.5/30; Fire 28.1/30; Heart 29.0/30; Voice 29.3/30; Sight 29.1/30; Crown 29.2/30; Starweave 29.8/30; Unity 29.5/30; Source 29.6/30.
- 130 catalog records verified with zero duplicate IDs and zero missing relationship targets.
- Standalone catalog validation proves 130 unique IDs and slugs, exact 42/28/25/15/20 totals, ten records in every Wave 02 batch, 560 valid relationship references, and 301 unique undirected graph edges.
- Gallery, graph, cinema chapters, registry-publication hydration, and 130 dossier routes implemented in the isolated worktree.
- Wave 02 explanation exports completed as 100 exact SVG dossiers, ten Gate boards, one 100-record atlas, and a machine-readable manifest; the vector layer references the approved masters and totals only 462,418 bytes.
- Infographic validation proves 100 unique IDs, the exact 30/20/20/15/15 category split, ten records per Gate, valid master references, and 100 unique images in the atlas; five representative dossier types plus the Source board were raster-inspected.
- Remote hosting is paused at the shared-platform release gate. Arcanea PR #241 defines Vercel Blob as a contained legacy transition only; Agentic Ops PR #14 defines Cloudflare R2 plus a dedicated shared Supabase registry as canonical. Neither draft PR has been merged or provisioned by this lane.
- A deterministic Media Fabric intake packet now covers all 130 masters: 320,204,312 bytes, unique SHA-256 checks, exact PNG dimensions, stable client correlation UUIDs, exact `/v1/ingest` headers, content-addressed source-key expectations, provenance, usage links, and explicit rights/review/publication holds. The Control Worker assigns canonical registry IDs; the packet reconciles responses by `arcanea:<sha256>`. The build performed zero network writes.
- The packet contract is pinned to `media-platform/src/control.ts` from Agentic Ops PR #14. Offline validation re-read every binary and proved 130 valid request plans, 130 unique source hashes, the 25 MiB per-object limit, exact content lengths, 4,096-character provenance limits, canonical `v1/arcanea/images/<sha256>.png` source keys, and an empty pre-publication receipt.
- The gallery no longer lists a bucket or needs a write token. It fails closed to catalog metadata until a `starlight.media-publication-receipt.v1` file arrives from `https://media.starlightintelligence.org` with matching source and rendition checksums, content-addressed URL/key, registry asset ID, rendition ID, publication-review ID, and rights-record ID. Duplicate, unknown, off-origin, or checksum-drifted records invalidate the receipt.
- Read-only Vercel audit: the canonical project is configured for Node 24.x; production and recent preview deployments are READY, but no deployment contains this branch and `arcanea.ai` is not attached to the project. Browser/build proof remains open because dependencies are not installed in the worktree and the machine performance gate currently holds local build/visual loops.
- Heart continuity proof: Miri was refined to exactly four jade leaves and two lens-eyes; Repair Chorus retains one Eilo, Roshen, Miri, Elian, and Rhea with distinct jobs and no duplicate Kinforms.
- Voice continuity proof: Tellu was restarted after a humanoid-superhero drift; The Unbroken Message retains one Chori, Tellu, Vesan, Tamarin, Sena, and Bellfox while resolving movement into an ethical archive confrontation.
- Sight continuity proof: Lens Against Shadow keeps the missing message blank across five named cast and two wildlife forms; the refined market removes repeated Orris-like silhouettes and exposes the missing provenance mount without readable labels.
- Crown continuity proof: both ensemble scenes preserve their distinct civic jobs without thrones, heroic elevation, or duplicate named forms; Council at the Unfinished Garden keeps four burden weights and every participant on one public plane.
- Starweave continuity proof: Sel and the Threadtail Grazer were each revised after familiar animal anatomy appeared; the corrected master lane preserves Tessel's three-support form, the Grazer's five supports, Veyra's five consequence fibers, and Nexi's one-body temporal echo.
- Unity continuity proof: Seven Houses was corrected after Wella drifted into a second arthropod; the approved frame separates Wella's worktable body from the single Chorusback Weaver and preserves seven visibly plural bridge zones.
- Source continuity proof: the final ten passed on first attempts; Source Gate Audit interrupts incomplete victory through behavior rather than verdict, and Hundredth Light joins all ten Gate ecologies through distributed work while unfinished repair remains visible and Qori stays at the edge.
- Foundation receipt proof: hashes and PNG dimensions were recomputed for all thirty Wave 01 masters and joined to the existing one hundred Wave 02 receipts; the catalog validator now proves 130 unique media hashes rather than trusting foundation filenames alone.

## Production cadence

Ten batches of ten are paced across seven hours. Each batch is Gate-led and mixes subjects so the collection develops as a world rather than a row of interchangeable mascots.

| Batch | Gate | Kinforms | Characters | Creatures | Places | Scenes |
|---|---|---:|---:|---:|---:|---:|
| 01 | Foundation | 3 | 2 | 2 | 2 | 1 |
| 02 | Flow | 3 | 2 | 2 | 2 | 1 |
| 03 | Fire | 3 | 2 | 2 | 2 | 1 |
| 04 | Heart | 3 | 2 | 2 | 2 | 1 |
| 05 | Voice | 3 | 2 | 2 | 2 | 1 |
| 06 | Sight | 3 | 2 | 2 | 1 | 2 |
| 07 | Crown | 3 | 2 | 2 | 1 | 2 |
| 08 | Starweave | 3 | 2 | 2 | 1 | 2 |
| 09 | Unity | 3 | 2 | 2 | 1 | 2 |
| 10 | Source | 3 | 2 | 2 | 1 | 2 |

## Canon and release rules

- Locked anchors may be referenced; new names, ecology, materials applications, histories, and locations stay proposals.
- Nero is fertile unknown, never shorthand for evil. Shadow is corruption.
- Godbeasts remain singular cosmological relationships, not collectible creatures.
- The eight known origin classes remain a closed staging list.
- Human review controls acceptance, canon promotion, hard deletion, and production release.
