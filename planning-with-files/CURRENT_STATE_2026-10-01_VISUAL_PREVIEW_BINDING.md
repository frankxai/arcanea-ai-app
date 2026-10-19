# Visual preview source binding

Scope: replace ready-comment URL selection with a verified GitHub deployment
record for visual QA. Owner: Codex, #427 and active program #276. Base:
e863be8304fdde9f00ba812d7845d66ec52787b9. Branch:
agent/codex/arcanea-preview-binding-20261001 in the reused owned sparse worktree.
Skills and reader candidates remain on their retained branches (#487 and #490).
Files: visual-qa/ci workflows, resolve-visual-preview.mjs, its tests and this record.
User job: inspect the actual candidate site and know which source the evidence covers.
Non-goals: app UI/canon/manuscripts, enabling deployments, changing credentials or
protection settings, merging PRs, creating repos, or certifying every promotion path.
Budget: small local tests, sequential tool-free review and text edits. No installs,
new worktree, local app build, browser/media generation or agent fanout.

Acceptance: source is a full Git SHA; repository and Preview environment match;
the newest deployment/status is trusted Vercel bot success; the capture URL is an
immutable Arcanea host; overrides match that URL; changed/closed/draft/foreign PRs
and cancelled/failed/missing metadata block capture. Recheck the same binding after
capture, before accepting a verdict. Record the source/deployment in the manifest
and report. The CI suite executes helper and actual workflow-script fixtures.
Verification: baseline reproduction, focused negative/positive and workflow tests,
read-only metadata against real older/newer reader commits, formatting, syntax and
enabled secret checks, all four exact-head CI checks and independent source review.
Rollback: revert this five-file proposal; leave content, settings and other drafts intact.
Stop at a reviewable draft. #408 requires Frank's named merge instruction.

The original resolver was executed with a mocked ready Vercel bot comment. It
accepted the older reader preview for the newer source without any metadata lookup.
The private receipt preserves original source SHA256, input source and accepted URL.
The candidate's 26 initial checks pass, including both actual workflow script bodies,
mid-run PR changes and a status failure during capture. Timestamps/IDs select latest
records independent of response order. A full 100-record page blocks rather than
guessing from truncated history. Missing/pending metadata gets at most 20 attempts,
with 15-second intervals; terminal non-success does not fall back to an older success.
The fixed URL allowlist follows the observed project/team generated host format;
a rename or different generated format needs an explicit policy/test update.

Live read-only metadata proof at 2026-10-01 21:02:49 UTC: GitHub Preview deployment
6791973953 successfully binds 60fcf333b4f178de0f255b5d8edb057a5ede6d25 to
arcanea-ai-ptg79i7g2-starlight-intelligence.vercel.app. No GitHub deployment exists
for newer reader768066b53996aec1379a316f9a9e28fae32dce4f, so the resolver rejects it.
Vercel's connector independently reports older dpl_51h5RXEBj9xjJaN2zNxRYv8ouHXb READY
at60 and newer dpl_FPjeCQbqi4YFKqu2DeZxSTPdwYdt CANCELED at768. This proof uses the
requested source without PR eligibility, so it does not approve the current draft.
No capture, bypass-token transmission, rendered QA or production action occurred.

Authority: GitHub deployment SHA/repository/environment and its latest bot status,
not a comment or status inspector URL. This does not independently authenticate
Vercel build contents or project configuration. Existing capture/auth-wall checks
and Gemini review remain; all production promotion paths and check/canon/human
release enforcement remain separate #427 requirements. The documented main protection,
manual-deploy and #451 ignored-build gaps are retained; this proposal does not enable them.
Reference: https://docs.github.com/en/rest/deployments/deployments and
https://docs.github.com/en/rest/deployments/statuses. These were checked before implementation.
The capability-loading guide is absent both from its instructed path and local
starlight-agent-config origin/main; no substitute provider configuration was inferred.

Local checks and source review establish a candidate only. Exact-head CI and
independent source review are pending until linked receipts exist. Full Arcanea goal
remains active, including rights/folds/consumers, creator/world behavior, manuscript
selection, community/revenue proof and human release decisions.
