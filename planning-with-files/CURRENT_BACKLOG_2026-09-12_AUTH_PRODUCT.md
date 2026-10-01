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
- [ ] In progress: publish the final review branch and verify its Vercel preview/CI.
- [ ] Merge/deploy the prevention changes after release checks and approval; retest full callback flow.
- [ ] Correct Supabase redirect allowlist after dashboard access is available.
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
