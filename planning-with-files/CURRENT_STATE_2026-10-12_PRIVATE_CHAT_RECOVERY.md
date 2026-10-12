# Private chat history and project continuity

Scope: preserve a creator's browser conversations and project selection within
the originating account; refuse work from a retired auth lifetime. Programme
[276](https://github.com/frankxai/arcanea-ai-app/issues/276) remains open.
Owner: Codex root, goal thread 01a1269f-23eb-7bb2-b609-77d731cacc50,
native lease ops-e9fe428396c3413bf4e6. Branch:
`agent/codex/private-chat-recovery-20261012`; checkout:
`arcanea-provider-account-20261011`; origin:
`https://github.com/frankxai/arcanea-ai-app.git`.
Base: `a021e394c28f7221462b128443113b2aa921a690`.

## Task contract

Creator job: reopen original worldbuilding conversations, search and organize
them, and use project chat on a shared browser without mixing another account's
work. Existing `/chat`, local stores, Supabase helpers and AuthProvider remain
the implementation. This repairs the accepted workspace; it adds no memory
service, scheduler, canvas or provider.

Files: `apps/web/lib/chat/{storage-scope,local-store,project-store,supabase-store}.ts`,
`apps/web/hooks/{use-chat-sessions,use-chat-persistence}.ts`,
`apps/web/app/chat/page.tsx`, the existing project chat button and session panel,
`scripts/tests/chat-account-storage.test.cjs`,
`.github/workflows/chat-history.yml`, and this execution record.

Non-goals: production database changes, a new persistence authority, paid
inference, pricing, publication, unrelated editor/canon lanes, and claiming the
full platform complete. Durable cloud message snapshots and project graph
activation remain required parts of the programme.

Acceptance: A/B/guest caches stay separate; reads, search, pin, delete, project
selection and saves cannot use a retired lifetime, including A → B → A; a late
cloud response cannot merge; cloud mutation payloads/filters retain the expected
actor; complete local messages survive metadata-only hydration; completed local
messages persist before the network debounce; prior unattributed keys remain
byte-identical. The chat page must retire messages, artifacts and callbacks
together at account change. Hosted full CI, compiled browser, independent
exact-source review and real authenticated acceptance are release gates.

Verification: native Node 24 tests against actual TypeScript store/hook source;
existing project-store regression cases; changed-source formatter, syntax and
lint checks; existing full hosted CI. The hook tests use deterministic React
hook shims and controlled timers; they do not exercise React rendering, real
Supabase RLS, authentication, provider output or customer usefulness.

Rollback: reviewed revert of this bounded source slice; keep both scoped and
legacy storage intact. Do not restore shared-cache behavior over private data
without reviewing the privacy consequences. No database rollback is introduced.

## Reproduced failures and implemented candidate

The first nine native cases failed against the accepted baseline: shared private
history/projects, retired writes and cloud dispatch, late merge, implicit legacy
adoption, complete-message erasure, and a missing-array crash. The repair uses
the existing credential-scope lifetime to bind browser keys and cloud operations.
It preserves completed local messages synchronously and debounces network work
only. The older persistence hook delegates to the same account-bound hook.
Project entry points use the authenticated account scope. A keyed chat subtree
retires all local chat UI state together.

The expanded native suite currently passes 15 cases. A temporary hook-test shim
incorrectly invoked useCallback functions during registration; its three
harness errors were corrected without treating them as product defects.

Legacy browser keys have no trustworthy owner. They are preserved and are not
automatically shown, imported or uploaded for whichever account logs in next.
An attributable, reviewed recovery/import path remains required before release;
preservation alone does not establish that creators can recover those entries.

## Read-only live database evidence

On 12 October, the installed Supabase connector identified project
`hcfhyssdzphudaqatxbk` as Arcanea, ACTIVE_HEALTHY, Postgres 17. The read-only
catalog query inspected columns, policies and constraints; it read no customer
rows and made no database changes.

Actual `chat_sessions` has UUID id, user_id, text luminor_id, title and timestamps.
It has no messages, model_id or project_id column. `chat_messages` is a separate
normalized relation with UUID ids, role/content and timestamps. `chat_projects`
exists with owner RLS; `project_memory_links` is absent. Owner RLS is enabled on
the inspected chat tables, but metadata does not prove real account isolation.

The current save helper persists metadata only; generated local `chat_...` ids
also violate the live UUID contract. Cloud full-message save/reopen remains
unearned. This slice tolerates missing message arrays and preserves complete
local work; it does not certify cloud sync. Missing project graph queries now
return unavailable instead of representing errors as an empty successful graph.
Do not apply the old graph migration blindly: inspect its current owner,
compatibility, policies, grants, triggers and actual activation history first.

## Admission and remaining work

Loaded sources: root AGENTS.md SHA256
`36b534b6a33f240aa752e4360ab08468702cbaa366c85c3ca9db0e0b21fd2ca5`,
SYSTEM.md, SCHEMA.md, SKILLS.md, current creator backlog, shared quality/machine
policies, .arcanea/CLAUDE.md, relevant historical MASTER_PLAN sections, Starlight
SI and graph engineering. Instructions guide this session; loading is not a
runtime enforcement claim. No deeper instruction source governs these files.

Machine admission holds new swarms: 8667 MB free against 10240 MB required,
27 task runtimes. Ordinary sequential edits and small tests proceed. Disk was
85058854912 bytes free; the owned clean checkout was reused, with no new
worktree. PR602 source `1c24a60f` and its failed review evidence remain preserved.

Next: finish changed-source/hosted checks, prove actual account transitions and
legacy recovery in the rendered chat, obtain independent exact-source review,
then prepare atomic durable message persistence against the verified schema.
Production database activation remains human-gated. The original Queen/SIS,
creator-platform, community, revenue, publishing and client objective stays active.

Local verification: all 14 native cases and the four existing project-store tests pass. TypeScript 5.9.3 parses all nine changed app modules; pinned Prettier 3.9.9 formats the changed source. A normal pnpm exec attempted its configured dependency verification and refused the sparse checkout because a patch file was absent; it did not supply a formatter. Subsequent checks read existing dependency packages from the source-guides checkout, whose root instructions have the same hash and whose ESLint config is byte-identical. No dependency installation or foreign repository write was made by those subsequent checks. Hosted pinned lint/typecheck/build remain required.

Entry refinement: the first candidate mounted prompt-consuming chat state while account loading was still pending. An actual entry-function case reproduced that admission failure after its JSX-only test transformation was corrected. The page now reuses the existing loading component until an actor is resolved, then mounts the keyed chat state. The native suite passes 15 cases; the entry case uses inert element records and does not establish rendered React behavior or actual URL recovery. Hosted 40af5b47 native history and compiled companion jobs passed; its TypeScript/lint jobs passed and its build was still running at that observation. Independent review was skipped and is unearned. A final source revision needs its own hosted checks.

## Atomic full-message candidate, continuation on 12 October

Previous turn was progress: exact941 CI38196791533 and compiled38196791528 completed successfully;31 source hashes/12 PNG bindings verified, mobile chat image viewed, and hub909280f plus programme comment6116925286 saved. These checks qualify941, not the new candidate. The full objective remains ACTIVE.

Creator outcome: keep a completed worldbuilding conversation, reopen its exact messages and structured text parts from the same account on another device, and retain current edits when saves fail or devices conflict. Compared the existing separate metadata/message writes and a second JSON conversation table against one atomic operation over the existing normalized tables. The latter preserves current ownership and message UUIDs, avoids a second persistence authority and detects older service writers through a SHA256 content revision.

Three new actual-source cases failed before implementation: non-UUID session IDs, newer cloud timestamps replacing unsaved local manuscripts, and cloud writes containing metadata only. New sessions now use UUIDs; already scoped old IDs map deterministically per actor without importing unattributed keys. Full immutable snapshots are queued per conversation, bounded and actor-pinned. Successful replies advance a confirmed base without marking newer content saved; expired lifetimes discard replies. In-memory revision checkpoints cover a browser-storage failure within the same credential lifetime. No service-role key is used.

The local cache marks pending edits and refuses conflicting hydration. A previously accepted test assumed newer timestamps should overwrite an unacknowledged manuscript/project; it failed under this protection. It now proves incoming project changes on an explicitly acknowledged clean copy, with a separate case preserving an unsaved manuscript/project. All29 native source cases and five existing/expanded project cases pass locally. Hook tests still use deterministic shims, not a mounted React application.

The real chat interface distinguishes device save, account save, pending save, unavailable/failed save, conflict and browser-storage failure. Retry, export and save-a-separate-copy use the existing conversation and export flow. Local failure sends the current in-memory manuscript rather than an older cached one. Visual gates remain open for the new status states; prior941 images are not fresh UI proof. Taste/design tokens and Emil recovery/accessibility guidance were applied; no new assets or animation were generated.

Supabase CLI was missing from PATH. Official CLI2.120.0 Windows archive64351870 bytes was checked against release SHA25653920013d24bc9e66180f35ceeea9ddc20e65a7afa883421e9c0ba60ad7457ee, then used in the owned private evidence directory to generate `20261012030707_atomic_chat_snapshots.sql`. Its candidate adds client identity/order/parts and model/project metadata to the existing tables, caller-RLS functions, one owner UPDATE policy for retained messages, stable UUID updates, idempotent identical replay and atomic compare-and-save. It refuses unrepresentable hidden system messages rather than discarding them. The1MiB/1000-message request ceiling is a technical safety bound, not approved subscription/credit terms.

The prepared disposable PostgreSQL17.6 workflow runs the actual migration and tests complete round-trip, ordering/parts, stable IDs/timestamps, replay, stale/foreign actor/project denial, atomic rollback, older writer conflicts and a two-connection race. Its fixture refuses any database with an auth schema or existing chat tables before DDL. Hosted execution is pending until this new source is pushed. Production remains untouched; fresh read-only metadata still shows the older normalized schema without these columns/functions.

Activation requires exact-source independent review, target-schema/permissions/trigger compatibility, backup/restore and migration approval, real Auth/RLS/save/reopen/export/account transitions, visual recovery checks, and the still-open attributable legacy import. Failed cloud deletions and cross-client cancellation/recovery also need product acceptance. Rollback: stop promotion, revert this owned application slice, and preserve data/added schema; do not destructively drop columns or message work. No new local worker/agent/database/server was started. PP review-lite was BOUNDED, one workload; no fanout. Disk stayed above50GiB/8percent; existing checkout reused.

Primary implementation references: [Supabase functions and invoker privileges](https://supabase.com/docs/guides/database/functions), [RLS](https://supabase.com/docs/guides/database/postgres/row-level-security), [PostgreSQL17 locking](https://www.postgresql.org/docs/17/explicit-locking.html). Changelog was fetched directly after the web fetch rejected its markdown content; relevant Data API grant changes were inspected. No model/version superiority or comparative customer value is claimed.
