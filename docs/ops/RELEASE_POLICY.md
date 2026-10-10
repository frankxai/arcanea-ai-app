# Arcanea release policy

Updated: 2026-10-01. Status: draft reconciliation in app PR #487.
Owner issues: [#276](https://github.com/frankxai/arcanea-ai-app/issues/276),
[#408](https://github.com/frankxai/arcanea-ai-app/issues/408) and
[#427](https://github.com/frankxai/arcanea-ai-app/issues/427).

This replaces the March 29 mirror, dual-remote and direct-merge guidance.
It records Frank's one-repo direction and the current repository contract.
A document change does not archive repositories, configure branch protection,
grant rights, install a bundle or prove a deployment gate is enforced in code.

## Repository and source boundaries

`frankxai/arcanea-ai-app` is the public Arcanea integration home: app, reader,
Codex, release experience, packages and locked lore. No new Arcanea repository
or app mirror is proposed. Canon remains `.arcanea/lore/CANON_LOCKED.md`.
The root licence and conflicting Heart frequency still need Frank's decision.

Observed GitHub metadata on October 1:

| Repository        | Visibility / default branch   | Working role                                                                           |
| ----------------- | ----------------------------- | -------------------------------------------------------------------------------------- |
| `arcanea-ai-app`  | Public / `main`; not archived | Canonical integration source                                                           |
| `arcanea`         | Public / `main`; not archived | Diverged legacy source; salvage before a pointer README and archive decision           |
| `arcanea-records` | Public / `main`; not archived | Legacy source to reconcile; no second app publishing destination                       |
| `arcanea-code`    | Public / `dev`; not archived  | Existing runtime fork; preserve consumers and provenance pending an explicit migration |
| `oh-my-arcanea`   | Public / `dev`; not archived  | Existing harness adapters; preserve their contracts pending consolidation              |

Default branches are observations, not independently approved release branches.
Do not infer `production` or `master` from the March policy. Before changing a
satellite, verify its root, origin, branch, owners, unique files, rights and callers.
The proposed retirement queue also includes `arcanea-platform`,
`arcanea-marketplace` after its consumer fold, and `arcanea-intelligence-os`.
Their archive status is not verified here. Archive/rename decisions remain
human-gated. Keep unfinished tasks, forks, provenance and source references.

Shared AuthorOS, world protocol, SIS graph, runtime/admission and media owners
retain their existing responsibilities until a reviewed contract migration.
An Arcanea adapter consumes those owners; it does not establish another shared
compiler, graph or scheduler. The [source consolidation proposal](../strategy/arcanea-source-consolidation-2026-10-01.md)
contains the wider role and survivor map. Repo count is not an acceptance metric.

## Skills, plugins and bundle consumers

The proposed curated skills root is `packages/arcanea-skills/skills`. Candidate
passports bind source/resources and declared rights, evaluations and separate
review. Four current skills are internal candidates; zero are ready. Public
repository visibility does not establish permission to reuse every file.
Third-party licences and notices keep their own scope; a new root licence
cannot relicense imported works. Private operator/Studio material stays outside
redistributable selections, subject to a verified source audit.

The hub lists a repository, contained folder and full immutable commit. Bundle
and marketplace consumers must resolve that identity, including a `git-subdir`
consumer where supported. Launcher root support is an unapplied patch with
mocked tests; intended upstream and checkout ownership remain unresolved.
Do not claim those consumers or working-set links are installed or reconciled.
Do not advertise blanket root discovery as the curated release.

## Branches, merges and preservation

Use an owned `agent/<harness>/<scope>` branch or assigned worktree. Verify exact
root/origin/branch, explicit files and lane ownership before writing or staging.
Stage only the named slice. Keep security hooks enabled and preserve other edits.

[#408](https://github.com/frankxai/arcanea-ai-app/issues/408) requires zero app
merges until Frank names `merge N`. There is no low-risk direct-merge exception
in this guide. A reviewable draft can advance before release approval; a PR stack
must not merge as a bundle. Review narrow survivors, preserving source references.
Books retain their canon and illustrated QA gates.

Age or branch divergence does not authorize deletion, archive or task closure.
Review a stale branch's current owner, callers, useful changes and evidence.
Propose a merge, split or extraction only after reconciling those facts. Retain
unfinished records; do not bulk merge an old branch to make it look current.

## Deployment and release evidence

The native Git deployment path uses `frankxai/arcanea-ai-app` and `main` for
production; development branches can receive Vercel previews. Push an owned
branch to that verified app origin. Do not push the app into `arcanea-records`,
synchronize an app mirror or follow the old dual-remote/`lean-prod` instructions.
Prefer the existing preview; do not create a second manual deployment for review.

Before any promotion, bind repository, PR, exact candidate SHA, environment and
preview deployment metadata. The repo contract requires frozen dependencies
and successful Build, Lint, TypeScript and CI Status checks at that SHA. Missing,
stale, skipped, cancelled or failed applicable checks do not establish a pass.
Independent review must cover the changed scope and candidate revision.
Record actual branch/environment protection separately; this document has not
verified that every manual path enforces those requirements. #427 remains open.

Verify the affected user journey on the bound preview, including applicable
desktop/mobile, keyboard and recovery behavior. Record draft-policy skips,
authentication restrictions or machine admission holds. READY, HTTP 200 and
unit tests alone do not establish rendered behavior or creator success.

Publishing additionally requires rights/provenance, canon/editorial/edition
gates and the appropriate human approval. #277's immutable approval receipt and
#279's release manifest are required integration work, not claimed implemented
by this guide. Source proposals and draft generation remain distinct from
publication, distribution, campaigns, prices, canon promotion and public deploys.

After an approved production action, bind the stable domain to its accepted
deployment and source SHA. Record the observation window, tested rollback and
user outcome. Do not infer revenue, delivery or demand from deployment status.

## Historical March 29 extraction notes

The earlier policy is preserved at commit
`5327861370c95748764017dc2e022b67b4abb348`. These suggestions are historical
and unverified against the current queue; no task is closed by this revision:

- `testing/phase0-codex-review`: proposed `c65a3c8f` cherry-pick,
  selective `700f8deb` extraction and `e17e7c60` split.
- `origin/claude/arcanea-challenge-platform-r0BHb`: concept/extraction source.
- `cursor/development-environment-setup-9dbe`: inspect useful work before reuse.
- `vercel/vercel-speed-insights-to-nextj-i9vkg4`: inspect need on current main.

Rollback this documentation through a scoped revert. No repository, consumer,
manuscript, protection setting or deployment is changed by the policy patch.
