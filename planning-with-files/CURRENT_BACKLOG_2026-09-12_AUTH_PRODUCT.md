# Auth recovery and creator product foundation

Source: task `01a0930b-6362-7e20-b6f9-3c0c34d969df`, 2026-09-12.
Continuation of the existing commercial audit and product-design objective; this
record adds scope without retiring the older book, world, MCP or design work.

Scope: repair Google sign-in's missing public binding; prevent recurrence; specify
tiers/payments/data stewardship and the book → media → agent → website business.
Owner: root task, one writer in `codex/arcanea-auth-product-foundation-20260912`.
Files: auth build gate/tests, Vercel build command, Turbo env selectors, callback
recovery and return-path validator, CI, incident report, product spec, economics
model/tests and this task record.
Non-goals: new pricing activation, paid generation, legal terms publication,
database migrations, replacing the Academy or overlapping other agents' branches.

## Task state

- [x] Reproduce Google failure in production and identify missing Vercel public vars.
- [x] Restore existing public Supabase binding in Preview.
- [x] Implement production build guard; observe red then passing regression tests.
- [x] Prepare product/data/payment design and executable contribution model.
- [x] Verify initial READY preview reaches Google.
- [x] Obtain production approval; restore public config and rebuild existing revision.
- [x] Complete initial independent code/design review (same provider).
- [x] Observe indirect root-code return after consent; confirm session completes after hydration.
- [x] Verify production protected settings, sign-out, fresh route protection and repeat Google sign-in.
- [x] Implement same-origin callback recovery and return-path validation; 16 tests pass.
- [x] Independently review callback recovery and return-path validation.
- [x] Publish auth foundation PR #404; verify READY preview and passing required CI.
- [ ] Merge/deploy the prevention changes after release checks and approval; retest full callback flow.
- [x] Correct production Supabase callback allowlist; fresh Google sign-in now returns to protected provider settings.
- [ ] Complete second-provider buyer critique before a commercial release.

## Next implementation slices

1. **P0 private billing boundary:** separate billing IDs and entitlements from public,
   user-editable profiles; reconcile existing customers; migrate under explicit
   approval. Acceptance: anon sees no private fields, owner cannot promote a tier or
   change provider customer ID, A cannot read/change B, legitimate profile edits work.
2. **P0 one payment path:** confirm seller entity, current Polar/Stripe account and
   fee schedule; sandbox one released SKU; signature/idempotency/state tests and
   download receipt. Existing Stripe customers remain supported throughout.
3. **P1 one excellent kit:** one original genre world bible, chapter, continuity tests
   and author-site export, plus independent buyer review and rights manifest.
4. **P1 data rights:** clear save/privacy UI, private project isolation, complete
   export/delete, retention policy implemented against vendor reality.
5. **P1 acquisition:** shared per-product demand capture, preview/sample and release
   content. No live campaign send without the user's specific channel authorization.
6. **P2 media and characters:** source-linked storyboards/voices, then bounded,
   disclosed character agents; self-deployed websites before hosted multi-tenant agents.

Track #307, #333, #403 and the commercial-truth branch as dependencies. Do not merge
them wholesale. Acceptance is verified delivered behavior; a document is not a
working subscription or a privacy certification.

Verification: `node --test scripts/tests/auth-env.test.mjs scripts/tests/auth-redirect.test.mjs scripts/tests/creator-economics.test.mjs`;
`node scripts/model-creator-economics.mjs`; source diff and secret scan; Vercel preview;
independent critique. Rollback: bounded code revert, previous verified deployment;
no database migration in this slice.

## Provider trust continuation

Owner: root; reuse the task-owned worktree with stacked branches
`codex/arcanea-provider-routing-20260912` (parent: auth foundation), then
`codex/arcanea-provider-experience-20260912` (parent: provider routing).
Routing and UI changes are split to remain inside the repository's diff review budget.
No new worktree, dependency, database migration or billing activation.

- [x] Reproduce fake key test and connected badge; trace key/content through server.
- [x] Implement matching-provider credential resolution, null legacy model compatibility,
      explicit customer-key precedence, storage validation, failed-write recovery and stale-save protection.
- [x] Independent review found two storage synchronization problems; address both and add regression.
- [x] Implement focused, labeled provider form with truthful save status, data flow and charges.
- [x] Clarify plugin/storefront/IP/data strategy using current official provider guidance.
- [ ] Reverify the refined frozen code and responsive preview; full CI and exact-head release review.
- [ ] Remove residual contradictory BYOK copy in chat/homepage through the commercial-truth lane.
- [x] Reproduce mobile menu failure in a fresh preview: duplicate notification bells
      reuse an already-subscribed Supabase channel. Isolate subscriptions with owned
      cleanup and recipient filters; add concurrent-mount and rapid-remount regressions.
- [ ] Verify repeated mobile menu open/close on the final preview with no Realtime error.
- [ ] Exercise paid provider generation only with a dedicated authorized test credential/budget.

Rollback: revert the provider UI slice, then routing if required; auth recovery is independent.
Keep production model credentials out of test output. Unit fixtures use invented dummy keys.
