# Library reading progress recovery

The reader's completed state must stay with the correct account, survive reload,
and show only acknowledged completion with a visible retry for uncertain saves.
This is one reader reliability slice of [issue 280](https://github.com/frankxai/arcanea-ai-app/issues/280).
The full Arcanea community programme remains active.

## Source and ownership

- Base: `89924fad029111918b800724b95d41a373ae3374`; branch `agent/codex/reading-progress-recovery-20261012`.
- Owner: `codex:01a127b9-5a4e-7b83-ae44-ddc8e8a6a8cb`; six exact files in the native lease.
- Root instructions SHA256: `36b534b6a33f240aa752e4360ab08468702cbaa366c85c3ca9db0e0b21fd2ca5`.
- Explicit instruction handoff includes root guide, `.arcanea/CLAUDE.md`, master plan, TASTE, DESIGN, web guide and May 27 protocol. It does not reload native startup instructions or enforce policy at runtime.
- `apps/web/app/agents.md` is a directory, not an instruction file. Foreign chapter-reader and shared CI lanes remain preserved.

## Reproduction and change

The controlled hook/transport reproduction of the original hook
(`6e7259c6d4927c86576f12e0a1d328194ddeebf153eb03184720b1cc52cda603`)
exited 1: after B's load followed by A's delayed load, B's view contained A's
completion and lost B's completion. No real Auth, database or browser was involved.

The hook now hides a different account's snapshot during render, cancels retired
requests and rejects their responses. Reads and writes have a 10-second deadline.
Only a matching returned owner/text/collection/completion row confirms Read.
Null data from a mock or an uncertain transport stays unconfirmed. Retrying uses
the existing `(user_id,text_slug)` database key. The migration and RLS are unchanged;
their production application has not been established by these fixtures.

| Before                                                 | After                                                                  | Why                                                          |
| ------------------------------------------------------ | ---------------------------------------------------------------------- | ------------------------------------------------------------ |
| Old account data survived a switch                     | New view hides old data before effect cleanup                          | Prevent incorrect completion from another account            |
| Failed saves gave no feedback                          | Loading, saving, confirmed Read and visible retry                      | Make the save outcome clear and recoverable                  |
| Zero-height sentinel and a permanent local marked flag | 1px sentinel scoped to account/text; confirmation required             | Keep automatic completion recoverable across account changes |
| Small button without a defined focus treatment         | 44px minimum button, visible keyboard focus, reduced-motion transition | Make completion usable with keyboard and touch               |

End-of-article visibility is a completion signal, not evidence of comprehension.

## Verification and acceptance

The first local run passed 21 controlled lifecycle/transport cases with no failures
or skips. Hosted Linux/Windows checks and an actual React/Chromium leaf fixture
are required before accepting this candidate. The leaf uses synthetic Auth and
table responses with the same-source production CSS/fonts; it is not a signed-in
production Supabase/RLS/customer test. Native captures need visual inspection and
canonical sidecar-schema validation remains unverified.

Independent exact-source review, full application checks, normal protected merge,
receiving checks and production source binding remain required. Local heavy work
remains held by machine admission; no new worktree, local browser, server or swarm
was started. Private manuscript, paid model screen and commercial approvals are
unchanged. No customer acceptance, managed API readiness or full programme completion
is claimed. Rollback is a normal revert of these six named files.
