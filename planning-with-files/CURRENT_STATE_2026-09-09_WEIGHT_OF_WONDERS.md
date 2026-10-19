# The Weight of Wonders — release task contract

Date: 2026-09-09. Owner and release approver: `/root`. Engineering maker: `/root/wonders_engineering`. Independent verifier: `/root/wonders_verifier`.

## Scope

Publish six completed experimental works as a connected collection at `/gallery/weight-of-wonders`, with six linked dossiers, encounter phase and ending selectors, copyable scene/session material, a trilogy outline, and an original opening excerpt. Expose the same proposal records through an explicitly opted-in read-only lore API and the repository's existing MCP source architecture.

Source baseline: `c31212ea58b97f2c07da0033ad40c4321d6aefb6`. The preceding Sovereign Depths production commit is `1a0cf9043ed1e00958b835649f4e3e55a6d6e21e`. Comparing these revisions found changes to the models explorer and its package script only; gallery routes and styles were unchanged.

## Recipient and experience thesis

For a reader or game master who wants an image to become the beginning of a story. The user explicitly rejected childish art and asked for mature fantasy with useful connections between bosses, places and books. Six completed artworks and their authored conflicts supply the evidence. The page promises enough context to choose a conflict, see its consequences and begin a scene. Primary action: enter a dossier. Signature proof: the selected encounter ending changes the session kit the reader can copy.

The first view should make the world feel inhabited, immense and worth protecting, then show the reader how to use it.

## Current context and direction decision

Live `/gallery` and `/gallery/sovereign-depths` were opened and visually inspected on 2026-09-09. Host mobile 375px evidence comes from the actual built-app artifact `10085471133` for the unchanged gallery source; it is a historical source-matched capture, not a newly captured mobile production claim. The supported cloud browser has no viewport emulation; new exact-width evidence will come from project CI against the actual built Next app.

Three materially different direction records live in `docs/worldbuilding/weight-of-wonders/directions/`. The approver selected **C: Atlas and encounter desk** before implementation, because the user's stated job extends beyond viewing art. Reuse the existing gallery typography, tokens, dossier image treatment and navigation. No new font or decorative motion. Preserve original image proportions in dossiers; use optimized source WebPs directly for tall cover heroes to avoid undersized mobile derivatives.

## File ownership

Root owns collection JSON, six WebPs, creative packet, provenance, direction records and this planning record. Maker owns new gallery routes/CSS/workbench, API and MCP reader source, tests and capture script changes. Verifier writes only independent evidence. Existing architecture and unrelated working branches remain intact.

## Non-goals

No replacement of Sovereign Depths' 36 records; no locked-canon promotion; no change to bonded identities, Nero or Malachar; no new cosmological class; no actual game simulation or published-novel claim; no npm package publication; no new dependency, font, authentication provider or deployment system.

## Acceptance and verification

- Six individual artworks load at their recorded dimensions and delivery hashes.
- Every record and public collection states EXPERIMENTAL status.
- Three boss/place pairs link both ways. Three phases and three consequential endings per boss work by keyboard and touch.
- Scene kits can be copied, with a visible manual-copy fallback when clipboard access fails.
- Lore API returns no records by default, or with either opt-in alone; both flags return six. Private MCP remains protected.
- Typecheck, lint and build pass on the reviewed head. Actual built-app desktop, mobile 375 and reduced-motion captures and interaction reports are independently reviewed.
- GitHub exact-head review bounds remain below 50 changed files and 120,000 textual diff characters. Split inert content and runtime if necessary; never weaken a gate.
- Verify the Vercel production deployment's commit, live routes, public API behavior and six delivered file hashes before claiming publication.

## Rollback

Before runtime merge, record the immediate production parent. Revert the runtime squash commit through a reviewed PR to remove the new routes/discovery link while preserving the inert media and the existing 36-work collection. If media also needs withdrawal, revert its separate content commit. Do not roll back unrelated models work. Post-deployment receipt belongs in a later evidence artifact or receipt commit, never in the commit whose SHA it claims to contain.

## Current status

Content and implementation preparation. No new deployment claimed by this task contract. Follow the eventual PR and post-deployment receipt for verified completion.
