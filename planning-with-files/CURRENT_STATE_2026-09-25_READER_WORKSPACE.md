# Arcanea reader workspace · production candidate

## Task contract

- **Job:** A reader selects a sentence in a published story, sees a faithful image, and keeps it with the passage in a private creative space. They can arrange their images and notes on an infinite canvas.
- **Owner:** Arcanea web. Base: `697c83f6e81e50919a72319df82b5909b1c70738` on `main`.
- **Files:** reader route/UI, private illustrations page, canvas route/UI, one additive Supabase migration, chat entry fixes.
- **Non-goals:** autonomous agent runtime, mobile binaries, social sharing, public image gallery, new payment checkout.
- **Acceptance:** Published-text validation; sign-in before generation; atomic one-credit reservation with refund on failure; private asset and creation; RLS graph isolation; lost-update conflict; responsive reader control; typecheck, build, lint and deployment smoke tests.
- **Rollback:** Revert this commit or deployment; additive tables and reservations remain intact for audit and user data. Do not drop a user table during a rollback.

## Product decision

The first loop is **read → select → illustrate → keep → connect**. Books are free to read. Private canvas and saved creations require sign-in. One image costs one credit; newly initialized `user_credits` accounts have a database default of five. Every call reserves a credit under a row lock, records an idempotent request, and refunds failures. The UI says the cost before the call. Existing payment and tier implementations need reconciliation before paid packs or subscriptions can honestly be sold through this flow. Do not expose free unlimited image calls through adjacent studio APIs.

Canonical sources: published story Markdown, `creations` with `visibility=private`, Supabase private `creations` Storage bucket, user-owned `personal_canvases`, existing Supabase Auth and `user_credits`. Returned image URLs expire after one hour and must be minted again on retrieval. The image route uses AI SDK `generateImage` with a configured OpenAI image model. It returns 503 when the provider key is absent. No placeholder art is substituted.

## Extension boundaries

| Surface | Decision | Release bar |
| --- | --- | --- |
| Reader | Provenance-rich passage image, annotations, progress, then character continuity | Source quote, chapter, model and private storage must survive export |
| Workspace | Canvas nodes link first-party creations, character sheets, chats and worlds | Authenticated RLS, version conflict, undo/export and mobile pan control |
| Chat | One canonical streamed AI SDK conversation with project context | Persisted sessions, tool authorization, memory provenance, latency and cost trace |
| Agents | Keep single-request generation on Next.js; use durable execution only for multi-step workflows | Resume, idempotency, scoped tools, consent for publishing, trace and evaluation |
| Platform | Versioned REST/MCP resources for books, worlds and user-owned artifacts | OAuth/scoped access, quotas, provenance, schema versioning, export/delete |
| Clients | Ship responsive web and installable PWA before desktop/mobile wrappers | Complete core reading and creation loop with offline reading, sync conflict rules |

AI SDK is already present in the live application; use its streaming and provider abstractions on short requests. Evaluate Eve for durable authoring agents only when a workflow actually needs long running state or channels. An OpenAI Apps SDK presentation and an Agents SDK runtime serve distinct integration needs; neither belongs in the reader image request. Do not make model branding part of the permanent data schema. Store the exact model and provider per creation and revise the art model behind a quality and unit-cost evaluation.

## Gates after this slice

1. Repair the separate `studio/generate-image` demo endpoint and the `imagine/generate` anonymous credit bypass before broad exposure. Centralize all billable actions on one metering contract; failed jobs refund and crashed jobs need a timed reconciliation worker. Reconcile `credit_balances` references with the actual `user_credits` schema.
2. Add faithful visual continuity tests: repeated Selene/Brío details, geography, source adherence, unintended text, six independent human reviews. Track accepted images per paid generation, not raw completion count.
3. Make canvas user nodes include signed thumbnails, autosave with revision checks, undo, export JSON/ZIP and a small-screen composition mode. Current graph is a genuine saveable beta with manual save.
4. Consolidate `/chat` and the bubble on one tested UI-message stream adapter and signed-in conversation history. Bubble sessions currently live in browser memory; the full chat has separate persistence.
5. Monetization: measure model cost and storage egress before pricing a credit pack. Subscriptions bundle predictable text/reading value and a stated monthly image allowance. BYOK is an opt-in advanced path with a clear provider-data boundary. No claim of unlimited GPU usage.
6. API/MCP after the same permissions and usage limits are enforced across first-party and third-party clients. Native wrappers after web core retention, not before.

## Evidence ledger

Known production baseline: Vercel `arcanea-ai-app` production deployment at `697c83f6`; Supabase `Arcanea` active in `eu-central-1`. New code and database schema require separately recorded validation, PR promotion and domain smoke tests. A READY build is not user outcome proof. Record failed generation, refund, missing provider key, graph conflict, mobile selection and image retrieval paths before widening release.
