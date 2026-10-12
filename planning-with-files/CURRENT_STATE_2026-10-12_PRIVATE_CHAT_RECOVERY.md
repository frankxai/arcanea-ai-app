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

## Hosted qualification and first-render correction

At `98e25f94bdcd111671dfcbf844913c023ab422cd`, hosted history run38200724276 passed both actual-source account checks and the actual disposable PostgreSQL17.6 migration, including the two-connection `{committed,conflict}` race, rollback and foreign-actor denial. Full CI38200724807 is terminal SUCCESS: build, typecheck and lint passed; authenticated and independent acceptance jobs were skipped. Compiled Companion38200724775 is terminal FAILURE: the desktop fixture recorded React hydration error418 and failed its zero-page-error assertion. Artifact11725276196 is retained in the private `private-chat-98e25f94-failed-hosted` evidence directory; it is failed evidence, not visual acceptance. No unchanged rerun or assertion relaxation was used.

A new actual-source regression reproduced an initial browser-cache-derived `local` save label where the server renders `idle`. The candidate now defers history, projects, active project and cache-derived save status until after mounting, and shows a save banner only when the conversation has messages. The native regression covers preloaded private messages and a selected project. All30 native source cases and five project-store cases pass; changed-source syntax/lint pass. One temporary test extension called the project fixture with a string instead of its object argument; that harness error was corrected and is not a product defect. Exact updated compiled-browser qualification remains pending; the native shim does not prove React rendering. The original error and failed artifact remain preserved.

Product checkout identity and root AGENTS.md SHA256 remain unchanged. Fresh PP review-lite is BOUNDED (8073MB free, projected6025MB, CPU66percent,27 runtimes); no new parallel agents or local build/browser server were started. Disk84385878016 bytes remains above the50GiB/8percent floors. Node24 and pinned pnpm11.28.4 remain the accepted runtime. Full programme276 remains open, including operational Queen/SIS/team/memory/graph, canvas/media/publishing/Academy/community, revenue/shops/adoption, developer kits/API/MCP and clients. No database activation, production promotion, paid inference or completion is claimed.

At `957521ae191bf0f46ca94c3a918bc36a73d787d8`, history38202211156 and full CI38202211210 are terminal SUCCESS; compiled Companion38202211235 remains terminal FAILURE with React418. The cache correction is a valid native regression repair, but does not establish the cause of the reported browser exception. Artifact11725603962 is retained; its failed desktop image was viewed, and fixture browser/stream cleanup passed. The verifier now records the error's page/phase/stack, checks zero exceptions before leaving Worlds and Chat, and binds the seven new chat dependencies into its source hashes. This is diagnostic work with stricter preserved assertions, not a browser acceptance claim or unchanged retry.

Fresh catalog-only Supabase metadata confirms live PostgreSQL17.6, caller table privileges and owner RLS, two timestamp triggers on chat_sessions, no incoming message-table foreign-key dependencies, and no candidate snapshot functions/migration installed. The private receipt is `private-chat-957521ae-live-activation-metadata.json`; no customer rows or database writes were used. Real Auth/RLS and backup/restore acceptance remain open. A discovered readable capability-loading guide was explicitly read in the existing `starlight-agent-config` recovery checkout; its canonical checkout path is still absent. Claude CLI reports loggedIn=false, so no authenticated cross-provider CLI reviewer is available through that interface. No inference or review verdict was fabricated.

Diagnostic Companion38202727149 at `ca0ef24276317fc310fee461641ca8027c5dba4f` is terminal FAILURE; artifact11725843131 locates React418 at `/chat`, after Worlds passes its page-error checkpoint. The entry's mutable credential scope may resolve in the parent before the delayed chat subtree hydrates. An actual-entry regression reproduces the server/client decision mismatch even with no cached messages. The entry now waits for its own mount as well as an authenticated/guest actor; the regression also checks pending auth after mount and account-key retirement. All30 native cases pass after the correction. The earlier cache regression repair remains valid, but its native result did not prove the browser error's cause. Fresh compiled qualification of the entry correction remains required.

