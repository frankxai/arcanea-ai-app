# Arcanea Visual World Engine Portal

Date: 2026-07-06
Owner: Codex lead operator
Routes: `/visual-world-engine`, `/visual-world-engine/social`
Repo: `C:\Users\frank\starlight\repos\arcanea-ai-app`

## Scope

Create a dedicated Arcanea Visual World Engine portal that turns the approved image run into a usable app surface. The portal should connect generated source frames, deterministic social masters, lore/story lanes, Gallery discovery, Genesis proof creation, music/storybook/webtoon pathways, future VIS/registry review, and a read-only social launch approval room.

## Source Truth

- Run folder: `.arcanea/image-lab/run-2026-07-06-god-mode`
- Public gallery masters: `apps/web/public/images/arcanea-world-engine/god-run-2026-07-06`
- Social masters: `apps/web/public/images/arcanea-world-engine/god-run-2026-07-06/social-overlays`
- Evidence manifest: `.visual-qa/arcanea-visual-world-engine-2026-07-06/design-loop-evidence.json`
- Review log: `.arcanea/image-lab/run-2026-07-06-god-mode/review.md`
- VIS dashboard: `C:\Users\frank\starlight\repos\visual-intelligence\data\vis-dashboard.html`

## User Flow

1. Discover the portal through Gallery or a direct route.
2. Understand the first-read promise: Arcanea turns mythic source frames into proof, story, music, and social campaign systems.
3. Browse four lanes: world/Gate frames, story and book seeds, music/performance seeds, and social campaign masters.
4. Choose a next action: open Gallery, enter Living Lore, start Genesis, or review social campaign candidates.
5. Enter `/visual-world-engine/social` to inspect the approval queue before any platform, DB, registry, or web3 action.
6. Keep DB, registry, web3, and external publishing behind human approval until rights/provenance and social readiness are confirmed.

## Scene Brief

First viewport:
- Dominant asset: `arc-visual-036-flow-gate-veloura-membrane-corridor.png`
- Job: show that the generated world engine is already producing canon-aware, portal-grade Arcanea worlds.
- Layout: full-width dark editorial surface with real image background, stats, and immediate route actions.
- Hint of next section must be visible under the hero on desktop and mobile.

Core sections:
- Run telemetry: 38 source frames, 30 curated gallery candidates, 36 deterministic social masters, 76 VIS assets in the last completed scan, 29/30 peak score.
- Portal lanes: Gallery/Atlas, Living Lore, Genesis proof, Music/Performance, Social approval.
- Approved candidates: top Batch 5 plus social flagship assets.
- Batch 11 additions: Unity Kyuro Bridge Action, Gate Stays Open Consent Exit, and World Tower Dragon Habitat Bridge.
- Campaign queue: nine channel-ready campaign seeds with 9:16 preview masters and format matrix.
- Operations rail: provenance, canon, approval, and registry/web3 readiness state.

Social Launch Room:
- Route: `/visual-world-engine/social`.
- Job: expose the nine-campaign approval queue as an operator cockpit, not a showcase and not a publishing tool.
- Source truth: `publishing-approval-queue.json`, `social-overlay-spec.json`, and `social-overlay-manifest.json`.
- App bundle source: verified snapshots of those three files live in `apps/web/app/visual-world-engine/social/data/` so the route can render in preview/production without reading `.arcanea` at request time.
- First wave: Unity Cooperation Lattice, Webtoon Gate Choice, and Music Resonance Proof.
- Must show campaign IDs, priority, approval status, gate, guardian, score, source image, platform copy, format exports, sidecar provenance, rights blockers, contact sheets, and next human actions.
- Must not include schedule, publish, export-to-DB, registry, or mint affordances while rights and human approval remain unresolved.

## Design Direction

- Asset tier: B/C. Generated-owned source frames plus deterministic code-rendered social overlays.
- Brand route: Arcanea product/IP, mythic creative operating system.
- Tone: premium AI-lab myth-tech, not fantasy game chrome.
- Materials: dark glass, starlight metal, gold thread, Veloura glass, living architecture, proof artifacts.
- Motion: static-first for this patch. CSS hover only; no new motion runtime, no 3D.

## Non-goals

- No production deploy.
- No scheduling or publishing social posts.
- No DB migration, registry write, chain mint, or public licensing claim.
- No mutation of locked lore canon.
- No replacement of the existing Gallery fallback data.

## Acceptance

- `/visual-world-engine` renders status 200 locally.
- `/visual-world-engine/social` renders status 200 locally.
- Portal displays real VWE source assets and deterministic social masters from public paths.
- Gallery has a visible route into the portal.
- Portal has a visible route into the Social Launch Room.
- Social Launch Room reads the queue/spec/manifest data instead of duplicating campaign records in component code.
- Social Launch Room uses bundled JSON snapshots and `scripts/verify-social-launch-data.cjs` proves they match the canonical run files.
- Social Launch Room clearly distinguishes ready for review from approved or published.
- Page text stays readable on mobile and desktop.
- Evidence and review logs record the portal integration and verification.
- Batch 11 `/gallery` and `/visual-world-engine` Playwright route smoke confirms status 200, Batch 11 title presence, desktop screenshots, and local server cleanup.
- Local dev server is stopped after verification.

## Rollback

- Remove `apps/web/app/visual-world-engine/page.tsx`.
- Remove `apps/web/app/visual-world-engine/social/page.tsx`.
- Remove `apps/web/app/visual-world-engine/social/data/`.
- Remove `scripts/verify-social-launch-data.cjs`.
- Remove the portal link from `apps/web/app/gallery/gallery-components.tsx`.
- Remove Social Launch Room links from `apps/web/app/visual-world-engine/page.tsx`.
- Remove `apps/web/public/images/arcanea-world-engine/god-run-2026-07-06/social-overlays` if the public social preview route is deferred.
- Revert this planning file and related evidence/review additions.
