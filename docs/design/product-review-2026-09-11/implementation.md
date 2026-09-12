# World draft implementation brief

Source: current Codex task `01a08d75-75fd-7ab2-9234-5351ac1a51e9`; Frank's instruction to continue with Premium Web OS on 2026-09-12. Prior research: `chatgpt-conversation://6aa313b7-00d0-83ed-bfaf-90264773805c` (subsequently retrieved; the initial audit's unavailable note is superseded).

Owner: this task, branch `codex/arcanea-product-design-review-20260911`. Baseline: deployed `d90904a1f8f03191d52ff79f0db5f954f617eb63`. Preserve the existing audit files and other worktrees. Application scope: homepage, world draft generation/save/recovery, waitlist failure fidelity. No database migrations or production promotion.

## Buyer and product loop

An experienced writer or worldbuilder already has an idea, scattered notes and experience with general AI chat. Novelcrafter is the functional benchmark for persistent context; World Anvil for navigable world structure; Linear and Apple for interaction clarity. The first win is a world draft they can inspect and keep. They need to know what was generated, what was saved and where it lives.

Input concept → generated draft → inspect characters, locations and world rules → explicitly save the exact draft → reopen its canonical URL. Guest drafts remain in this browser tab across authentication. Export is a secondary recovery route. Save makes no model call. Failures preserve the draft and never claim completion.

## Copy preservation and scene

Preserve “Build living worlds with AI agents.” It is concrete and already live. Replace blanket sovereignty claims around hosted generation with the actual boundary: hosted AI generation; account worlds stored privately; local tools available separately. Avoid claims of automatic continuity enforcement.

Homepage: hybrid acquisition/product surface. Asymmetric composition, existing Geist typography and design-system variables. One input and one creation action, alongside an inspectable authored sample. The sample is labelled as an example. Its tabs reveal world rules, characters and locations; a rule variation changes the authored example and its visible consequences. It never impersonates live AI analysis. Use the example concept to start a real draft. Rich existing world/library content stays accessible through direct links.

Signature set-piece: a world dossier whose rule and connected entries change together. Information job: demonstrate why a world consists of connected decisions. No WebGL: the product state is text and relationships; adding a renderer would increase loading and obscure inspection. Mobile stacks the input and dossier; all content stays available. Initial content server-renders. Track A only: short colour/selection feedback, with reduced-motion and forced-colour fallbacks. No autoplay, scroll capture, entrance opacity gate or new media generation.

## Component archaeology

- Existing `world-graph-canvas`: connection metaphor useful, but timed decorative nodes and uppercase labels obscure real product state. Adapt the relationship idea into an inspectable dossier.
- Existing `motion/glow-card`: pointer state rerenders and appended alpha is invalid for CSS variables. Do not import it for this lightweight hero.
- Existing World Seed PR #320: reuse server-rendered proof and honest proposed/current boundaries; preserve the current approved headline and richer entry routes.
- Existing waitlist PR #336: preserve its shared Growth Core adapter and program segmentation where integrated; do not invent another capture service.
- Existing brand hero image: available for atmosphere, but no new asset is required to explain the draft. Product content earns first-viewport space.

## Acceptance and release

No regeneration on save; authenticated ownership enforced; duplicate retries resolve the same world; persisted slug returned; child failures reported; invalid drafts rejected; browser storage failures explained; keyboard navigation works; copy is sentence case. Run behavioural tests, scoped lint, app types/build and desktop/mobile preview. Independent code and skeptical-buyer review are separate from self-review. Record actual results here; incomplete gates stay incomplete.

Rollback: revert this bounded application commit. No schema or existing records are rewritten. Production merge requires Frank's explicit approval under the repository execution protocol.

## Implementation verification · 2026-09-12

Implemented the server-rendered product homepage, bounded world draft validation, explicit authenticated exact-draft save, same-tab recovery through sign-in/sign-up, JSON export and truthful waitlist responses. The homepage's authored example offers three views and a reversible rule variation. The first input is available without waiting for an entrance animation. Generation uses Gemini 2.5 Flash with bounded output, a timeout and no automatic retries; save makes no model call.

The shared Growth Core waitlist adapter is integrated from existing PR #336, commit `c07c2cd2d3577292459a3767d6fee367a4a1d63b`; that independent PR remains untouched. No real email signup was submitted during testing.

- Sixteen behavioral tests pass: validation, private persistence, canonical slug, source preservation, idempotent retry, child-write failure reporting, owner/payload separation, storage recovery and waitlist acceptance/failure fidelity. CI now runs these tests.
- Scoped ESLint, app type-check and the full Turbo build pass. The final build completed 8/8 tasks and generated 524 routes on Node 24.16.0 / pnpm 8.15.0. CI uses Node 22; that remote result is still pending.
- Premium Web OS slop scan passes for the two new homepage components. Final CSS/copy refinement removed unverified counts and preserved initial content visibility.
- Read-only production schema/RLS inspection confirms the save fields, document creation type, owner policies and global slug uniqueness. No database records or schema were modified.
- Independent code review passes: the sign-up return-link issue was corrected and rechecked; no remaining P0/P1/P2 defects were found in the targeted save/auth scope.
- Second-provider review remains incomplete: Claude CLI is not authenticated; Gemini CLI's configured account rejected the client as unsupported. Neither produced a critique. These failures are not passes.
- Preview browser inspection and remote CI results will be appended after deployment. Production is unchanged.

Known limits: the Supabase REST save sequence is retryable, not transactional; a failed child write can leave a private partial world, and the UI reports failure while preserving the draft. Browser recovery is tab-local; opening email confirmation on another device cannot carry the draft there. Positive authenticated persistence is covered by controlled tests and live schema inspection, not a live-user write. Full-world editing, continuity analysis, paid entitlements and the remaining page families are outside this implementation slice.