Another owner's accepted world-SDK release612 moved production to READY `a2e1f4add1f2c70aa3ea3a779ee8f0707260d508` on deployment `dpl_F16eQeuuYS7ymMaRyxsafDXfn6rF`; neither610 nor602 was promoted. The diagnostic branch push occurred while that mainline deployment was BUILDING. No mainline source or deployment was changed by this lane; its same handle was followed to READY. Check and inspect BUILDING results before future pushes rather than proceeding within an unchecked sequential tool batch.

## Preserve original manuscripts across cache pressure

Previous goal turn: PROGRESS. The d195 entry correction is now qualified at its exact source: history38203230372, compiled38203230329/114660979985 and full CI38203230235 are terminal SUCCESS. Types/lint/build/status passed; real authenticated and independent review jobs were skipped. Artifact11725129730 binds38 Git source hashes/12 PNG hashes; desktop/mobile full-chat images were inspected. Four synthetic fixture modes report no page exceptions,0 real provider calls/production writes and successful cleanup.11 retained ERR_ABORTED records are not zero-network proof. This does not establish new private recovery states, real Auth or production acceptance.

Scope: keep the originating account's complete conversations recoverable when local history exceeds its50-entry cache budget or receives newer cloud metadata. Owner: the existing Codex root/native19-path lease. Files: local-store.ts, chat-cloud-persistence.test.cjs and this task record. Non-goals: a new persistence authority, subscription quotas, legacy attribution/import, production activation or changing another lane. Acceptance: original unsynced work, pins and unacknowledged copies survive cache pressure; new saves never claim success after being discarded by the cap; metadata-only hybrid copies remain dirty. Verification: actual-source native regressions, existing project-store cases, formatter/lint and fresh exact hosted qualification. Rollback: reviewed source revert preserving all stored data; never restore a cap by destructively truncating manuscripts.

Six actual-source cases failed before the correction: the51st unsynced conversation evicted an older manuscript; cloud hydration evicted older unsynced work;50 pinned chats caused a new save to returntrue while discarding its messages; replacement truncated protected copies; a hybrid metadata response incorrectly marked retained messages cloud-saved; and remote metadata cleared the creator's device-local pin. The candidate prunes only unpinned copies with an explicit clean flag and a valid confirmed-revision format. Protected copies can exceed50 until actual browser quota refusal; existing volatile/retry/export handling remains. Hydration keeps local pins and marks retained content dirty when it differs from the received snapshot. All36 native source cases and five project-store cases pass locally; changed-file formatter/lint pass. New exact hosted/browser review remains pending. Older cloud discovery/pagination, durable delete reconciliation, attributable legacy recovery, real creator acceptance and exact independent review remain gaps.

