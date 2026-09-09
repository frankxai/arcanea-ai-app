# Book waitlist integration: implementation boundary

Status: open dependency, not a release pass. Source task: `01a04dd1-0b3b-7102-a946-4bbf1a30bd26`.

The canonical product already exists as `books-arcanea-legends` in the estate product registry. Reuse that identity; do not create a parallel list for the provisional title. The registry still names `frankx.ai + KDP`, a 5–15 EUR price hypothesis and unapproved founding benefits. Reconciliation with the current `arcanea.ai/books` edition and €17 hypothesis must preserve history and not publish those benefits as commitments.

## Ownership evidence

The control-plane checkout resolves to `starlight-command`, branch `codex/gpt-2.5-images`. Its `graph/products.graph.json` has staged changes and `packages/demand-capture/` is untracked. This task does not own those changes. No control-plane files were modified, staged or copied into a new competing implementation.

## Source review findings

Inspected the shared package's README and `src/types.ts`, `questions.ts`, `handler.ts`, `store.ts`, and `WaitlistForm.tsx`. Its two-step capture and shared schema are the required integration path. The following findings need closure before this book uses it publicly:

1. `claimPosition` reads, increments and writes in separate requests. Concurrent signup for the same email can increment the count twice and return different positions. Use an atomic claim and test duplicate concurrent requests.
2. The REST helper checks HTTP status but not a successful HTTP response containing a KV command error. Require a valid command result and a safe positive integer position before claiming signup success.
3. `publicState` returns the raw count even when `publicCount` is withheld. The public route needs an explicitly safe response shape, with no raw low-volume count or undeclared cohort scarcity.
4. Resend synchronization ignores unsuccessful HTTP responses. The comment promises nightly reconciliation, but the inspected files do not establish that mechanism. Record delivery state and verify actual retries before promising email delivery.
5. Missing product-specific audience configuration falls back to a shared audience. Confirm isolation and consent wording before promising a product-only list.
6. The current app `/api/waitlist` deliberately reports success on database failure and attributes every signup to the platform Founding Circle. It is not a safe fallback for book demand capture.

These are static source findings, not claims about current provider outages or actual customer data. No real signup or email was sent.

## Integration acceptance

- Preserve the shared `DemandSignal` field names and common store so aggregated estate reporting continues to work.
- Isolate the book endpoint from platform signup behavior; allow only the registered product identity.
- Validate payload size, shape, consent and price/urgency values; reject malformed JSON cleanly.
- Make email-first signup durable before the optional role, expected-price and reading-interest questions.
- Preserve prior answers and original creation time when a repeated email-only request arrives.
- Use honest errors on storage failure. Never seed counts, promise an undecided date, or use an unapproved founding benefit.
- Test storage error, duplicate/concurrent signup, repeat signup, optional-answer update, audience failure and withheld-count behavior.
- Use the shared form with book-specific voice, visible errors, keyboard focus, mobile layout and a privacy link.
- Confirm actual configured storage and product audience without printing secrets. Review privacy and email behavior before activating live capture.

Until ownership and these integration conditions are resolved, the edition remains a protected preview and checkout stays closed. Continue manuscript and visual work in the assigned book worktree; this dependency is not a reason to discard or archive the goal.
