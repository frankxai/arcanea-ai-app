# Home-to-chat draft handoff

Source task: `01a1269f-23eb-7bb2-b609-77d731cacc50`; programme issue [276](https://github.com/frankxai/arcanea-ai-app/issues/276).

Scope: creator entry privacy, editable chat prefill, composition-aware Enter and browser-storage recovery.
Owner: Codex, exclusive lease `codex-entry-handoff-20261011`; sequential work, no new agent or local heavy worker.
Files: the eleven paths in that lease. Base: `86a412efcebf3873bbed0d8796d6a684e85470da`, frozen chat companion candidate.
Non-goals: history service, new homepage replacement, real provider spend, credit ledger, media generation, account migration, production promotion and the wider team programme.
Acceptance: typed home text stays out of URLs; auth settles before handoff; another actor cannot prefill it; composition Enter never navigates or sends; navigation never executes a provider; storage denial leaves editable text and recovery actions on home; explicit Send uses the existing AI SDK transport.
Verification: direct Node draft tests; compiled hosted browser in desktop, 375px mobile, reduced-motion and forced-colors modes; changed-scope lint/typecheck/build; exact-revision captures and source hashes; manual visual inspection and design scan. Independent release review remains required.
Rollback: revert this eleven-file slice on its branch, preserving the frozen parent and other owners' work. It adds no migration or backend credential storage.

## Useful outcome and alternative

Creators can carry a private scene from the existing home entry to an editable chat message without exposing the scene in navigation URLs or triggering a paid request. The previous implementation put the full text into `?prompt=` and the conversation hook accepted `auto=1` as permission to send. A separate per-account server draft service would support durable recovery and multiple devices; that belongs with the occupied history lane. This slice uses one bounded sessionStorage record and a random opaque URL reference. It is a same-tab handoff, not durable saved work, an encryption boundary or proof of Supabase tenant isolation.

The record can be consumed once by the same actor for ten minutes. It is removed on successful consumption, replacement, expiry inspection or tab-session closure. Expiry refuses access; sessionStorage does not run a background erasure timer. Guest-to-account changes require a new draft. A malformed, used or unavailable reference shows recovery. An account mismatch preserves the original record. Browser storage failure keeps the home component and its text; Select draft and a new-tab chat link permit manual recovery. Reloading an unsent chat composer is still the separate history owner's responsibility.

| Surface    | Before                                                                 | After                                                                                          |
| ---------- | ---------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Home entry | Faint placeholder and shortcuts; delayed controls; smaller send target | Existing brand tokens, readable text, immediate shortcuts, 44px open action                    |
| Navigation | Typed text in URL; optional automatic send                             | Opaque one-use reference; editable prefill; explicit Send                                      |
| Keyboard   | Enter during composition could navigate/send                           | Active composition, native isComposing and legacy keyCode 229 are guarded                      |
| Recovery   | No storage handoff or account guard                                    | Storage failure preserves home text; mismatched actor denied; account change remounts composer |

## Source and ownership evidence

Worktree: `C:/Users/frank/starlight/worktrees/arcanea-billing-recovery-20261010`; origin `https://github.com/frankxai/arcanea-ai-app.git`; branch `agent/codex/home-chat-handoff-20261011`. Location guard and eleven-file route check passed before writes; they verify routing and do not acquire ownership. The active lease separately assigns these files. PR447's history APIs and service and PR505's replacement homepage files are preserved. PR505 may eventually replace the V3 homepage entry, so its owner must integrate this behavior at that future boundary.

Root AGENTS.md was read at SHA256 `36b534b6a33f240aa752e4360ab08468702cbaa366c85c3ca9db0e0b21fd2ca5`. Existing task state, shared Arcanea instructions, master plan, machine policy, creator outcome quality policy, TASTE, DESIGN, PWO activation and relevant design skills were loaded. SYSTEM, SCHEMA and SKILLS were explicitly read at candidate revision `3548d78ca2f781991220a04fa47f0d219dad9441` before switching branches; their restoration in PR566 has not been adopted on main. Root DESIGN's old asset pipeline conflicts with the current TASTE palette and Frank's explicit prohibition of Higgsfield tools; this slice retains the accepted teal palette and generates no assets. No new stack/model/package installation is proposed. Actual repository pins remain Node24/pnpm11.28.4; the pasted Node20 instruction conflict remains unresolved.

Frozen chat PR562, reader PR560, source-guide/team proposal PR566 and their existing proofs are retained. Their reviews do not automatically cover this changed revision. No real provider call, paid reviewer, customer account write, Circle send, npm publication or production promotion is performed by this slice. Browser auth events and AI streams are synthetic. Build and screenshots cannot establish product demand or close Frank's full platform objective.

## Verification state

Implementation prepared. Nine local Node unit tests passed after formatting, including quota denial, failed removal, guest/account separation, expiry, corrupt data and all three composition guards. Direct Prettier check, JavaScript syntax check and changed-scope ESLint passed. A final four-line retry guard and recovery-copy correction followed that lint run; hosted CI must validate the final revision. The manual installed Impeccable scan covered the actual home component, chat page, chat composer and shared handoff CSS and returned no findings; this does not establish visual or accessibility acceptance. Hosted gates, capture inspection and exact-revision independent review remain pending until their receipts exist. The existing production revision remains separate. Private evidence and the estate handover belong in `.starlight/evidence/` and `frankxai/agentic-ops-hub`, respectively. Maintain issue276 and the hub's existing current prompt; do not create a competing queue.
