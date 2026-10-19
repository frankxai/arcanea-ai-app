# Source-linked world scenes

Scope: reuse the existing World SDK for world → character → scene → revision →
export, as a bounded internal Studio workflow. Owning programme #276; source and
canon boundary #283. This does not replace AuthorOS or approve the external
creator product. Owner: Codex thread 01a127b9-5a4e-7b83-ae44-ddc8e8a6a8cb.
Checkout: arcanea-narrative-routing-20261011. Branch:
agent/codex/source-linked-scenes-20261011. Origin:
https://github.com/frankxai/arcanea-ai-app.git. Base:
49001a3f6a902c333562b99faef31cf86fb62907.

Owned files: packages/world-sdk/src/scene-drafts.mjs,
packages/world-sdk/bin/scene-cli.mjs, packages/world-sdk/bin/cli.mjs,
packages/world-sdk/src/index.mjs, packages/world-sdk/index.d.ts,
packages/world-sdk/tests/scene-drafts.test.mjs, packages/world-sdk/README.md,
.github/workflows/world-scenes.yml, packages/world-sdk/src/evolution.mjs,
packages/world-sdk/src/fs-world.mjs and this record. Foreign world-editor,
chat-world handoff and library scopes remain untouched.

Creator job: take explicitly selected world and character documents into the
chosen writing harness without losing the source context, preserve competing
edits, and produce recoverable scene text with source snapshots. The SDK's old
genesis/evolution helpers do not provide a scene revision/export path. Reuse its
world manifest and public hash/index contracts; add no provider, dependency,
scheduler, rich-text editor or automatic publishing authority.

Acceptance: actual CLI capture/prompt/import/revision/export; exact prose and
source hashes; optimistic parent conflict and concurrent append denial; source
change refusal with old export recovery; bounded UTF-8 input; path and junction
denial; interrupted write and corrupted-chain handling; public hash/index and
source byte preservation. Exact-source independent review and Linux/Windows
hosted execution are required before promotion. Existing build/type/lint/security
checks remain enabled.

The lead exercised a private original working world, selected character and two
world/location documents through capture, prompt, two prose revisions and the
actual CLI export helper. Final scene: 580 words; exact Markdown/export identity
passes. Accepted revision SHA256:
ddeec1fefad90419bac672046bc4cc14397bed770cd368e0c1f3c63b13bc8ee0.
Private proof stays in the existing goal evidence directory, not this repository
or reviewer payload. Provider calls and paid calls are zero. Producer identity is
caller-reported and the runtime model is not independently identified. The lead
authored and revised the prose; no independent literary review, human editorial
approval, competitive comparison or customer success is claimed.

Evidence at implementation: the new import initially failed because the scene
module did not exist. Eight new real behavior cases now pass on Node 24.16.0
Windows, alongside nine existing SDK cases: 17 pass, zero fail/skip. The actual
CLI test uses a synthetic writer label and makes no provider call. These results
do not establish a creative model ranking or customer acceptance. The old SDK
test that writes public evolution lore remains unchanged and does not satisfy
#283's separate removal/promotion requirement.

At 2026-10-11T21:41:42.979Z, browser-qa admission was HOLD: 5,617 MB free versus
8,192 required; 27 Codex runtimes and parallelism one. No local build, browser,
extra agent or model server was started. Small Node tests run sequentially.
Storage check: 88,101,707,776 bytes free. Hosted checks are pending.

Instructions: root AGENTS SHA256
36b534b6a33f240aa752e4360ab08468702cbaa366c85c3ca9db0e0b21fd2ca5;
.arcanea/CLAUDE 83ea5b289cdfcf89abd2195111846cda5aa942daccb8a0ed2dec4d30f960ac94;
MASTER_PLAN 5c9b74df1bddc980b2d2235b25f398380fd42356d8ff36743b8a6cc51a3aa4f6;
CANON_LOCKED 58c9c86fd3b540e274d478b91096523031132388b7b18b2fa1d67dee676bf54f.
Those unchanged sources were read in this ongoing goal and hashes rechecked for
this slice; relevant current world recovery/editor records, workspace workflow,
machine policy and product-quality policy were read. No deeper AGENTS in the
owned SDK/workflow/planning scopes. Native lane claim ran location guard and
explicit-file routing check, with ownership checked separately. These reads and
checks are not a claim of universal runtime enforcement.

Limits: scene commands make no model call; provider choice/funding remains with
the chosen harness. Labels are caller-reported. No commercial subscription,
tenant isolation, automatic model experiments, human canon/publication receipt,
semantic canon validator, calibrated judge, competitor comparison or production
creator outcome is proved. Day-one library correction #515 remains with its
foreign owner. ARC-REL-001 remains Dragonborne; publication approval is pending.

Rollback: revert this eleven-file slice via a reviewed PR. Preserve creator draft
directories and exports; no live data migration or canon change is introduced.
Never delete incomplete export directories or accepted revisions as cleanup.

PR601 first candidate aa14768a593a0406a010e2e5be97b7dc5375a106 ran hosted workflow
38178219823: all eight new scene cases pass on both platforms. Windows has 17
passes; Linux has 16 passes and one inherited memory test failure. The failure is
real: recordMemory uses only the timestamp as its filename, so same-millisecond
events overwrite each other. A forced equal-timestamp regression fails with one
stored path instead of four. Memory files now use random UUID names and exclusive
creation; timestamps remain unchanged in their records. No evolution/canon
promotion behavior is changed. A separate UTF-8 BOM case reproduced a captured
source hash failure; snapshots now preserve the BOM while manifest parsing skips
only that marker. The updated local suite has 19 passes, zero failures or skips.
Fresh hosted execution and exact-source independent review remain required.

The initial Poolside source review at aa14768a returned malformed JSON containing
a WARN and five alleged findings. Its complete raw response and error are kept.
It supplies no accepted independent verdict. Lead inspection rejects the claimed
CLI position bug: args[3] is the output directory and the real CLI tests exercise
that exact vector. It also incorrectly says the concurrent Windows case is absent.
Its empty-capture complaint contradicts the deliberate revision-zero state;
the hypothetical UUID collision already refuses via wx. Its proposed rename
replacement could overwrite an accepted revision. These lead findings do not
substitute for a fresh, valid independent review of the corrected candidate.

The ready-event application CI at 746ac64e passed build, lint and TypeScript,
and both hosted scene jobs passed 19 cases. CodeQL's workflow completed, but its
separate Advanced Security check failed on one high-severity regex slowdown in
the inherited frontmatter parser (fs-world.mjs line 15). That revision was not
merged. A real 200,000-tab malformed frontmatter case timed out after two seconds
in a session-owned child process. Splitting the key at the first colon and then
trimming the value removes the overlapping regex repetition. The regression now
passes; 91 representative legacy field/Unicode cases match the old semantics.
The local Windows suite has 20 passes, zero failures or skips. This extends the
owned scope to fs-world.mjs; unrelated path/evolution helpers remain unchanged.
Fresh exact-source independent review, CodeQL alert resolution and all required
candidate/receiving checks remain necessary. Earlier malformed Poolside and
truncated Cohere reviews are retained without accepted verdicts; the valid
Nemotron review at 746ac64e cannot approve this subsequent parser change.