This is a cache budget, not approved business pricing or unlimited durability. The browser may refuse storage; no fallback deletes protected work to make room. Primary reference: [HTML Web Storage setItem](https://html.spec.whatwg.org/multipage/webstorage.html#dom-storage-setitem). Existing account boundaries, activation gates and the complete Queen/SIS/platform/media/community/commerce/client programme remain intact.

## Durable deletion recovery, current continuation

Previous turn supplied a requested status inspection only; no product mutation occurred. This continuation pushed qualified local cache-preservation source63e11eda after inspecting an empty Vercel BUILDING result. Exact hosted history38204749325, CI38204749431 and Companion38204749443 are confirmed in progress; follow those handles, never infer termination from observation timeout.

Scope: honor a creator's explicit conversation deletion across connection loss and browser restarts, without losing the original when intent cannot be stored. Owner: existing Codex root19-path lease. Files: local-store.ts, supabase-store.ts, use-chat-sessions.ts, two native chat test files and this record. Non-goals: deleting customer data from this agent session, new schema/permission changes, project deletion, global coordination or migration activation. Acceptance: failed deletions stay hidden from old cloud copies after restart; pending deletes retry only for their originating current account; storage refusal preserves the original and dispatches no destructive request; retired/stale saves cannot recreate the deleted ID. Verification: reproduce against actual source, native account/cloud regressions, existing project cases, changed-source lint/format and exact hosted qualification. Rollback: bounded source revert preserving all original data and deletion records; never purge browser evidence or activate DDL without approval.

Compared the current runtime-only tombstone against an owner-scoped persisted intent record. The current runtime Set forgets the deletion on reload. A small record alongside the existing account cache preserves intent without introducing another database authority; confirmed IDs remain as barriers to late hydration and save replay. This behavior is creator recovery, not proof of global deletion across concurrent devices or legal erasure. Real authenticated/UI acceptance and independent review remain required.

Four new actual-source cases failed before the deletion correction: a failed deletion reappeared on restart/hydration, restart never retried it, storage refusal still dispatched deletion, and restarted stale saves admitted deleted IDs. The candidate writes one owner-scoped intent key per conversation before cache removal or cloud dispatch; independent keys avoid competing deletion intents replacing one another. Reads, replacements and saves respect the barrier after restart. Up to five pending requests per hydration share the existing per-conversation queue, use actor checks and20-second request deadlines, and retry on mount/focus/online. Acknowledged barriers remain with only the ID/state, so late cloud reads cannot resurrect them. An additional overlapping-retry regression reproduced an incorrect false result after the first acknowledgement; acknowledgement is now idempotent. Eleven added cases cover these failures, retired/foreign accounts, confirmed barriers, late reads, bounded batches and quota failures. The source-module restart fixture copies browser storage into a new VM; it is not real browser or authenticated acceptance.

Exact63e11 qualification is terminal SUCCESS: history38204749325 (native114665637809 and actual PostgreSQL17.6/rollback/race114665637653), full CI38204749431 (install/types/lint/build/status) and Companion38204749443/114665638353. Authenticated and independent jobs were skipped. Artifact11727211066 is retained in private-chat-63e11eda-hosted;38 Git-source hashes and12 image hashes independently match the exact source. Full-chat mobile/desktop images were viewed; four fixture modes have no page errors,0 real provider calls/production writes and successful browser/server cleanup. Nine retained aborted request records are not a zero-network claim. These checks qualify63e11, not the uncommitted deletion correction.

Fresh machine review-lite admission is BOUNDED:7404MB free,5356MB projected, CPU39percent and27 task runtimes; no new parallel agent, local server/build/database or paid inference was started. Disk84346241024 bytes remains above the storage floors. Read-only foreign installed dependencies supply formatter/lint/project runner only; no installation or foreign write. Supabase delete guidance was checked at https://supabase.com/docs/reference/javascript/delete; two abort-signal documentation fetches returned internal errors, not verified docs. The existing application already uses the same request deadline API. The candidate does not activate database permissions/schema or delete any live customer row from this session. Storage-refused deletion currently leaves the conversation in place; explicit failure messaging, actual account acceptance, legacy recovery, older-history discovery, cross-device deletion fencing and independent exact-source review remain open.

## Visible conversation-removal recovery

Previous goal turn: NO PROGRESS (requested status only). Current exact cb0 source, draft PR610, full CI38205371623, history38205371654 and compiled38205371647 were rechecked: all three runs are terminal success; release and real-user acceptance remain open. No unchanged inference retry is made. The full programme stays active.

Scope: make failed and pending conversation removals visible and safely retryable, including an empty current conversation. Owner: codex-provider-account-20261011, native lease ops-e9fe428396c3413bf4e6, with no overlapping active lease on the six paths. Files: use-chat-sessions.ts, chat-storage-status.tsx, chat/page.tsx, chat-account-storage.test.cjs, verify-companion-browser.cjs and this record. Non-goals: cloud pagination, global deletion fencing, production migration/permission activation, or a new UI/persistence authority. Acceptance: storage refusal preserves original messages and shows a retry; offline account removal shows its pending count; acknowledgement clears it; old-account failures/retries never carry across account lifetimes. Verification: actual-source stateful-hook regression, compiled desktop/mobile/reduced/forced-colors recovery with screenshot/source bindings, and normal build/types/lint/database checks. Rollback: bounded reviewed source revert, preserving original caches and deletion records.

Static UI brief: creator removing a saved conversation; first read is the failure or unsynced removal and its next action. Reuse the existing save-status area, Geist UI, theme text/focus tokens and 44px buttons. Keep ordinary save/export recovery alongside removal recovery. Do not introduce animation, images, sound, cards or private conversation titles. Mobile wraps the message and action; keyboard retry has a visible focus outline; forced colors and reduced motion retain the same meaning. Compared with the existing silent refusal, this adds an actionable account-scoped outcome without hiding or discarding original work.

The five root Design Taste Kernel pointers are missing. Their original filenames were found and read at C:/Users/frank/starlight/repos/design-agent-standards/ (a recovered folder whose actual Git root is C:/Users/frank/starlight, origin frankxai/starlight-command, HEAD d6a3ca6e1a2d777f02d9400ffe72909063ae33c2; no writes there). SHA256: DESIGN_TASTE c91227bc225e39142b9a4239944a2b86d4a68d4d33828c6207a7587e11993a83; WEB_EXPERIENCE_STANDARD 7d4908123b92d687bd47e0ad0eff886dd5755808de0131f8cfabd768d3006666; MOTION_TASTE_RUBRIC ca51d09669343d1bee30a147b057b7392cb9703f2a009c06cf62d9eadfcd56d0; MULTI_AGENT_DESIGN_COUNCIL ed06689a94623724f9190372c998930a413ba8aac970cfc3bee90ba846c7c70e; VISUAL_QA_GATE 9434c94178866b4e64779a3ca036db1e356fdeB4e92259d06166728453f49ea2. Repo TASTE/DESIGN, relevant Premium OS and Emil recovery/accessibility rules inform this static refinement; independent and rendered review remain unearned until actually completed. Product root AGENTS hash remains 36b534b6a33f240aa752e4360ab08468702cbaa366c85c3ca9db0e0b21fd2ca5; guard/check passed for explicit files. Reading policies does not install runtime enforcement.

Three added actual-source hook-state regressions reproduced the missing failure/retry/pending state, then passed after implementation. All50 native account/cloud checks, five project-store cases and changed-source formatting/lint pass. The shim keeps memoized scope identity and state/effect lifetimes; it does not prove mounted React or real Auth. Compiled verification now exercises storage refusal while an empty chat is open, preserves and reopens the original, retries removal with keyboard focus, clears the active editor, and retains an unavailable synthetic account deletion until sign-out. It measures recovery contrast/targets and binds the sidebar plus both chat regression sources. Rendered results remain pending.

A page-wiring inspection found that active removal left the previous messages visible. Successful removal now stops that conversation and clears its editor; refused storage retains it. Retry uses the same page handler synchronously for this case so a new selection cannot retain the deleted messages. No application/provider/production data was written from this session. Node24.16.0 is installed; global pnpm reports8.15.0, so no local package install/build is claimed under the pinned11.28.4 contract. Hosted workflows explicitly set11.28.4. PP review-lite BOUNDED7054MB free/projected5006MB, CPU48percent,27 runtimes; no additional agents or local build/browser/server/model. Disk84311957504 bytes exceeds both floors. Fresh Vercel has zero BUILDING deployments and READY production dpl_3hiAzLAMooUjU32egLKFaotfRBBL / main5a348670 (#613, another owner); this candidate is not promoted.
