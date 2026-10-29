# Arcanea edition workspace, Codex, 29 October 2026, revision 1

Author: Codex. Contributors: none. Review state: implementation in progress;
independent review and rendered inspection pending. Source issue: #642.

## Outcome and ownership

An authenticated creator assembles existing project writing into an editable text
edition, recovers the draft locally and exports Markdown plus a JSON source record.
Extend existing project navigation and document reads. Preserve the existing rich
document editor and portable media export; this slice assembles multiple texts.

Owner: Codex root. Repository: frankxai/arcanea-ai-app.
Worktree: C:/Users/frank/starlight/repos/.codex-worktrees/arcanea-edition-glass-20261029.
Branch: codex/arcanea-edition-glass-20261029.
Base: a42ddc8d3f6a3426feecbf646bc762d863bb77fe, fetched origin/main.
Lane: codex-109d4d0f. Files: apps/web/lib/editions/{edition.ts,edition.test.ts},
apps/web/components/editions/{edition-workspace.tsx,edition-manuscript.tsx,edition-workspace.module.css},
apps/web/app/projects/[id]/edition/page.tsx, existing project page, this record.

## Design decision

Composition lane. Keep the product's tokens, type and existing identity. Compare a
full glass canvas against a solid reading canvas with floating glass controls.
Choose the latter: long text keeps a stable contrast floor and the controls have
material depth. A paper preview and dark preview serve different reading contexts.
No new logo, lore, media generation, dependencies, database schema or provider calls.
Glass belongs to the tool rail; accepted global liquid tiers are reused.
Mobile: source list precedes editable sections, controls wrap, actions remain 44px.
Motion: fast color/border transitions only, no delayed navigation or moving text;
reduced motion disables transitions. Focus is explicit and independent of hover.

## Acceptance and verification

Recover owner/project-scoped drafts without overwriting corrupt storage. Refuse
stale-account actions and conflicting tab writes. Bound draft sizes and section
counts. Preserve source revision and source-text hashes separately from edited-text
hashes. Export has no verified-rights, canon-approval, or Kernel receipt claim.
No raw HTML rendering. Existing authenticated APIs authorize each document read.
Compare manual document copying with assembly on the same real creator task before
claiming an advantage. No customer comparison has been performed.

Budget: one lightweight text/code workload; PP swarm HOLD (3382MB free, 10240MB
required). No subagents, build, browser or image jobs until admitted. Recovered
storage sensor measured 96.7GiB / 10.2% free; current v1.2 contract permits bounded
work despite the older recovered sensor's percentage-based 'critical' label.
The canonical sensor path was missing; recovered script and matching policy were
run read-only, capability probes skipped. No cleanup or foreign process action.

Instructions explicitly read: root AGENTS.md, apps/web/CLAUDE.md, current project
recovery record, .arcanea/CLAUDE.md and MASTER_PLAN.md, TASTE.md, DESIGN.md,
SYSTEM.md, SCHEMA.md, SKILLS.md; shared machine/product/workflow policies; Emil
design engineering and Premium Web OS guides. emil-prototype was read but not
activated: this is a scoped product extension, not a user-invoked picker exercise.
Root AGENTS SHA256: 00207d780ef3d98d7d260fe979b650199a8c1fbaab475ac684d3fa0630307267.
App CLAUDE SHA256: a43b1abc5f46c7cfd82605644f5a017cb7d3e8f34a6147f808416ad29a160a0e.
TASTE SHA256: f92102020196807734aff83838bbdb5d22241e918e90aea6b67f9d31a352b344.
DESIGN SHA256: dbbb7acbb5f211e300ea764518f1ce42ad1f7acfa792661b050bc64cf4d2baba.
Architecture projection fetched from frankx-starlight-command/ARCHITECTURE-STACK.md:
new Vercel binaries follow Blob/Image; preserve existing stores. Prior chat's R2
recommendation is not implemented. Registry projection missing locally; no new
technology or storage choice is made by this change.

Rollback: remove the bounded route/components/helpers and project navigation link.
Preserve local recovery records and all other branches. No public release performed.

## Verification checkpoint

Implemented locally: account-gated project route, imported text snapshots, editable
ordered sections, one-step undo, paper/obsidian reading options, existing floating
liquid surface tiers, Markdown/source-record export, hash-checked restoration and
account/project-scoped local recovery. Cooperating tabs serialize writes through
Web Locks and compare existing storage. Unsupported browsers explicitly keep edits
in memory and warn before leaving. Corrupt recovery data is preserved for download;
quota failures retain current writing in memory. Source reads validate owner,
project, document and revision. No model execution is added or implied.

Nine Node regression tests pass. Strict TypeScript model check and source syntax
checks pass; these are not full application typecheck/build/lint. Formatting and
git diff whitespace checks pass for the scoped source. Source generation timestamps,
provider/model identity and seed are not invented: no images were generated.
Existing logos and media remain unchanged. Emil guidance was selected, read and
applied in code; focus, touch, reduced motion and interruption are implemented but
have not been verified in a rendered browser. No visual score is assigned.

Latest PP: swarm HOLD, 2871MB free / 10240MB required, CPU 87%. Multiple requested
Terra agents were not started. No browser, build, image or provider job was run.
Remaining: full app gates; actual authenticated recovery/export on a hosted preview;
375/768/1440 inspection, keyboard/touch/reduced-motion/interruption; exact-revision
independent review; real creator comparison; review imagery/logo options after
machine admission and provenance context. The 21 October focus-window policy was
found in the hub; this local feature preparation is explicitly requested by Frank,
and no new feature PR, promotion or broad policy exception is claimed.
