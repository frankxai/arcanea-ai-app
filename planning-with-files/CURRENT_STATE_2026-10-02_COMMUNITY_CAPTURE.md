# Community demand capture reconciliation

Source: active goal `01a0f74f-8bad-7db1-ab06-fd89b5faec84`, app #276;
original candidate #403 at `f20484f8ec7cc02e2f9507f08186057597360db5`,
owned by task `01a08d75-75fd-7ab2-9234-5351ac1a51e9`.
Base: main `e863be8304fdde9f00ba812d7845d66ec52787b9`.
Owner: Codex, `agent/codex/arcanea-community-capture-20261002`, in the existing
source-consolidation worktree. This additive derivative preserves draft #403 and
its owner's untracked audit. It does not supersede that draft.

User job: a reader or world builder can register interest in Arcanea updates and
know whether that interest was saved. This supports Arcanea's world/audience
priority and eventual releases. A saved signup is not delivered community value
or evidence of paid demand.

Scope: adapt #403's community form to the durable waitlist storage contract already
merged by #458. Main's form only prevents submission. The old draft's Growth Core
proxy would replace newer storage and its CI would remove accepted checks. World
generate/save/create blobs already match main. Main's waitlist API and insert
adapter stay byte-identical.

Files: community form, community-page signup copy and overview extraction, waitlist
submit helper and tests, additive CI test path, this record. Relevant guidance: root AGENTS.md,
apps/web/CLAUDE.md, TASTE.md and DESIGN.md; #276 hierarchy, #408 merge authority and
#427 release proof. Historical blanket licence/count claims in taste guidance
are not verified current rights. No new design skill or image generation is needed
for this existing form.

Behavior: POST only email/source to `/api/waitlist`, with `community_footer` source;
accept only HTTP success and explicit JSON `success: true`; reset only then.
New registrations retain their source; repeat emails remain on the existing shared
list and do not create a second source-specific subscription.
Failures keep the typed email. A ten-second browser timeout permits retry,
acknowledging that an interrupted response may follow a successful write. Existing
server duplicate handling makes retry safe. Accessible form/status IDs are unique
per instance; native email validity remains active. An immediate pending ref stops
same-render duplicate submission. Page copy describes interest capture without
promising weekly delivery, unsubscribe machinery or email isolation.

Non-goals: mail delivery/campaign sends, new backend/storage, pricing/entitlements,
world/auth changes, canon, licensing, archives, private Studio gateways, source
promotion or release. Homepage/dossier and pricing reconciliation remain unfinished
work from #403. Prior #487/#490/#491 proposals remain intact.

Budget and stops: one sequential interactive text/test workload; no dependency
install, new worktree, local full build or long-lived server. PP bounded, above the
4 GiB RAM floor; disk bounded at approximately 14% free. Independent provider review
is one tool-free call with a 300-second deadline and maximum USD 1. Stop on lane,
branch/upstream change, failed checks or machine hold. No merge/mark-ready/deploy.

Acceptance: exact current API payload; explicit success/failure; source persisted
through the current insert adapter; timeout and network/body failures recover;
form clears only after confirmed save; distinct accessible IDs. Preserve all
existing CI checks. Node 22 frozen remote build/type/lint/status and independent
source review are required for the draft. Actual browser and same-source preview
proof remain unproven until executed. No live signup is submitted.

Verification: `pnpm --dir apps/web exec tsx --test lib/waitlist/__tests__/join.test.ts
lib/waitlist/__tests__/submit.test.ts`; scoped formatting, staged diff and secret
hooks; exact-source independent review and four required CI checks. Local tests use
existing tools without installing dependencies. Results are appended after
execution, retaining failures. The HTTP test uses the real fetch client and
unchanged insert adapter with an in-memory sink; it is not a Supabase or Next route
execution. The fixture server closes at test completion.

Rollback: revert this scoped change through normal protections. No migrations,
account writes or mail were performed. Frank's named `merge N` is required by #408.

## Local verification and retained limits

Fifteen cases pass on Node 22.23.2 using existing Sucrase type erasure: six unchanged
server-adapter cases and nine client cases, including a real fetch/HTTP fixture.
A separate attempt through existing tsx 4.22.3 failed before executing either test
file because its Windows esbuild binary is missing. No dependency was installed.
Frozen Node 22 remote CI remains the native application/toolchain gate.
A focused local TypeScript attempt also stopped before checking source: the
existing TypeScript package directory has no `bin/tsc` entry. No local native
typecheck pass is claimed. These environment failures are preserved with the
passing type-erased test evidence.

Formatting the historical community page would grow it to 775 lines. Its first
four sections are therefore extracted into a 310-line server component, preserving
their existing content and classes. The remaining page is 483 lines. The extracted
hero image now supplies Next Image's required fill/sizes settings. Both touched
components drop the blanket lint-disable header; scoped and CI lint must still
verify them. Existing third-party community links, dates, counts and delivery
claims elsewhere on the page are inherited, unverified and outside this capture
repair. This is not a whole-community design or current-content acceptance.

Source review and required CI results will be linked to the exact commit on #276
and in agentic-ops-hub #98. Source-matched browser proof, live storage acceptance,
mail delivery and release approval remain separate work.

Initial complete seven-file review at `9afb94d408406b32c2cb316020d3fe06af8c4b94`
returned REVISE: unused Link import, field/error association, native typecheck
evidence gap. The unused import is removed and the status description is directly
associated with the email input. The review's proposed `aria-invalid` for all
failed saves is not applied: transport/storage failures do not establish an
invalid address. Native required/email validation remains operative. The review's
critical lint severity overstates the known soft lint posture; its underlying
unused import is still corrected. Fresh source review and CI remain necessary.
Raw review and all attempts are preserved privately.

Official references consulted: [React useId](https://react.dev/reference/react/useId)
and [AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController).
