# Orthea app integration

Source objective: `01a06ecf-6107-7e80-abe9-bb0fcdc9b7f2`. Scope: native React playtest at `/lab/orthea` with deterministic play, local snapshot download/open and app navigation. Owner: original Arcanea objective coordinator. Base: main `141ad072132597f741979eee58671b3bd4e26a88`; assigned branch `codex/orthea-app-integration-20260909`.

## Boundary and provenance

The standalone source is AgentSkills PR7 at `079ced09729937eaaedd7f88d6672b20e0b31254`. The engine comes from `plugins/arcanea-world-atlas/prototype/orthea-engine.mjs`; original SHA256 `a93064a0276a255554b5c4619c259ceec6c22b7e651e29f10f91c9b70ea2ff1d`. Repository-required Prettier formatting plus the ESLint-required `let` to `const` binding in `advance` change its bytes: adapted SHA256 `5c19078066ec6cf66f97c5e5774806bfc7a6b2164e75563bbc08ea7699137b54`. The original never reassigns that binding; normalizing that single declaration and formatting the original in memory must match the entire app engine. The original unmodified formatted hash was `596c1dd1a3e011672e3435b92ec663124b9e32db5ae3cce5ba0def21baf6ee23`. Its snapshot source records the original proposal at `515f19cc0b0a684766b211a07ac771118559b214`. Behavior changes must reconcile its tests and the local-MCP consumer rather than silently diverge.

Orthea is absent from the current public collection. Its source remains restricted. The route therefore renders only in a Vercel preview or local development. Production, an absent VERCEL_ENV during a production build/server, and other environments return not found. This is deployment admission, not per-user authorization; Vercel preview access protection remains the hosting boundary. No sitemap, gallery discovery, asset publication or locked-canon update is included.

No account, database, provider, new dependency or global configuration is required. Snapshot data is editable local state, not a signed certificate. It keeps the standalone format so the verified local MCP bridge can preserve it. The hosted World Context Gateway is a different interface. No compatibility with its payload or Academy's five-file packet is claimed.

## Design and acceptance

Use the Premium Visual Design loop and existing app tokens. Keep the diagram as an actual representation of water and route state, editorial heading, plain instructions and a visible mobile refuge control. Avoid decorative generated art, lore promotion and a fake cinematic. This is exact interactive UI. The preview lets a reviewer assess the app experience before any public release decision.

Acceptance: both endings through actual UI actions; conserved water; visible committed footfalls; recoverable falls; live/pause/manual time; longer cues; stable keyboard focus through ticks; local download/reopen including hostile text; late file results cannot replace newer actions; route exit closes its clock. No image assets or locked lore change. First-time playtest and independent visual critique remain required; tests do not establish balance or fun.

Verification: retained engine regressions, source hash, strict typecheck/lint/build, real built Next desktop/mobile/reduced-motion browser checks and Vercel preview. Test production denial separately. Use existing CI browser installation/server lifecycle; no additional local server while machine posture constrains it. Record actual subsequent results in the PR/private evidence, not as pre-claimed passes here.

## Files and rollback

Own only `apps/web/app/lab/orthea/`, `apps/web/lib/encounters/orthea-engine.*`, `scripts/verify-orthea-*`, scoped `.github/workflows/ci.yml` checks, the early Orthea-only denial in `apps/web/middleware.ts`, and this record. The capability task owns MCP/skill/package files; the book task owns its editions/readers. Author Studio PR379 is preserved on its separate branch, with migration approval still pending.

Rollback: revert this bounded route/check slice. No persistent data was created, and existing downloaded snapshots remain compatible with the standalone engine. Do not delete original Atlas work, change public-collection records or reset other tasks' branches.

## First deployed inspection and refinement

PR385 first head `7bfe254` produced READY Vercel `arcanea-ai-k0yazqhh7-starlight-intelligence.vercel.app`. The coordinator reached the actual deployed route through Vercel-issued temporary access, inspected its desktop/mobile layout and operated Harbor/open controls. No project protection setting changed; access tokens are excluded from this record.

CI34394214581 tested the GitHub merge revision `0cb37e99f3e0eeb52b9f24c58a0186a1a221fae2`: full typecheck, application compilation, inherited package/collection checks, 15 encounter regressions and all 10 built-app browser checks passed. Overall CI failed: the engine binding required `const`, and the production page's notFound response streamed HTTP200. The browser screenshots exposed an oversized checkbox from global minimum-size CSS and too much introductory height on mobile.

The refinement uses an explicit compact checkbox inside its full-height label, a shorter mobile introduction/control bar, and places the permanent family-passage consequence beside the phase-two decision. It removes the duplicated brand in the document title. The middleware rejects this specific route before any streaming, with HTTP404, no-store and noindex; page admission remains as a second check. CI retains the strict status assertion and adds body/header and Flight denial checks. This follows Next.js's documented distinction between streamed and non-streamed not-found responses: https://nextjs.org/docs/app/api-reference/file-conventions/not-found.

Deployment admission is not a promise that a production build contains no compiled proposal text. The candidate remains a private preview; source/publication review must precede any merge that would distribute it. Independent code review at the first head was Gemini2.5Flash APPROVE; a changed head requires fresh review. Independent visual/editorial critique and a first-time human playtest remain outstanding.
