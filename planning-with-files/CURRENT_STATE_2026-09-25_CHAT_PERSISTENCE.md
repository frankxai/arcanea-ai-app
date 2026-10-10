# Saved chat API recovery — 25 September 2026

Scope: make saved chat history/session responses truthful and account-bound.
Owner: Arcanea reliability, quality issue #427. Base SHA:
`4e104ae5e40d280d04f863137a505483f11e2409`.
Files: `app/api/chat/{history,sessions}`, `lib/services/chat-service.ts`
and this task record.
Non-goals: production migrations or auth settings, changing the modern
`/chat` browser store, claiming cross-device synchronization, or promoting a
release.

At 2026-09-25 09:31 UTC the serving production deployment logged a 500 on
`POST /api/chat/history`. The route could try writing a local function file
after Supabase failed and accept a client-supplied user identity. The sessions
endpoint similarly offered process-memory state as if it were a saved account
session. Those stores cannot establish durability or account isolation.

Candidate behavior: use verified Supabase identity and RLS for both endpoints;
reject anonymous requests; return 503 when saved storage fails; never claim a
successful save after a database write failed. Return the most recent messages
first and offer older pages by cursor. A failure to count bond turns or update
a session title after a successful insert does not turn that insert into a
failed response. Response bodies and logs omit database errors and messages.

Acceptance: separate accounts cannot select records through a query/body
`userId`; anonymous requests cannot read/save an account history; a failed
storage operation does not return 200; a committed insert is acknowledged.
Verification: focused lint/format, full changed-scope typecheck/build in
GitHub CI on the PR SHA, independent review and authenticated preview save,
reload, pagination and error-recovery checks. The current main `/chat` UI
uses a separate browser store; its export/sync/privacy contract needs its own
acceptance slice before being described as durable account history.

Rollback: revert this code-only PR or restore the last approved deployment
through the release gate. Do not delete chat records to roll back.
