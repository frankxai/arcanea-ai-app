# Public source entry and contribution routes

Source task: `01a0f74f-8bad-7db1-ab06-fd89b5faec84`.
Owning issue: [#276](https://github.com/frankxai/arcanea-ai-app/issues/276).
Owner: Codex, `agent/codex/arcanea-source-consolidation-20261001`.
Slice base: `95eacd844c194fcd4fc1b456e84306336b8a6dc1`.
Current main observed: `4740b4c3953ac9278241a3fa936c82197b4486e8`.
State: proposed entry/community guidance on the existing review branch, unmerged.

Scope: correct the public repository entry and contributor/reporting paths.
Files: README.md, CONTRIBUTING.md, SECURITY.md, CODE_OF_CONDUCT.md, .gitignore,
package.json, .github/ISSUE_TEMPLATE/{bug_report,creative_workflow,config}.yml,
and this record.
Acceptance: source and issue URLs identify the app; repository links resolve;
local skill-review commands work without web/provider setup; community files are
trackable; forms use supported GitHub syntax and retain blank issue access;
rights, skills and review status match actual evidence; security reporting has a
private fallback without an invented mailbox, bounty or response guarantee.
Non-goals: license selection, permission grants, canon changes, skills promotion,
MCP/launcher edits, repo archives/renames, hosted community activation or release.
Budget: one lead, text/metadata changes and small local checks; no dependencies,
build fanout, additional worker, server, paid media or new worktree.
Rollback: revert this ten-file slice. No production/runtime data changed.

## Evidence and changes

The old README cloned `frankxai/arcanea`, linked missing root LICENSE and
CONTRIBUTING files, referenced absent `arcanea-claw/`, and copied an absent root
environment template. Root package source/issue URLs also pointed to the old
repository. The README now maps the app, canon, library, curated candidates and
MCP source, with local review commands and explicit pending rights status. The
two package URLs identify `frankxai/arcanea-ai-app`; other manifest fields are
unchanged, including unresolved license metadata. No blanket grant is added.

New contribution guidance accepts small cleared examples and saved failures from
authors, world builders, media creators and game developers. It names the existing
candidate root, rights/attribution evidence, accepted/proposed world boundaries,
current tool pins, scope verification and existing human release gates. The web
environment template is partial; guidance identifies the actual check script and
package command rather than claiming a complete one-command setup.

New repository conduct rules and security guidance use the existing root package
maintainer contact `frank@arcanea.ai`. Mailbox deliverability was not tested and no
response SLA is asserted. The legacy community draft advertises other contacts,
councils and deadlines; none are treated as operational evidence here. Three
root files were explicitly ignored by .gitignore. Those three rules are removed;
the existing LICENSE exclusion remains for reconciliation with the rights ruling.

GitHub metadata read on 2026-10-01 confirms this app is public and unarchived with
no detected license. Its community profile reports missing contributing/conduct/
issue templates (42% metric; not a quality score). The connector could not read
private-report settings or branch protection; authenticated GitHub CLI reads
confirmed private vulnerability reporting is disabled and main requires Build,
Lint, TypeScript and CI Status, with zero required GitHub approval count. That
count does not waive independent-provider or human release requirements. No
settings were changed. SECURITY.md offers the existing maintainer email and the
private GitHub form only if later available. No public exploit details requested.

Two issue forms gather reproduction and concrete creator-output evidence. They
do not add another task queue or promise a shipped skill. Their main-branch links
become available after this proposal lands; this branch does not activate forms.
Blank issues remain enabled. Rights terms must be reviewed before substantive
content folding or release; contribution guidance establishes no implicit license.

## Verification and remaining work

Verified 18 named local Markdown links against the Git tree plus this slice's
files. Parsed the three YAML files; form IDs, supported types, required fields
and retained blank-issue access passed checks. Compared package JSON against
the base: only the two source/bug URLs changed. The three community files are
no longer ignored. All three README commands ran on Node 22: catalog validation
and listing reported four candidates/zero ready; eight installer tests passed.
Explicit Markdown/JSON/YAML formatting and diff checks passed. Staged secret
checks remain enabled and run at commit.

No full application build/typecheck/lint or PR CI is claimed by these small checks.
No independent review sign-off is available: the prior Claude attempt timed out
without output. Maintainer acceptance of conduct/reporting guidance, deliverable
mailbox validation, required checks and independent review remain integration
gates. The broader community/revenue objective remains active. The proposal does
not alter current published guidance until reviewed and merged.

At slice close, main advanced with MCP-reader documentation and web-route fixes;
neither changes this ten-file scope or the candidate package. There is no existing
PR for this branch. Fresh GitHub reads found 27 open app PRs; no numeric admission
rule was found in the inspected current repo/workspace policies. The earlier
queue-budget observation is not treated as fresh evidence. Prepare one draft PR
for the existing source-consolidation branch; do not mark it ready or merge while
required checks, rights and independent review remain open.

Next: get exact-commit review and human license/contact acceptance, integrate the
existing source branch under required checks, then prove isolated skill evaluations
and installed consumers. Coordinate launcher origin/ownership before writes.

Primary references consulted:

- [GitHub issue form syntax](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/syntax-for-issue-forms)
- [GitHub issue template configuration](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/configuring-issue-templates-for-your-repository)
- [GitHub private reporting guidance](https://docs.github.com/en/code-security/how-tos/report-and-fix-vulnerabilities/report-privately)
- [GitHub licensing guidance](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/licensing-a-repository)
