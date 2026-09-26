# Arcanea World Atelier and Reader Experience — proposed product contract

Status: **PR-ready proposal only**. This document does not activate a runtime, change canon, approve a product, or supersede the existing release gates.

Scope: the Arcanea product and its official-world reference experience in `frankxai/arcanea-ai-app`. Portfolio topology and shared contracts are governed by [`frankxai/agentic-ops` PR #72](https://github.com/frankxai/agentic-ops/pull/72), [issue #29](https://github.com/frankxai/agentic-ops/issues/29), and [issue #35](https://github.com/frankxai/agentic-ops/issues/35). Product outcome owner: [Arcanea issue #191](https://github.com/frankxai/arcanea-ai-app/issues/191). Exact reviewed source: Arcanea `main` at `5b32b226eebd14312dbbbf2242e5c2d3fa3d3f67`; portfolio Registry at `578d61eed8d304fdbed62a6c69af2603204ea0ef`.

## Decision and audience job

Arcanea should let an author or studio make a world that survives model changes, collaborators, media formats and publication. The first complete customer result is a **World Seed**: a small, distinctive, owned world with a coherent premise, one conflict, one place, one character choice, a playable or readable scene, a visual direction, a soundtrack cue, and a portable edition. Arcanea's own universe demonstrates the system, while a customer's universe retains independent canon, private sources and rights.

The experience thesis: **a reader encounters a consequential choice; the creator can trace every visible artifact back to a governed source and can revise or withdraw it.** The first screen offers one action, a concrete result and proof of save/export. Mythic language belongs in the work and its carefully earned ceremony; routine controls stay plain. An infinite canvas is a spatial view over the same records, not a second database or a place where drawn edges become accepted canon.

The Registry already records `product_arcanea` as `building`, and `product_arcanea_world_seed` as `flagship_prototype`, both in this repository. World and Experience Studio is the primary manager for a cross-media World Seed; Publishing, Media, Template and Software Studios contribute through bounded envelopes and receipts. This is one product with multiple compilations, not a separate SaaS for every medium.

## Existing assets and hard truth

| Surface | Observed at the source revision | Release implication |
|---|---|---|
| Web | Next.js 16, React 19, strict TypeScript, AI SDK 6, Supabase SSR, `@vercel/blob`, `@xyflow/react`, `@arcanea/design-system`, Playwright in `apps/web/package.json` | Reuse these in the first slice. Verify the installed API and source before coding model calls. |
| World draft | `worldDraftSchema` validates an unsaved draft and browser recovery; [PR #403](https://github.com/frankxai/arcanea-ai-app/pull/403) proposes inspectable generation, private save and export | PR is draft and based on an older revision. Rebase and prove a real owner-scoped save; do not imply it is on production. |
| World context | `docs/architecture/WORLD_CONTEXT_GATEWAY_V1.md` labels the hosted tool a disabled compatibility preview, lacking durable membership, snapshot, conflict and OAuth authority | Do not advertise a connected hosted world MCP until the listed production gate is met. Local portable skills and read-only tools remain separate. |
| Reader/canvas | [PR #454](https://github.com/frankxai/arcanea-ai-app/pull/454) proposes passage illustration and a private saved canvas | Recovery migration, provider setup, actual image/debit/refund and final preview are pending. Do not duplicate its code on another branch. |
| WorldPack | [PR #421](https://github.com/frankxai/arcanea-ai-app/pull/421) proposes canon/rights/provenance audit over the MCP package | Treat its tools as a candidate until its packaging, tests, review and publication have independently landed. |
| Feedback | `apps/web/app/api/feedback/route.ts` can return `{ok:true}` when Supabase is absent or insert fails | This cannot power a customer learning loop. Failed persistence needs an explicit error, retry/recovery and observable receipt. |
| Delivery | [Issue #427](https://github.com/frankxai/arcanea-ai-app/issues/427) owns exact-head visual QA and production-path binding; [issue #408](https://github.com/frankxai/arcanea-ai-app/issues/408) owns PR consolidation | A READY preview and a passing source check do not prove stable-domain delivery or customer completion. |

The current production runtime inspection reported `SUPABASE_SERVICE_ROLE_KEY` missing on a book-draft route, one `undefined.map` error, and a waitlist environment failure in the last 24 hours. The READY deployment at the inspected main revision is aliased to `arcanea.ai`; READY does not resolve these route failures. Reproduce and attribute each before release; no key is to be copied into this document or configured as part of this proposal.

## World object and graph contract

Model six independent axes: **authority state, visibility, rights, release state, revision, and provenance**. A source or accepted canon may be private; a beautiful public rendering may still contain a proposal. Never equate a generated image with a canon decision. Official Arcanea work reads the creator-approved `.arcanea/lore/CANON_LOCKED.md` at a recorded revision and reconciles with the Arcanean Library's fictional-canon authority. A customer project cannot inherit Arcanea's entities or world laws by default.

Candidate portable object:

| Field | Meaning |
|---|---|
| `id`, `tenant_id`, `world_id`, `type` | Stable, scoped identity; types include source passage, claim, entity, scene, asset, edition and feedback. |
| `revision`, `content_digest`, `source_ref` | Immutable version and digest linked to the exact source or parent revision; portable export preserves both. |
| `canon_state`, `visibility`, `rights_state`, `release_state` | Separate reviewed dimensions. `proposal`, `accepted`, `conflict`, `deprecated` and `rejected` are decisions, not synonyms for public/private. |
| `created_by`, `accepted_by`, `derived_with` | Human/agent actor, approver, model/tool and prompt or operation revision; no provider session ID as canonical identity. |
| `edges` | Typed, scoped relationships: `DERIVED_FROM`, `DEPICTS`, `APPEARS_IN`, `CONFLICTS_WITH`, `SUPERSEDES`, `APPROVED_FOR`. Edge creation is evidence, never automatic canon promotion. |

Postgres with RLS remains product business truth and the candidate place for creator world records and typed edges once the current project-graph migrations, generated types and live schema are reconciled. `scripts/project-graph-activate.ts` is a plan/apply tool, not evidence of deployment. Binary masters, delivery renditions and working evidence follow the accepted portfolio media fabric, with stable IDs and rights; Starlight Memory can project approved graph relationships with source commit, and the portable WorldPack can export/import the graph. Do not establish an independent Neo4j, vector store or hidden agent memory as world authority because a visual graph is desired.

An imported creator source goes through quarantine, extraction and explicit consent before model context. Source correction invalidates or flags dependent claims and editions. Deleting or revoking a source stops future retrieval and publishing and records affected derivatives, existing downloads and required takedown action. A model summary never silently replaces the source passage.

## The six views over one world

| View | Primary action | Evidence of completion |
|---|---|---|
| **Call / World Seed** | State a premise, audience and source/ownership boundary | Inspectable draft, source citation, save/export choice. |
| **Atlas** | Edit entities, laws, timelines and causal links | Conflict diff, canon-state decision and revision history. |
| **Scene Desk** | Turn one conflict into a character choice and changed world state | Readable scene with editorial pass; world law cost and consequence tested. |
| **Media Desk** | Direct an image, motion or music cue from a specific scene revision | Variant comparison, consent/licensing/provenance, chosen master and accessible fallback. |
| **Reader** | Read, bookmark, select a passage, optionally create a personal visual note | Passage anchor and edition revision retained; private visualization has spend admission, save, delete and refund behavior. |
| **Release Desk** | Preview web/EPUB/PDF/asset pack and issue a publication decision | Exact source/rights/quality receipt, channel package, rollback and export verified. |

One signature moment can reveal a causal relationship between a scene, place and character. The world map must earn its interaction: keyboard/touch navigation, non-spatial list view, zoom bounds, reduced motion, static fallback, caption/audio controls and saved state. Test 375px first. Use the existing tokens/components for production; no ornamental Three.js or motion dependency without measured experiential value and performance proof.

## Where work and customer state live

| Mode | Local | Hosted | Authority and recovery |
|---|---|---|---|
| Founder production | Private masters, manuscripts, raw recordings and working exports on controlled local storage; Git for reviewed source and contracts | Vercel app/preview, Supabase private account/world records, approved media rendition storage and controlled provider calls | Explicit asset IDs, source digests, backup/restore rehearsal and separate public release receipt. Local paths and credentials never enter public packs. |
| Customer web | Browser drafts only for recovery; download of a portable export | Authenticated, tenant-scoped projects, RLS, revisions and queued generation | Save must confirm persistence. Export and deletion must be tested across source, graph, binaries and generated derivatives. |
| Customer local/self-host | WorldPack files and CLI/skills/MCP with explicit import/export; optional private local media library | None required for a portable authoring task; sync opt-in | Same schema/version/provenance; no silent upload, canon merge or local filesystem access from hosted agents. |
| Managed deployment | Device/cache is replaceable | Same contracts with tenant isolation, backup, retention, metering, support and release rollback | One seller/entitlement contract resolved by portfolio authority before paid access is claimed. |

Web is the current production surface. The mobile web reader and capture path should be excellent before a native mobile commitment. A native app becomes justified when offline reading/creation, camera/audio capture, background import or push can be proven to outperform the responsive web path; Expo/React Native is a candidate subject to platform and maintenance evaluation, not an approved implementation. A desktop Arcanea companion is justified by high-volume media intake, filesystem watching, offline drafts, color-managed asset work or local models. Start with the portfolio's existing desktop Suite/library integration and a portable file protocol; avoid a second Arcanea control plane. No `apps/mobile` directory exists at the inspected main revision despite a root release filter mentioning it.

## Two agent teams with different powers

**Team building Arcanea** is a production organization. World architect owns the ontology and authority map; narrative editor owns scene causality; art/music directors own medium-specific direction; product engineer owns RLS, app routes and recoverability; rights reviewer owns source and license checks; independent verifier checks exact revision and rendered output. World and Experience Studio manages the bounded task envelopes, budget reserve, cross-studio receipts and one release decision. Builder agents can propose changes on branches; reviewer agents cannot silently mutate the candidate they certify.

**Team shipped to creators** is a portable capability pack with least privilege. A World Guide elicits constraints and drafts the seed; a Continuity Critic finds contradictions and affected edges; a Scene Editor strengthens choices and cost; a Visual Director writes variant briefs from approved source; a Release Assistant builds preview/export packages and checks accessibility and rights. Each role has declared inputs, output schema, tool scopes, spend ceiling, model/provider portability and stop condition. None may accept canon, publish, charge, share private sources or delete data without the creator's explicit act. A role packet works in Codex/Claude/other capable hosts through skills or MCP; hosted agents call the same outcome-level gateway once its auth and durability gates are connected. An optional long-lived character agent would require a separate measured stateful job and the accepted persistent-entity runtime decision.

## Learning loop as product behavior

Instrument *completed outcomes*, not clicks alone: draft actually saved, first coherent scene produced, variant selected, reader reached the consequence, edition exported/opened, creator returned to revise, paid buyer reached the promised result. Link each event to a world/edition revision and consent scope. Do not upload private manuscript text into analytics. In-product feedback anchors to an exact passage/asset/revision and distinguishes defect, taste critique, canon conflict, rights request and requested capability. Acknowledgement means durable acceptance, with a visible ticket/receipt or an error and local recovery. A weekly human review clusters themes, compares cohorts and opens scoped issues; agent synthesis proposes fixes with source examples and confidence, and independent evaluation checks whether the fix improved the original job. Rights and canon corrections interrupt the optimization loop immediately.

The pilot dashboard should show numerator and denominator for first-world save, useful-world completion, reader completion, export success, complaint/recovery, repeat revision, median generation cost, and refunded attempts. Qualitative editorial review remains necessary: retention can reward generic addictive output while weakening authored worlds.

## Release gate and exact first slice

1. Reconcile current open PRs under #408. Choose one survivor for draft/save (#403), reader visualization (#454), WorldPack audit (#421) and homepage (#320), with exact head SHA and dependency map. Do not merge the stack as a bundle.
2. Establish a single **World Seed gold path** on a synthetic test tenant: creator-owned source → governed proposal → conflict-aware scene → one approved image and soundtrack cue → reader preview → portable export. Record all intermediate IDs, revision hashes, rights and deliberate human approvals. An official Arcanea example may be a separate reference fixture with locked-canon source and no silent promotion of proposed story material.
3. Repair feedback persistence before trusting feedback data. Reconcile live schema/RLS and project graph before enabling the hosted context gateway. Keep compatibility mode disabled until its nine production-authority conditions and isolated integration tests pass.
4. Verify responsive/mobile keyboard/reduced-motion/static/audio and reading recovery; real private save/generation/debit/refund; role isolation and revocation; source correction propagation; stale revision rejection; export re-import; backup restore; and exact-head build, typecheck, lint, visual review and stable-domain deployment binding. Use #427 as the production gate.
5. Only after those results, test one bounded creator pilot and measure whether the finished artifact survives a second session and a second medium. Establish listing, pricing, entitlement, support, refund and channel adapter separately through portfolio approvals.

Every release receipt names the source commit and world snapshot, canon authority revision, accepted decisions, asset hashes and license, model/tool revisions and spend, CI and browser evidence, deployment ID, user-visible channel, export/restore test, owner and independent verifier, known limitations and rollback/takedown. A READY preview is a preview. A merger is source promotion. A customer outcome requires delivered, recoverable use.

## Placement and unresolved decisions

- Product owner: `repo_arcanea_ai_app`, `product_arcanea_world_seed`; portfolio Registry source above. The fictional Arcanean Library has a separate authority record under `repo_arcanean_library`. Do not move that corpus into a generic product package.
- Design authority: `design_arcanea` in `starlight-design-intelligence`, adoption status `audit_required`. Its Arcanea pack currently calls for Playfair/Inter and one palette; local `AGENTS.md`/`TASTE.md` prescribe Geist/Instrument Serif and another palette, while root `DESIGN.md` is an older local handoff. This is a real conflict. The design owner must pin a reconciled pack revision and migration before new visual implementation; this proposal does not pick tokens by preference.
- Commerce authority, customer entitlement and hosted agent rate/spend authority remain dependencies. No new backend, checkout, graph database, native app repository or provider credential is created here.
- This document's intended status is a reviewable plan. The named draft PRs and future stack must be rebased and evaluated on current main. Acceptance of this document does not claim that any of those features shipped.

## Task contract

Scope: architecture proposal and next vertical-slice gates. Owner: Arcanea World and Experience Studio, with issue #191 for product proof and #427 for production. Files: this document only. Non-goals: runtime code, schema apply, canon edits, brand-token migration, checkout, deploy, merge. Acceptance: authority/source and candidate states are accurate; build and shipped agent teams have distinct powers; one complete path and its failure gates are explicit; no duplicate product/runtime is proposed. Verification: source and PR-state inspection at the listed SHA, independent reviewer of this exact documentation diff. Rollback: revert this document on its branch or later reviewed commit; no customer state changed.
