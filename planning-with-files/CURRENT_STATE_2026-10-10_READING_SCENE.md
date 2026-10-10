# Reading to a private scene creation

Scope: select an existing public chapter passage, edit its visual interpretation,
generate one image through the existing credit-reserved image route, recover the
same request after interruption, export the artifact, and save a private creation.
Owner: Codex thread 01a1269f-23eb-7bb2-b609-77d731cacc50; programme issue #276.
Base: 2ed6ae8b362689d21075aa983ecc3f438e36bcb6, frankxai/arcanea-ai-app.
Branch: agent/codex/reading-scene-20261010. Reused clean, handed-off billing worktree;
the old branch and all other owners' work remain preserved.

Files: components/saga/{chapter-reader.tsx,scene-visualizer.tsx,scene-visualizer.module.css};
lib/reading-scene/{brief.ts,session.ts,**tests**/brief.test.ts,**tests**/session.test.ts};
app/api/reading-scenes/route.ts; scripts/verify-reading-scene-browser.cjs;
.github/workflows/reading-scene.yml; this pickup.

Non-goals: no canon or manuscript change, new billing rail or prices, provider
migration, automatic publication, new orchestrator, historical migration replay,
or replacement of the accepted creator-entry PR505. This is one implementation
lane within the full platform/team/community/commercial goal, which remains open.

Acceptance: a source-bound passage becomes an editable brief and a real usable
image; generation shows catalog credits and requires normal authentication;
uncertain responses retain the request identity; local recovery is scoped to the
signed-in actor; saves remain private and retry idempotently; exports retain
source/provenance; keyboard, touch, reduced motion and interruption are verified.

Verification: meaningful source/recovery/denial tests; native lint/type/build;
compiled desktop/mobile/reduced-motion browser checks; exact-revision independent
review; source-bound hosted preview and stable production verification before
claiming release. Provider fixtures do not establish actual paid output quality.
Rollback: revert this bounded change; retain existing creations and billing data.

Scene brief: keep reading primary. One quiet “Visualize a passage” action opens
an inline workspace below the chapter. Selected prose, editable composition and
the resulting image carry the hierarchy. Use existing Arcanea tokens, sentence
case, visible focus, 44px touch controls and no entrance animation. Creation
output is a personal interpretation, never approved canon or a rights grant.

Serious alternative: copy a passage from an ebook into an image tool and save
files manually. Measure usable output, continuity, repair effort and cost before
claiming an advantage. No such comparison has yet been run.

Evidence: route guard/check passed; current production verified directly through
Vercel at dpl_3qy6PjqamyUnfo7ZHvDhtdhhjvaN / base2ed6ae8b. Interactive admission
is BOUNDED (one task); swarm/build/browser admission remains held. No extra worker,
new checkout, install, local server, paid creator generation or process killing.
Installed /si, graph-engineering, humanizer and Emil guidance read. Relocated
design standards resolved under design-agent-standards. Missing config capability
guides remain unresolved and are not represented as loaded. No config writes.

Status: implementation in progress; no release or acceptance certification yet.

Local implementation evidence: six source/recovery tests and six compiled actual-route
tests pass; targeted ESLint passes with zero warnings; both browser/review scripts
pass syntax checks. Private save/reopen uses existing creations RLS, inspected
read-only on production: RLS enabled; private reads and insert/update restricted
to auth.uid owner. No database migration or public object upload. Inline image
bytes are bounded; ten saves/minute per process use the existing limiter. A
distributed quota remains a separate inherited reliability gap.

Scene UI is split into scene-visualizer.tsx and scene-workspace-view.tsx, both
under500 lines. Reader swipe/tap navigation defers while a passage is selected.
The account-keyed workspace discards late callbacks after remount; anonymous
briefs can carry through normal login. Private server copies reopen across tabs.
The remote browser fixture verifies interaction/recovery with synthetic auth and
image responses. It cannot certify real authenticated production generation.

The remote review uses the existing Google credential through a manual, actor/
branch/head-bound job. Final source hashes and all findings must be retained.
Native CI lint/type/build, compiled browser evidence, independent review and live
acceptance are pending. The entire platform objective remains active.
