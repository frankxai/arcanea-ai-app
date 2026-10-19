# World read repair — 2026-09-30

Scope: distinguish unavailable database reads from missing/RLS-hidden worlds.
Owner: Arcanea, tracked in issue #482.
Base: `5f264e790776b0b9950d4c2b77fe54710da82f19`.
Files: world detail page, metadata and error boundary; a redacted read-result
helper; regression tests and their existing CI step.
Non-goals: database mutations, changed access policies, new auth or child-query
behavior, production promotion, draft-loader or Guardian fixes.

Acceptance: successful zero-row results preserve the existing private-owner
fallback and not-found behavior. Backend failures, aborted reads and missing
bindings reach the retry boundary; only safe database codes enter diagnostics.
The existing public cookie-free read, RLS boundary, hard deadlines and row limits
remain intact. Error copy never displays an exception's raw message.

Verification: 12 world/deadline and failure-classification tests pass on Node
22.23.3; full web ESLint and workspace-backed type check pass locally. Build and
exact-head GitHub/Vercel checks are recorded in the pull request. Existing CI
gates remain authoritative and independent review is required before merge.
Rollback: revert this application-only change.

## Current evidence and remaining repair

On 2026-09-30 the serving `arcanea.ai` production deployment is
`dpl_2NpoCTMjYrNT2rn5aYcrrSDezTjK` at the base SHA above. A 16:42 UTC request to
`https://arcanea.ai/worlds/shattered-meridian` returned HTTP 200 while production
logs recorded failed world and metadata queries. HTTP success alone does not
prove the world rendered.

Read-only production inspection confirmed the policy dependency cycle
`worlds → world_collaborators → worlds`. Production migration history lacks
`20260912120000_world_policy_recursion.sql`, which is already checked in.
Issue #482 owns the separately reviewed database rollout and disposable role
fixture. This branch improves failure handling; it does not resolve that cycle.
No production data, policy, credential or alias was changed.

This receipt uses fresh provider evidence; older planning documents are not a
claim about the current deployment or recovery. Stop at reviewable source and
exact-head checks until the independent review and database rollout gates pass.
