# Authentication response privacy

Scope: close the live cache-header gap observed after author recovery PR556.
Owner: Codex thread01a123df-58c6-72f3-b86c-65083426cf65; programme issue276.
Base:9cdbbe3b73c198fdd56b83c56782d9e4e235dc9d, origin frankxai/arcanea-ai-app.
Lane: existing isolated arcanea-gateway-admission-20261010 worktree, fresh branch
agent/codex/auth-response-privacy-20261010; clean index and no foreign edits.

Author556 merged normally14:52:40UTC from exact reviewed a74d7fc04ea64680a729f87e90de32ee3fccbb10.
Its receiving tree matches the reviewed tree. Production dpl_J6MdFrSM1tdJhfH6QBkDQL1UpGPf
is READY at9cdbbe3b with www/apex/app aliases. Real isolated-preview author acceptance
and independent Gemini response J1DKavj2Lfm2sOIPvubtgAc passed, with all48 source hashes
verified. Formal receipt6098756758. Both exact production database repairs and rollback-only
policy proofs passed with zero retained fixture rows. The owned fixture secret was deleted.

The live anonymous author GET/POST returned401, but inherited middleware sent no private
cache directive and Vercel returned public,max-age=0,must-revalidate. No private content
was returned; this is a cache-policy gap, not evidence of a leaked draft. The initial HTTP
receipt remains preserved. Its page200 followed the login redirect, so it does not prove
anonymous author-page access. Correctly test redirects without following them.

Ten native tests compile the actual middleware and use real NextRequest/NextResponse with
only Supabase/env network dependencies mocked. Five failed before the change; public-provider
auth bypass already passed. Private,no-store covers auth-dependent401, redirects and signed-in
pass-through; refresh cookies remain intact and public routes retain existing bypass behavior.
Two expanded cases reproduced dropped first-cookie chunks on pass-through and dropped refresh
cookies on auth redirects. Cookie updates/removals now preserve accumulated cookies, and redirects
and refusals copy the session response cookies. The removal case verifies obsolete-cookie expiry
without dropping refreshed chunks. Official Supabase SSR guidance was read on10October2026:
https://supabase.com/docs/guides/auth/server-side/advanced-guide and
https://supabase.com/docs/guides/auth/server-side/creating-a-client.
Full CI, exact independent review,
hosted preview and receiving-production HTTP checks are required before completion.

Files: middleware.ts; scripts/tests/auth-response-privacy.test.cjs; ci.yml;
scripts/review-author-recovery.mjs; scripts/verify-sovereign-browser.cjs; this pickup. Reuse the existing manual Google review rail,
restricted to frankxai and the two explicitly owned branch names; no new provider secret.
Acceptance: preserved status/auth routing and cookies, explicit private/no-store, zero paid
creator-provider calls, normal protected merge, exact stable deployment/source binding.
Rollback: revert only this follow-up through a reviewed PR; preserve556/database repairs.

Instructions explicitly read: root AGENTS.md SHA25636b534b6a33f240aa752e4360ab08468702cbaa366c85c3ca9db0e0b21fd2ca5,
apps/web/CLAUDE.md; WORKFLOW, product-outcome quality, machine contract and humanizer.
Guard and explicit-file check passed. No deeper AGENTS scope exists for these paths.
Policy loading is session evidence, not runtime enforcement. PP browser-qa HOLD7429MB/8192required
prevents new local browser/build/agent workloads; small tests and hosted verification continue.
Production account linkage, chapter creation/navigation, Guardian review, publish/export/rights,
paid/editorial usefulness, financial rollout and the broad original goal remain open.

Follow-up15:15UTC:97531891a79f7795428b64266fbb9f155ddf6344 PR CI38062262168 and CodeQL38062262192 passed;
its manual38062276191 independent Gemini3.1Pro response xlTKatPrKt2ez7IP28CemAw passed with0 blocking findings
and all28 source hashes verified. All four exact hosted HTTP checks passed private/no-store and proper307
login destination without following redirects. The same manual run's full Build failed on an inherited
gallery locator matching two identical Pelagic Cathedral links, also seen historically in MCP388.
Preserve that failure; do not rerun until green or use it as approval of a changed head. Gallery verification
now selects the exact destination among visible cards and requires exactly one match; search input also
requires visible uniqueness. Hidden streaming markup may be ignored, while duplicate visible cards still fail.
The actual cause of the transient duplicate DOM was not captured; no permanent visible UI defect is claimed.
No gallery UI/canon content was changed. Fresh full CI and independent review are required again.
